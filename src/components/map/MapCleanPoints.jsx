import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useFetchCleanPointsQuery } from '@/api/api';

const MapCleanPoints = ({
  map,
  selectedFields = new Set(),
  selectedYears = new Set(),
  isPrev = false,
  show = true,
}) => {
  const layerRef = useRef(null);

  const fieldsArray = useMemo(() => Array.from(selectedFields), [selectedFields]);
  const yearsArray = useMemo(() => Array.from(selectedYears), [selectedYears]);
  const shouldFetch = fieldsArray.length > 0 && (!isPrev || yearsArray.length > 0);

  const queryArgs = {
    field: fieldsArray,
    year: isPrev ? yearsArray : yearsArray.length > 0 ? yearsArray : undefined,
  };

  const { data: pointsData, isFetching } = useFetchCleanPointsQuery(queryArgs, {
    skip: !shouldFetch,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!map || !show || !shouldFetch || !pointsData) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    function getFillColor(depth) {
      if (depth <= 0 || depth > 15) return '#aba9a9';
      const maxDepth = 15;
      const normalized = Math.min(1, depth / maxDepth);
      const green = Math.floor(255 * (1 - normalized));
      const blue = Math.floor(100 * (1 - normalized));
      return `rgb(0, ${green}, ${blue})`;
    }

    const geoJsonLayer = L.geoJSON(pointsData, {
      pointToLayer: (feature, latlng) => {
        const depth = feature.properties?.depth ?? 0;
        return L.circle(latlng, {
          radius: 4,
          stroke: false,
          fillColor: getFillColor(depth),
          color: getFillColor(depth),
          weight: 10,
          opacity: 0.1,
          fillOpacity: isPrev ? 0.2 : 1,
        }).bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);
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
  }, [map, pointsData, show, shouldFetch, isPrev]);

  // 🔴 ПОКАЗЫВАЕМ ПРЕДУПРЕЖДЕНИЕ ТОЛЬКО ЕСЛИ НЕ ВЫБРАНО МЕСТОРОЖДЕНИЕ
  if (show && fieldsArray.length === 0) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '50%',
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
        Выберите месторождение для отображения точек
      </div>
    );
  }

  if (isFetching && show && shouldFetch) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '7%',
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
        Загрузка точек...
      </div>
    );
  }

  return null;
};

export default MapCleanPoints;
