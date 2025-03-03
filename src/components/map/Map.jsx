import React, { useState, useEffect } from 'react';
import { MapContainer, ScaleControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import '../../static/css/MapMain.css';
import LayersControlComponent from './LayersControlComponent';
import RulerControl from './RulerControl';
import config from '../../config';
import DrawTools from './DrawTools';
import MapPoints from './MapPoints';
import HeatmapLayer from './HeatMapLayer';
import GridCells from './Fields/GridCells';
import MapCleanPoints from './MapCleanPoints';
import FieldSelectionSidebar from './Fields/FieldsList';
import useListFields from '../../hook/useListFields';
import MapFields from './Fields/MapFields';
import ToggleButtonGroup from '../buttons/ToogleButtons';
import WebSocketComponent from '../location/WebsockerLocation';
import LocationMarker from '../location/LocationMarker';
import YearSelectionSidebar from './YearSelectionSidebar';
import useUniqueYears from '../../hook/useUniqueYears';
import useCleanPoints from '../../hook/useCleanPoints';

const MapComponent = () => {
  const { listGeojsonFields } = useListFields();
  const { listUniqueYears } = useUniqueYears();

  const loadState = (key, defaultValue) => {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : defaultValue;
  };

  const [selectedFields, setSelectedFields] = useState(
    loadState('selectedFields', new Set())
  );
  const [selectedYears, setSelectedYears] = useState(
    loadState('selectedYears', new Set())
  );
  const [showGridCells, setShowGridCells] = useState(
    loadState('showGridCells', false)
  );
  const [showMapPoints, setShowMapPoints] = useState(
    loadState('showMapPoints', true)
  );
  const [showCleanPoints, setShowCleanPoints] = useState(
    loadState('showCleanPoints', true)
  );
  const [showHotMap, setShowHotMap] = useState(loadState('showHotMap', true));
  const [location, setLocation] = useState(null);

  const {
    geojsonData: cleanGeojsonData,
    loading: cleanLoading,
    error: cleanError,
  } = useCleanPoints(selectedFields, selectedYears);

  useEffect(() => {
    localStorage.setItem('selectedFields', JSON.stringify([...selectedFields]));
  }, [selectedFields]);

  useEffect(() => {
    localStorage.setItem('selectedYears', JSON.stringify([...selectedYears]));
  }, [selectedYears]);

  useEffect(() => {
    localStorage.setItem('showGridCells', JSON.stringify(showGridCells));
  }, [showGridCells]);

  useEffect(() => {
    localStorage.setItem('showMapPoints', JSON.stringify(showMapPoints));
  }, [showMapPoints]);

  useEffect(() => {
    localStorage.setItem('showCleanPoints', JSON.stringify(showCleanPoints));
  }, [showCleanPoints]);

  useEffect(() => {
    localStorage.setItem('showHotMap', JSON.stringify(showHotMap));
  }, [showHotMap]);

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
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <LayersControlComponent />
        <DrawTools />
        <RulerControl />

        {listGeojsonFields && (
          <MapFields listGeojsonFields={listGeojsonFields} />
        )}
        {showMapPoints && <MapPoints selectedFields={selectedFields} />}
        {showCleanPoints && cleanGeojsonData && (
          <MapCleanPoints
            geojsonData={cleanGeojsonData}
            loading={cleanLoading}
            error={cleanError}
          />
        )}
        {showHotMap && cleanGeojsonData && (
          <HeatmapLayer data={cleanGeojsonData.features} />
        )}
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
