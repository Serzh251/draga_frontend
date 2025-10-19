import React from 'react';
import {
  AimOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  FileExcelOutlined,
  RadarChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useAuth } from '@/hook/use-auth';

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

const ToggleButtonGroup = ({
  showMapPoints,
  setShowMapPoints,
  showCleanPoints,
  setShowCleanPoints,
  showGridCells,
  setShowGridCells,
  showHotMap,
  setShowHotMap,
  showMyLocation,
  setShowMyLocation,
  showBatymetryLayer,
  setShowBatymetryLayer,
}) => {
  const { isAdmin } = useAuth();

  return (
    <>
      <ToggleButton
        title={showMyLocation ? 'Скрыть мое местоположение' : 'Показать мое местоположение'}
        icon={AimOutlined}
        onClick={() => setShowMyLocation((prev) => !prev)}
        isActive={showMyLocation}
        activeColor="#52c41a" // зелёный при включении
        style={{ top: 272, left: 11, width: 30, height: 30, padding: 3 }}
      />

      <ToggleButton
        title={showBatymetryLayer ? 'Скрыть промеры' : 'Показать промеры'}
        icon={AreaChartOutlined}
        onClick={() => setShowBatymetryLayer((prev) => !prev)}
        isActive={showBatymetryLayer}
        activeColor="blue"
        style={{ top: 312, left: 11, width: 30, height: 30, padding: 3 }}
      />

      <ToggleButton
        title={showCleanPoints ? 'Скрыть clean точки' : 'Показать clean точки'}
        icon={EnvironmentFilled}
        onClick={() => setShowCleanPoints((prev) => !prev)}
        isActive={showCleanPoints}
        activeColor="green"
        style={{ top: 350, right: 11 }}
      />

      <ToggleButton
        title={showHotMap ? 'Скрыть hot map' : 'Показать hot map'}
        icon={RadarChartOutlined}
        onClick={() => setShowHotMap((prev) => !prev)}
        isActive={showHotMap}
        activeColor="blue"
        style={{ top: 292, right: 11 }}
      />

      {isAdmin && (
        <>
          <ToggleButton
            title={showMapPoints ? 'Скрыть все точки' : 'Показать все точки'}
            icon={EnvironmentOutlined}
            onClick={() => setShowMapPoints((prev) => !prev)}
            isActive={showMapPoints}
            activeColor="red"
            style={{ top: 406, right: 11 }}
          />

          <ToggleButton
            title={showGridCells ? 'Скрыть сетку' : 'Показать сетку'}
            icon={FileExcelOutlined}
            onClick={() => setShowGridCells((prev) => !prev)}
            isActive={showGridCells}
            activeColor="#faad14" // оранжевый
            style={{ top: 462, right: 11 }}
          />
        </>
      )}
    </>
  );
};

export default ToggleButtonGroup;
