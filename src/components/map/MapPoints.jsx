import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useFetchPointsQuery } from '@/api/api';

const MapPoints = ({ map, selectedFields, selectedYears }) => {
  const layerRef = useRef(null);
  const fieldsArray = useMemo(() => Array.from(selectedFields), [selectedFields]);
  const yearsArray = useMemo(() => Array.from(selectedYears || []), [selectedYears]);

  const shouldFetch = fieldsArray.length > 0;
  const queryArgs = {
    field: fieldsArray[0],
    year: yearsArray.length > 0 ? yearsArray[0] : undefined,
  };

  const { data: points, isFetching } = useFetchPointsQuery(queryArgs, {
    skip: !shouldFetch,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!map || !shouldFetch || !points) return;

    // Удаляем предыдущий слой
    if (layerRef.current) {
      try {
        if (map.hasLayer(layerRef.current)) map.removeLayer(layerRef.current);
      } catch (e) {}
      layerRef.current = null;
    }

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
        const depth = feature.properties?.depth ?? 0;
        return L.circle(latlng, {
          radius: 4,
          stroke: false,
          fillColor: getFillColor(depth),
          color: getFillColor(depth),
          weight: 1,
          opacity: 0.1,
          fillOpacity: 0.8,
        }).bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);
      },
    });

    geoJsonLayer.addTo(map);
    layerRef.current = geoJsonLayer;

    requestAnimationFrame(() => {
      try {
        if (layerRef.current?.bringToBack) {
          layerRef.current.bringToBack();
        }
      } catch (e) {}
      // map.eachLayer(l => l !== layerRef.current && l.bringToFront?.());
    });

    return () => {
      if (layerRef.current) {
        try {
          if (map.hasLayer(layerRef.current)) map.removeLayer(layerRef.current);
        } catch (e) {}
        layerRef.current = null;
      }
    };
  }, [map, points, shouldFetch]);

  if (fieldsArray.length === 0) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '55%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fffbe6',
          color: '#7a5c00',
          padding: '8px 12px',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          border: '1px solid #ffe58f',
        }}
      >
        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
        Выберите месторождение для отображения всех точек
      </div>
    );
  }

  if (isFetching && shouldFetch) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '12%',
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
    );
  }

  return null;
};

export default MapPoints;
