// TrackLine.jsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import L from 'leaflet';

// RTK Query
import { useFetchTrackPointsQuery } from '../../api/api';

// Цветовая шкала
const getColor = (depth) => {
  if (depth >= 10) return '#002B5B';
  if (depth >= 8) return '#004A8C';
  if (depth >= 6) return '#007ACC';
  if (depth >= 4) return '#3D9BE9';
  if (depth >= 2) return '#7ABFE4';
  if (depth >= 1) return '#e4d241';
  return '#f6ecc1';
};

const TrackLine = ({ track }) => {
  const map = useMap(); // Получаем карту
  const layerRef = useRef(null); // Ссылка на слой

  // ✅ Безопасный вызов хука — на верхнем уровне компонента
  const { pointsData, isLoading, error } = useFetchTrackPointsQuery(
    { trackId: track.id },
    { skip: !map } // только если карта готова
  );

  // Отрисовка трека
  useEffect(() => {
    if (!map || !pointsData?.features?.length) return;

    // Фильтруем валидные точки
    const cleanFeatures = pointsData.features.filter(
      (f) => f.geometry?.type === 'Point' && f.properties?.depth != null
    );

    if (cleanFeatures.length < 2) return;

    // Подготавливаем координаты
    const latlngs = cleanFeatures.map((f) => [
      f.geometry.coordinates[1], // lat
      f.geometry.coordinates[0], // lng
    ]);
    const depths = cleanFeatures.map((f) => f.properties.depth);

    // Создаём линию
    const trackLayer = L.geoJson(null, {
      style: (feature) => ({
        color: getColor(feature.properties.depth),
        weight: 12,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`Глубина: ${feature.properties.depth.toFixed(2)} м`, {
          direction: 'top',
        });
      },
    });

    // Добавляем сегменты
    for (let i = 0; i < latlngs.length - 1; i++) {
      const segment = turf.lineString([
        [latlngs[i][1], latlngs[i][0]], // [lng, lat]
        [latlngs[i + 1][1], latlngs[i + 1][0]],
      ]);
      const avgDepth = (depths[i] + depths[i + 1]) / 2;

      trackLayer.addData({
        type: 'Feature',
        geometry: segment.geometry,
        properties: { depth: avgDepth },
      });
    }

    // Добавляем на карту
    trackLayer.addTo(map);
    layerRef.current = trackLayer;

    // Подстраиваем масштаб
    map.fitBounds(trackLayer.getBounds(), { padding: [50, 50] });

    // Очистка при размонтировании
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [pointsData, map]);

  if (error) {
    console.error(`Ошибка загрузки точек для трека ${track.id}:`, error);
  }

  return null;
};

export default TrackLine;
