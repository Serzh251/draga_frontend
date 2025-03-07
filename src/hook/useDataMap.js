import { useSelector } from 'react-redux';

export function useMapData() {
  const { points, cleanPoints, fieldsData, yearsData } = useSelector((state) => state.mapData);

  return { points, cleanPoints, fieldsData, yearsData };
}
