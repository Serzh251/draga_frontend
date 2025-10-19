// src/components/Batymetry/TrackLine.jsx
import { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import L from 'leaflet';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useFetchTrackPointsQuery } from '@/api/api';

const getColor = (depth) => {
  if (depth >= 10) return '#002B5B';
  if (depth >= 8) return '#004A8C';
  if (depth >= 6) return '#007ACC';
  if (depth >= 4) return '#3D9BE9';
  if (depth >= 3) return '#5DBEDC';
  if (depth >= 2) return '#7ABFE4';
  if (depth >= 1) return '#e4d241';
  return '#f6ecc1';
};

const TrackLine = ({ track, map, onLoaded, onError, status, currentIndex, totalTracks }) => {
  const layerRef = useRef(null);

  const { data, error } = useFetchTrackPointsQuery({ trackId: track.id }, { skip: !map || !track?.id });

  // Обработка ошибки
  useEffect(() => {
    if (error) {
      console.error(`Ошибка загрузки трека ${track.id}:`, error);
      onError();
    }
  }, [error, track.id]);

  useEffect(() => {
    if (!data || !map) return;

    const cleanFeatures =
      data.features?.filter((f) => f.geometry?.type === 'Point' && f.properties?.depth != null) || [];

    if (cleanFeatures.length < 2) {
      onLoaded();
      return;
    }

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

    for (let i = 0; i < latlngs.length - 1; i++) {
      const segment = turf.lineString([
        [latlngs[i][1], latlngs[i][0]],
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
    onLoaded(trackLayer);

    return () => {};
  }, [data, map, track.id]);

  // UI: уведомления
  if (status === 'loading') {
    return (
      <div style={notificationStyle}>
        <LoadingOutlined /> Загрузка трека {currentIndex + 1} из {totalTracks}...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ ...notificationStyle, background: '#fff1f0', color: '#cf1322' }}>
        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Ошибка загрузки трека {track.id}
      </div>
    );
  }

  return null;
};

const notificationStyle = {
  position: 'fixed',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '8px 12px',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1000,
};

export default TrackLine;
