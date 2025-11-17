import React from 'react';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';

/**
 * Универсальная иконка-кнопка.
 * На mobile автоматически становится компактнее.
 */
const BaseIconButton = ({ title, Icon, onClick, isActive, activeColor, style = {} }) => {
  const isMobile = useSelector((state) => state.ui?.isMobile);

  // базовые (десктоп) значения
  const base = {
    position: 'absolute',
    zIndex: 500,
    fontSize: 25,
    cursor: 'pointer',
    background: 'white',
    padding: 9,
    borderRadius: 5,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    color: isActive ? activeColor : undefined,
    transform: isActive ? 'scale(1.06)' : 'scale(1)',
    transition: 'all 0.12s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // компактные значения для мобильных
  const mobileOverrides = {
    fontSize: 18,
    padding: 6,
    borderRadius: 4,
    // уменьшаем тень и масштаб активности
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    transform: isActive ? 'scale(1.03)' : 'scale(1)',
  };

  const mergedStyle = {
    ...base,
    ...(isMobile ? mobileOverrides : {}),
    ...style, // user-provided style (позиция/размеры) имеет приоритет
  };

  // Если пользователь явно передал width/height — уменьшим их на mobile, если не задано — base берёт fontSize/padding.
  if (isMobile) {
    if (mergedStyle.width && typeof mergedStyle.width === 'number') {
      mergedStyle.width = Math.max(20, Math.round(mergedStyle.width * 0.75));
    }
    if (mergedStyle.height && typeof mergedStyle.height === 'number') {
      mergedStyle.height = Math.max(20, Math.round(mergedStyle.height * 0.75));
    }
  }

  return (
    <Tooltip placement="left" title={title}>
      <div onClick={onClick} style={mergedStyle} role="button" tabIndex={0} onKeyDown={() => {}}>
        <Icon />
      </div>
    </Tooltip>
  );
};

export default BaseIconButton;
