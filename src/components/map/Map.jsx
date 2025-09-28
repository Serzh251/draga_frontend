// src/components/Map/MapComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate'; // Подключаем плагин
import '../../static/css/MapMain.css';
import config from '../../config';
import ToggleButtonGroup from '../buttons/ToogleButtons';
import WebSocketComponent from '../location/WebsocketLocation';
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
import RotatableLeafletMap from './RotatableLeafletMap';
import MapFields from './Fields/MapFields';

const MapComponent = () => {
  const dispatch = useDispatch();
  const { isAuth, authStatus } = useAuth();
  const { fieldsData, yearsData, cleanPoints, cleanPointsPrev } = useMapData();

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

  const { data: mapData } = useFetchDefaultMapCenterQuery(undefined, {
    skip: !isAuth,
  });

  const {
    data: listGeojsonFields,
    isLoading: fieldsLoading,
    refetch: refetchFields,
  } = useFetchFieldsQuery(undefined, {
    skip: !isAuth,
  });
  const { data: listUniqueYears } = useFetchYearsQuery(undefined, {
    skip: !isAuth,
  });

  const {
    data: cleanGeojsonData,
    isFetching: cleanLoading,
    refetch: refetchCleanPoints,
  } = useFetchCleanPointsQuery(
    {
      year: selectedYears.size > 0 ? Array.from(selectedYears) : [],
      field: Array.from(selectedFields),
    },
    {
      skip: !isAuth || selectedFields.size === 0,
      refetchOnMountOrArgChange: true,
    }
  );

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

  useEffect(() => {
    if (isAuth) {
      refetchFields().then((result) => {
        if (result.data) {
          dispatch(setFieldsData(result.data));
        }
      });
    }
  }, [isAuth, refetchFields, dispatch]);

  useEffect(() => {
    if (isAuth && selectedFields.size > 0) {
      refetchCleanPoints();
      refetchCleanPointsPrev();
    }
  }, [showCleanPoints, refetchCleanPoints, refetchCleanPointsPrev, isAuth, selectedFields]);

  useEffect(() => {
    if (cleanGeojsonData) dispatch(setCleanPoints(cleanGeojsonData));
    if (cleanGeojsonDataPrev) dispatch(setCleanPointsPrev(cleanGeojsonDataPrev));
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [cleanGeojsonData, cleanGeojsonDataPrev, listUniqueYears, dispatch]);

  // --- Инициализация карты ---
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
      rotateControl: {
        closeOnZeroBearing: false,
      },
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        map.remove();
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
  }, [mapData]);

  if (authStatus === 'loading') {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="app-layout">
      {/* Контейнер для карты */}
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {/* Инструменты */}
      {isMapReady && <MapInstruments map={mapInstanceRef.current} isAuth={isAuth} />}

      {isAuth && isMapReady && fieldsData && !fieldsLoading && (
        <MapFields
          key={`map-fields-${fieldsData.features?.length || 0}`}
          map={mapInstanceRef.current}
          features={fieldsData.features}
        />
      )}

      {/*<RotatableLeafletMap*/}
      {/*  selectedFields={selectedFields}*/}
      {/*  selectedYears={selectedYears}*/}
      {/*  selectedYearsPrev={selectedYearsPrev}*/}
      {/*  showGridCells={showGridCells}*/}
      {/*  showMapPoints={showMapPoints}*/}
      {/*  showMyLocation={showMyLocation}*/}
      {/*  showCleanPoints={showCleanPoints}*/}
      {/*  showBatymetryLayer={showBatymetryLayer}*/}
      {/*  showHotMap={showHotMap}*/}
      {/*  location={location}*/}
      {/*  fieldsData={fieldsData}*/}
      {/*  cleanPoints={cleanPoints}*/}
      {/*  cleanPointsPrev={cleanPointsPrev}*/}
      {/*  mapCenter={mapCenter}*/}
      {/*  zoom={z}*/}
      {/*/>*/}

      {/* Слои, требующие переработки — временно закомментированы */}
      {/* {showMapPoints && <MapPoints selectedFields={selectedFields} />} */}
      {/* {showCleanPoints && cleanPoints && <MapCleanPoints isFetching={cleanLoading} />} */}
      {/* {showCleanPoints && cleanPointsPrev && selectedYearsPrev.size > 0 && (
        <MapCleanPoints isFetching={cleanLoadingPrev} isPrev={true} />
      )} */}
      {/* {showHotMap && cleanPoints && <HeatmapLayer />} */}
      {/* {showMyLocation && <MyLocationMarker />} */}
      {/* {showBatymetryLayer && <BatymetryLayer />} */}
      {/* {showHotMap && cleanPointsPrev && selectedYearsPrev.size > 0 && <HeatmapLayer isPrev={true} />} */}
      {/* {showGridCells && <GridCells />} */}
      {/* {location && <LocationMarker location={location} />} */}
      {/* <UserGeoDataProvider /> */}

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
          showMyLocation={showMyLocation}
          setShowMyLocation={setShowMyLocation}
          setShowBatymetryLayer={setShowBatymetryLayer}
          showBatymetryLayer={showBatymetryLayer}
        />
      )}
      <WebSocketComponent setLocation={setLocation} />
    </div>
  );
};

export default MapComponent;
