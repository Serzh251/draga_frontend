// import React, { useEffect, useState } from "react";
// import "../../../static/css/MapFields.css";
//
// const STORAGE_KEY = "selectedFields";
//
// const FieldSelectionSidebar = ({ fields, onSelectionChange }) => {
//   const [selectedFields, setSelectedFields] = useState(new Set());
//
//   useEffect(() => {
//     const savedFields = JSON.parse(localStorage.getItem(STORAGE_KEY));
//     if (savedFields) {
//       setSelectedFields(new Set(savedFields));
//     } else {
//       setSelectedFields(new Set(fields.map((f) => f.id))); // Выбираем все по умолчанию
//     }
//   }, [fields]);
//
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedFields]));
//     onSelectionChange(selectedFields);
//   }, [selectedFields, onSelectionChange]);
//
//   const toggleField = (fieldId) => {
//     setSelectedFields((prev) => {
//       const newSelection = new Set(prev);
//       newSelection.has(fieldId) ? newSelection.delete(fieldId) : newSelection.add(fieldId);
//       return newSelection;
//     });
//   };
//
//   return (
//     <div className="field-sidebar">
//       <h3>Выбор полей</h3>
//       {fields.map((field) => (
//         <label key={field.id} className="field-checkbox">
//           <input
//             type="checkbox"
//             checked={selectedFields.has(field.id)}
//             onChange={() => toggleField(field.id)}
//           />
//           {field.properties.name}
//         </label>
//       ))}
//     </div>
//   );
// };
//
// export default FieldSelectionSidebar;
