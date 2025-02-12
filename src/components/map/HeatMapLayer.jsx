import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const heatData = data.map((feature) => {
      const { coordinates } = feature.geometry;
      const depth = feature.properties?.depth ?? 0;
      // Нормализация глубины (0 м -> 0, 20 м -> 1)
      const normalizedDepth = Math.min(1, depth / 20);
      return [coordinates[1], coordinates[0], normalizedDepth]; // lat, lng, weight
    });
    const heatLayer = L.heatLayer(heatData, {
      radius: 20,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.1: "#ADD8E6", // Светло-голубой (мелкие)
        0.3: "#0000FF", // Синий (средняя глубина)
        0.6: "#00008B", // Темно-синий (глубокие)
        1.0: "#00004B", // Почти черный (очень глубокие)
      },
    });
    heatLayer.addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);
  return null;
};

export default HeatmapLayer;
