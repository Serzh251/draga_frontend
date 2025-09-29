// src/components/Map/UserDataGeometry/UserGeoDataProvider.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hook/use-auth';
import { useFetchUserGeoDataQuery, useDeleteUserGeoDataMutation } from '../../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserGeoData, removeUserGeoData } from '../../../store/slices/userGeoDataSlice';
import UserDataGeometryTable from './UserDataGeometryTable';
import UserGeoDataLayer from './UserGeoDataLayer';

const UserGeoDataProvider = ({ map }) => {
  const { isAuth } = useAuth();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const userGeoData = useSelector((state) => state.userGeoData.userGeoData);

  // Загружаем список геоданных пользователя
  const { data: listUserGeoData, refetch: refetchUserGeoData } = useFetchUserGeoDataQuery(undefined, {
    skip: !isAuth,
  });

  const [deleteUserGeoData] = useDeleteUserGeoDataMutation();

  // Чтение/запись ID в localStorage
  const getStoredIds = () => {
    try {
      const data = localStorage.getItem('userGeoDataIds');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveSelectedIds = (ids) => {
    if (!ids.length) {
      localStorage.removeItem('userGeoDataIds');
    } else {
      localStorage.setItem('userGeoDataIds', JSON.stringify(ids));
    }
  };

  // Восстановление выбора из localStorage
  useEffect(() => {
    if (!isAuth) {
      dispatch(removeUserGeoData());
      setSelectedRowKeys([]);
      return;
    }

    if (listUserGeoData && !selectedRowKeys.length) {
      const storedIds = getStoredIds();
      const filteredData = listUserGeoData.features.filter((f) => storedIds.includes(f.id));
      if (filteredData.length > 0) {
        dispatch(setUserGeoData(filteredData));
        setSelectedRowKeys(storedIds);
      }
    }
  }, [listUserGeoData, isAuth, selectedRowKeys.length, dispatch]);

  // Очистка при выходе
  useEffect(() => {
    return () => {
      dispatch(removeUserGeoData());
    };
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await deleteUserGeoData(id).unwrap();
      await refetchUserGeoData();
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
    }
  };

  const handleOpenModal = async () => {
    if (isAuth) {
      await refetchUserGeoData();
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    const selectedData = (listUserGeoData?.features || []).filter((f) => selectedRowKeys.includes(f.id));
    dispatch(setUserGeoData(selectedData));
    saveSelectedIds(selectedRowKeys);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    setSelectedRowKeys([]);
    dispatch(removeUserGeoData());
    saveSelectedIds([]);
  };

  return (
    <>
      <UserDataGeometryTable
        isModalOpen={isModalOpen}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        onSave={handleSave}
        onClear={handleClear}
        onDelete={handleDelete}
        data={listUserGeoData?.features || []}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        isAuth={isAuth}
      />

      {isAuth && map && <UserGeoDataLayer userGeoData={userGeoData || []} map={map} />}
    </>
  );
};

export default UserGeoDataProvider;
