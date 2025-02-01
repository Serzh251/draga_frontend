import React, { useEffect, useState } from "react";
import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../../static/css/MapMain.css';

const position = [
  [65, 42],
  [61, 40],
];

const layers = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps'
  },
  {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB'
  },
  {
    name: 'ArcGIS Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  {
    name: 'HOT',
    url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
    attribution: '&copy; Humanitarian OpenStreetMap Team'
  },
  {
    name: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap contributors'
  },
  {
    name: 'Cycle Map',
    url: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap France'
  }
];


export default function MapComponent() {
  const [selectedLayer, setSelectedLayer] = useState(() => {
    return localStorage.getItem('selectedLayer') || layers[0].name;
  });

  useEffect(() => {
    localStorage.setItem('selectedLayer', selectedLayer);
  }, [selectedLayer]);

  return (
    <div className="app-layout">
    <MapContainer
      zoomControl={false}
      bounds={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <ZoomControl position="bottomright" />
      <LayersControl position="topright">
        {layers.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.name}
            name={layer.name}
            checked={layer.name === selectedLayer}
          >
            <TileLayer
              url={layer.url}
              attribution={layer.attribution}
              eventHandlers={{
                add: () => setSelectedLayer(layer.name)
              }}
            />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
    </MapContainer>
    </div>
  );
}
