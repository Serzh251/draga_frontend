import React, { useEffect, useState } from "react";
import { LayersControl, MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-ruler/src/leaflet-ruler.css";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-ruler";
import '../../static/css/MapMain.css';

const position = [

  [65, 40],
  [62, 45],
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

function DrawTools() {
  const map = useMap();

  useEffect(() => {
    if (map.drawControl) return; // Предотвращение дублирования

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      edit: {
        featureGroup: drawnItems
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: false
      }
    });
    map.addControl(drawControl);
    map.drawControl = drawControl;

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
    });
  }, [map]);

  return null;
}

function RulerControl() {
  const map = useMap();

  useEffect(() => {
    const rulerControl = L.control.ruler({
      position: 'topright',
      lengthUnit: { display: "km", decimal: 3, factor: null, label: 'Расстояние:' },
      angleUnit: {
        display: '&deg;',
        decimal: 2,
        factor: null,
        label: 'Азимут' +
          ':'
      }
    });

    map.addControl(rulerControl);

    return () => {

      map.removeControl(rulerControl);
    };
  }, [map]);

  return null;
}



export default function MapComponent() {
  const [selectedLayer, setSelectedLayer] = useState(() => {
    return localStorage.getItem('selectedLayer') || layers[0].name;
  });

  useEffect(() => {
    localStorage.setItem('selectedLayer', selectedLayer);
  }, [selectedLayer]);

  return (
    <div className="app-layout">
    <MapContainer bounds={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
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
      <DrawTools />
      <RulerControl />
    </MapContainer>
    </div>

  );
}
