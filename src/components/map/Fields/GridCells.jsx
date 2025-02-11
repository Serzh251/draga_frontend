import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import useGridCells from "../../../hook/useGridCells";
import { Button } from "antd";

const GridCells = () => {
  const map = useMap();
  const { cells, hasMore, loading, loadMore } = useGridCells();
  const [isGridVisible, setIsGridVisible] = useState(false); // Состояние для управления видимостью сетки

  useEffect(() => {
    // Загружаем данные только при активации сетки
    if (isGridVisible && !loading && cells.length === 0) {
      loadMore();
    }
  }, [isGridVisible, loading, cells, loadMore]);

  useEffect(() => {
    if (!map || !isGridVisible || !cells || cells.length === 0) return; // Отображаем данные только если сетка активирована

    try {
      const layerGroup = L.layerGroup().addTo(map);

      // Формирование объекта FeatureCollection для Leaflet
      const geoJsonData = {
        type: "FeatureCollection",
        features: cells.map((cell) => {
          if (cell?.properties?.cell?.coordinates) {
            return {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: cell.properties.cell.coordinates,
              },
              properties: {
                ...cell.properties,
                // Добавляем уникальный идентификатор для попапа
                cell_id: cell.id, // Используем ID ячейки (или другой уникальный идентификатор)
              },
            };
          }
          console.error("Ошибка: некорректная геометрия", cell);
          return null;
        }).filter(Boolean),
      };

      // Добавляем полигоны с обработчиком клика
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: {
          color: "#000",
          weight: 1,
          fillOpacity: 0,
        },
        onEachFeature: (feature, layer) => {
          // Проверяем, что у feature есть cell_id
          if (feature.properties.cell_id) {
            layer.on("click", () => {
              const popupContent = `
                <strong>ID ячейки:</strong> ${feature.properties.cell_id}<br>
              `;
              layer.bindPopup(popupContent).openPopup();
            });
          }
        },
      });

      // Добавляем слой на карту
      geoJsonLayer.addTo(layerGroup);

      // Очистка слоя, когда компонент размонтируется или когда слой скрывается
      return () => {
        map.removeLayer(geoJsonLayer);
      };
    } catch (error) {
      console.error("Ошибка при добавлении GeoJSON:", error);
    }
  }, [cells, map, isGridVisible]);

  return (
    <div>
      <div style={{ position: "absolute", bottom: 10, left: 10, background: "white", padding: "5px" }}>
        {loading && <span>Загрузка данных...</span>}
        {!hasMore && <span>Все данные загружены</span>}
      </div>

      <Button
        id="button-grid"
        onClick={() => setIsGridVisible((prev) => !prev)} // Переключение видимости сетки
        type="primary"
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 400,
          right: 10,
        }}
      >
        {isGridVisible ? "Скрыть сетку" : "Показать сетку"}
      </Button>
    </div>
  );
};

export default GridCells;
