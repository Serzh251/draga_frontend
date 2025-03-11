import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DrawTools = () => {
  const map = useMap();

  useEffect(() => {
    if (map.drawControl) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
      },
    });

    map.addControl(drawControl);
    map.drawControl = drawControl;

    const updateMeasurements = (layer) => {
      let tooltipContent = '';

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        tooltipContent = `Площадь: ${area.toFixed(2)} м²`;
      } else if (layer instanceof L.Polyline) {
        const latLngs = layer.getLatLngs();
        const length = latLngs.reduce((sum, latLng, index, array) => {
          if (index === 0) return sum;
          const prevLatLng = array[index - 1];
          return sum + map.distance(prevLatLng, latLng);
        }, 0);
        tooltipContent = `Длина: ${length.toFixed(2)} м`;
      } else if (layer instanceof L.Circle) {
        const radius = layer.getRadius();
        if (!isNaN(radius)) {
          const circleArea = Math.PI * radius * radius;
          tooltipContent = `Радиус: ${radius.toFixed(2)} м, Площадь: ${circleArea.toFixed(2)} м²`;
        } else {
          console.error('Invalid radius value:', radius);
          tooltipContent = 'Ошибка в расчете радиуса.';
        }
      }

      if (tooltipContent) {
        layer
          .bindTooltip(tooltipContent, {
            permanent: true,
            direction: 'center',
            className: 'leaflet-tooltip-area',
          })
          .openTooltip();
      }
    };

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      updateMeasurements(layer);
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        updateMeasurements(layer);
      });
    });
  }, [map]);

  return null;
};

export default DrawTools;
