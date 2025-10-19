// src/components/notifications/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Typography, Space, Alert, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useWebSocket } from '../../hooks/useWebSocket'; // предполагается ваш хук для WS

const { Text } = Typography;

// Маппинг источников ошибок на человекочитаемые названия
const SOURCE_LABELS = {
  modbus: 'Modbus',
  gps: 'GPS',
  default: 'Система',
};

// Маппинг ошибок на описания
const ERROR_DESCRIPTIONS = {
  'No data received from Modbus TCP/IP.': 'Нет данных от устройства Modbus. Проверьте подключение и настройки сети.',
  'No coordinates and datetime received from GPS.':
    'GPS-приёмник не передаёт координаты и время. Проверьте антенну и питание.',
  default: 'Произошла неизвестная ошибка.',
};

const NotificationBell = () => {
  const [errors, setErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Предполагается, что ваш WebSocket-хук предоставляет данные
  // Если у вас другой способ получения данных — адаптируйте
  const { lastMessage } = useWebSocket(); // или ваш метод получения сообщений

  // Обработка входящих сообщений
  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const message = JSON.parse(lastMessage.data);
        if (message.type === 'task_error' && Array.isArray(message.errors)) {
          setErrors((prev) => {
            const newErrors = message.errors.map((err, index) => ({
              id: Date.now() + index, // простой ID для уникальности
              source: err.source,
              error: err.error,
              timestamp: new Date().toISOString(),
            }));
            return [...prev, ...newErrors].slice(-10); // храним максимум 10 последних ошибок
          });
        }
      } catch (e) {
        console.warn('Failed to parse WebSocket message:', e);
      }
    }
  }, [lastMessage]);

  const clearErrors = () => {
    setErrors([]);
  };

  const getErrorDescription = (errorText) => {
    return ERROR_DESCRIPTIONS[errorText] || ERROR_DESCRIPTIONS.default;
  };

  const getSourceLabel = (source) => {
    return SOURCE_LABELS[source] || SOURCE_LABELS.default;
  };

  const menuContent = (
    <div style={{ width: 320, padding: '8px 0' }}>
      <div style={{ padding: '0 12px 8px' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text strong>Системные ошибки</Text>
          {errors.length > 0 && (
            <Text type="secondary" style={{ cursor: 'pointer' }} onClick={clearErrors}>
              Очистить
            </Text>
          )}
        </Space>
      </div>

      {errors.length === 0 ? (
        <div style={{ padding: '24px 12px' }}>
          <Empty description="Нет активных ошибок" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <List
          dataSource={errors}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 12px' }}>
              <Alert
                type="error"
                message={
                  <Space direction="vertical" size={2}>
                    <Text strong>{getSourceLabel(item.source)}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(item.timestamp).toLocaleString('ru-RU')}
                    </Text>
                  </Space>
                }
                description={getErrorDescription(item.error)}
                showIcon
                style={{ marginBottom: 0 }}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown overlay={menuContent} trigger={['click']} open={isOpen} onOpenChange={setIsOpen} placement="bottomRight">
      <Badge dot={errors.length > 0}>
        <BellOutlined
          style={{
            fontSize: '20px',
            color: errors.length > 0 ? '#ff4d4f' : '#595959',
            animation: errors.length > 0 ? 'pulse 1.5s infinite' : 'none',
            cursor: 'pointer',
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
