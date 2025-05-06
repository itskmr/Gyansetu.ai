// File: components/calendar/badges/EventScopeBadge.jsx
import React from "react";
import { UserCircle, Users } from "lucide-react";

const EventScopeBadge = ({ eventScope, targetClass, targetSection }) => {
  if (eventScope === "personal") {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 flex items-center">
        <UserCircle size={12} className="mr-1" />
        Personal
      </span>
    );
  } else {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
        <Users size={12} className="mr-1" />
        {targetClass}
        {targetSection ? ` - ${targetSection}` : ""}
      </span>
    );
  }
};

export default EventScopeBadge;
