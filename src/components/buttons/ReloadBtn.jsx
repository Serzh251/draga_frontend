import React from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import BaseIconButton from './BaseIconButton';

const ReloadButton = ({ style }) => {
  return (
    <BaseIconButton
      title="Обновить страницу"
      Icon={Loading3QuartersOutlined}
      onClick={() => window.location.reload()}
      style={style}
    />
  );
};

export default ReloadButton;
