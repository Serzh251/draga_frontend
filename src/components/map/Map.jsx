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
import { AlignCenterOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const MapComponent = () => {
  const { listGeojsonFields } = useListFields();
  const [selectedFields, setSelectedFields] = useState(new Set());
  const [cleanGeojsonData, setCleanGeojsonData] = useState(null);
  const [showGridCells, setShowGridCells] = useState(false);
  const [showMapPoints, setShowMapPoints] = useState(true);
  const [showCleanPoints, setShowCleanPoints] = useState(true);

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
        {listGeojsonFields && <MapFields listGeojsonFields={listGeojsonFields} />}
        <DrawTools />
        <RulerControl />
        {showMapPoints && <MapPoints selectedFields={selectedFields} />}
        {showCleanPoints && <MapCleanPoints selectedFields={selectedFields} onDataLoaded={setCleanGeojsonData} />}
        {cleanGeojsonData && <HeatmapLayer data={cleanGeojsonData.features} />}
        {showGridCells && <GridCells />}
      </MapContainer>

      <Tooltip title={showMapPoints ? "Скрыть все точки" : "Показать все точки"}>
        <EnvironmentOutlined
          onClick={() => setShowMapPoints((prev) => !prev)}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 250,
            right: 10,
            fontSize: "24px",
            cursor: "pointer",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        />
      </Tooltip>

      <Tooltip title={showCleanPoints ? "Скрыть clean точки" : "Показать clean точки"}>
        <EnvironmentOutlined
          onClick={() => setShowCleanPoints((prev) => !prev)} // Управляем отображением MapCleanPoints
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 320,
            right: 10,
            fontSize: "24px",
            cursor: "pointer",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        />
      </Tooltip>

      <Tooltip title={showGridCells ? "Скрыть сетку" : "Показать сетку"}>
        <AlignCenterOutlined
          onClick={() => setShowGridCells((prev) => !prev)}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 390,
            right: 10,
            fontSize: "24px",
            cursor: "pointer",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        />
      </Tooltip>
    </div>
  );
};

export default MapComponent;
