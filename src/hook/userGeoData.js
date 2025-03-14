import { useSelector } from 'react-redux';

export function useUserGeoData() {
  const { userGeoData } = useSelector((state) => state.mapData);

  return { userGeoData };
}
