// src/components/Batymetry/BatymetryLayer.jsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import L from 'leaflet';

// RTK Query
import { useFetchTrackListQuery } from '../../api/api';

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

const BatymetryLayer = () => {
  const map = useMap();
  const layerRef = useRef(null);
  const legendRef = useRef(null);

  // Загружаем список треков
  const { trackList, isLoading, error } = useFetchTrackListQuery(undefined, {
    skip: !map,
  });

  // Отрисовка всех треков
  useEffect(() => {
    if (!map || !trackList?.tracks?.length) return;

    // Удаляем старый слой
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // Группа для всех треков
    const featureGroup = new L.FeatureGroup();

    // Для каждого трека делаем отдельный запрос
    const fetchAndAddTrack = async (track) => {
      try {
        const response = await fetch(`/api/batymetry/tracks/${track.id}/points/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (!data.features?.length) return;

        const cleanFeatures = data.features.filter((f) => f.geometry?.type === 'Point' && f.properties?.depth != null);

        if (cleanFeatures.length < 2) return;

        const latlngs = cleanFeatures.map((f) => [f.geometry.coordinates[1], f.geometry.coordinates[0]]);
        const depths = cleanFeatures.map((f) => f.properties.depth);

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

        featureGroup.addLayer(trackLayer);
      } catch (err) {
        console.error(`Ошибка загрузки трека ${track.id}:`, err);
      }
    };

    // Запускаем все запросы параллельно
    Promise.all(trackList.tracks.map((track) => fetchAndAddTrack(track))).then(() => {
      if (featureGroup.getLayers().length > 0) {
        featureGroup.addTo(map);
        layerRef.current = featureGroup;
        map.fitBounds(featureGroup.getBounds(), { padding: [50, 50] });
      }
    });

    // Легенда (один раз)
    if (!legendRef.current) {
      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        div.style.fontFamily = 'sans-serif';
        div.style.lineHeight = '1.8';
        div.style.width = '160px';

        let labels = ['<b>Глубина (м)</b><br>'];

        [
          { label: '<1', color: '#f6ecc1' },
          { label: '1–2', color: '#e4d241' },
          { label: '2–4', color: '#7ABFE4' },
          { label: '4–6', color: '#3D9BE9' },
          { label: '6–8', color: '#007ACC' },
          { label: '8–10', color: '#004A8C' },
          { label: '≥10', color: '#002B5B' },
        ].forEach((item) => {
          labels.push(
            `<div><i style="background:${item.color}; width: 20px; height: 12px; display: inline-block; margin-right: 5px; border: 1px solid #ccc;"></i>${item.label}</div>`
          );
        });

        div.innerHTML = labels.join('');
        return div;
      };
      legend.addTo(map);
      legendRef.current = legend;
    }

    // Очистка
    return () => {
      if (legendRef.current) {
        map.removeControl(legendRef.current);
        legendRef.current = null;
      }
    };
  }, [trackList, map]);

  if (error) {
    console.error('Ошибка загрузки списка треков:', error);
  }

  return null;
};

export default BatymetryLayer;
