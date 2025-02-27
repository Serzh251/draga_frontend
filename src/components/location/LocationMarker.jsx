import React, { useState, useEffect, useRef } from "react";
import { Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

const LocationMarker = ({ location }) => {
  const [trail, setTrail] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    if (location.lat && location.lng) {
      lastUpdateTime.current = Date.now();
      setIsActive(true);
      setTrail((prevTrail) => [...prevTrail.slice(-50), [location.lat, location.lng]]);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastUpdateTime.current > 60000) {
        setIsActive(false);
      }
    }, 10000); // Проверяем каждые 10 секунд

    return () => clearInterval(interval);
  }, []);

  const icon = new L.DivIcon({
    html: `
      <div class="custom-icon-wrapper ${isActive ? "" : "inactive"}">
        <div class="pulse-ring ${isActive ? "" : "hidden"}"></div>
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
      {/* Шлейф пути */}
      {trail.length > 5 && <Polyline positions={trail} color="red" weight={5} opacity={0.8} dashArray="5, 5" />}

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
