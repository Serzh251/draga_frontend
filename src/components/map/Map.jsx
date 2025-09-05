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

  // Загружаем настройки карты
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

  // === Запрос для текущих чистых точек ===
  const {
    data: cleanGeojsonData,
    isFetching: cleanLoading,
    refetch: refetchCleanPoints,
  } = useFetchCleanPointsQuery(
    {
      year: selectedYears.size > 0 ? Array.from(selectedYears) : [], // [] — все года
      field: Array.from(selectedFields),
    },
    {
      skip: !isAuth || selectedFields.size === 0, // Убрали проверку на selectedYears.size === 0
      refetchOnMountOrArgChange: true,
    }
  );

  // === Запрос для предыдущих чистых точек ===
  const {
    data: cleanGeojsonDataPrev,
    isFetching: cleanLoadingPrev,
    refetch: refetchCleanPointsPrev,
  } = useFetchCleanPointsQuery(
    {
      year: selectedYearsPrev.size > 0 ? Array.from(selectedYearsPrev) : [],
      field: Array.from(selectedFields),
    },
    {
      skip: !isAuth || selectedFields.size === 0,
      refetchOnMountOrArgChange: true,
    }
  );

  // === Ключевой эффект: принудительный refetch при изменении showCleanPoints ===
  useEffect(() => {
    if (isAuth && selectedFields.size > 0) {
      // Принудительно запрашиваем данные при изменении showCleanPoints
      refetchCleanPoints();
      refetchCleanPointsPrev();
    }
  }, [showCleanPoints, refetchCleanPoints, refetchCleanPointsPrev, isAuth, selectedFields]);

  // Сохраняем данные в Redux
  useEffect(() => {
    if (cleanGeojsonData) dispatch(setCleanPoints(cleanGeojsonData));
    if (cleanGeojsonDataPrev) dispatch(setCleanPointsPrev(cleanGeojsonDataPrev));
    if (listGeojsonFields) dispatch(setFieldsData(listGeojsonFields));
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [listGeojsonFields, listUniqueYears, cleanGeojsonData, cleanGeojsonDataPrev, dispatch]);

  return (
    <div className="app-layout">
      <MapContainer
        center={config.defaultCenter}
        zoom={config.defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        maxZoom={25}
      >
        {mapData?.center?.coordinates && (
          <MapSyncCenter center={[mapData.center.coordinates[1], mapData.center.coordinates[0]]} zoom={mapData.zoom} />
        )}

        <MapInstruments />

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

            {fieldsData && <MapFields />}
            {showMapPoints && <MapPoints selectedFields={selectedFields} />}
            {showCleanPoints && cleanPoints && <MapCleanPoints isFetching={cleanLoading} />}
            {showCleanPoints && cleanPointsPrev && selectedYearsPrev.size > 0 && (
              <MapCleanPoints isFetching={cleanLoadingPrev} isPrev={true} />
            )}
            {showHotMap && cleanPoints && <HeatmapLayer />}
            {showHotMap && cleanPointsPrev && selectedYearsPrev.size > 0 && <HeatmapLayer isPrev={true} />}
            {showGridCells && <GridCells />}
            {location && <LocationMarker location={location} />}
            <UserGeoDataProvider />
          </>
        )}
      </MapContainer>

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

      <WebSocketComponent setLocation={setLocation} />
    </div>
  );
};

export default MapComponent;
