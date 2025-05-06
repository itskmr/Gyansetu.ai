// File: components/ConflictWarning.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const ConflictWarning = () => {
  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
      <AlertTriangle
        size={20}
        className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
      />
      <div>
        <h4 className="font-medium text-yellow-800">
          Potential Schedule Conflict!
        </h4>
        <p className="text-sm text-yellow-700 mt-1">
          This event may conflict with "Science Test - Grade 9" on May 5, 2025,
          2:00 PM. Students in Grade 9 A and 9 B have both events on the same
          day.
        </p>
      </div>
    </div>
  );
};

export default ConflictWarning;
