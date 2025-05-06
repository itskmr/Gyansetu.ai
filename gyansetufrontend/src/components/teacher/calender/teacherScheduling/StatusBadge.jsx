// File: components/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    scheduled: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
