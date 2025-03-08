import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useMapData } from '../../hook/useDataMap';

const HeatmapLayer = () => {
  const map = useMap();
  const { cleanPoints } = useMapData();

  useEffect(() => {
    if (!cleanPoints || cleanPoints.length === 0) return;

    const heatData = cleanPoints.features.map((feature) => {
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

    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <style>
          .legend {
            background: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 12px;
            font-weight: bold;
            line-height: 14px;
          }
          .legend-scale {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .legend-bar {
            width: 20px;
            height: 80px;
            background: linear-gradient(to top,#0f0fb3, #0015ff, #1053b3, #2200ff, #2200ff, #0059ff, #0080ff, #9ea4a6);
          }
          .depth {
            font-size: 11px;
          }
        </style>
        <div class="legend-scale">
          <div class="legend-bar"></div>
          <div class="depth">Глубина</div>
          <div>20+</div>
          <div>10</div>
          <div>5</div>
          <div>0</div>
        </div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeLayer(heatLayer);
      map.off('click', handleClick);
      legend.remove();
    };
  }, [cleanPoints, map]);

  return null;
};

export default HeatmapLayer;
