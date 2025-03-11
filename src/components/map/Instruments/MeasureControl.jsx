import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';
import L from 'leaflet';

const MeasureControl = () => {
  const map = useMap();

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

    map.addControl(measureControl);

    const originalSetView = map.setView;
    map.setView = function (center, zoom, options) {
      return originalSetView.call(map, map.getCenter(), zoom, options);
    };

    return () => {
      map.removeControl(measureControl);
      map.setView = originalSetView;
    };
  }, [map]);

  return null;
};

export default MeasureControl;
