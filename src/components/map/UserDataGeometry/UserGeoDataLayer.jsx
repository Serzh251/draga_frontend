// UserGeoDataLayer.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import PopupContent from './PopupComponent';

const UserGeoDataLayer = ({ map, userGeoData }) => {
  const layersRef = useRef(new Map());
  const popupRoots = useRef(new Map()); // храним React root'ы

  useEffect(() => {
    if (!map || !Array.isArray(userGeoData)) return;

    // Очистка старых слоёв
    layersRef.current.forEach((layer) => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    layersRef.current.clear();
    popupRoots.current.clear();

    const makePopupNode = (id, properties) => {
      let rootEntry = popupRoots.current.get(id);

      if (!rootEntry) {
        const node = document.createElement('div');
        const root = createRoot(node);
        popupRoots.current.set(id, { node, root });
        rootEntry = { node, root };
      }

      const render = () => {
        rootEntry.root.render(
          <PopupContent name={properties?.name || 'Без названия'} description={properties?.description || ''} />
        );
      };

      return { node: rootEntry.node, render };
    };

    userGeoData.forEach((feature) => {
      const { geometry, properties } = feature;
      if (!geometry) return;

      const color = properties?.color || '#3388ff';
      let layer = null;

      if (geometry.type === 'Point') {
        const { node, render } = makePopupNode(feature.id, properties);
        // Указываем панель 'fieldsPane' для маркера
        layer = L.marker([geometry.coordinates[1], geometry.coordinates[0]], { pane: 'fieldsPane' }).bindPopup(node);
        layer.on('popupopen', render);
      } else if (geometry.type === 'LineString') {
        const { node, render } = makePopupNode(feature.id, properties);
        const latlngs = geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        // Указываем панель 'fieldsPane' для линии
        layer = L.polyline(latlngs, { color, weight: 4, pane: 'fieldsPane' }).bindPopup(node);
        layer.on('popupopen', render);
      } else if (geometry.type === 'Polygon') {
        const { node, render } = makePopupNode(feature.id, properties);
        const rings = geometry.coordinates.map((ring) => ring.map(([lon, lat]) => [lat, lon]));
        // Указываем панель 'fieldsPane' для полигона
        layer = L.polygon(rings, { color, weight: 4, fillOpacity: 0.1, pane: 'fieldsPane' }).bindPopup(node);
        layer.on('popupopen', render);
      } else if (geometry.type === 'GeometryCollection') {
        geometry.geometries.forEach((geo, index) => {
          const { node, render } = makePopupNode(`${feature.id}-geo-${index}`, properties);
          let subLayer = null;

          if (geo.type === 'Point') {
            // Указываем панель 'fieldsPane' для подмаркера
            subLayer = L.marker([geo.coordinates[1], geo.coordinates[0]], { pane: 'fieldsPane' }).bindPopup(node);
          } else if (geo.type === 'LineString') {
            const coords = geo.coordinates.map(([lon, lat]) => [lat, lon]);
            // Указываем панель 'fieldsPane' для подлинии
            subLayer = L.polyline(coords, { color, weight: 4, pane: 'fieldsPane' }).bindPopup(node);
          } else if (geo.type === 'Polygon') {
            const rings = geo.coordinates.map((ring) => ring.map(([lon, lat]) => [lat, lon]));
            // Указываем панель 'fieldsPane' для подполигона
            subLayer = L.polygon(rings, { color, weight: 4, fillOpacity: 0.1, pane: 'fieldsPane' }).bindPopup(node);
          }

          if (subLayer) {
            subLayer.on('popupopen', render);
            subLayer.addTo(map);
            layersRef.current.set(`${feature.id}-geo-${index}`, subLayer);
          }
        });
        return;
      }

      if (layer) {
        layer.addTo(map);
        layersRef.current.set(feature.id, layer);
      }
    });

    return () => {
      layersRef.current.forEach((layer) => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      });
      layersRef.current.clear();
      popupRoots.current.clear();
    };
  }, [map, userGeoData]);

  return null;
};

export default UserGeoDataLayer;
