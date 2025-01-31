import React, {useState} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../../static/css/MapMain.css';
// import {useAuth} from "../../hook/use-auth";
// import Basemap from "./MapTypeChoose";
// import {LastLocationLayer} from "./LastLocationLayer";

// L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

const position = [
  [64, 41],
  [62, 42],
];

const MapComponent = () => {
  const [basemap, setBasemap] = useState("osm");
  // const {isAuth} = useAuth();
  const basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    sat: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    hot: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
    topomap: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  };
  // const onBMChange = (bm) => {
  //   setBasemap(bm);
  // };

  return (
    <div className="app-layout">
      <MapContainer bounds={position} zoom={13} style={styles.map}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url={basemapsDict[basemap]}
        />
        {/*<Basemap basemap={basemap} onChange={onBMChange}/>*/}
        {/*{isAuth && (*/}
        {/*  <>*/}
        {/*    <TrackMain/>*/}
        {/*    <LastLocationLayer/>*/}
        {/*  </>*/}
        {/*// )}*/}
      </MapContainer>
    </div>
  );
};
export default MapComponent;

const styles = {
  map: {
    height: '100%',
    width: '100%',
  },
};
