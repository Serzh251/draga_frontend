// src/components/buttons/SaveMapCenterButton.jsx
import React from 'react';
import { Button, notification } from 'antd';
import { useCreateOrUpdateDefaultMapCenterMutation } from '@/api/api';

const SaveMapCenterButton = ({ map, onSaveSuccess }) => {
  const [saveMapCenter] = useCreateOrUpdateDefaultMapCenterMutation();

  const handleSave = () => {
    if (!map) {
      console.error('Карта не передана в SaveMapCenterButton');
      return;
    }

    const center = map.getCenter();
    const zoom = map.getZoom();
    const wktCenter = `POINT(${center.lng.toFixed(6)} ${center.lat.toFixed(6)})`;
    const getBearing = map.getBearing();

    saveMapCenter({
      center: wktCenter,
      zoom,
      bearing: getBearing,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Успешно',
          description: 'Настройки карты сохранены',
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
      onClick={handleSave}
      disabled={!map}
      style={{
        position: 'absolute',
        bottom: 20,
        left: 25,
        zIndex: 1000,
        padding: 4,
        height: 'auto',
      }}
    >
      Сохранить настройки карты
    </Button>
  );
};

export default SaveMapCenterButton;
