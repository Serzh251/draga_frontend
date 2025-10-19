import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { LoadingOutlined } from '@ant-design/icons';
import { useFetchPointsQuery } from '@/api/api';

const HeatmapLayer = ({ map, selectedFields = new Set(), selectedYears = new Set() }) => {
  const heatLayerRef = useRef(null);
  const markersLayerRef = useRef(null); // добавляем слой для маркеров

  const fieldsArray = Array.from(selectedFields);
  const yearsArray = Array.from(selectedYears);

  const skip = fieldsArray.length === 0;

  const queryArgs = useMemo(
    () => ({
      field: fieldsArray,
      year: yearsArray,
    }),
    [fieldsArray, yearsArray]
  );

  const { data: pointsData, isFetching } = useFetchPointsQuery(queryArgs, {
    skip,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!map) return;

    // очистка старых слоев
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    if (skip || !pointsData?.features?.length) return;

    // --- Heatmap ---
    const heatData = pointsData.features.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const depth = feature.properties?.depth ?? 0;
      const normalizedDepth = Math.min(1, depth / 15);
      return [lat, lng, normalizedDepth];
    });

    const heatLayer = L.heatLayer(heatData, {
      radius: 15,
      blur: 10,
      maxZoom: 10,
      minOpacity: 0.3,
      gradient: {
        0.1: '#9ea4a6',
        0.2: '#51a5f8',
        0.3: '#0059ff',
        0.4: '#125dc8',
        0.5: '#3219e8',
        0.6: '#125dc8',
        0.7: '#1323d6',
        1.0: '#1717b1',
      },
    });
    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    // --- Circle markers with popups ---
    const markersLayer = L.layerGroup();
    pointsData.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const depth = feature.properties?.depth ?? '—';
      const marker = L.circleMarker([lat, lng], {
        radius: 5,
        color: 'blue',
        weight: 1,
        fillColor: 'blue',
        fillOpacity: 0.7,
      }).bindPopup(`<b>Глубина:</b> ${depth} м`);
      markersLayer.addLayer(marker);
    });
    markersLayer.addTo(map);
    markersLayerRef.current = markersLayer;

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      if (markersLayerRef.current) {
        map.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
      }
    };
  }, [map, pointsData, skip]);

  if (isFetching) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '7px 10px',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}
      >
        <LoadingOutlined style={{ fontSize: 18, marginRight: 8 }} />
        Загрузка тепловой карты...
      </div>
    );
  }

  return null;
};

export default HeatmapLayer;
