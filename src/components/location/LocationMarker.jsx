import { useEffect, useRef } from 'react';
import L from 'leaflet';

const LocationMarker = ({ map, location }) => {
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const trailRef = useRef([]);
  const lastUpdateTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const isValid = location?.lat != null && location?.lng != null;

  // Функция для обновления стиля маркера
  const updateMarkerStyle = (isActive) => {
    if (!markerRef.current) return;

    const iconDiv = markerRef.current.getElement();
    if (iconDiv) {
      if (isActive) {
        iconDiv.classList.remove('inactive');
      } else {
        iconDiv.classList.add('inactive');
      }
    }
  };

  useEffect(() => {
    if (!map || !isValid) return;

    const latlng = L.latLng(location.lat, location.lng);
    trailRef.current = [...trailRef.current, latlng].slice(-50);
    lastUpdateTimeRef.current = Date.now();

    // Создаём или обновляем маркер
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      const icon = L.divIcon({
        html: `<div class="custom-icon-wrapper">
          <div class="pulse-ring"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <circle cx="12.5" cy="12.5" r="8" fill="red" stroke="black" strokeWidth="2"/>
          </svg>
        </div>`,
        className: 'custom-icon',
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      });
      markerRef.current = L.marker(latlng, { icon }).addTo(map);
    }

    // Обновляем стиль: активный
    updateMarkerStyle(true);

    // --- Шлейф ---
    if (trailRef.current.length >= 2) {
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(trailRef.current);
      } else {
        polylineRef.current = L.polyline(trailRef.current, {
          color: 'red',
          weight: 5,
          opacity: 0.8,
          dashArray: '5, 5',
        }).addTo(map);
      }
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (lastUpdateTimeRef.current) {
        const elapsed = Date.now() - lastUpdateTimeRef.current;
        const isActive = elapsed < 5 * 60 * 1000;
        updateMarkerStyle(isActive);
      }
    }, 20000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, location?.lat, location?.lng, isValid]);

  return null;
};

export default LocationMarker;
