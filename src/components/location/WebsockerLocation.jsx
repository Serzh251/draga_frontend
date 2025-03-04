import { useEffect } from 'react';

const WebSocketComponent = ({ setLocation }) => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:2025/ws/last-location/');

    ws.onopen = () => {};
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data).message;
      setLocation({
        lat: message.lat,
        lng: message.lng,
        course: message.course,
      });
    };

    ws.onclose = () => {};
    ws.onerror = () => {};
    return () => {
      ws.close();
    };
  }, [setLocation]);

  return null;
};

export default WebSocketComponent;
