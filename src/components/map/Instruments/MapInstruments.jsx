// src/components/Map/Instruments/MapInstruments.jsx
import { useEffect } from 'react';
import L from 'leaflet';

import LayersControlComponent from './LayersControlComponent';
import MeasureControl from './MeasureControl';
import DrawTools from './DrawTools';

const MapInstruments = ({ map, isAuth }) => {
  useEffect(() => {
    if (!map) return;

    let zoomControl;
    let scaleControl;

    try {
      zoomControl = L.control.zoom({ position: 'bottomright' }).addTo(map);
      scaleControl = L.control
        .scale({
          position: 'bottomleft',
          metric: true,
          imperial: false,
        })
        .addTo(map);
    } catch (err) {
      console.error('Ошибка при добавлении контрола:', err);
    }

    return () => {
      if (zoomControl) map.removeControl(zoomControl);
      if (scaleControl) map.removeControl(scaleControl);
    };
  }, [map]);

  return (
    <>
      <LayersControlComponent map={map} />
      <MeasureControl map={map} />
      <DrawTools map={map} isAuth={isAuth} />
    </>
  );
};

export default MapInstruments;
