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
import { useFetchCleanPointsQuery, useFetchFieldsQuery, useFetchYearsQuery } from '../../api/api';

const MapComponent = (isAuth) => {
  const { data: listGeojsonFields, refetch: refetchFields } = useFetchFieldsQuery();
  const { data: listUniqueYears, refetch: refetchYears } = useFetchYearsQuery();

  const [selectedFields, setSelectedFields] = useState(new Set());
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [showGridCells, setShowGridCells] = usePersistentState('showGridCells', false);
  const [showMapPoints, setShowMapPoints] = usePersistentState('showMapPoints', false);
  const [showCleanPoints, setShowCleanPoints] = usePersistentState('showCleanPoints', true);
  const [showHotMap, setShowHotMap] = usePersistentState('showHotMap', true);
  const [location, setLocation] = useState(null);

  const {
    data: cleanGeojsonData,
    isFetching: cleanLoading,
    refetch: refetchCleanPoints,
  } = useFetchCleanPointsQuery({
    year: Array.from(selectedYears),
    field: Array.from(selectedFields),
  });
  useEffect(() => {
    if (isAuth) {
      refetchFields();
      refetchYears();
      refetchCleanPoints();
    }
  }, [isAuth, refetchFields, refetchYears, refetchCleanPoints]);
  return (
    <div className="app-layout">
      <FieldSelectionSidebar
        fields={listGeojsonFields?.features || []}
        selectedFields={selectedFields}
        onSelectionChange={setSelectedFields}
      />
      <YearSelectionSidebar
        years={listUniqueYears || []}
        selectedYears={selectedYears}
        onSelectionChange={setSelectedYears}
      />
      <MapContainer
        bounds={config.defaultPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        maxZoom={25}
      >
        <MapInstruments />

        {listGeojsonFields && <MapFields listGeojsonFields={listGeojsonFields} />}
        {showMapPoints && <MapPoints selectedFields={selectedFields} />}
        {showCleanPoints && cleanGeojsonData && (
          <MapCleanPoints geojsonData={cleanGeojsonData} isFetching={cleanLoading} />
        )}
        {showHotMap && cleanGeojsonData && <HeatmapLayer data={cleanGeojsonData.features} />}
        {showGridCells && <GridCells />}
        {location && <LocationMarker location={location} />}
      </MapContainer>

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

      <WebSocketComponent setLocation={setLocation} />
    </div>
  );
};

export default MapComponent;
