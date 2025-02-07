import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapFields = ({ listGeojsonFields }) => {
  const map = useMap();
  const [layers, setLayers] = useState(new Map());

  useEffect(() => {
    if (!listGeojsonFields || !Array.isArray(listGeojsonFields.features)) {
      console.warn("Некорректные данные GeoJSON: отсутствует массив features");
      return;
    }

    layers.forEach(({ polygon, border, label }) => {
      map.removeLayer(polygon);
      map.removeLayer(border);
      map.removeLayer(label);
    });
    const newLayers = new Map();

    listGeojsonFields.features.forEach((feature) => {
      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0];
        const polygon = L.geoJSON(feature.geometry, {
          style: {
            color: "#25282b",
            weight: 2,
            fillOpacity: 0,
          },
        }).addTo(map);

        polygon.eachLayer((layer) => {
          layer.on("click", (e) => {
            e.originalEvent.stopPropagation(); // Блокируем всплытие события клика
          });
        });

        const border = L.geoJSON(feature.geometry, {
          style: {
            color: "blue", // Цвет границы
            weight: 3,
            fillOpacity: 0,
          },
        }).addTo(map);

        const midIndex = Math.floor(coordinates.length / 2);
        const midPoint = coordinates[midIndex];

        if (midPoint) {
          const label = L.marker([midPoint[1], midPoint[0]], {
            icon: L.divIcon({
              className: "polygon-label",
              html: `<div style="background: white; padding: 2px 5px; border-radius: 5px; font-size: 12px; font-weight: bold; border: 1px solid #ccc;">
                        ${feature.properties.name}
                     </div>`,
              iconSize: [100, 20],
            }),
            interactive: false,
          }).addTo(map);

          newLayers.set(feature.id, { polygon, border, label });
        } else {
          newLayers.set(feature.id, { polygon, border });
        }
      }
    });
    setLayers(newLayers);

    return () => {
      newLayers.forEach(({ polygon, border, label }) => {
        map.removeLayer(polygon);
        map.removeLayer(border);
        if (label) map.removeLayer(label);
      });
    };
  }, [listGeojsonFields, map]);

  return null;
};

export default MapFields;
