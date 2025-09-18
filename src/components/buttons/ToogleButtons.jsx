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
import { useAuth } from '../../hook/use-auth';

const ToggleButton = ({ title, icon: Icon, onClick, style }) => (
  <Tooltip placement="left" title={title}>
    <Icon
      onClick={onClick}
      style={{
        ...style,
        position: 'absolute',
        zIndex: 500,
        fontSize: '25px',
        cursor: 'pointer',
        background: 'white',
        padding: '9px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    />
  </Tooltip>
);

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
        style={{ top: 272, left: 11, width: 30, height: 30, padding: 3 }}
      />
      <ToggleButton
        title={showBatymetryLayer ? 'Скрыть промеры' : 'Показать промеры'}
        icon={AreaChartOutlined}
        onClick={() => setShowBatymetryLayer((prev) => !prev)}
        style={{ top: 312, left: 11, color: 'blue', width: 30, height: 30, padding: 3 }}
      />
      <ToggleButton
        title={showCleanPoints ? 'Скрыть clean точки' : 'Показать clean точки'}
        icon={EnvironmentFilled}
        onClick={() => setShowCleanPoints((prev) => !prev)}
        style={{ top: 350, right: 11, color: 'green' }}
      />

      <ToggleButton
        title={showHotMap ? 'Скрыть hot map' : 'Показать hot map'}
        icon={RadarChartOutlined}
        onClick={() => setShowHotMap((prev) => !prev)}
        style={{ top: 292, right: 11, color: 'blue' }}
      />

      {isAdmin && (
        <>
          <ToggleButton
            title={showMapPoints ? 'Скрыть все точки' : 'Показать все точки'}
            icon={EnvironmentOutlined}
            onClick={() => setShowMapPoints((prev) => !prev)}
            style={{ top: 406, right: 11, color: 'red' }}
          />
          <ToggleButton
            title={showGridCells ? 'Скрыть сетку' : 'Показать сетку'}
            icon={FileExcelOutlined}
            onClick={() => setShowGridCells((prev) => !prev)}
            style={{ top: 462, right: 11 }}
          />{' '}
        </>
      )}
    </>
  );
};

export default ToggleButtonGroup;
