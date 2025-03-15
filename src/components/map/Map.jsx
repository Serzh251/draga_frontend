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
import { useFetchCleanPointsQuery, useFetchFieldsQuery, useFetchYearsQuery } from '../../api/api';
import { useAuth } from '../../hook/use-auth';
import { useMapData } from '../../hook/useDataMap';
import UserDataGeometryTable from './UserDataGeometry/UserDataGeometryTable';
import UserGeoDataLayer from './UserDataGeometry/UserGeoDataLayer';

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

  const { data: listGeojsonFields, refetch: refetchFields } = useFetchFieldsQuery();
  const { data: listUniqueYears, refetch: refetchYears } = useFetchYearsQuery();
  const {
    data: cleanGeojsonData,
    isFetching: cleanLoading,
    refetch: refetchCleanPoints,
  } = useFetchCleanPointsQuery({
    year: Array.from(selectedYears),
    field: Array.from(selectedFields),
  });
  const {
    data: cleanGeojsonDataPrev,
    isFetching: cleanLoadingPrev,
    refetch: refetchCleanPointsPrev,
  } = useFetchCleanPointsQuery({
    year: Array.from(selectedYearsPrev),
    field: Array.from(selectedFields),
  });

  useEffect(() => {
    if (isAuth) {
      refetchFields();
      refetchYears();
      refetchCleanPoints();
      refetchCleanPointsPrev();
    }
  }, [isAuth, refetchFields, refetchYears, refetchCleanPoints, refetchCleanPointsPrev]);

  useEffect(() => {
    if (cleanGeojsonData) dispatch(setCleanPoints(cleanGeojsonData));
    if (cleanGeojsonDataPrev) dispatch(setCleanPointsPrev(cleanGeojsonDataPrev));
    if (listGeojsonFields) dispatch(setFieldsData(listGeojsonFields));
    if (listUniqueYears) dispatch(setYearsData(listUniqueYears));
  }, [listGeojsonFields, listUniqueYears, cleanGeojsonData, cleanGeojsonDataPrev, dispatch]);

  return (
    <div className="app-layout">
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
      <MapContainer
        bounds={config.defaultPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        maxZoom={25}
      >
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
            <UserDataGeometryTable />
            <UserGeoDataLayer />
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
