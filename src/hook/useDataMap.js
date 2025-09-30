import { useSelector } from 'react-redux';

export function useMapData() {
  const { fieldsData, yearsData } = useSelector((state) => state.mapData);

  return { fieldsData, yearsData };
}
