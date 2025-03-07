import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { LoadingOutlined } from '@ant-design/icons';
import { useLazyFetchGridCellsQuery } from '../../../api/api';

const GridCells = () => {
  const map = useMap();
  const [allCells, setAllCells] = useState([]);
  const [error, setError] = useState(null);
  const [fetchCells, { isFetching, isError }] = useLazyFetchGridCellsQuery();

  useEffect(() => {
    const loadAllPages = async () => {
      try {
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const result = await fetchCells(currentPage).unwrap();
          if (result?.features?.length) {
            setAllCells((prevCells) => [...prevCells, ...result.features]);
          }
          hasMore = result?.hasMore || false;
          currentPage += 1;
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err?.data?.message || 'Не удалось загрузить данные для сетки');
      }
    };

    loadAllPages();
  }, [fetchCells]);

  // Отображение сетки на карте
  useEffect(() => {
    if (!map || allCells.length === 0) return;

    const layerGroup = L.layerGroup().addTo(map);
    const geoJsonData = {
      type: 'FeatureCollection',
      features: allCells.map((cell) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: cell?.properties?.cell?.coordinates || [],
        },
        properties: {
          ...cell.properties,
          cell_id: cell.id,
        },
      })),
    };

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          layer.bindPopup(`<strong>ID ячейки:</strong> ${feature.properties.cell_id}`).openPopup();
        });
      },
    });

    geoJsonLayer.addTo(layerGroup);
    return () => {
      map.removeLayer(layerGroup);
    };
  }, [allCells, map]);

  return (
    <>
      {isFetching && (
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

      {isError && (
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
          ❌ Ошибка: {error || 'Не удалось загрузить данные для сетки'}
        </div>
      )}
    </>
  );
};

export default GridCells;
