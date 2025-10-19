import React, { useState, useEffect, useMemo } from 'react';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../../../static/css/MapFields.css';
import { useMapData } from '@/hook/useDataMap';

const { Option } = Select;

const FieldSelectionSidebar = ({ onSelectionChange }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { fieldsData } = useMapData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeFields = fieldsData?.features || [];

  // Считаем ширину самого длинного названия
  const minWidth = useMemo(() => {
    if (!safeFields.length) return 150;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Arial';
    const maxTextWidth = Math.max(...safeFields.map((f) => ctx.measureText(f.properties.name).width));
    return Math.min(maxTextWidth + 48, window.innerWidth * 0.8);
  }, [safeFields]);

  // Загрузка сохраненного значения из localStorage
  useEffect(() => {
    const savedField = localStorage.getItem('selectedField');
    if (savedField && savedField !== 'null') {
      setSelectedField(JSON.parse(savedField));
    }
  }, []);

  useEffect(() => {
    if (selectedField) {
      localStorage.setItem('selectedField', JSON.stringify(selectedField));
    } else {
      localStorage.removeItem('selectedField');
    }
    onSelectionChange(selectedField ? new Set([selectedField]) : new Set());
  }, [selectedField, onSelectionChange]);

  return (
    <div
      className={`field-sidebar-wrapper ${selectedField ? 'has-selection' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="field-toggle-button">☰</div>
      {isOpen && (
        <div className="field-sidebar">
          <div className="field-sidebar-title">Месторождения</div>
          <Select
            style={{
              minWidth: minWidth,
              maxWidth: '80vw',
            }}
            className={selectedField ? 'select-with-value' : ''}
            placeholder="Выберите месторождение"
            value={selectedField || undefined}
            onChange={(value) => setSelectedField(value || null)}
            allowClear
          >
            {safeFields.map((field) => (
              <Option key={field.id} value={field.id}>
                {field.properties.name}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default FieldSelectionSidebar;
