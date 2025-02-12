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
import useGeoData from "../../hook/useGeodataPoints";
import MapPoints from "./MapPoints";
import HeatmapLayer from "./HeatMapLayer";
import GridCells from "./Fields/GridCells";
import MapCleanPoints from "./MapCleanPoints";
import FieldSelectionSidebar from "./Fields/FieldsList";
import useListFields from "../../hook/useListFields";
import MapFields from "./Fields/MapFields";

const MapComponent = () => {
  const { listGeojsonFields } = useListFields();
  const [selectedFields, setSelectedFields] = useState(new Set());

  return (
    <div className="app-layout">
      <FieldSelectionSidebar
        fields={listGeojsonFields?.features || []}
        selectedFields={selectedFields}
        onSelectionChange={setSelectedFields}
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
        {/*<GridCells />*/}
        {listGeojsonFields && (
          <MapFields listGeojsonFields={listGeojsonFields}/>
        )}
        <DrawTools />
        <RulerControl />
        {<MapPoints selectedFields={selectedFields}/>}
        {<MapCleanPoints selectedFields={selectedFields}/>}
        {/*{geojsonData && <HeatmapLayer data={geojsonData.features} />}*/}
      </MapContainer>
    </div>
  );
};
export default  MapComponent;