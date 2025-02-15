import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axois";
import configApi from "../api/config-api";

const useGridCells = () => {
  const [cells, setCells] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCells = async () => {
      if (!hasMore || loading) return;

      setLoading(true);
      try {
        const response = await axiosPrivate.get(`${configApi.GET_GRID_CELLS}?page=${page}`);
        const newCells = response.data; // FeatureCollection

        if (newCells?.results?.features && Array.isArray(newCells.results.features)) {
          setCells((prevCells) => [...prevCells, ...newCells.results.features]); // Добавляем новые данные
        } else {
          console.error("Ошибка: данные не содержат массив features", response.data);
        }

        // Если нет следующей страницы, останавливаем загрузку
        if (!newCells.next_page) {
          setHasMore(false);
        } else {
          setPage((prevPage) => prevPage + 1); // Переходим на следующую страницу
        }
      } catch (error) {
        console.error("Ошибка загрузки сетки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCells();
  }, [page, hasMore, loading]); // Эффект зависит от страницы и состояния hasMore

  return { cells, hasMore, loading, loadMore: () => setPage((prev) => prev + 1) };
};

export default useGridCells;
