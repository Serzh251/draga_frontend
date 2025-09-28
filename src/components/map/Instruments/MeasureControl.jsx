// src/components/Map/Instruments/MeasureControl.jsx
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure/dist/leaflet-measure.ru';

const MeasureControl = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const measureControl = new L.Control.Measure({
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares',
      activeColor: '#ff0000',
      completedColor: '#00ff00',
      position: 'topright',
    });

    measureControl.addTo(map);
    const originalSetView = map.setView;

    map.setView = function (center, zoom, options) {
      return originalSetView.call(map, map.getCenter(), zoom, options);
    };

    return () => {
      if (measureControl && map.hasLayer(measureControl)) {
        map.removeControl(measureControl);
      }
      map.setView = originalSetView;
    };
  }, [map]);

  return null;
};

export default MeasureControl;
