import React, { useState } from 'react';
import { Modal, Table } from 'antd';
import { CheckSquareOutlined, MonitorOutlined } from '@ant-design/icons';
import { useFetchUserGeoDataQuery } from '../../../api/api';

const UserDataGeometry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: listUserGeoData, refetch: refetchUserGeoData } = useFetchUserGeoDataQuery();

  const dataSource = (listUserGeoData?.features || []).map((feature) => {
    const geometry = feature.geometry || {};
    const geometries = geometry.geometries || [];

    const hasPoint =
      geometry.type === 'Point' ||
      (geometry.type === 'GeometryCollection' &&
        Array.isArray(geometries) &&
        geometries.some((g) => g.type === 'Point'));

    const hasLine =
      geometry.type === 'LineString' ||
      (geometry.type === 'GeometryCollection' &&
        Array.isArray(geometries) &&
        geometries.some((g) => g.type === 'LineString'));

    const hasPolygon =
      geometry.type === 'Polygon' ||
      (geometry.type === 'GeometryCollection' &&
        Array.isArray(geometries) &&
        geometries.some((g) => g.type === 'Polygon'));

    return {
      key: feature.id,
      name: feature.properties?.name || '-',
      description: feature.properties?.description || '-',
      color: feature.properties?.color || '#000000',
      created_at: feature.properties?.created_at || null,
      has_point: hasPoint,
      has_line: hasLine,
      has_polygon: hasPolygon,
    };
  });

  const columns = [
    {
      title: 'Время создания',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (text) => <div style={{ textAlign: 'left' }}>{new Date(text).toLocaleString()}</div>,
      width: 200,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
      width: 300,
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
      width: 500,
    },
    {
      title: 'Цвет',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
      render: (color) => (
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '2px',
            display: 'inline-block',
          }}
        />
      ),
      width: 60,
    },
    {
      title: 'Точка',
      key: 'has_point',
      align: 'center',
      render: (_, record) => (record.has_point ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
      width: 60,
    },
    {
      title: 'Линия',
      key: 'has_line',
      align: 'center',
      render: (_, record) => (record.has_line ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
      width: 60,
    },
    {
      title: 'Полигон',
      key: 'has_polygon',
      align: 'center',
      render: (_, record) => (record.has_polygon ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
      width: 60,
    },
  ];

  const toggleModal = async () => {
    try {
      await refetchUserGeoData();
      setIsModalOpen(!isModalOpen);
    } catch (error) {
      console.error('Ошибка загрузки данных геоJSON:', error);
    }
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

      <Modal
        title="Таблица данных"
        open={isModalOpen}
        onCancel={toggleModal}
        footer={null}
        width="80%"
        style={{ maxHeight: '90vh' }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={dataSource.length > 12 ? { pageSize: 12 } : false}
          bordered
          size="middle"
          scroll={{ y: 'calc(90vh - 150px)' }}
        />
      </Modal>
    </>
  );
};

export default UserDataGeometry;
