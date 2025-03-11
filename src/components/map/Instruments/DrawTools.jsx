import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-draw'; // Подключаем инструменты рисования
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

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
        // Рассчитываем площадь полигона
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        tooltipContent = `Площадь: ${area.toFixed(2)} м²`;
      } else if (layer instanceof L.Polyline) {
        // Рассчитываем длину линии
        const latLngs = layer.getLatLngs();
        const length = latLngs.reduce((sum, latLng, index, array) => {
          if (index === 0) return sum;
          const prevLatLng = array[index - 1];
          return sum + map.distance(prevLatLng, latLng); // Рассчитываем расстояние
        }, 0);
        tooltipContent = `Длина: ${length.toFixed(2)} м`;
      } else if (layer instanceof L.Circle) {
        // Рассчитываем радиус и площадь круга
        const radius = layer.getRadius();
        if (!isNaN(radius)) {
          const circleArea = Math.PI * radius * radius; // Площадь круга: π * r^2
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

    // Событие создания нового объекта
    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      updateMeasurements(layer);
    });

    // Событие редактирования объектов
    map.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        updateMeasurements(layer);
      });
    });
  }, [map]);

  return null;
};

export default DrawTools;
