// src/components/Map/UserDataGeometry/UserDataGeometryTable.jsx
import React from 'react';
import { Modal, Table, Button, Tooltip } from 'antd';
import { CheckSquareOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const UserDataGeometryTable = ({
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onSave,
  onClear,
  onDelete,
  data,
  selectedRowKeys,
  setSelectedRowKeys,
  isAuth,
}) => {
  const isMobile = useSelector((state) => state.ui?.isMobile);

  const dataSource = data.map((feature) => {
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

  const columns = isMobile
    ? [
        // --- Мобильные колонки ---
        {
          title: 'Название',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
        },
        {
          title: 'Типы',
          key: 'types',
          render: (_, record) => (
            <span>
              {record.has_point && <span>Точка </span>}
              {record.has_line && <span>Линия </span>}
              {record.has_polygon && <span>Полигон </span>}
            </span>
          ),
        },
        {
          title: 'Действия',
          key: 'actions',
          render: (_, record) => (
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              onClick={() => onDelete(record.key)}
            />
          ),
        },
      ]
    : [
        // --- Десктопные колонки ---
        {
          title: 'Время создания',
          dataIndex: 'created_at',
          key: 'created_at',
          align: 'center',
          render: (text) => <div style={{ textAlign: 'left' }}>{new Date(text).toLocaleString()}</div>,
          responsive: ['md'], // Показывать на medium (768px) и больше
          width: 200,
        },
        {
          title: 'Название',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
          responsive: ['sm'], // Показывать на small (576px) и больше
          width: 300,
        },
        {
          title: 'Описание',
          dataIndex: 'description',
          key: 'description',
          align: 'center',
          render: (text) => <div style={{ textAlign: 'left' }}>{text}</div>,
          responsive: ['lg'], // Показывать только на large (992px) и больше
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
          responsive: ['md'], // Показывать на medium и больше
          width: 60,
        },
        {
          title: 'Точка',
          key: 'has_point',
          align: 'center',
          render: (_, record) => (record.has_point ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
          responsive: ['sm'], // Показывать на small и больше
          width: 60,
        },
        {
          title: 'Линия',
          key: 'has_line',
          align: 'center',
          render: (_, record) => (record.has_line ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
          responsive: ['sm'], // Показывать на small и больше
          width: 60,
        },
        {
          title: 'Полигон',
          key: 'has_polygon',
          align: 'center',
          render: (_, record) => (record.has_polygon ? <CheckSquareOutlined style={{ color: 'green' }} /> : null),
          responsive: ['sm'], // Показывать на small и больше
          width: 80,
        },
        {
          title: 'Удалить',
          key: 'delete',
          align: 'center',
          render: (_, record) => (
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              onClick={() => onDelete(record.key)}
            />
          ),
          responsive: ['xs'], // Показывать на всех размерах, включая extra small
          width: 70,
        },
      ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
      if (newSelectedRowKeys.length === 0) {
        localStorage.removeItem('userGeoDataIds');
      } else {
        localStorage.setItem('userGeoDataIds', JSON.stringify(newSelectedRowKeys));
      }
    },
  };

  return (
    <>
      {isAuth && (
        <Tooltip title="Показать данные" placement="right">
          <SearchOutlined className={'btn-search'} onClick={onOpenModal} />
        </Tooltip>
      )}

      <Modal
        title="Таблица данных"
        open={isModalOpen}
        onCancel={onCloseModal}
        footer={[
          <Button key="clear" onClick={onClear} disabled={selectedRowKeys.length === 0}>
            Очистить
          </Button>,
          <Button key="save" type="primary" onClick={onSave}>
            Показать
          </Button>,
        ]}
        width={isMobile ? '100%' : '80%'}
        style={{ maxHeight: '80vh' }}
      >
        <Table
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          pagination={dataSource.length > 10 ? { pageSize: 10, size: isMobile ? 'small' : 'default' } : false}
          scroll={{ y: 'calc(80vh - 150px)' }}
          size={isMobile ? 'small' : 'default'}
        />
      </Modal>
    </>
  );
};

export default UserDataGeometryTable;
