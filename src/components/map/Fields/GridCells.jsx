// src/components/Map/Fields/GridCells.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { LoadingOutlined } from '@ant-design/icons';
import { useLazyFetchGridCellsQuery } from '@/api/api';

const GridCells = ({ map, selectedFields }) => {
  const [allCells, setAllCells] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Защита от некорректного типа selectedFields
  const safeSelectedFields =
    selectedFields instanceof Set
      ? selectedFields
      : Array.isArray(selectedFields)
        ? new Set(selectedFields)
        : new Set();

  const fieldId = safeSelectedFields.size > 0 ? Array.from(safeSelectedFields)[0] : null;

  const [triggerFetch] = useLazyFetchGridCellsQuery();
  const layerGroupRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (layerGroupRef.current && map) {
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map]);

  // Рекурсивная загрузка
  const loadPage = async (urlOrParams) => {
    if (!isMountedRef.current) return;

    setIsFetching(true);
    try {
      const result = await triggerFetch(urlOrParams).unwrap();
      const features = result.features || [];
      const nextUrl = result.next;

      if (isMountedRef.current) {
        setAllCells((prev) => [...prev, ...features]);
      }

      if (nextUrl && isMountedRef.current) {
        await loadPage(nextUrl);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err?.data?.message || 'Не удалось загрузить данные для сетки');
      }
    } finally {
      if (isMountedRef.current) {
        setIsFetching(false);
      }
    }
  };

  // Запуск при смене поля
  useEffect(() => {
    if (fieldId == null) {
      setAllCells([]);
      setError(null);
      return;
    }

    setAllCells([]);
    setError(null);
    loadPage({ page: 1, field: fieldId });
  }, [fieldId]);

  // Отображение на карте
  useEffect(() => {
    if (!map) return;

    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
      layerGroupRef.current = null;
    }

    if (allCells.length === 0) return;

    const layerGroup = L.layerGroup();
    layerGroupRef.current = layerGroup;

    const geoJsonData = {
      type: 'FeatureCollection',
      features: allCells.map((cell) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: cell?.geometry?.coordinates || [], // ← ИСПРАВЛЕНО
        },
        properties: {
          ...cell.properties,
          cell_id: cell.id,
        },
      })),
    };

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: { color: '#000', weight: 1, fillOpacity: 0 },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          layer.bindPopup(`<strong>ID ячейки:</strong> ${feature.properties.cell_id}`).openPopup();
        });
      },
    });

    geoJsonLayer.addTo(layerGroup);
    map.addLayer(layerGroup);

    return () => {
      if (layerGroupRef.current && map.hasLayer(layerGroupRef.current)) {
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [allCells, map]);

  return (
    <>
      {isFetching && fieldId != null && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '7px 10px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <LoadingOutlined />
          Загрузка данных для сетки...
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#f44336',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          ❌ Ошибка: {error}
        </div>
      )}
    </>
  );
};

export default GridCells;
