import React from 'react';
import FieldSelectionSidebar from './Fields/FieldsList';
import YearSelectionSidebar from './YearSelectionSidebar';

const SidebarSelections = ({
  listGeojsonFields,
  listUniqueYears,
  selectedFields,
  setSelectedFields,
  selectedYears,
  setSelectedYears,
}) => {
  return (
    <>
      <FieldSelectionSidebar
        fields={listGeojsonFields?.features || []}
        selectedFields={selectedFields}
        onSelectionChange={setSelectedFields}
      />
      <YearSelectionSidebar
        years={listUniqueYears || []}
        selectedYears={selectedYears}
        onSelectionChange={setSelectedYears}
      />
    </>
  );
};

export default SidebarSelections;
