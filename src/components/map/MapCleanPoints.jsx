import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useMap } from "react-leaflet";
import L from "leaflet";
import useCleanPoints from "../../hook/useCleanPoints";

const MapCleanPoints = (selectedFields) => {
  const map = useMap();
  const { geojsonData, loading, error } = useCleanPoints(selectedFields);
  const [opacity, setOpacity] = useState(1); // Прозрачность точек

  const toggleVisibility = () => {
    setOpacity((prev) => (prev === 1 ? 0 : 1)); // Переключаем прозрачность
  };

  useEffect(() => {
    if (!geojsonData) return;

    function getFillColor(depth) {
      if (depth <= 0 || depth > 15) {
        return "#aba9a9";  // Серый цвет для глубины <= 0 или > 15
      }

      const maxDepth = 15;  // Максимальная глубина
      const normalized = Math.min(1, depth / maxDepth);  // Нормализуем глубину от 0 до 1 (0 -> светлый, 1 -> тёмный)

      const green = Math.floor(255 * (1 - normalized));  // Чем больше глубина, тем темнее зелёный
      const blue = Math.floor(100 * (1 - normalized));  // Немного синего для темных оттенков

      return `rgb(0, ${green}, ${blue})`;  // Только зелёные оттенки
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
          opacity: opacity, // Контролируем прозрачность
          fillOpacity: opacity * 0.8,
        });

        circleMarker.bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);

        return circleMarker;
      },
    });

    geoJsonLayer.addTo(map);

    return () => map.removeLayer(geoJsonLayer);
  }, [geojsonData, map, opacity]); // opacity влияет ТОЛЬКО на прозрачность, не мешая загрузке данных

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  return (
    <>
      <Button
        onClick={toggleVisibility}
        type="primary"
        style={{
          position: "absolute",
          top: "350px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        {opacity === 1 ? "Скрыть clean точки" : "Показать clean точки"}
      </Button>
    </>
  );
};

export default MapCleanPoints;
