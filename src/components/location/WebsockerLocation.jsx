import { useEffect } from 'react';
import configApi from '../../api/config-api';

const WebSocketComponent = ({ setLocation }) => {
  useEffect(() => {
    const ws = new WebSocket(configApi.WS_API_HOST);
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
