// File: components/calendar/FilterMenu.jsx
import React from "react";

const FilterMenu = ({ filterType, setFilterType }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
      <div className="p-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">Event Type</h3>
      </div>
      <div className="p-2 space-y-1">
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="all"
            checked={filterType === "all"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">All</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="meeting"
            checked={filterType === "meeting"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Meetings</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="exam"
            checked={filterType === "exam"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Exams</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="event"
            checked={filterType === "event"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Events</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="training"
            checked={filterType === "training"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Training</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="filterType"
            value="holiday"
            checked={filterType === "holiday"}
            onChange={(e) => setFilterType(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">Holidays</span>
        </label>
      </div>
    </div>
  );
};

export default FilterMenu;
