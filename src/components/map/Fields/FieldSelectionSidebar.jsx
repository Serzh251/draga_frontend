import React, { useState, useEffect, useMemo } from 'react';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../../../static/css/MapFields.css';

const { Option } = Select;

const FieldSelectionSidebar = ({ fields, onSelectionChange }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Считаем ширину самого длинного названия
  const minWidth = useMemo(() => {
    if (!fields?.length) return 150;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Arial'; // тот же шрифт, что у Select
    const maxTextWidth = Math.max(...fields.map((f) => ctx.measureText(f.properties.name).width));
    return Math.min(maxTextWidth + 48, window.innerWidth * 0.8); // +48px на иконки/паддинги
  }, [fields]);

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
    <div className="field-sidebar-wrapper" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <div className="field-toggle-button">☰</div>
      {isOpen && (
        <div className="field-sidebar">
          <div className="field-sidebar-title">Месторождения</div>
          <Select
            style={{
              minWidth: minWidth,
              maxWidth: '80vw',
            }}
            placeholder="Выберите месторождение"
            value={selectedField || undefined}
            onChange={(value) => setSelectedField(value || null)}
            allowClear
          >
            {fields.map((field) => (
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
