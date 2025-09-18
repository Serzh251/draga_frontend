import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// RTK Query
import { useFetchTrackListQuery } from '../../api/api';
import TrackLine from './TrackLine';

const BatymetryLayer = () => {
  const map = useMap();
  const legendRef = useRef(null);

  const {
    data: trackList,
    isLoading,
    error,
  } = useFetchTrackListQuery(undefined, {
    skip: !map,
  });

  // Легенда
  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend');
      div.style.background = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      div.style.fontFamily = 'sans-serif';
      div.style.lineHeight = '1.8';
      div.style.width = '88px';

      let labels = ['<b>Глубина,м</b><br>'];

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

    return () => {
      if (legendRef.current) {
        legendRef.current.remove();
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
        <TrackLine key={track.id} track={track} />
      ))}
    </>
  );
};

export default BatymetryLayer;
