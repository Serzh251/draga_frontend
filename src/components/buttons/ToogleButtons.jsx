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
import { useSelector } from 'react-redux';

const BUTTONS_CONFIG = [
  {
    key: 'showBatymetryLayer',
    titleOn: 'Скрыть промеры',
    titleOff: 'Показать промеры',
    Icon: AreaChartOutlined,
    activeColor: 'blue',
    style: { top: 272, left: 11, width: 30, height: 30, padding: 3 },
  },
  {
    key: 'showMyLocation',
    titleOn: 'Скрыть мое местоположение',
    titleOff: 'Показать мое местоположение',
    Icon: AimOutlined,
    activeColor: '#52c41a',
    style: { top: 312, left: 11, width: 30, height: 30, padding: 3 },
  },
  {
    key: 'showCleanPoints',
    titleOn: 'Скрыть clean точки',
    titleOff: 'Показать clean точки',
    Icon: EnvironmentFilled,
    activeColor: 'green',
    style: { top: 346, right: 11 },
  },
  {
    key: 'showHotMap',
    titleOn: 'Скрыть hot map',
    titleOff: 'Показать hot map',
    Icon: RadarChartOutlined,
    activeColor: 'blue',
    style: { top: 290, right: 11 },
  },
  {
    key: 'showMapPoints',
    titleOn: 'Скрыть все точки',
    titleOff: 'Показать все точки',
    Icon: EnvironmentOutlined,
    activeColor: 'red',
    style: { top: 402, right: 11 },
    adminOnly: true,
  },
  {
    key: 'showGridCells',
    titleOn: 'Скрыть сетку',
    titleOff: 'Показать сетку',
    Icon: FileExcelOutlined,
    activeColor: '#faad14',
    style: { top: 460, right: 11 },
    adminOnly: true,
  },
];

const scaleStyleForMobile = (style, scale = 0.75) => {
  if (!style) return style;
  const s = { ...style };
  // scale top/left/right if numeric
  ['top', 'left', 'right', 'bottom'].forEach((k) => {
    if (s[k] !== undefined && typeof s[k] === 'number') s[k] = Math.round(s[k] * scale);
  });
  // scale width/height/padding
  ['width', 'height', 'padding'].forEach((k) => {
    if (s[k] !== undefined && typeof s[k] === 'number') s[k] = Math.max(20, Math.round(s[k] * scale));
  });
  return s;
};

const ToggleButtonGroup = ({ displayStates, toggleDisplayState }) => {
  const { isAdmin } = useAuth();
  const isMobile = useSelector((state) => state.ui?.isMobile);

  const cfg = useMemo(
    () =>
      BUTTONS_CONFIG.filter((c) => {
        if (c.adminOnly && !isAdmin) return false;
        return true;
      }),
    [isAdmin]
  );

  return (
    <>
      {cfg.map((c) => {
        const isActive = !!displayStates[c.key];
        const title = isActive ? c.titleOn : c.titleOff;
        const style = isMobile ? scaleStyleForMobile(c.style, 0.75) : c.style;
        return (
          <BaseIconButton
            key={c.key}
            title={title}
            Icon={c.Icon}
            onClick={() => toggleDisplayState(c.key)}
            isActive={isActive}
            activeColor={c.activeColor}
            style={style}
          />
        );
      })}
    </>
  );
};

export default ToggleButtonGroup;
