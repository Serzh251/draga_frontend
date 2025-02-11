import React, { useState } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "../../static/css/MapMain.css";
import LayersControlComponent from "./LayersControlComponent";
import RulerControl from "./RulerControl";
import config from "../../config";
import DrawTools from "./DrawTools";
import useListFields from "../../hook/useListFields";
import MapPoints from "./MapPoints";
import MapFields from "./Fields/MapFields";
import FieldSelectionSidebar from "./Fields/FieldsList";
import MapCleanPoints from "./MapCleanPoints";
import GridCells from "./Fields/GridCells";


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
        <GridCells />
        <DrawTools />
        <RulerControl />
        {<MapPoints selectedFields={selectedFields}/>}
        {<MapCleanPoints selectedFields={selectedFields}/>}
        {listGeojsonFields && (
          <MapFields listGeojsonFields={listGeojsonFields}/>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
