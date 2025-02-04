import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const DrawTools = () => {
  const map = useMap();

  useEffect(() => {
    if (map.drawControl) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topleft",
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: false,
      },
    });

    map.addControl(drawControl);
    map.drawControl = drawControl;

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
    });
  }, [map]);

  return null;
}
export default DrawTools;