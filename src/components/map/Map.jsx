// src/components/MapComponent.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate';
import '../../static/css/MapMain.css';
import config from '../../config';
import usePersistentState from '@/hooks/usePersistentState';
import MapInstruments from './Instruments/MapInstruments';
import { setYearsData } from '@/store/slices/mapDataSlice';
import { useFetchYearsQuery, useFetchDefaultMapCenterQuery } from '@/api/api';
import { useAuth } from '@/hooks/useAuth';
import { useMapData } from '@/hooks/useDataMap';
import MapFields from './Fields/MapFields';
import UserGeoDataProvider from './UserDataGeometry/UserGeoDataProvider';
import FieldSelectionSidebar from './Fields/FieldSelectionSidebar';
import YearSelectionSidebar from './YearSelectionSidebar';
import MapPoints from './MapPoints';
import MapCleanPoints from './MapCleanPoints';
import HeatmapLayer from './HeatMapLayer';
import RotateButtons from './Instruments/RotateButtons';
import LocationMarker from '../location/LocationMarker';
import BatymetryLayer from '../Batymetry/BatymetryLayer';
import MyLocationMarker from '../location/MyLocationMarker';
import GridCells from './Fields/GridCells';
import SaveCurrentPointButton from './Instruments/SaveCurrentPointButton';
import ReloadButton from '../buttons/ReloadBtn';
import ToggleButtonGroup from '@/components/buttons/ToogleButtons';

const MapComponent = () => {
  const dispatch = useDispatch();
  const { isAuth, authStatus } = useAuth();
  const { yearsData } = useMapData();

  const isMobile = useSelector((state) => state.ui?.isMobile);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [selectedFields, setSelectedFields] = useState(new Set());
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [selectedYearsPrev, setSelectedYearsPrev] = useState(new Set());

  // persistent flags (single source of truth)
  const [showGridCells, setShowGridCells] = usePersistentState('showGridCells', false);
  const [showMapPoints, setShowMapPoints] = usePersistentState('showMapPoints', false);
  const [showMyLocation, setShowMyLocation] = usePersistentState('showMyLocation', false);
  const [showCleanPoints, setShowCleanPoints] = usePersistentState('showCleanPoints', true);
  const [showBatymetryLayer, setShowBatymetryLayer] = usePersistentState('showBatymetryLayer', true);
  const [showHotMap, setShowHotMap] = usePersistentState('showHotMap', true);

  const displayStates = useMemo(
    () => ({
      showGridCells,
      showMapPoints,
      showMyLocation,
      showCleanPoints,
      showBatymetryLayer,
      showHotMap,
    }),
    [showGridCells, showMapPoints, showMyLocation, showCleanPoints, showBatymetryLayer, showHotMap]
  );

  const toggleDisplayState = (key) => {
    switch (key) {
      case 'showGridCells':
        setShowGridCells((v) => !v);
        break;
      case 'showMapPoints':
        setShowMapPoints((v) => !v);
        break;
      case 'showMyLocation':
        setShowMyLocation((v) => !v);
        break;
      case 'showCleanPoints':
        setShowCleanPoints((v) => !v);
        break;
      case 'showBatymetryLayer':
        setShowBatymetryLayer((v) => !v);
        break;
      case 'showHotMap':
        setShowHotMap((v) => !v);
        break;
      default:
        break;
    }
  };

  const { data: mapData } = useFetchDefaultMapCenterQuery(undefined, { skip: !isAuth });
  const { data: listUniqueYears } = useFetchYearsQuery(undefined, { skip: !isAuth });

  useEffect(() => {
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [listUniqueYears, dispatch]);

  // init map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = mapData?.center?.coordinates
      ? [mapData.center.coordinates[1], mapData.center.coordinates[0]]
      : config.defaultCenter;
    const initialZoom = mapData?.zoom || config.defaultZoom;
    const initialBearing = mapData?.bearing || 0;
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      maxZoom: 25,
      rotate: true,
      touchRotate: true,
      bearing: initialBearing,
      rotateControl: { closeOnZeroBearing: false, position: 'bottomright' },
      zoomControl: false,
      attributionControl: false,
      touchGestures: true,
    });

    // create panes
    map.createPane('fieldsPane').style.zIndex = 650;
    map.createPane('popupAbovePane').style.zIndex = 710;

    // add mobile class to container if needed
    if (isMobile && mapContainerRef.current) {
      mapContainerRef.current.classList.add('mobile-map');
    }

    mapInstanceRef.current = map;

    map.whenReady(() => requestAnimationFrame(() => setIsMapReady(true)));

    return () => {
      // remove mobile class on unmount
      if (mapContainerRef.current) {
        mapContainerRef.current.classList.remove('mobile-map');
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData?.center?.coordinates?.join(','), mapData?.zoom]); // don't include isMobile here to avoid re-creating map

  // update mobile class when isMobile changes (do NOT recreate map)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    if (isMobile) container.classList.add('mobile-map');
    else container.classList.remove('mobile-map');
  }, [isMobile]);

  if (authStatus === 'loading') return <div>Загрузка...</div>;

  return (
    <div className="app-layout">
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {isMapReady && (
        <>
          <MapInstruments map={mapInstanceRef.current} isAuth={isAuth} />
          {mapInstanceRef.current && <UserGeoDataProvider map={mapInstanceRef.current} />}
        </>
      )}

      {isAuth && (
        <>
          <FieldSelectionSidebar selectedFields={selectedFields} onSelectionChange={setSelectedFields} />
          <YearSelectionSidebar
            years={yearsData || []}
            selectedYears={selectedYears}
            onSelectionChange={setSelectedYears}
          />
          <YearSelectionSidebar
            years={yearsData || []}
            selectedYears={selectedYearsPrev}
            onSelectionChange={setSelectedYearsPrev}
            isPrev
          />

          {isMapReady && (
            <>
              <ReloadButton style={{ top: 352, left: 11, width: 30, height: 30, padding: 2 }} />
              <MapFields map={mapInstanceRef.current} />
              <RotateButtons map={mapInstanceRef.current} />
              <SaveCurrentPointButton style={{ top: 312, left: 11, width: 30, height: 30, padding: 2 }} />

              {showBatymetryLayer && <BatymetryLayer map={mapInstanceRef.current} />}
              <LocationMarker map={mapInstanceRef.current} />
              {showMyLocation && <MyLocationMarker map={mapInstanceRef.current} />}
              {showGridCells && <GridCells selectedFields={selectedFields} map={mapInstanceRef.current} />}
              {showMapPoints && (
                <MapPoints
                  map={mapInstanceRef.current}
                  selectedFields={selectedFields}
                  selectedYears={selectedYears}
                />
              )}
              {showCleanPoints && (
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
                    isPrev
                  />
                </>
              )}
              {showHotMap && (
                <HeatmapLayer
                  map={mapInstanceRef.current}
                  selectedFields={selectedFields}
                  selectedYears={selectedYears}
                />
              )}
            </>
          )}

          <ToggleButtonGroup displayStates={displayStates} toggleDisplayState={toggleDisplayState} />
        </>
      )}
    </div>
  );
};

export default MapComponent;
