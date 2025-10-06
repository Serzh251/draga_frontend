// src/components/Batymetry/BatymetryLayer.jsx
import { useEffect, useRef, useState } from 'react';
import { useFetchTrackListQuery } from '../../api/api';
import TrackLine from './TrackLine';

const BatymetryLayer = ({ map }) => {
  const legendRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'success'

  // ✅ Используем isLoading и data от RTK Query
  const {
    data: trackList,
    isLoading,
    error,
  } = useFetchTrackListQuery(undefined, {
    skip: !map,
  });

  // ✅ Инициализация треков только когда данные загружены
  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('Ошибка загрузки списка треков:', error);
      setStatus('error');
      return;
    }

    if (trackList && Array.isArray(trackList.tracks)) {
      const loadedTracks = trackList.tracks;
      setTracks(loadedTracks);
      if (loadedTracks.length > 0) {
        setCurrentIndex(0);
        setStatus('loading');
      } else {
        setStatus('success'); // треков нет
      }
    } else {
      setTracks([]);
      setStatus('success');
    }
  }, [trackList, isLoading, error]);

  // ✅ Легенда (без изменений)
  useEffect(() => {
    if (!map || !map.getContainer()) return;

    const legendDiv = document.createElement('div');
    legendDiv.className = 'batymetry-legend';
    legendDiv.innerHTML = `
      <b>Глубина,м</b><br>
      <div><i style="background:#f6ecc1; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i><1</div>
      <div><i style="background:#e4d241; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>1–2</div>
      <div><i style="background:#7ABFE4; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>2–3</div>
      <div><i style="background:#5DBEDC; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>3–4</div>
      <div><i style="background:#3D9BE9; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>4–6</div>
      <div><i style="background:#007ACC; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>6–8</div>
      <div><i style="background:#004A8C; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>8–10</div>
      <div><i style="background:#002B5B; width:20px; height:12px; display:inline-block; margin-right:5px; border:1px solid #ccc;"></i>≥10</div>
    `;

    const mapContainer = map.getContainer();
    mapContainer.appendChild(legendDiv);
    legendRef.current = legendDiv;

    return () => {
      if (legendRef.current && mapContainer.contains(legendRef.current)) {
        mapContainer.removeChild(legendRef.current);
        legendRef.current = null;
      }
    };
  }, [map]);

  // UI: ошибки и загрузка списка
  if (isLoading) {
    return (
      <div style={notificationStyle}>
        <span>Загрузка списка треков...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...notificationStyle, background: '#fff1f0', color: '#cf1322' }}>
        Ошибка загрузки списка треков
      </div>
    );
  }

  // Рендерим только текущий трек
  const currentTrack = tracks[currentIndex];

  return (
    <>
      {currentTrack && (
        <TrackLine
          key={currentTrack.id}
          track={currentTrack}
          map={map}
          onLoaded={() => {
            if (currentIndex < tracks.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              setStatus('success');
            }
          }}
          onError={() => setStatus('error')}
          status={status}
          currentIndex={currentIndex}
          totalTracks={tracks.length}
        />
      )}

      {!currentTrack && tracks.length === 0 && status === 'success' && (
        <div style={notificationStyle}>Нет доступных треков</div>
      )}
    </>
  );
};

const notificationStyle = {
  position: 'fixed',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(255, 255, 255, 0.95)',
  padding: '8px 12px',
  borderRadius: '5px',
  fontSize: '13px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1000,
};

export default BatymetryLayer;
