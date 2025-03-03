import { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axois';
import configApi from '../api/config-api';

const useCleanPoints = (selectedFields, selectedYears) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      if (
        (!selectedFields || selectedFields.size === 0) &&
        (!selectedYears || selectedYears.size === 0)
      ) {
        setGeojsonData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const fieldParam =
          selectedFields?.size > 0
            ? `field=${Array.from(selectedFields).join(',')}`
            : '';
        const yearParam =
          selectedYears?.size > 0
            ? `year=${Array.from(selectedYears).join(',')}`
            : '';
        const queryString = [fieldParam, yearParam].filter(Boolean).join('&');

        const response = await axiosPrivate.get(
          `${configApi.GET_CLEAN_POINTS}?${queryString}`
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
  }, [selectedFields, selectedYears]); // Добавил зависимость от selectedYears

  return { geojsonData, loading, error };
};

export default useCleanPoints;
