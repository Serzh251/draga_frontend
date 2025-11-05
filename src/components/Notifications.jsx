import React, { useState, useCallback } from 'react';
import { Dropdown, List, Typography, Space, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useWebSocket } from '@/hooks/useWebSocket';
import configApi from '@/api/config-api';

const { Text, Paragraph } = Typography;

const SOURCE_LABELS = {
  modbus: 'Дисплей',
  gps: 'GPS',
  database: 'База данных',
  data: 'Данные',
  default: 'Система',
};

const ERROR_DESCRIPTIONS = {
  'No data received from Modbus TCP/IP.': 'Нет данных от панели оператора. Проверьте включено ли оборудование.',
  'No coordinates and datetime received from GPS.':
    'GPS-приёмник не передаёт координаты или передает не валидные данные. Проверьте включен ли приемник и перезагрузите.',
  default: 'Произошла неизвестная ошибка.',
};

const NotificationBell = () => {
  const [errors, setErrors] = useState([]);
  const [isManual, setIsManual] = useState(false);
  const [open, setOpen] = useState(false);

  const handleWebSocketMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'task_status') {
        const isManualFlag = !!data.is_manual;
        setIsManual(isManualFlag);

        if (data.status === 'error' && Array.isArray(data.errors)) {
          setErrors(data.errors);
          // Показываем ошибки всегда (и вручную, и автоматически)
          if (isManualFlag) {
            setOpen(true);
            setTimeout(() => setOpen(false), 8000);
          }
        } else if (data.status === 'success') {
          setErrors([]);
          // Успех показываем ТОЛЬКО при ручном режиме
          if (isManualFlag) {
            setOpen(true);
            setTimeout(() => setOpen(false), 5000);
          }
          // При автоматическом успехе — НИЧЕГО не делаем
        }
      }
    } catch (e) {
      console.warn('Invalid notification message:', e);
    }
  }, []);

  useWebSocket(configApi.WS_NOTIFICATIONS, handleWebSocketMessage);

  const clearErrors = () => {
    setErrors([]);
    setIsManual(false);
    setOpen(false);
  };

  const getErrorDescription = (errorText) => {
    return ERROR_DESCRIPTIONS[errorText] || ERROR_DESCRIPTIONS.default;
  };

  const getSourceLabel = (source) => {
    return SOURCE_LABELS[source] || SOURCE_LABELS.default;
  };

  const menuContent = (
    <div
      style={{
        width: 450,
        padding: '8px 0',
        background: '#fff',
        borderRadius: 8,
        boxShadow:
          '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ padding: '0 12px 8px' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Paragraph strong underline>
            {isManual ? 'Результат сохранения точки' : 'Ошибки и предупреждения'}
          </Paragraph>
          {errors.length > 0 && (
            <Text type="secondary" style={{ cursor: 'pointer' }} onClick={clearErrors}>
              Скрыть
            </Text>
          )}
        </Space>
      </div>

      {errors.length > 0 ? (
        <div style={{ padding: '0 12px' }}>
          {isManual && <Text type="danger">❌ Точка не сохранена</Text>}
          <List
            dataSource={errors}
            renderItem={(item) => (
              <List.Item style={{ padding: '6px 0' }}>
                <Space size={8} style={{ width: '100%' }}>
                  <Text type="danger">●</Text>
                  <Text>
                    <Text strong>{getSourceLabel(item.source)}:</Text> {getErrorDescription(item.error)}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
        </div>
      ) : isManual ? (
        <div style={{ padding: '12px' }}>
          <Text type="success">✅ Точка успешно сохранена вручную</Text>
        </div>
      ) : (
        <div style={{ padding: '24px 12px' }}>
          <Empty description="Нет активных ошибок и предупреждений" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      overlayStyle={{ top: 65, right: 70 }}
      open={open}
      onOpenChange={setOpen}
      popupRender={() => menuContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <BellOutlined
        style={{
          fontSize: '20px',
          color: errors.length > 0 ? '#ff4d4f' : '#595959',
          animation: errors.length > 0 ? 'pulse 1.5s infinite' : 'none',
          cursor: 'pointer',
          transition: 'color 0.3s',
        }}
      />
    </Dropdown>
  );
};

export default NotificationBell;
