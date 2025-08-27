// components/map/MapComponent.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import '../../static/css/MapMain.css';
import config from '../../config';
import MapPoints from './MapPoints';
import HeatmapLayer from './HeatMapLayer';
import GridCells from './Fields/GridCells';
import MapCleanPoints from './MapCleanPoints';
import FieldSelectionSidebar from './Fields/FieldSelectionSidebar';
import MapFields from './Fields/MapFields';
import ToggleButtonGroup from '../buttons/ToogleButtons';
import WebSocketComponent from '../location/WebsockerLocation';
import LocationMarker from '../location/LocationMarker';
import YearSelectionSidebar from './YearSelectionSidebar';
import usePersistentState from '../../hook/usePersistentState';
import MapInstruments from './Instruments/MapInstruments';
import { useDispatch } from 'react-redux';
import { setFieldsData, setYearsData, setCleanPoints, setCleanPointsPrev } from '../../store/slices/mapDataSlice';
import {
  useFetchCleanPointsQuery,
  useFetchFieldsQuery,
  useFetchYearsQuery,
  useFetchDefaultMapCenterQuery,
} from '../../api/api';
import { useAuth } from '../../hook/use-auth';
import { useMapData } from '../../hook/useDataMap';
import UserGeoDataProvider from './UserDataGeometry/UserGeoDataProvider';

// Импорт новой кнопки
import SaveMapCenterButton from '../buttons/SaveMapCenterButton';
import MapSyncCenter from './MapSyncCenter';
const MapComponent = () => {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const { fieldsData, yearsData, cleanPoints, cleanPointsPrev } = useMapData();

  const [selectedFields, setSelectedFields] = useState(new Set());
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [selectedYearsPrev, setSelectedYearsPrev] = useState(new Set());
  const [showGridCells, setShowGridCells] = usePersistentState('showGridCells', false);
  const [showMapPoints, setShowMapPoints] = usePersistentState('showMapPoints', false);
  const [showCleanPoints, setShowCleanPoints] = usePersistentState('showCleanPoints', true);
  const [showHotMap, setShowHotMap] = usePersistentState('showHotMap', true);
  const [location, setLocation] = useState(null);

  // Загружаем настройки карты (центр и зум)
  const { data: mapData } = useFetchDefaultMapCenterQuery(undefined, {
    skip: !isAuth,
  });

  // Запросы к данным
  const { data: listGeojsonFields } = useFetchFieldsQuery(undefined, {
    skip: !isAuth,
  });
  const { data: listUniqueYears } = useFetchYearsQuery(undefined, {
    skip: !isAuth,
  });
  const { data: cleanGeojsonData, isFetching: cleanLoading } = useFetchCleanPointsQuery(
    {
      year: Array.from(selectedYears),
      field: Array.from(selectedFields),
    },
    { skip: !isAuth || selectedFields.size === 0 || selectedYears.size === 0 }
  );

  const { data: cleanGeojsonDataPrev, isFetching: cleanLoadingPrev } = useFetchCleanPointsQuery(
    {
      year: Array.from(selectedYearsPrev),
      field: Array.from(selectedFields),
    },
    { skip: !isAuth || selectedFields.size === 0 || selectedYearsPrev.size === 0 }
  );

  // Сохраняем данные в Redux
  useEffect(() => {
    if (cleanGeojsonData) dispatch(setCleanPoints(cleanGeojsonData));
    if (cleanGeojsonDataPrev) dispatch(setCleanPointsPrev(cleanGeojsonDataPrev));
    if (listGeojsonFields) dispatch(setFieldsData(listGeojsonFields));
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [listGeojsonFields, listUniqueYears, cleanGeojsonData, cleanGeojsonDataPrev, dispatch]);

  return (
    <div className="app-layout">
      {/* Сайдбары (только для авторизованных) */}
      {isAuth && (
        <>
          <FieldSelectionSidebar
            fields={fieldsData?.features || []}
            selectedFields={selectedFields}
            onSelectionChange={setSelectedFields}
          />
          <YearSelectionSidebar
            years={yearsData || []}
            selectedYears={selectedYears}
            onSelectionChange={setSelectedYears}
          />
          <YearSelectionSidebar
            years={yearsData || []}
            selectedYears={selectedYearsPrev}
            onSelectionChange={setSelectedYearsPrev}
            isPrev={true}
          />
        </>
      )}

      {/* Карта */}
      <MapContainer
        center={config.defaultCenter}
        zoom={config.defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        maxZoom={25}
      >
        {/* Синхронизация центра после получения данных */}
        {mapData?.center?.coordinates && (
          <MapSyncCenter center={[mapData.center.coordinates[1], mapData.center.coordinates[0]]} zoom={mapData.zoom} />
        )}
        {/* Инструменты и слои */}
        <MapInstruments />

        {isAuth && (
          <>
            {fieldsData && <MapFields />}
            {showMapPoints && <MapPoints selectedFields={selectedFields} />}
            {showCleanPoints && cleanPoints && <MapCleanPoints isFetching={cleanLoading} />}
            {showCleanPoints && cleanPointsPrev && selectedYearsPrev.size && (
              <MapCleanPoints isFetching={cleanLoadingPrev} isPrev={true} />
            )}
            {showHotMap && cleanPoints && <HeatmapLayer />}
            {showHotMap && cleanPointsPrev && selectedYearsPrev.size && <HeatmapLayer isPrev={true} />}
            {showGridCells && <GridCells />}
            {location && <LocationMarker location={location} />}
            <UserGeoDataProvider />
          </>
        )}

        {/* Кнопка сохранения центра — только для авторизованных */}
        {isAuth && <SaveMapCenterButton />}
      </MapContainer>

      {/* Группа переключателей */}
      {isAuth && (
        <ToggleButtonGroup
          showMapPoints={showMapPoints}
          setShowMapPoints={setShowMapPoints}
          showCleanPoints={showCleanPoints}
          setShowCleanPoints={setShowCleanPoints}
          showGridCells={showGridCells}
          setShowGridCells={setShowGridCells}
          showHotMap={showHotMap}
          setShowHotMap={setShowHotMap}
        />
      )}

      {/* WebSocket для получения локации */}
      <WebSocketComponent setLocation={setLocation} />
    </div>
  );
};

export default MapComponent;
