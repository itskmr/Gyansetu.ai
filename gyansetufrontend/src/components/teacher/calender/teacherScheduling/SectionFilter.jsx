// File: components/SectionFilter.jsx
import React from "react";

const SectionFilter = ({
  sections,
  selectedSection,
  setSelectedSection,
  disabled,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Section:</span>
      <select
        className="block w-32 rounded-md border border-gray-300 py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        disabled={disabled}
      >
        <option value="">All Sections</option>
        {sections.map((section) => (
          <option key={section} value={section}>
            {section}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SectionFilter;
