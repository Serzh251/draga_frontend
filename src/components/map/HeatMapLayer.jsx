import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useMapData } from '../../hook/useDataMap';

const HeatmapLayer = ({ isPrev = false }) => {
  const map = useMap();
  const { cleanPoints, cleanPointsPrev } = useMapData();
  const heatLayerRef = useRef(null); // Реф для хранения слоя

  const points = isPrev ? cleanPointsPrev : cleanPoints;

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heatData = points.features.map((feature) => {
      const { coordinates } = feature.geometry;
      const depth = feature.properties?.depth ?? 0;
      const normalizedDepth = Math.min(1, depth / 15);
      return {
        lat: coordinates[1],
        lng: coordinates[0],
        depth,
        weight: normalizedDepth,
      };
    });

    const heatLayer = L.heatLayer(
      heatData.map(({ lat, lng, weight }) => [lat, lng, weight]),
      {
        radius: 15,
        blur: 10,
        maxZoom: 10,
        minOpacity: 0.3,
        maxIntensity: 0.1,
        max: 1,
        gradient: {
          0.1: '#9ea4a6',
          0.2: '#0080ff',
          0.3: '#0059ff',
          0.4: '#2200ff',
          0.5: '#2200ff',
          0.6: '#1053b3',
          0.7: '#0015ff',
          1.0: '#0f0fb3',
        },
      }
    );

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer; // Сохраняем слой

    setTimeout(() => {
      const heatmapCanvases = document.querySelectorAll('.leaflet-heatmap-layer');
      if (heatmapCanvases.length) {
        const targetCanvas = heatmapCanvases[heatmapCanvases.length - 1];
        if (isPrev) {
          targetCanvas.style.opacity = '0.2';
        }
      }
    }, 500);

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      const clickThreshold = 0.0002;
      let closestPoint = null;
      let minDistance = Infinity;

      heatData.forEach((point) => {
        const dist = Math.hypot(point.lat - lat, point.lng - lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = point;
        }
      });

      if (closestPoint && minDistance <= clickThreshold) {
        L.popup()
          .setLatLng([closestPoint.lat, closestPoint.lng])
          .setContent(`<strong>Глубина:</strong> ${closestPoint.depth.toFixed(2)} м`)
          .openOn(map);
      }
    };

    map.on('click', handleClick);

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      map.off('click', handleClick);
    };
  }, [points, map, isPrev]);

  return null;
};

export default HeatmapLayer;
