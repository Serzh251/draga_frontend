// src/components/Batymetry/TrackLine.jsx
import { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import L from 'leaflet';
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

const TrackLine = ({ track, map }) => {
  const layerRef = useRef(null);

  const { data, isFetching, error } = useFetchTrackPointsQuery({ trackId: track.id }, { skip: !map || !track?.id });

  useEffect(() => {
    if (!map || !data?.features?.length) return;

    // Удаляем старый слой
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    const cleanFeatures = data.features.filter((f) => f.geometry?.type === 'Point' && f.properties?.depth != null);

    if (cleanFeatures.length < 2) return;

    const latlngs = cleanFeatures.map((f) => [f.geometry.coordinates[1], f.geometry.coordinates[0]]);
    const depths = cleanFeatures.map((f) => f.properties.depth);

    const trackLayer = L.geoJson(null, {
      style: (feature) => ({
        color: getColor(feature.properties.depth),
        weight: 15,
        opacity: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`Глубина: ${feature.properties.depth.toFixed(2)} м`, {
          direction: 'top',
        });
      },
    });

    // Рисуем сегменты линии
    for (let i = 0; i < latlngs.length - 1; i++) {
      const segment = turf.lineString([
        [latlngs[i][1], latlngs[i][0]], // [lng, lat] для Turf
        [latlngs[i + 1][1], latlngs[i + 1][0]],
      ]);
      const avgDepth = (depths[i] + depths[i + 1]) / 2;

      trackLayer.addData({
        type: 'Feature',
        geometry: segment.geometry,
        properties: { depth: avgDepth },
      });
    }

    trackLayer.addTo(map);
    layerRef.current = trackLayer;

    // Опционально: подгоняем карту под трек (удалите, если не нужно)
    // map.fitBounds(trackLayer.getBounds(), { padding: [50, 50] });

    // Cleanup
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, data, track.id]);

  if (error) {
    console.error(`Ошибка загрузки точек для трека ${track.id}:`, error);
  }

  return null; // Компонент ничего не рендерит в DOM
};

export default TrackLine;
