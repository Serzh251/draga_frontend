import { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axois';
import configApi from '../api/config-api';

const useGeoData = ({ selectedFields }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      if (!selectedFields || selectedFields.size === 0) {
        setGeojsonData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const fieldParam = Array.from(selectedFields).join(',');
        const response = await axiosPrivate.get(
          `${configApi.GET_POINTS}?is_working=1&field=${encodeURIComponent(fieldParam)}`
        );
        setGeojsonData(response.data);
      } catch (err) {
        setError(err);
        setGeojsonData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoData();
  }, [selectedFields]);
  return { geojsonData, loading, error };
};

export default useGeoData;
