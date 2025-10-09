import React from 'react';
import { Button } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const ReloadPageButton = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Button
      type="text"
      icon={<Loading3QuartersOutlined />}
      onClick={handleReload}
      style={{
        position: 'absolute',
        top: 392,
        left: 11,
        width: 30,
        height: 30,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 500,
      }}
    />
  );
};

export default ReloadPageButton;
