import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-ruler/src/leaflet-ruler.css';
import 'leaflet-ruler';
import { useMap } from 'react-leaflet';

const RulerControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (typeof L.control.ruler !== 'function') {
      console.error('Метод L.control.ruler не найден. Проверьте зависимости.');
      return;
    }

    const rulerControl = L.control.ruler({
      position: 'topright',
      lengthUnit: {
        display: 'm', // Показ в метрах
        decimal: 2, // Два знака после запятой
        factor: 1000, // Принудительно переводим км → м
        label: 'Расстояние:',
      },
      angleUnit: {
        display: '&deg;',
        decimal: 2,
        factor: null,
        label: 'Азимут:',
      },
      styles: {
        rulerLabel: 'font-size: 36px; font-weight: bold;', // Увеличение шрифта
      },
    });

    map.addControl(rulerControl);

    return () => {
      map.removeControl(rulerControl);
    };
  }, [map]);

  return null;
};

export default RulerControl;
