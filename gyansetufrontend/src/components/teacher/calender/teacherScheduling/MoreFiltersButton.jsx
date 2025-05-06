// File: components/MoreFiltersButton.jsx
import React from "react";
import { Filter } from "lucide-react";

const MoreFiltersButton = () => {
  return (
    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center">
      <Filter size={16} className="mr-1" />
      More Filters
    </button>
  );
};

export default MoreFiltersButton;
