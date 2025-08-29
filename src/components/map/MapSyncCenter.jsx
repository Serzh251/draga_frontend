// components/map/MapSyncCenter.jsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export default function MapSyncCenter({ center, zoom }) {
  const map = useMap();
  const hasSetCenter = useRef(false); // Флаг: центр уже установлен

  useEffect(() => {
    // Устанавливаем центр только если:
    // 1. Есть center и zoom
    // 2. Карта ещё не была центрирована
    if (center && zoom && !hasSetCenter.current) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 0.5,
      });
      hasSetCenter.current = true;
    }
  }, [center, zoom, map]);

  return null;
}
