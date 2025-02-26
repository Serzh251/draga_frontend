import React, { useEffect } from "react";

const WebSocketComponent = ({ setLocation }) => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2025/ws/last-location/");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data).message;
      setLocation({ lat: message.lat, lng: message.long });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [setLocation]);

  return null;
};

export default WebSocketComponent;
