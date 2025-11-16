// src/components/location/LocationTracker.jsx
import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import configApi from '../../api/config-api';
import { useWebSocket } from '@/hooks/useWebsocket';

const LocationTracker = ({ map }) => {
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const trailRef = useRef([]);
  const lastUpdateTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const updateMarkerStyle = useCallback((isActive) => {
    if (!markerRef.current) return;
    const iconDiv = markerRef.current.getElement();
    if (iconDiv) {
      iconDiv.classList.toggle('inactive', !isActive);
    }
  }, []);

  const updateLocationOnMap = useCallback(
    (lat, lng) => {
      if (!map) return;

      const latlng = L.latLng(lat, lng);
      trailRef.current = [...trailRef.current, latlng].slice(-50);
      lastUpdateTimeRef.current = Date.now();

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
        // --- ИЗМЕНЕНИЕ: Создаем маркер ---
        const newMarker = L.marker(latlng, { icon, pane: 'fieldsPane' });

        newMarker.on('click', function (e) {
          e.originalEvent.stopPropagation();
          newMarker
            .bindPopup(`Текущая позиция:<br>Широта: ${lat.toFixed(6)}<br>Долгота: ${lng.toFixed(6)}`)
            .openPopup();
        });

        newMarker.addTo(map);
        markerRef.current = newMarker;
      }

      updateMarkerStyle(true);

      if (trailRef.current.length >= 2) {
        if (polylineRef.current) {
          polylineRef.current.setLatLngs(trailRef.current);
        } else {
          polylineRef.current = L.polyline(trailRef.current, {
            color: 'red',
            weight: 5,
            opacity: 0.8,
            dashArray: '5, 5',
            pane: 'fieldsPane', // Добавляем опцию pane
          }).addTo(map);
        }
      }
    },
    [map, updateMarkerStyle]
  );

  const handleWebSocketMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.data);
        const { lat, lng } = data.message || {};
        if (lat != null && lng != null) {
          updateLocationOnMap(lat, lng);
        }
      } catch (e) {
        console.error('Invalid location message:', e);
      }
    },
    [updateLocationOnMap]
  );

  // Подключаемся к WebSocket через хук
  useWebSocket(configApi.WS_LAST_LOCATION, handleWebSocketMessage);

  // Таймер неактивности
  useEffect(() => {
    if (!map) return;

    intervalRef.current = setInterval(() => {
      if (lastUpdateTimeRef.current) {
        const isActive = Date.now() - lastUpdateTimeRef.current < 5 * 60 * 1000;
        updateMarkerStyle(isActive);
      }
    }, 20000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (markerRef.current) map.removeLayer(markerRef.current);
      if (polylineRef.current) map.removeLayer(polylineRef.current);
    };
  }, [map, updateMarkerStyle]);

  return null;
};

export default LocationTracker;
