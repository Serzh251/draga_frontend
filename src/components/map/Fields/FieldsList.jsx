import React, { useState, useEffect } from "react";
import "../../../static/css/MapFields.css";

const FieldSelectionSidebar = ({ fields, onSelectionChange }) => {
  const [selectedFields, setSelectedFields] = useState(new Set());
  const [isOpen, setIsOpen] = useState(new Set());

  useEffect(() => {
    onSelectionChange(selectedFields);
    localStorage.setItem("selectedFields", JSON.stringify([...selectedFields]));
  }, [selectedFields, onSelectionChange]);

  const toggleField = (fieldId) => {
    setSelectedFields((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(fieldId) ? newSelection.delete(fieldId) : newSelection.add(fieldId);
      return newSelection;
    });
  };

  return (
    <div
      className="field-sidebar-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="field-toggle-button">☰</div>
      {isOpen && (
        <div className="field-sidebar">
          <div>Месторождения</div>
          {fields.map((field) => (
            <label key={field.id} className="field-checkbox">
              <input
                type="checkbox"
                checked={selectedFields.has(field.id)}
                onChange={() => toggleField(field.id)}
              />
              {field.properties.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldSelectionSidebar;
