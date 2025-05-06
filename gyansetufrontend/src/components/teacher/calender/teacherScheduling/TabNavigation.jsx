// File: components/TabNavigation.jsx
import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex space-x-4">
        <button
          className={`pb-2 px-1 text-sm font-medium ${
            activeTab === "upcoming"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium ${
            activeTab === "past"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
