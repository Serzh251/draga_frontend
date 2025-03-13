import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { MonitorOutlined, SaveOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';

const UserDataGeometry = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dataSource = [
    {
      key: '1',
      name: 'Элемент 1',
      value: 'Значение 1',
    },
    {
      key: '2',
      name: 'Элемент 2',
      value: 'Значение 2',
    },
  ];

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <MonitorOutlined
        style={{
          position: 'absolute',
          top: 280,
          left: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '7px 10px',
          borderRadius: '5px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}
        onClick={toggleModal}
      />

      <Modal title="Таблица данных" visible={isModalVisible} onCancel={toggleModal} footer={null}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Modal>
    </>
  );
};

export default UserDataGeometry;
