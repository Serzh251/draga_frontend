import React, { useState } from 'react';
import { Modal, notification, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useCreateManualPointMutation } from '../../../api/api';

const SaveCurrentPointButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createUserGeoData, { isLoading }] = useCreateManualPointMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // Отправляем пустое тело, как вы просили
      await createUserGeoData({}).unwrap();
      setIsModalOpen(false);
      // Опционально: показать уведомление об успехе
      // message.success('Точка сохранена');
    } catch (error) {
      console.error('Ошибка сохранения точки:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        duration: 3,
      });
    }
  };

  return (
    <>
      <Tooltip title="Сохранить текущую точку" placement="right">
        <EditOutlined
          onClick={showModal}
          style={{
            position: 'absolute',
            top: 352,
            width: 30,
            height: 30,
            left: 11,
            fontSize: '25px',
            color: '#1890ff',
            cursor: 'pointer',
            background: 'white',
            padding: '2px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 500,
          }}
        />
      </Tooltip>
      <Modal
        title="Сохранить текущую точку?"
        open={isModalOpen}
        onOk={handleConfirm}
        centered
        onCancel={handleCancel}
        okText="Да"
        cancelText="Нет"
        confirmLoading={isLoading}
        okButtonProps={{ danger: false }}
      >
        <p>Сохранить точку с текущим положением и глубиной?</p>
      </Modal>
    </>
  );
};

export default SaveCurrentPointButton;
