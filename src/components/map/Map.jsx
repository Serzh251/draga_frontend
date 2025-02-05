import React from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
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

const MapComponent = () => {
  const { geojsonData, loading, error } = useGeoData("http://localhost:2025/api/points/?is_working=1");

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  return (
    <div className="app-layout">
      <MapContainer
        bounds={config.defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <LayersControlComponent />
        <DrawTools />
        <RulerControl />
        {/*{geojsonData && <MapPoints geojsonData={geojsonData} />}*/}
        {geojsonData && <HeatmapLayer data={geojsonData.features} />}
      </MapContainer>
    </div>
  );
};
export default  MapComponent;