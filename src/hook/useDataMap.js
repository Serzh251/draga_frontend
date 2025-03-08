import { useSelector } from 'react-redux';

export function useMapData() {
  const { points, cleanPoints, cleanPointsPrev, fieldsData, yearsData } = useSelector((state) => state.mapData);

  return { points, cleanPoints, cleanPointsPrev, fieldsData, yearsData };
}
