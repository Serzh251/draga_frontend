import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../../static/css/MapYearsSidebar.css';

const { Option } = Select;

const YearSelectionSidebar = ({ years, onSelectionChange, isPrev = false }) => {
  const [selectedYears, setSelectedYears] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedYear = localStorage.getItem('selectedYears');
    if (savedYear && savedYear !== 'null') {
      setSelectedYears(JSON.parse(savedYear));
    }
  }, []);

  useEffect(() => {
    if (selectedYears) {
      if (isPrev) {
        localStorage.setItem('selectedYearsPrev', JSON.stringify(selectedYears));
      } else {
        localStorage.setItem('selectedYears', JSON.stringify(selectedYears));
      }
    } else {
      if (isPrev) {
        localStorage.removeItem('selectedYearsPrev', JSON.stringify(selectedYears));
      } else {
        localStorage.removeItem('selectedYears', JSON.stringify(selectedYears));
      }
    }
    onSelectionChange(selectedYears ? new Set([selectedYears]) : new Set());
  }, [selectedYears, onSelectionChange, isPrev]);

  return (
    <div
      className={`year-sidebar-wrapper ${isPrev ? 'last-year-position' : ''} ${selectedYears ? 'has-selection' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="year-toggle-button">
        <div className="year-toggle-button">
          {isPrev ? <ClockCircleOutlined style={{ fontSize: 20 }} /> : <CalendarOutlined style={{ fontSize: 20 }} />}
        </div>
      </div>

      {isOpen && (
        <div className="year-sidebar">
          <div className="year-sidebar-title">{isPrev ? 'Прошлый год' : 'Текущий год'}</div>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите год"
            value={selectedYears || 'Не выбрано'}
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
