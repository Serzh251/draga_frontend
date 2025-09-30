import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LoadingOutlined } from '@ant-design/icons';
import { useFetchCleanPointsQuery } from '../../api/api';

const MapCleanPoints = ({
  map,
  selectedFields = new Set(),
  selectedYears = new Set(),
  isPrev = false,
  show = true, // новый проп для управления видимостью
}) => {
  const fieldsArray = Array.from(selectedFields);
  const yearsArray = Array.from(selectedYears);

  const layerRef = useRef(null);

  const skip = fieldsArray.length === 0 || (isPrev && yearsArray.length === 0);

  const queryArgs = {
    field: fieldsArray,
    year: isPrev ? yearsArray : yearsArray.length > 0 ? yearsArray : undefined,
  };

  const { data: pointsData, isFetching } = useFetchCleanPointsQuery(queryArgs, { skip });

  useEffect(() => {
    if (!map) return;

    // Удаляем предыдущий слой перед добавлением нового
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    // Если show выключен или prev без годов — не рисуем
    if (!show || (isPrev && yearsArray.length === 0)) return;

    if (!pointsData) return;

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
        return L.circleMarker(latlng, {
          radius: 8,
          stroke: false,
          fillColor: getFillColor(depth),
          color: '#000',
          weight: 1,
          opacity: 0.1,
          fillOpacity: isPrev ? 0.2 : 1,
        }).bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);
      },
    });

    geoJsonLayer.addTo(map);
    layerRef.current = geoJsonLayer;

    // Очистка слоя при размонтировании
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, pointsData, yearsArray, isPrev, show]);

  if (isFetching && show) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 100,
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
