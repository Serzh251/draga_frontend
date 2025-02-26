import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const LocationMarker = ({ location }) => {
  const icon = new L.Icon({
    iconUrl: require("../../static/icons/icon-location.png"), // Замените на путь к вашей иконке
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      <Popup>Current Location</Popup>
    </Marker>
  );
};

export default LocationMarker;
