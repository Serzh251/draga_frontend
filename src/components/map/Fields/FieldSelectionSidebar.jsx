import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../../../static/css/MapFields.css';

const { Option } = Select;

const FieldSelectionSidebar = ({ fields, onSelectionChange }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Загрузка сохраненного значения из localStorage при монтировании
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
      className="field-sidebar-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="field-toggle-button">☰</div>
      {isOpen && (
        <div className="field-sidebar">
          <div className="field-sidebar-title">Месторождения</div>
          <Select
            style={{ width: '100%' }}
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
