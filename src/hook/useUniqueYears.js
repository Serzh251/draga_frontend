import { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axois';
import configApi from '../api/config-api';

const useUniqueYears = () => {
  const [listUniqueYears, setListUniqueYears] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(configApi.GET_UNIQUE_YEARS);
        setListUniqueYears(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  return { listUniqueYears, loading, error };
};

export default useUniqueYears;
