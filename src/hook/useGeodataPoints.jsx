import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axois";
import configApi from "../api/config-api";

const useGeoData = (endpoint) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(configApi.GET_POINTS);
        setGeojsonData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, [configApi.GET_POINTS, axiosPrivate]);

  return { geojsonData, loading, error };
};

export default useGeoData;
