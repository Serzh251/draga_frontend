import React, { useState, useEffect } from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const LocationMarker = ({ location }) => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    if (location.lat && location.lng) {
      setTrail((prevTrail) => [...prevTrail.slice(-10), [location.lat, location.lng]]);
    }
  }, [location]);

  const icon = new L.DivIcon({
    html: `
      <div class="custom-icon-wrapper">
        <div class="pulse-ring"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <circle cx="12.5" cy="12.5" r="8" fill="red" stroke="black" strokeWidth="2"/>
        </svg>
      </div>
    `,
    className: "custom-icon",
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  return (
    <>
      {/* Длинный и заметный шлейф */}
      {trail.length > 1 && <Polyline positions={trail} color="red" weight={50} opacity={0.8} dashArray="1, 1" />}

      {/* Маркер с анимацией */}
      <Marker position={[location.lat, location.lng]} icon={icon}>
        <Popup>
          <strong>Текущая позиция</strong>
          <br />
          Широта: {location.lat}, Долгота: {location.lng}
          {location.course && <p>Курс: {location.course}°</p>}
        </Popup>
      </Marker>
    </>
  );
};

export default LocationMarker;
