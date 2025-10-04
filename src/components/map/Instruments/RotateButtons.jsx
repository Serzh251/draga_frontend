// src/components/buttons/RotateButtons.jsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';

/**
 * RotateButtons — два простых кнопки поворота карты влево/вправо.
 *
 * Props:
 *  - map: экземпляр Leaflet map (обязательный для работы)
 *  - step: шаг поворота в градусах (по умолчанию 10)
 *  - style: дополнительный стиль для контейнера (опционально)
 */
const RotateButtons = ({ map, step = 10, style = {} }) => {
  const handleRotate = (delta) => {
    if (!map) {
      console.warn('RotateButtons: map is not provided');
      return;
    }

    // Получаем текущий угол (bearing) безопасно
    const getBearing =
      typeof map.getBearing === 'function'
        ? map.getBearing.bind(map)
        : () => (map.options && map.options.bearing) || 0;

    const setBearing = typeof map.setBearing === 'function' ? map.setBearing.bind(map) : null;

    const current = Number(getBearing() || 0);
    const next = current + Number(delta);

    if (setBearing) {
      setBearing(next);
    } else {
      // Если setBearing нет — просто логируем, чтобы не ломать приложение
      console.warn('RotateButtons: map does not support setBearing(). Make sure leaflet-rotate is loaded.');
    }
  };
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: 11,
        ...style,
      }}
    >
      <Tooltip title={`Повернуть влево на ${step}°`}>
        <Button onClick={() => handleRotate(-step)} icon={<UndoOutlined />} disabled={!map} type="default" />
      </Tooltip>

      <Tooltip title={`Повернуть вправо на ${step}°`}>
        <Button onClick={() => handleRotate(step)} icon={<RedoOutlined />} disabled={!map} type="default" />
      </Tooltip>
    </div>
  );
};

export default RotateButtons;
