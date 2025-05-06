// File: components/calendar/CalendarHeader.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock,
  CalendarDays,
  CalendarClock,
  Calendar,
} from "lucide-react";
import FilterMenu from "./FilterMenu";

const CalendarHeader = ({
  currentView,
  setCurrentView,
  currentDate,
  headerTitle,
  navigatePrevious,
  navigateNext,
  handleTodayClick,
  handleAddEventClick,
  showFilterMenu,
  setShowFilterMenu,
  filterType,
  setFilterType,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === "day"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentView("day")}
          >
            <Clock size={18} className="mr-1" />
            Day
          </button>
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === "week"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentView("week")}
          >
            <CalendarDays size={18} className="mr-1" />
            Week
          </button>
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === "month"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentView("month")}
          >
            <CalendarClock size={18} className="mr-1" />
            Month
          </button>
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === "quarter"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentView("quarter")}
          >
            <Calendar size={18} className="mr-1" />
            Quarter
          </button>
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              currentView === "year"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentView("year")}
          >
            <Calendar size={18} className="mr-1" />
            Year
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center">
          <button
            className="p-2 mr-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            onClick={() => navigatePrevious()}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold mx-2">{headerTitle}</h2>
          <button
            className="p-2 ml-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            onClick={() => navigateNext()}
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="ml-4 bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-3 rounded"
            onClick={handleTodayClick}
          >
            Today
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-3 rounded flex items-center gap-1"
            onClick={handleAddEventClick}
          >
            <Plus size={16} />
            Add Event
          </button>
          <div className="relative">
            <button
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded flex items-center gap-1"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} />
              Filter
            </button>
            {showFilterMenu && (
              <FilterMenu
                filterType={filterType}
                setFilterType={setFilterType}
              />
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center">
        <div className="relative w-64 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Event type legend */}
        <div className="ml-auto flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
            <span>Regular Events</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
            <span>Exams</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full mr-1"></div>
            <span>Meetings</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-400 rounded-full mr-1"></div>
            <span>Holidays</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
