// File: components/calendar/badges/EventTypeBadge.jsx
import React from "react";

const EventTypeBadge = ({ type }) => {
  switch (type) {
    case "meeting":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
          Meeting
        </span>
      );
    case "conference":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
          Conference
        </span>
      );
    case "exam":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
          Exam
        </span>
      );
    case "event":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
          Event
        </span>
      );
    case "training":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
          Training
        </span>
      );
    case "holiday":
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
          Holiday
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
  }
};

export default EventTypeBadge;
