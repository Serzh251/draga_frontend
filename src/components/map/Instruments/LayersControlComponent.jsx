// src/components/Map/Instruments/LayersControlComponent.jsx
import { useEffect } from 'react';
import L from 'leaflet';
import config from '../../../config';

const LayersControlComponent = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const layers = {};

    config.layers.forEach((layerConfig) => {
      const layer = L.tileLayer(layerConfig.url, {
        attribution: layerConfig.attribution,
      });
      layers[layerConfig.name] = layer;
    });

    const savedLayerName = localStorage.getItem('selectedLayer');
    const defaultLayerName = config.layers[0].name;
    const initialLayerName = savedLayerName || defaultLayerName;

    if (layers[initialLayerName]) {
      layers[initialLayerName].addTo(map);
    }

    const layerControl = L.control
      .layers(layers, null, {
        position: 'topright',
      })
      .addTo(map);

    map.on('baselayerchange', (event) => {
      const newLayerName = Object.keys(layers).find((name) => layers[name] === event.layer);
      if (newLayerName) {
        localStorage.setItem('selectedLayer', newLayerName);
      }
    });

    return () => {
      map.off('baselayerchange');
      layerControl.remove();
      // Удаляем все базовые слои
      Object.values(layers).forEach((layer) => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map]);

  return null;
};

export default LayersControlComponent;
