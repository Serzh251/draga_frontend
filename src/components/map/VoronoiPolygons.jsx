import { Polygon, Popup } from "react-leaflet";
import * as turf from "@turf/turf";

const getColor = (depth) => {
  if (depth <= 3) return "blue";
  if (depth <= 6) return "cyan";
  if (depth <= 9) return "lime";
  if (depth <= 12) return "yellow";
  return "red";
};
const raw = [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48606,
          64.55983666666665
        ]
      },
      "properties": {
        "depth": 10.8,
        "point_datetime": "2024-09-19T10:54:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.486055,
          64.55983166666667
        ]
      },
      "properties": {
        "depth": 10.2,
        "point_datetime": "2024-09-19T10:53:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48605833333333,
          64.55983666666665
        ]
      },
      "properties": {
        "depth": 10.2,
        "point_datetime": "2024-09-19T10:52:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48598666666667,
          64.55971666666666
        ]
      },
      "properties": {
        "depth": 10.2,
        "point_datetime": "2024-09-19T10:07:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48587333333333,
          64.55970833333335
        ]
      },
      "properties": {
        "depth": 10.2,
        "point_datetime": "2024-09-19T09:51:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48491666666666,
          64.55989166666667
        ]
      },
      "properties": {
        "depth": 10.2,
        "point_datetime": "2024-09-17T18:04:00+03:00",
        "is_working": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          40.48365666666667,
          64.56014333333333
        ]
      },
      "properties": {
        "depth": 10.8,
        "point_datetime": "2024-09-14T19:45:00+03:00",
        "is_working": true
      }
    },
]
const filterMaxDepthPoints = (data, gridSize = 10) => {
  if (!data || data.length === 0) {
    console.warn("❌ Нет входных данных!");
    return [];
  }

  // Преобразуем точки в GeoJSON
  const points = turf.featureCollection(
    data
      .filter((feature) => feature.geometry && feature.geometry.coordinates)
      .map((feature) =>
        turf.point(
          feature.geometry.coordinates, // (долгота, широта) БЕЗ инверсии!
          feature.properties
        )
      )
  );

  if (points.features.length === 0) {
    console.warn("❌ Нет валидных точек!");
    return [];
  }

  console.log("✅ Исходные точки:", points.features.length);

  // Определяем границы данных
  const bbox = turf.bbox(points);
  console.log("📌 BBOX:", bbox);

  // Создаем сетку квадратов
  const grid = turf.squareGrid(bbox, gridSize, { units: "kilometers" });
  console.log("🗺️ Сетка ячеек:", grid.features.length);

  const maxDepthPoints = [];

  grid.features.forEach((cell, index) => {
    // Используем более точный метод для поиска точек внутри полигона
    const pointsInCell = turf.pointsWithinPolygon(points, cell).features;

    if (pointsInCell.length > 0) {
      // Берем точку с максимальной глубиной
      const maxDepthPoint = pointsInCell.reduce((max, p) =>
        p.properties.depth > max.properties.depth ? p : max
      );
      maxDepthPoints.push(maxDepthPoint);
    }

    console.log(`🟦 Ячейка ${index + 1}:`, pointsInCell.length, "точек");
  });

  console.log("🎯 Итоговые точки:", maxDepthPoints.length);
  return maxDepthPoints;
};


const VoronoiPolygons = ({ data }) => {
  if (!data || data.length === 0) return null; // Проверка наличия данных

  const data_depth = filterMaxDepthPoints(raw, 10); // 10 км вместо 5

  // Преобразуем точки в формат GeoJSON (с исправленными координатами!)
  const points = turf.featureCollection(
    data_depth.map((feature) =>
      turf.point(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], // (широта, долгота)
        feature.properties
      )
    )
  );

  if (points.features.length < 2) {
    console.warn("❌ Недостаточно точек для Вороного!");
    return null;
  }

  // Генерируем полигоны Вороного
  const bbox = turf.bbox(points);
  const voronoi = turf.voronoi(points, { bbox });

  if (!voronoi || !voronoi.features) {
    console.warn("❌ Ошибка генерации Вороного!");
    return null;
  }

  return (
    <>
      {voronoi.features.map((polygon, index) => {
        if (!polygon.geometry || !polygon.geometry.coordinates) return null;

        const depth = polygon.properties?.depth || 0;
        return (
          <Polygon
            key={index}
            positions={polygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]])} // Обратно в Leaflet формат
            color="black"
            weight={1}
            fillOpacity={0.6}
            fillColor={getColor(depth)}
          >
            <Popup>Глубина: {depth} м</Popup>
          </Polygon>
        );
      })}
    </>
  );
};

export default VoronoiPolygons;
