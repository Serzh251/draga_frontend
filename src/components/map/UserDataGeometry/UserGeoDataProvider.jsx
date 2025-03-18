import React, { useEffect, useState } from 'react';
import { useFetchUserGeoDataQuery, useDeleteUserGeoDataMutation } from '../../../api/api';
import { useDispatch } from 'react-redux';
import { setUserGeoData, removeUserGeoData } from '../../../store/slices/userGeoDataSlice';
import UserDataGeometryTable from './UserDataGeometryTable';
import UserGeoDataLayer from './UserGeoDataLayer';

const UserGeoDataProvider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();

  const storedIds = (() => {
    try {
      const data = localStorage.getItem('userGeoDataIds');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка парсинга localStorage:', error);
      return [];
    }
  })();

  const { data: listUserGeoData, refetch: refetchUserGeoData } = useFetchUserGeoDataQuery();
  const [deleteUserGeoData] = useDeleteUserGeoDataMutation();

  useEffect(() => {
    if (listUserGeoData && Array.isArray(storedIds) && storedIds.length > 0 && !selectedRowKeys.length) {
      const filteredData = listUserGeoData.features.filter((feature) => storedIds.includes(feature.id));
      dispatch(setUserGeoData(filteredData));
      setSelectedRowKeys(storedIds);
    }
  }, [listUserGeoData, storedIds, selectedRowKeys, dispatch]);

  const handleDelete = async (id) => {
    try {
      await deleteUserGeoData(id);
      await refetchUserGeoData();
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
    }
  };

  const handleOpenModal = async () => {
    try {
      await refetchUserGeoData();
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки данных геоJSON:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(removeUserGeoData());
  };

  const handleSave = () => {
    const selectedData = (listUserGeoData?.features || []).filter((feature) => selectedRowKeys.includes(feature.id));
    dispatch(setUserGeoData(selectedData));
    localStorage.setItem('userGeoDataIds', JSON.stringify(selectedRowKeys));
    setIsModalOpen(false);
  };
  const handleClear = () => {
    setSelectedRowKeys([]);
    dispatch(removeUserGeoData());
    localStorage.removeItem('userGeoDataIds');
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
      />
      <UserGeoDataLayer />
    </>
  );
};

export default UserGeoDataProvider;
