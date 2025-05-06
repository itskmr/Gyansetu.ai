// File: components/ClassFilter.jsx
import React from "react";

const ClassFilter = ({ classes, selectedClass, setSelectedClass }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Class:</span>
      <select
        className="block w-32 rounded-md border border-gray-300 py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">All Classes</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassFilter;
