import React, { useState, useEffect } from "react";
import { Select } from "antd";
import "antd/dist/reset.css";
import "../../static/css/MapYearsSidebar.css";

const { Option } = Select;

const YearSelectionSidebar = ({ years, onSelectionChange }) => {
  const [selectedYears, setSelectedYears] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedYear = localStorage.getItem("selectedYears");
    if (savedYear && savedYear !== "null") {
      setSelectedYears(JSON.parse(savedYear));
    }
  }, []);

  // Сохранение выбора и обновление данных
  useEffect(() => {
    if (selectedYears) {
      localStorage.setItem("selectedYears", JSON.stringify(selectedYears));
    } else {
      localStorage.removeItem("selectedYears"); // Удаляем null из localStorage
    }
    onSelectionChange(selectedYears ? new Set([selectedYears]) : new Set());
  }, [selectedYears, onSelectionChange]);

  return (
    <div
      className="year-sidebar-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="year-toggle-button">☰</div>
      {isOpen && (
        <div className="year-sidebar">
          <div className="year-sidebar-title">Год</div>
          <Select
            style={{ width: "100%" }}
            placeholder="Выберите год"
            value={selectedYears || undefined}
            onChange={(value) => setSelectedYears(value || null)}
            allowClear
          >
            {years.map((yearObj) => (
              <Option key={yearObj.year} value={yearObj.year}>
                {yearObj.year}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default YearSelectionSidebar;
