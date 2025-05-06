// File: components/EventTypeBadge.jsx
import React from "react";

const EventTypeBadge = ({ type }) => {
  const typeStyles = {
    quiz: "bg-blue-100 text-blue-800",
    test: "bg-indigo-100 text-indigo-800",
    exam: "bg-purple-100 text-purple-800",
    assignment: "bg-green-100 text-green-800",
    activity: "bg-amber-100 text-amber-800",
    assessment: "bg-teal-100 text-teal-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        typeStyles[type] || "bg-gray-100 text-gray-800"
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default EventTypeBadge;
