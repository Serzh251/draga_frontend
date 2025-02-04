import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axois";

const useGeoData = (endpoint) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(endpoint);
        setGeojsonData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, [endpoint, axiosPrivate]);

  return { geojsonData, loading, error };
};

export default useGeoData;
