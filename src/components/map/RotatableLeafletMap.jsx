// src/components/Map/RotatableLeafletMap.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate'; // Подключаем плагин

// Ваши слои и компоненты
import MapPoints from './MapPoints';
import HeatmapLayer from './HeatMapLayer';
import GridCells from './Fields/GridCells';
import MapCleanPoints from './MapCleanPoints';
import MapFields from './Fields/MapFields';
import BatymetryLayer from '../Batymetry/BatymetryLayer';
import LocationMarker from '../location/LocationMarker';
import MyLocationMarker from '../location/MyLocationMarker';
import UserGeoDataProvider from './UserDataGeometry/UserGeoDataProvider';

// Утилиты
import config from '../../config';

const RotatableLeafletMap = ({
  selectedFields,
  selectedYears,
  selectedYearsPrev,
  showGridCells,
  showMapPoints,
  showMyLocation,
  showCleanPoints,
  showBatymetryLayer,
  showHotMap,
  location,
  fieldsData,
  cleanPoints,
  cleanPointsPrev,
  mapCenter,
  zoom,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const initialCenter = mapCenter || config.defaultCenter;
      const initialZoom = zoom || config.defaultZoom;

      // Инициализация карты с поворотом
      const map = L.map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        rotate: true,
        bearing: 0,
        touchRotate: true,
        rotateControl: false, // ❌ Отключаем стандартный контрол
      });

      // Добавляем тайлы
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // --- Контрол поворота внизу по центру ---
      const createRotationControl = () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control rotation-control');

        Object.assign(container.style, {
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '6px 8px',
          margin: '0',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 'bold',
        });

        const buttonLeft = document.createElement('button');
        buttonLeft.innerHTML = '⟲';
        buttonLeft.style.width = '30px';
        buttonLeft.style.height = '30px';
        buttonLeft.style.border = 'none';
        buttonLeft.style.background = 'transparent';
        buttonLeft.style.fontSize = '18px';
        buttonLeft.title = 'Повернуть влево';

        const bearingDisplay = document.createElement('span');
        bearingDisplay.style.minWidth = '50px';
        bearingDisplay.style.textAlign = 'center';
        bearingDisplay.style.fontWeight = 'bold';
        bearingDisplay.textContent = '0°';

        const buttonRight = document.createElement('button');
        buttonRight.innerHTML = '⟳';
        buttonRight.style.width = '30px';
        buttonRight.style.height = '30px';
        buttonRight.style.border = 'none';
        buttonRight.style.background = 'transparent';
        buttonRight.style.fontSize = '18px';
        buttonRight.title = 'Повернуть вправо';

        container.appendChild(buttonLeft);
        container.appendChild(bearingDisplay);
        container.appendChild(buttonRight);

        // Обновление угла
        const updateBearing = () => {
          const bearing = map.getBearing() || 0;
          bearingDisplay.textContent = `${Math.round(bearing)}°`;
        };

        map.on('rotate', updateBearing);
        updateBearing();

        // Обработчики кликов
        const onClick = (e) => e.stopPropagation();
        buttonLeft.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          map.setBearing((map.getBearing() || 0) - 10);
        });
        buttonRight.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          map.setBearing((map.getBearing() || 0) + 10);
        });
        container.addEventListener('click', onClick);

        return container;
      };

      // Создаём кастомный контрол
      const rotationControl = L.control({ position: 'bottomcenter' });
      rotationControl.onAdd = createRotationControl;
      rotationControl.addTo(map);

      // Регистрируем позицию bottomcenter
      if (!map._controlCorners.bottomcenter) {
        const corner = L.DomUtil.create(
          'div',
          'leaflet-bottomcenter leaflet-control-container',
          map._controlContainer
        );
        map._controlCorners.bottomcenter = corner;
      }

      // Сохраняем ссылку
      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          map.removeControl(rotationControl);
          map.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [mapCenter, zoom]);

  // Функция для рендера слоёв внутри карты
  const renderOverlays = () => (
    <>
      {fieldsData && <MapFields map={mapInstanceRef.current} />}
      {showMapPoints && <MapPoints map={mapInstanceRef.current} selectedFields={selectedFields} />}
      {showCleanPoints && cleanPoints && <MapCleanPoints map={mapInstanceRef.current} isFetching={false} />}
      {showCleanPoints && cleanPointsPrev && selectedYearsPrev.size > 0 && (
        <MapCleanPoints map={mapInstanceRef.current} isFetching={false} isPrev={true} />
      )}
      {showHotMap && cleanPoints && <HeatmapLayer map={mapInstanceRef.current} />}
      {showHotMap && cleanPointsPrev && selectedYearsPrev.size > 0 && (
        <HeatmapLayer map={mapInstanceRef.current} isPrev={true} />
      )}
      {showMyLocation && <MyLocationMarker map={mapInstanceRef.current} />}
      {location && <LocationMarker map={mapInstanceRef.current} location={location} />}
      {showBatymetryLayer && <BatymetryLayer map={mapInstanceRef.current} />}
      {showGridCells && <GridCells map={mapInstanceRef.current} />}
      <UserGeoDataProvider map={mapInstanceRef.current} />
    </>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Рендерим React-компоненты как оверлеи */}
      {mapInstanceRef.current && renderOverlays()}
    </div>
  );
};

export default RotatableLeafletMap;
