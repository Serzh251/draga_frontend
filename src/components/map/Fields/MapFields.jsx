// import { useEffect, useState } from "react";
// import { useMap, LayersControl } from "react-leaflet";
// import L from "leaflet";
//
// const STORAGE_KEY = "selectedFields";
//
// const MapFields = () => {
//   const map = useMap();
//   const [fields, setFields] = useState([]);
//   const [selectedFields, setSelectedFields] = useState(new Set());
//
//   // Загружаем данные из localStorage при загрузке компонента
//   useEffect(() => {
//     const storedFields = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
//     setSelectedFields(new Set(storedFields));
//   }, []);
//
//   useEffect(() => {
//     fetch(`http://localhost:2025/api/fields/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setFields(data.features);
//         setSelectedFields((prev) => {
//           // Если в localStorage нет данных, включаем все поля по умолчанию
//           return prev.size > 0 ? prev : new Set(data.features.map((f) => f.id));
//         });
//       })
//       .catch((error) => console.error("Ошибка загрузки полигонов:", error));
//   }, []);
//
//   useEffect(() => {
//     const layers = new Map();
//
//     fields.forEach((feature) => {
//       if (!selectedFields.has(feature.id)) return;
//
//       const polygon = L.geoJSON(feature.geometry, {
//         style: {
//           color: "#007bff", // Синий цвет границы
//           weight: 2,
//           fillOpacity: 0, // Без заливки
//         },
//       }).bindPopup(`<strong>${feature.properties.name}</strong>`);
//
//       polygon.addTo(map);
//       layers.set(feature.id, polygon);
//     });
//
//     return () => {
//       layers.forEach((layer) => map.removeLayer(layer));
//     };
//   }, [fields, selectedFields, map]);
//
//   const toggleField = (fieldId) => {
//     setSelectedFields((prev) => {
//       const newSelection = new Set(prev);
//       if (newSelection.has(fieldId)) {
//         newSelection.delete(fieldId);
//       } else {
//         newSelection.add(fieldId);
//       }
//
//       localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSelection]));
//       return newSelection;
//     });
//   };
//
//   return (
//     <LayersControl position="bottomleft">
//       <LayersControl.Overlay name="Все поля">
//         <div>
//           {fields.map((field) => (
//             <label key={field.id} style={{ display: "block", marginLeft: "10px" }}>
//               <input
//                 type="checkbox"
//                 checked={selectedFields.has(field.id)}
//                 onChange={() => toggleField(field.id)}
//               />
//               {field.properties.name}
//             </label>
//           ))}
//         </div>
//       </LayersControl.Overlay>
//     </LayersControl>
//   );
// };
//
// export default MapFields;
