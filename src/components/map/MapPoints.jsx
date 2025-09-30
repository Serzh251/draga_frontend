import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useFetchPointsQuery } from '../../api/api';
import { setPoints } from '../../store/slices/mapDataSlice';
import { useMapData } from '../../hook/useDataMap';

const MapPoints = ({ map, selectedFields }) => {
  const dispatch = useDispatch();
  const { points } = useMapData();

  const [queryParams, setQueryParams] = useState(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (selectedFields.size > 0) {
      setQueryParams({ field: Array.from(selectedFields) });
    } else {
      setQueryParams(null);
    }
  }, [selectedFields]);

  const { data, isFetching } = useFetchPointsQuery(queryParams, {
    skip: !queryParams,
  });

  useEffect(() => {
    if (data) {
      dispatch(setPoints(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!map) return;

    // Удаляем старый слой перед добавлением нового
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!points) return;

    function getFillColor(depth) {
      if (depth > 15) return '#aba9a9';
      if (depth <= 0) return 'rgb(255,197,170)';
      const normalized = Math.min(1, depth / 15);
      const red = 255;
      const green = Math.floor(128 + 127 * (1 - normalized));
      const blue = Math.floor(128 + 127 * (1 - normalized));
      return `rgb(${red}, ${green}, ${blue})`;
    }

    const geoJsonLayer = L.geoJSON(points, {
      pointToLayer: (feature, latlng) => {
        const depth = Number(feature.properties?.depth ?? 0);
        const circleMarker = L.circleMarker(latlng, {
          radius: 8,
          stroke: false,
          fillColor: getFillColor(depth),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });

        circleMarker.bindPopup(`<strong>Глубина:</strong> ${isNaN(depth) ? '-' : depth.toFixed(2)} м`);
        return circleMarker;
      },
    });

    geoJsonLayer.addTo(map);
    layerRef.current = geoJsonLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [points, map]);

  return isFetching ? (
    <div
      style={{
        position: 'fixed',
        bottom: 60,
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
      <LoadingOutlined style={{ fontSize: 18, marginRight: 8 }} />
      Загрузка всех точек...
    </div>
  ) : null;
};

export default MapPoints;
