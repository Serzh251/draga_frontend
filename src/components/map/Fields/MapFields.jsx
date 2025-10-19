import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useFetchFieldsQuery } from '@/api/api';
import { useAuth } from '@/hook/use-auth';
import { useDispatch } from 'react-redux';
import { setFieldsData } from '@/store/slices/mapDataSlice';

const MapFields = ({ map }) => {
  const layersRef = useRef(new Map());
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const [features, setFeatures] = useState([]);

  const { data } = useFetchFieldsQuery(undefined, { skip: !isAuth });

  useEffect(() => {
    if (data?.features) {
      setFeatures(data.features);
      dispatch(setFieldsData(data));
    }
  }, [data, dispatch]);

  // Добавление слоев на карту
  useEffect(() => {
    if (!map || !features) return;

    let mounted = true;

    const addLayers = () => {
      if (!mounted || !map.getContainer()) return;

      // Удаляем старые слои
      layersRef.current.forEach(({ polygon, border, label }) => {
        if (polygon && map.hasLayer(polygon)) map.removeLayer(polygon);
        if (border && map.hasLayer(border)) map.removeLayer(border);
        if (label && map.hasLayer(label)) map.removeLayer(label);
      });
      layersRef.current.clear();

      // Добавляем новые слои
      features.forEach((feature) => {
        if (feature.geometry.type !== 'Polygon') return;

        const coordinates = feature.geometry.coordinates[0];
        const midIndex = Math.floor(coordinates.length / 2);
        const midPoint = coordinates[midIndex];

        try {
          const polygon = L.geoJSON(feature.geometry, {
            style: { color: '#25282b', weight: 2, fillOpacity: 0 },
          }).addTo(map);

          polygon.eachLayer((layer) => layer.on('click', (e) => e.originalEvent.stopPropagation()));

          const border = L.geoJSON(feature.geometry, {
            style: { color: 'blue', weight: 3, fillOpacity: 0 },
          }).addTo(map);

          let label = null;
          if (midPoint) {
            label = L.marker([midPoint[1], midPoint[0]], {
              icon: L.divIcon({
                className: 'polygon-label',
                html: `<div style="background: white; padding: 2px 5px; border-radius: 5px; font-size: 12px; font-weight: bold; border: 1px solid #ccc;">
                         ${feature.properties.name || ''}
                       </div>`,
                iconSize: [100, 20],
              }),
              interactive: false,
            }).addTo(map);
          }

          layersRef.current.set(feature.id, { polygon, border, label });
        } catch (err) {
          console.warn('Ошибка добавления слоя Leaflet', err);
        }
      });
    };

    map.whenReady(() => requestAnimationFrame(addLayers));

    return () => {
      mounted = false;
      layersRef.current.forEach(({ polygon, border, label }) => {
        if (polygon && map.hasLayer(polygon)) map.removeLayer(polygon);
        if (border && map.hasLayer(border)) map.removeLayer(border);
        if (label && map.hasLayer(label)) map.removeLayer(label);
      });
      layersRef.current.clear();
    };
  }, [map, features]);

  return null;
};

export default MapFields;
