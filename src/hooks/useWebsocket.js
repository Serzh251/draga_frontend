// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (url, onMessage) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isManuallyClosedRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (isManuallyClosedRef.current) return;

    // Просто подключаемся — куки отправятся автоматически
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event);
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!isManuallyClosedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 10000);
      }
    };

    ws.onerror = () => ws.close();
  }, [url, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      isManuallyClosedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  return { sendMessage };
};
