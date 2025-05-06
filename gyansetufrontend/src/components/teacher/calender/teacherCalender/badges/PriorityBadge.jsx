// File: components/calendar/badges/PriorityBadge.jsx
import React from "react";

const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case "urgent":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
          Urgent
        </span>
      );
    case "high":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
          High
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
          Medium
        </span>
      );
    case "low":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
          Low
        </span>
      );
    default:
      return null;
  }
};

export default PriorityBadge;
