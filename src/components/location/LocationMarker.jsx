// src/components/location/LocationTracker.jsx
import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import configApi from '../../api/config-api';

const LocationTracker = ({ map }) => {
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const trailRef = useRef([]);
  const lastUpdateTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isManuallyClosedRef = useRef(false);

  // === Обновление стиля маркера ===
  const updateMarkerStyle = useCallback((isActive) => {
    if (!markerRef.current) return;
    const iconDiv = markerRef.current.getElement();
    if (iconDiv) {
      if (isActive) {
        iconDiv.classList.remove('inactive');
      } else {
        iconDiv.classList.add('inactive');
      }
    }
  }, []);

  // === Обновление маркера и шлейфа на карте ===
  const updateLocationOnMap = useCallback(
    (lat, lng) => {
      if (!map) return;

      const latlng = L.latLng(lat, lng);
      trailRef.current = [...trailRef.current, latlng].slice(-50);
      lastUpdateTimeRef.current = Date.now();

      // Маркер
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

      updateMarkerStyle(true);

      // Шлейф
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
    },
    [map, updateMarkerStyle]
  );

  // === Подключение WebSocket ===
  const connectWebSocket = useCallback(() => {
    // Защита от дублирования
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) return;
      wsRef.current.close();
    }

    if (isManuallyClosedRef.current) return;

    const ws = new WebSocket(configApi.WS_API_HOST);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('📍 WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const message = data.message;
        if (message?.lat != null && message?.lng != null) {
          updateLocationOnMap(message.lat, message.lng);
        }
      } catch (e) {
        console.error('Invalid WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      console.log('📍 WebSocket disconnected. Reconnecting...');
      wsRef.current = null;
      if (!isManuallyClosedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('📍 WebSocket error:', error);
      ws.close(); // триггерит onclose
    };
  }, [updateLocationOnMap]);

  // === Эффект: инициализация и cleanup ===
  useEffect(() => {
    if (!map) return;

    isManuallyClosedRef.current = false;
    connectWebSocket();

    // Таймер неактивности
    intervalRef.current = setInterval(() => {
      if (lastUpdateTimeRef.current) {
        const elapsed = Date.now() - lastUpdateTimeRef.current;
        const isActive = elapsed < 5 * 60 * 1000; // 5 минут
        updateMarkerStyle(isActive);
      }
    }, 20000);

    return () => {
      isManuallyClosedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Удаление слоёв
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, connectWebSocket, updateMarkerStyle]);

  return null;
};

export default LocationTracker;
