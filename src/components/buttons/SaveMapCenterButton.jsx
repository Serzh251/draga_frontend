// SaveMapCenterButton.jsx
import React from 'react';
import { Button, notification } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useMap } from 'react-leaflet';
import { useCreateOrUpdateDefaultMapCenterMutation } from '../../api/api';
import { message } from 'antd'; // ✅ Импортируем message

export default function SaveMapCenterButton({ onSaveSuccess }) {
  const map = useMap();
  const [saveMapCenter] = useCreateOrUpdateDefaultMapCenterMutation();

  const handleSave = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
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
        message.error('Не удалось сохранить настройки');
      });
  };

  return (
    <Button
      type="primary"
      icon={<AimOutlined />}
      onClick={handleSave}
      style={{
        position: 'absolute',
        bottom: 20,
        left: 25,
        zIndex: 1000,
        padding: 10,
      }}
    >
      Сохранить центр и zoom
    </Button>
  );
}
