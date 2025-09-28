import { useEffect } from 'react';
import L from 'leaflet';

import LayersControlComponent from './LayersControlComponent';
import MeasureControl from './MeasureControl';
import DrawTools from './DrawTools'; // ✅ Подключаем

const MapInstruments = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    let zoomControl;
    let scaleControl;

    try {
      zoomControl = L.control.zoom({ position: 'bottomright' }).addTo(map);
      scaleControl = L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);
    } catch (err) {
      console.error('Ошибка при добавлении контрола:', err);
    }

    return () => {
      if (zoomControl && map.hasLayer(zoomControl)) {
        map.removeControl(zoomControl);
      }
      if (scaleControl && map.hasLayer(scaleControl)) {
        map.removeControl(scaleControl);
      }
    };
  }, [map]);

  return (
    <>
      <LayersControlComponent map={map} />
      <MeasureControl map={map} />
      <DrawTools map={map} /> {/* ✅ Передаём map */}
    </>
  );
};

export default MapInstruments;
