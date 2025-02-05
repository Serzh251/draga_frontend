import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const heatData = data.map((feature) => [
      feature.geometry.coordinates[1], // Lat
      feature.geometry.coordinates[0], // Lng
      feature.properties.depth / 15, // Интенсивность (0-1)
    ]);

    const heatLayer = L.heatLayer(heatData, {
      radius: 15,
      blur: 10,
      maxZoom: 10,
      gradient: {
        0.1: "blue",
        0.3: "cyan",
        0.5: "lime",
        0.7: "yellow",
        1.0: "red",
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
