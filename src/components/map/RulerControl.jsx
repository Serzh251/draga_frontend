import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-ruler/src/leaflet-ruler.css";
import "leaflet-ruler";
import { useMap } from "react-leaflet";

const RulerControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (typeof L.control.ruler !== "function") {
      console.error("Метод L.control.ruler не найден. Проверьте зависимости.");
      return;
    }

    const rulerControl = L.control.ruler({
      position: "topright",
      lengthUnit: { display: "km", decimal: 3, factor: null, label: "Расстояние:" },
      angleUnit: {
        display: "&deg;",
        decimal: 2,
        factor: null,
        label: "Азимут:",
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