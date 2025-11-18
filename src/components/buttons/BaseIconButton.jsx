import React from 'react';
import { Tooltip } from 'antd';
import '@/static/css/map-buttons.css';

const BaseIconButton = ({ title, Icon, onClick, isActive, activeColor, style = {}, className = '' }) => {
  const cls = `map-button ${className} ${isActive ? 'active' : ''}`;

  const mergedStyle = {
    ...style,
    color: isActive ? activeColor : undefined,
  };

  return (
    <Tooltip placement="left" title={title}>
      <div className={cls} style={mergedStyle} onClick={onClick}>
        <Icon />
      </div>
    </Tooltip>
  );
};

export default BaseIconButton;
