// src/components/buttons/ToogleButtons.jsx
import React from 'react';
import {
  AimOutlined,
  AreaChartOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  FileExcelOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useAuth } from '@/hooks/useAuth';

// Общая базовая кнопка
const ToggleButton = ({ title, icon: Icon, onClick, isActive, activeColor = '#1890ff', ...props }) => {
  const baseStyle = {
    position: 'absolute',
    zIndex: 500,
    fontSize: '25px',
    cursor: 'pointer',
    background: 'white',
    padding: '9px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    color: isActive ? activeColor : undefined,
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.2s ease',
  };

  return (
    <Tooltip placement="left" title={title}>
      <Icon onClick={onClick} style={{ ...baseStyle, ...props.style }} />
    </Tooltip>
  );
};

const ToggleButtonGroup = ({ displayStates, toggleDisplayState }) => {
  const { isAdmin } = useAuth();

  return (
    <>
      <ToggleButton
        title={displayStates.showBatymetryLayer ? 'Скрыть промеры' : 'Показать промеры'}
        icon={AreaChartOutlined}
        onClick={() => toggleDisplayState('showBatymetryLayer')}
        isActive={displayStates.showBatymetryLayer}
        activeColor="blue"
        style={{ top: 272, left: 11, width: 30, height: 30, padding: 3 }}
      />
      <ToggleButton
        title={displayStates.showMyLocation ? 'Скрыть мое местоположение' : 'Показать мое местоположение'}
        icon={AimOutlined}
        onClick={() => toggleDisplayState('showMyLocation')}
        isActive={displayStates.showMyLocation}
        activeColor="#52c41a"
        style={{ top: 392, left: 11, width: 30, height: 30, padding: 3 }}
      />

      <ToggleButton
        title={displayStates.showCleanPoints ? 'Скрыть clean точки' : 'Показать clean точки'}
        icon={EnvironmentFilled}
        onClick={() => toggleDisplayState('showCleanPoints')}
        isActive={displayStates.showCleanPoints}
        activeColor="green"
        style={{ top: 350, right: 11 }}
      />

      <ToggleButton
        title={displayStates.showHotMap ? 'Скрыть hot map' : 'Показать hot map'}
        icon={RadarChartOutlined}
        onClick={() => toggleDisplayState('showHotMap')}
        isActive={displayStates.showHotMap}
        activeColor="blue"
        style={{ top: 292, right: 11 }}
      />

      {isAdmin && (
        <>
          <ToggleButton
            title={displayStates.showMapPoints ? 'Скрыть все точки' : 'Показать все точки'}
            icon={EnvironmentOutlined}
            onClick={() => toggleDisplayState('showMapPoints')}
            isActive={displayStates.showMapPoints}
            activeColor="red"
            style={{ top: 406, right: 11 }}
          />

          <ToggleButton
            title={displayStates.showGridCells ? 'Скрыть сетку' : 'Показать сетку'}
            icon={FileExcelOutlined}
            onClick={() => toggleDisplayState('showGridCells')}
            isActive={displayStates.showGridCells}
            activeColor="#faad14"
            style={{ top: 462, right: 11 }}
          />
        </>
      )}
    </>
  );
};

export default ToggleButtonGroup;
