import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import useCleanPoints from "../../hook/useCleanPoints";
import { LoadingOutlined } from "@ant-design/icons";

const MapCleanPoints = ({ selectedFields, onDataLoaded }) => {
  const map = useMap();
  const { geojsonData, loading, error } = useCleanPoints(selectedFields);

  useEffect(() => {
    if (geojsonData) {
      onDataLoaded(geojsonData);
    }
  }, [geojsonData, onDataLoaded]);

  useEffect(() => {
    if (!geojsonData || !map) return;

    function getFillColor(depth) {
      if (depth <= 0 || depth > 15) {
        return "#aba9a9";
      }

      const maxDepth = 15;
      const normalized = Math.min(1, depth / maxDepth);
      const green = Math.floor(255 * (1 - normalized));
      const blue = Math.floor(100 * (1 - normalized));

      return `rgb(0, ${green}, ${blue})`;
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
          opacity: 1,
          fillOpacity: 0.8,
        });

        circleMarker.bindPopup(`<strong>Глубина:</strong> ${depth.toFixed(2)} м`);
        return circleMarker;
      },
    });

    geoJsonLayer.addTo(map);

    return () => map.removeLayer(geoJsonLayer);
  }, [geojsonData, map]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "7px 10px",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <LoadingOutlined style={{ fontSize: 18, marginRight: 8 }} />
        Загрузка очищенных данных...
      </div>
    );
  }

  return null;
};

export default MapCleanPoints;
