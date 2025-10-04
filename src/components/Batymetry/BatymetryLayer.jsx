// src/components/Batymetry/BatymetryLayer.jsx
import { useEffect, useRef } from 'react';
import { useFetchTrackListQuery } from '../../api/api';
import TrackLine from './TrackLine';

const BatymetryLayer = ({ map }) => {
  const legendRef = useRef(null);

  const {
    data: trackList,
    isLoading,
    error,
  } = useFetchTrackListQuery(undefined, {
    skip: !map,
  });

  useEffect(() => {
    if (!map || !map.getContainer()) return;

    // Создаём контейнер для легенды
    const legendDiv = document.createElement('div');
    legendDiv.className = 'batymetry-legend';

    const labels = ['<b>Глубина,м</b><br>'];

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

    legendDiv.innerHTML = labels.join('');

    // Добавляем легенду в контейнер карты
    const mapContainer = map.getContainer();
    mapContainer.appendChild(legendDiv);
    legendRef.current = legendDiv;

    // Cleanup
    return () => {
      if (legendRef.current && mapContainer.contains(legendRef.current)) {
        mapContainer.removeChild(legendRef.current);
        legendRef.current = null;
      }
    };
  }, [map]);

  if (error) {
    console.error('Ошибка загрузки списка треков:', error);
  }

  if (isLoading) return null;

  return (
    <>
      {trackList?.tracks?.map((track) => (
        <TrackLine key={track.id} track={track} map={map} />
      ))}
    </>
  );
};

export default BatymetryLayer;
