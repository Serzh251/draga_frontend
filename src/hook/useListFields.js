import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axois";
import configApi from "../api/config-api";

const useListFields = () => {
  const [listGeojsonFields, setListGeojsonFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(configApi.LIST_FIELDS);
        setListGeojsonFields(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  return { listGeojsonFields, loading, error };
};

export default useListFields;
