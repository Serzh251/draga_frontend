import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Стили для пульсации (добавляются один раз)
const addPulseStyles = () => {
  const styleId = 'user-location-styles';
  if (document.getElementById(styleId)) return;

  const styles = `
    .user-location-icon {
      text-align: center;
      font-size: 20px;
    }
    .pulse-ring {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid #007bff;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
      opacity: 0.6;
      z-index: -1;
    }
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.6; }
      70% { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(0.8); opacity: 0; }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
};

const MyLocationMarker = () => {
  const map = useMap();
  let userMarker = null;
  let accuracyCircle = null;

  useEffect(() => {
    if (!map) return;

    // Добавляем стили
    addPulseStyles();

    const onLocationFound = (e) => {
      const { latlng, accuracy } = e;

      // Удаляем старые слои
      if (userMarker) map.removeLayer(userMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);

      // Создаём маркер с пульсацией
      userMarker = L.marker(latlng, {
        icon: L.divIcon({
          className: 'user-location-icon',
          html: '<div class="pulse-ring"></div>📍',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(map).bindPopup(`
        Вы здесь<br>
        Широта: ${latlng.lat.toFixed(6)}<br>
        Долгота: ${latlng.lng.toFixed(6)}
      `);

      // Круг точности
      accuracyCircle = L.circle(latlng, {
        radius: accuracy,
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);

      // Центрируем карту
      map.setView(latlng, Math.min(map.getZoom(), 17), {
        animate: true,
      });
    };

    const onLocationError = (e) => {
      console.warn('Не удалось определить местоположение:', e.message);
      alert(
        'Не удалось получить местоположение.\n\n' +
          'Проверьте:\n' +
          '1. Разрешён ли доступ к геолокации\n' +
          '2. Включён ли GPS\n' +
          '3. Откройте страницу по HTTPS или localhost'
      );
    };

    // Запускаем определение местоположения
    map.locate({
      setView: false, // Не центрируем сразу — сделаем вручную
      maxZoom: 17,
      timeout: 10000,
      maximumAge: 60000,
      watch: true, // Слежение за перемещением
    });

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // Очистка
    return () => {
      map.stopLocate();
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      if (userMarker) map.removeLayer(userMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);
    };
  }, [map]);

  return null; // Маркер управляется напрямую через Leaflet API
};

export default MyLocationMarker;
