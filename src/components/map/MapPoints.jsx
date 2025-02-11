import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useMap } from "react-leaflet";
import L from "leaflet";
import useGeoData from "../../hook/useGeodataPoints";

const MapPoints = (selectedFields) => {
  const map = useMap();
  const { geojsonData, loading, error } = useGeoData(selectedFields);
  const [opacity, setOpacity] = useState(1); // Используем прозрачность вместо удаления слоя

  const toggleVisibility = () => {
    setOpacity((prev) => (prev === 1 ? 0 : 1)); // Переключаем прозрачность
  };

  useEffect(() => {
    if (!geojsonData) return;

    function getFillColor(depth) {
      if (depth > 15) return "#aba9a9";
      if (depth <= 0) return "rgb(255,197,170)";
      const normalized = Math.min(1, depth / 15);
      const red = 255;
      const green = Math.floor(128 + (127 * (1 - normalized)));
      const blue = Math.floor(128 + (127 * (1 - normalized)));
      return `rgb(${red}, ${green}, ${blue})`;
    }

    const geoJsonLayer = L.geoJSON(geojsonData, {
      pointToLayer: (feature, latlng) => {
        const depth = feature.properties?.depth ?? 0;
        const circleMarker = L.circleMarker(latlng, {
          radius: 8,
          stroke: false,
          fillColor: getFillColor(depth),
          color: "#000",
          weight: 1,
          opacity: opacity, // Управляем прозрачностью
          fillOpacity: opacity * 0.8, // fillOpacity тоже меняем
        });

        circleMarker.bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);

        return circleMarker;
      },
    });

    geoJsonLayer.addTo(map);

    return () => map.removeLayer(geoJsonLayer);
  }, [geojsonData, map, opacity]); // Изменение opacity не влияет на загрузку данных!

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  return (
    <>
      <Button
        onClick={toggleVisibility}
        type="primary"
        style={{
          position: "absolute",
          top: "300px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        {opacity === 1 ? "Скрыть точки" : "Показать точки"}
      </Button>
    </>
  );
};

export default MapPoints;
