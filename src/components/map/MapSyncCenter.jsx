// components/map/MapSyncCenter.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapSyncCenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      // Плавно перемещаем карту
      map.flyTo(center, zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [center, zoom, map]);

  return null;
}
