import React, { useEffect, useState } from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';
import config from '../../../config';

const LayersControlComponent = () => {
  const [selectedLayer, setSelectedLayer] = useState(() => {
    return localStorage.getItem('selectedLayer') || config.layers[0].name;
  });

  useEffect(() => {
    localStorage.setItem('selectedLayer', selectedLayer);
  }, [selectedLayer]);

  return (
    <LayersControl position="topright">
      {config.layers.map((layer) => (
        <LayersControl.BaseLayer key={layer.name} name={layer.name} checked={layer.name === selectedLayer}>
          <TileLayer
            url={layer.url}
            attribution={layer.attribution}
            eventHandlers={{
              add: () => setSelectedLayer(layer.name),
            }}
          />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
};

export default LayersControlComponent;
