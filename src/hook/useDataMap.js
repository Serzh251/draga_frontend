import { useSelector } from 'react-redux';

export function useMapData() {
  const fieldsData = useSelector((state) => state.mapData.fieldsData);
  const yearsData = useSelector((state) => state.mapData.yearsData);

  return { fieldsData, yearsData };
}
