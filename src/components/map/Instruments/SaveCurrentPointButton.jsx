import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useCreateManualPointMutation } from '@/api/api';
import BaseIconButton from '@/components/buttons/BaseIconButton';

const SaveCurrentPointButton = ({ style }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createUserGeoData, { isLoading }] = useCreateManualPointMutation();

  const handleConfirm = async () => {
    try {
      await createUserGeoData({}).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      notification.error({ message: 'Ошибка', description: 'Не удалось сохранить точку' });
    }
  };

  return (
    <>
      <BaseIconButton
        title="Сохранить текущую точку"
        Icon={EditOutlined}
        onClick={() => setIsModalOpen(true)}
        style={style}
      />
      <Modal
        title="Сохранить текущую точку?"
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Да"
        cancelText="Нет"
        confirmLoading={isLoading}
        centered
      >
        <p>Сохранить точку с текущим положением и глубиной?</p>
      </Modal>
    </>
  );
};

export default SaveCurrentPointButton;
