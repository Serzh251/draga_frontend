import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import useGeoData from "../../hook/useGeodataPoints";

const MapPoints = (selectedFields) => {
  const map = useMap();
  const { geojsonData, loading, error } = useGeoData(selectedFields);

  useEffect(() => {
    if (!geojsonData) return;

    function getFillColor(depth) {
      if (depth > 15) {
        return "#aba9a9";
      }
      if (depth <= 0) {
        return "rgb(255,197,170)";
      }
      const normalized = Math.min(1, depth / 15);
      const red = 255;
      const green = Math.floor(128 + (127 * (1 - normalized))); // Зеленый уменьшается от 128 до 1
      const blue = Math.floor(128 + (127 * (1 - normalized))); // Синий уменьшается от 128 до 1
      return `rgb(${red}, ${green}, ${blue})`;
    }

    const geoJsonLayer = L.geoJSON(geojsonData, {
      pointToLayer: (feature, latlng) => {
        const depth = feature.properties.depth ?? 0;
        const circleMarker = L.circleMarker(latlng, {
          radius: 8,
          stroke: false,
          fillColor: getFillColor(depth),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });

        circleMarker.bindPopup(
          `<strong>Глубина:</strong> ${depth.toFixed(2)} м`
        );

        return circleMarker;
      },
    });

    geoJsonLayer.addTo(map);

    return () => map.removeLayer(geoJsonLayer);
  }, [geojsonData, map]);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  return null;
};

export default MapPoints;