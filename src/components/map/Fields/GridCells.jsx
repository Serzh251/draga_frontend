import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import useGridCells from '../../../hook/useGridCells';
import { LoadingOutlined } from '@ant-design/icons';

const GridCells = () => {
  const map = useMap();
  const { cells, loading, loadMore } = useGridCells();

  useEffect(() => {
    if (!loading && cells.length === 0) {
      loadMore();
    }
  }, [loading, cells, loadMore]);

  useEffect(() => {
    if (!map || !cells || cells.length === 0) return;

    try {
      const layerGroup = L.layerGroup().addTo(map);
      const geoJsonData = {
        type: 'FeatureCollection',
        features: cells
          .map((cell) => {
            if (cell?.properties?.cell?.coordinates) {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: cell.properties.cell.coordinates,
                },
                properties: {
                  ...cell.properties,
                  cell_id: cell.id, // Уникальный идентификатор
                },
              };
            }
            console.error('Ошибка: некорректная геометрия', cell);
            return null;
          })
          .filter(Boolean),
      };

      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: '#000',
          weight: 1,
          fillOpacity: 0,
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties.cell_id) {
            layer.on('click', () => {
              const popupContent = `
                <strong>ID ячейки:</strong> ${feature.properties.cell_id}<br>
              `;
              layer.bindPopup(popupContent).openPopup();
            });
          }
        },
      });

      geoJsonLayer.addTo(layerGroup);
      return () => {
        map.removeLayer(geoJsonLayer);
      };
    } catch (error) {
      console.error('Ошибка при добавлении GeoJSON:', error);
    }
  }, [cells, map]);

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
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
        <LoadingOutlined />
        Загрузка данных для сетки...
      </div>
    );
  }

  return null;
};

export default GridCells;
