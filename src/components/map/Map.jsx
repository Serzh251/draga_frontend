import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate';
import '../../static/css/MapMain.css';
import config from '../../config';
import ToggleButtonGroup from '../buttons/ToogleButtons';
import WebSocketComponent from '../location/WebsocketLocation';
import usePersistentState from '../../hook/usePersistentState';
import MapInstruments from './Instruments/MapInstruments';
import { useDispatch } from 'react-redux';
import { setFieldsData, setYearsData } from '../../store/slices/mapDataSlice';
import { useFetchFieldsQuery, useFetchYearsQuery, useFetchDefaultMapCenterQuery } from '../../api/api';
import { useAuth } from '../../hook/use-auth';
import { useMapData } from '../../hook/useDataMap';
import MapFields from './Fields/MapFields';
import UserGeoDataProvider from './UserDataGeometry/UserGeoDataProvider';
import FieldSelectionSidebar from './Fields/FieldSelectionSidebar';
import YearSelectionSidebar from './YearSelectionSidebar';
import MapPoints from './MapPoints';
import MapCleanPoints from './MapCleanPoints';

const MapComponent = () => {
  const dispatch = useDispatch();
  const { isAuth, authStatus } = useAuth();
  const { fieldsData, yearsData } = useMapData();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [selectedFields, setSelectedFields] = useState(new Set());
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [selectedYearsPrev, setSelectedYearsPrev] = useState(new Set());

  const [showGridCells, setShowGridCells] = usePersistentState('showGridCells', false);
  const [showMapPoints, setShowMapPoints] = usePersistentState('showMapPoints', false);
  const [showMyLocation, setShowMyLocation] = usePersistentState('showMyLocation', false);
  const [showCleanPoints, setShowCleanPoints] = usePersistentState('showCleanPoints', true);
  const [showBatymetryLayer, setShowBatymetryLayer] = usePersistentState('showBatymetryLayer', true);
  const [showHotMap, setShowHotMap] = usePersistentState('showHotMap', true);
  const [location, setLocation] = useState(null);

  const { data: mapData } = useFetchDefaultMapCenterQuery(undefined, { skip: !isAuth });

  const {
    data: listGeojsonFields,
    isLoading: fieldsLoading,
    refetch: refetchFields,
  } = useFetchFieldsQuery(undefined, { skip: !isAuth });

  const { data: listUniqueYears } = useFetchYearsQuery(undefined, { skip: !isAuth });

  useEffect(() => {
    if (!isAuth) return;
    refetchFields().then((res) => {
      if (res?.data) dispatch(setFieldsData(res.data));
    });
  }, [isAuth, refetchFields, dispatch]);

  useEffect(() => {
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [listUniqueYears, dispatch]);

  // Инициализация карты — безопасно, с проверкой DOM
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = mapData?.center?.coordinates
      ? [mapData.center.coordinates[1], mapData.center.coordinates[0]]
      : config.defaultCenter;
    const initialZoom = mapData?.zoom || config.defaultZoom;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      rotate: true,
      bearing: 0,
      touchRotate: true,
      rotateControl: { closeOnZeroBearing: false },
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Ждём полной готовности карты и рендерера
    map.whenReady(() => requestAnimationFrame(() => setIsMapReady(true)));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
  }, [mapData?.center?.coordinates?.join?.(','), mapData?.zoom]);

  if (authStatus === 'loading') return <div>Загрузка...</div>;

  return (
    <div className="app-layout">
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {isMapReady && <MapInstruments map={mapInstanceRef.current} isAuth={isAuth} />}

      {isAuth && isMapReady && fieldsData && !fieldsLoading && (
        <MapFields
          key={`map-fields-${fieldsData.features?.length || 0}`}
          map={mapInstanceRef.current}
          features={fieldsData.features}
        />
      )}
      {showMapPoints && isMapReady && <MapPoints map={mapInstanceRef.current} selectedFields={selectedFields} />}
      {isMapReady && mapInstanceRef.current && <UserGeoDataProvider map={mapInstanceRef.current} />}

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

          {showCleanPoints && isMapReady && (
            <>
              <MapCleanPoints
                map={mapInstanceRef.current}
                selectedFields={selectedFields}
                selectedYears={selectedYears}
                isPrev={false}
              />

              <MapCleanPoints
                map={mapInstanceRef.current}
                selectedFields={selectedFields}
                selectedYears={selectedYearsPrev}
                isPrev={true}
              />
            </>
          )}

          <ToggleButtonGroup
            showMapPoints={showMapPoints}
            setShowMapPoints={setShowMapPoints}
            showCleanPoints={showCleanPoints}
            setShowCleanPoints={setShowCleanPoints}
            showGridCells={showGridCells}
            setShowGridCells={setShowGridCells}
            showHotMap={showHotMap}
            setShowHotMap={setShowHotMap}
            showMyLocation={showMyLocation}
            setShowMyLocation={setShowMyLocation}
            setShowBatymetryLayer={setShowBatymetryLayer}
            showBatymetryLayer={showBatymetryLayer}
          />
        </>
      )}
      <WebSocketComponent setLocation={setLocation} />
    </div>
  );
};

export default MapComponent;
