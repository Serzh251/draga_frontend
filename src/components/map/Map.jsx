import React, { useState } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import '../../static/css/MapMain.css';
import LayersControlComponent from "./LayersControlComponent";
import RulerControl from "./RulerControl";
import config from "../../config";
import DrawTools from "./DrawTools";
import MapPoints from "./MapPoints";
import HeatmapLayer from "./HeatMapLayer";
import GridCells from "./Fields/GridCells";
import MapCleanPoints from "./MapCleanPoints";
import FieldSelectionSidebar from "./Fields/FieldsList";
import useListFields from "../../hook/useListFields";
import MapFields from "./Fields/MapFields";
import ToggleButtonGroup from "../buttons/ToogleButtons";
import WebSocketComponent from "../location/WebsockerLocation";
import LocationMarker from "../location/LocationMarker";
import YearSelectionSidebar from "./YearSelectionSidebar";
import useUniqueYears from "../../hook/useUniqueYears";
import useCleanPoints from "../../hook/useCleanPoints";

const MapComponent = () => {
  const { listGeojsonFields } = useListFields();
  const { listUniqueYears } = useUniqueYears();
  const [selectedFields, setSelectedFields] = useState(new Set());
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [showGridCells, setShowGridCells] = useState(false);
  const [showMapPoints, setShowMapPoints] = useState(true);
  const [showCleanPoints, setShowCleanPoints] = useState(true);
  const [showHotMap, setShowHotMap] = useState(true);
  const [location, setLocation] = useState(null);

  const { geojsonData: cleanGeojsonData, loading: cleanLoading, error: cleanError } = useCleanPoints(selectedFields, selectedYears);

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
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        maxZoom={25}
      >
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <LayersControlComponent />
        <DrawTools />
        <RulerControl />

        {listGeojsonFields && <MapFields listGeojsonFields={listGeojsonFields} />}
        {showMapPoints && <MapPoints selectedFields={selectedFields} />}
        {showCleanPoints && cleanGeojsonData && (
          <MapCleanPoints
            geojsonData={cleanGeojsonData}
            loading={cleanLoading}
            error={cleanError}
          />
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
