// src/components/buttons/SaveMapCenterButton.jsx
import React from 'react';
import { Button, notification } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useCreateOrUpdateDefaultMapCenterMutation } from '../../api/api';

const SaveMapCenterButton = ({ map, onSaveSuccess }) => {
  const [saveMapCenter] = useCreateOrUpdateDefaultMapCenterMutation();

  const handleSave = () => {
    if (!map) {
      console.error('Карта не передана в SaveMapCenterButton');
      return;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    // Форматируем координаты: POINT(долгота широта)
    const wktCenter = `POINT(${center.lng.toFixed(6)} ${center.lat.toFixed(6)})`;

    saveMapCenter({
      center: wktCenter,
      zoom,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Успешно',
          description: 'Центр и масштаб сохранены',
          duration: 2,
        });

        if (onSaveSuccess) {
          onSaveSuccess();
        }
      })
      .catch((err) => {
        console.error('Ошибка сохранения настроек карты:', err);
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось сохранить настройки',
          duration: 3,
        });
      });
  };

  return (
    <Button
      type="primary"
      icon={<AimOutlined />}
      onClick={handleSave}
      disabled={!map}
      style={{
        position: 'absolute',
        bottom: 20,
        left: 25,
        zIndex: 1000,
        padding: '0 8px',
        height: 'auto',
      }}
    >
      Сохранить центр и zoom
    </Button>
  );
};

export default SaveMapCenterButton;
