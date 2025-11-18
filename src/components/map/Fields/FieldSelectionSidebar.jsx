import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import '../../../static/css/FieldSelectionSidebar.css';
import { useMapData } from '@/hooks/useDataMap';
import { useSelector } from 'react-redux';

const { Option } = Select;

const FieldSelectionSidebar = ({ onSelectionChange }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);
  const isMobile = useSelector((state) => state.ui.isMobile);
  const { fieldsData } = useMapData();
  const safeFields = fieldsData?.features || [];

  const minWidth = useMemo(() => {
    if (!safeFields.length) return isMobile ? 130 : 150;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = isMobile ? '12px Arial' : '14px Arial';
    const maxTextWidth = Math.max(...safeFields.map((f) => ctx.measureText(f.properties.name).width));
    return Math.min(maxTextWidth + (isMobile ? 36 : 48), window.innerWidth * 0.8);
  }, [safeFields, isMobile]);

  // Загружаем сохранённый выбор
  useEffect(() => {
    const savedField = localStorage.getItem('selectedField');
    if (savedField && savedField !== 'null') {
      setSelectedField(JSON.parse(savedField));
    }
  }, []);

  // Сохраняем выбор и передаём наружу
  useEffect(() => {
    if (selectedField) {
      localStorage.setItem('selectedField', JSON.stringify(selectedField));
    } else {
      localStorage.removeItem('selectedField');
    }
    onSelectionChange(selectedField ? new Set([selectedField]) : new Set());
  }, [selectedField, onSelectionChange]);

  // Мобильное открытие панели
  const handleOpen = () => {
    if (isMobile) setIsOpen((prev) => !prev);
  };

  // Закрытие при клике вне (только для мобильных)
  useEffect(() => {
    if (!isMobile) return;

    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isMobile]);

  // Закрывать список после выбора — только мобильный
  const handleSelectChange = (value) => {
    setSelectedField(value || null);
    if (isMobile) setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`field-sidebar-wrapper ${selectedField ? 'has-selection' : ''} ${
        isMobile ? 'mobile-field-sidebar' : ''
      }`}
      style={isMobile ? { position: 'absolute', right: 10 } : {}}
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      <div className={`field-toggle-button ${isMobile ? 'mobile-field-toggle' : ''}`} onClick={handleOpen}>
        ☰
      </div>

      {isOpen && (
        <div className="field-sidebar">
          <div className="field-sidebar-title">Месторождения</div>

          <Select
            style={{
              minWidth: minWidth,
              maxWidth: isMobile ? '75vw' : '80vw',
            }}
            size={isMobile ? 'small' : 'middle'}
            className={selectedField ? 'select-with-value' : ''}
            placeholder="Выберите месторождение"
            value={selectedField || undefined}
            onChange={handleSelectChange}
            allowClear
            styles={{
              popup: {
                root: {
                  fontSize: isMobile ? 12 : 14,
                },
              },
            }}
          >
            {safeFields.map((field) => (
              <Option key={field.id} value={field.id} style={{ fontSize: isMobile ? 12 : 14 }}>
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
