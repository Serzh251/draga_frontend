import React from 'react';
import { EnvironmentFilled, EnvironmentOutlined, FileExcelOutlined, RadarChartOutlined } from '@ant-design/icons';
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
}) => {
  const { isAdmin } = useAuth();
  return (
    <>
      <ToggleButton
        title={showHotMap ? 'Скрыть hot map' : 'Показать hot map'}
        icon={RadarChartOutlined}
        onClick={() => setShowHotMap((prev) => !prev)}
        style={{ top: 292, right: 11, color: 'blue' }}
      />

      <ToggleButton
        title={showCleanPoints ? 'Скрыть clean точки' : 'Показать clean точки'}
        icon={EnvironmentFilled}
        onClick={() => setShowCleanPoints((prev) => !prev)}
        style={{ top: 350, right: 11, color: 'green' }}
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
          />
        </>
      )}
    </>
  );
};

export default ToggleButtonGroup;
