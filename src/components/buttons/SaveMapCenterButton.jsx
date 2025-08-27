// components/buttons/SaveMapCenterButton.jsx
import React from 'react';
import { Button } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useMap } from 'react-leaflet';
import { useCreateOrUpdateDefaultMapCenterMutation } from '../../api/api';

export default function SaveMapCenterButton() {
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
        alert('Центр и масштаб карты сохранены!');
      })
      .catch((err) => {
        console.error('Ошибка сохранения настроек карты:', err);
        alert('Не удалось сохранить настройки');
      });
  };

  return (
    <Button
      type="primary"
      icon={<AimOutlined />}
      onClick={handleSave}
      style={{
        position: 'absolute',
        top: 70,
        right: 10,
        zIndex: 1000,
      }}
    >
      Сохранить центр
    </Button>
  );
}
