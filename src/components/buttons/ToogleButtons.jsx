import React from "react";
import { AlignCenterOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const ToggleButton = ({ title, icon: Icon, onClick, style }) => (
  <Tooltip title={title}>
      <Icon
        onClick={onClick}
        style={{
            ...style,
            position: "absolute",
            zIndex: 1000,
            fontSize: "24px",
            cursor: "pointer",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
                           }) => (
  <>
      <ToggleButton
        title={showMapPoints ? "Скрыть все точки" : "Показать все точки"}
        icon={EnvironmentOutlined}
        onClick={() => setShowMapPoints((prev) => !prev)}
        style={{ top: 250, right: 10 }}
      />
      <ToggleButton
        title={showCleanPoints ? "Скрыть clean точки" : "Показать clean точки"}
        icon={EnvironmentOutlined}
        onClick={() => setShowCleanPoints((prev) => !prev)}
        style={{ top: 320, right: 10 }}
      />
      <ToggleButton
        title={showGridCells ? "Скрыть сетку" : "Показать сетку"}
        icon={AlignCenterOutlined}
        onClick={() => setShowGridCells((prev) => !prev)}
        style={{ top: 390, right: 10 }}
      />
  </>
);

export default ToggleButtonGroup;
