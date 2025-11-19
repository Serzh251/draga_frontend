import React, { useMemo } from 'react';
import {
  AimOutlined,
  AreaChartOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  FileExcelOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import BaseIconButton from './BaseIconButton';
import '@/static/css/map-buttons.css';

const BUTTONS_CONFIG = [
  {
    key: 'showBatymetryLayer',
    titleOn: 'Скрыть промеры',
    titleOff: 'Показать промеры',
    Icon: AreaChartOutlined,
    activeColor: 'blue',
    style: { top: 272, left: 11 },
  },
  {
    key: 'showMyLocation',
    titleOn: 'Скрыть мое местоположение',
    titleOff: 'Показать мое местоположение',
    Icon: AimOutlined,
    activeColor: '#52c41a',
    style: { top: 393, left: 11 },
  },
  {
    key: 'showCleanPoints',
    titleOn: 'Скрыть clean точки',
    titleOff: 'Показать clean точки',
    Icon: EnvironmentFilled,
    activeColor: 'green',
    style: { top: 260, right: 11 },
  },
  {
    key: 'showHotMap',
    titleOn: 'Скрыть hot map',
    titleOff: 'Показать hot map',
    Icon: RadarChartOutlined,
    activeColor: 'blue',
    style: { top: 220, right: 11 },
  },
  {
    key: 'showMapPoints',
    titleOn: 'Скрыть все точки',
    titleOff: 'Показать все точки',
    Icon: EnvironmentOutlined,
    activeColor: 'red',
    style: { top: 300, right: 11 },
    adminOnly: true,
  },
  {
    key: 'showGridCells',
    titleOn: 'Скрыть сетку',
    titleOff: 'Показать сетку',
    Icon: FileExcelOutlined,
    activeColor: '#faad14',
    style: { top: 340, right: 11 },
    adminOnly: true,
  },
];

const toPxStyle = (s) => {
  const out = {};
  Object.entries(s || {}).forEach(([k, v]) => {
    out[k] = typeof v === 'number' ? `${v}px` : v;
  });
  return out;
};

const ToggleButtonGroup = ({ displayStates, toggleDisplayState }) => {
  const { isAdmin } = useAuth();

  const cfg = useMemo(() => BUTTONS_CONFIG.filter((c) => !c.adminOnly || isAdmin), [isAdmin]);

  return (
    <>
      {cfg.map((c) => {
        const isActive = !!displayStates[c.key];
        const title = isActive ? c.titleOn : c.titleOff;

        return (
          <BaseIconButton
            key={c.key}
            className={`btn-${c.key}`}
            title={title}
            Icon={c.Icon}
            onClick={() => toggleDisplayState(c.key)}
            isActive={isActive}
            activeColor={c.activeColor}
            style={toPxStyle(c.style)}
          />
        );
      })}
    </>
  );
};

export default ToggleButtonGroup;
