// src/components/Instruments/SaveCurrentPointButton.jsx (или как у вас называется файл)
import React, { useState, useEffect } from 'react';
import { Modal, notification, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useCreateManualPointMutation } from '@/api/api';

const SaveCurrentPointButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createUserGeoData, { isLoading }] = useCreateManualPointMutation();

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-is-open');
    } else {
      document.body.classList.remove('modal-is-open');
    }

    return () => {
      document.body.classList.remove('modal-is-open');
    };
  }, [isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await createUserGeoData({}).unwrap();
      setIsModalOpen(false);
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
        <EditOutlined onClick={showModal} className="map-button btn-save-clear-point-manually" />
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
