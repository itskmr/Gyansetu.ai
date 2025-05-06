import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  AlertTriangle,
  Search,
  Plus,
  Filter,
} from "lucide-react";

const TeacherScheduling = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample data
  const classes = [
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];
  const sections = ["A", "B", "C", "D"];

  const upcomingEvents = [
    {
      id: 1,
      title: "Mathematics Quiz",
      date: "2025-05-02",
      time: "10:00 AM",
      type: "quiz",
      classes: ["Grade 9 A", "Grade 9 B"],
      status: "scheduled",
    },
    {
      id: 2,
      title: "Science Project Submission",
      date: "2025-05-05",
      time: "02:00 PM",
      type: "assignment",
      classes: ["Grade 10 A", "Grade 10 B", "Grade 10 C"],
      status: "scheduled",
    },
    {
      id: 3,
      title: "English Debate Competition",
      date: "2025-05-07",
      time: "11:30 AM",
      type: "activity",
      classes: ["Grade 11 A", "Grade 11 B"],
      status: "scheduled",
    },
    {
      id: 4,
      title: "History Test",
      date: "2025-05-10",
      time: "09:15 AM",
      type: "test",
      classes: ["Grade 8 C", "Grade 8 D"],
      status: "draft",
    },
  ];

  const pastEvents = [
    {
      id: 101,
      title: "Mathematics Mid-term Exam",
      date: "2025-04-15",
      time: "09:00 AM",
      type: "exam",
      classes: ["Grade 9 A", "Grade 9 B"],
      status: "completed",
    },
    {
      id: 102,
      title: "Science Lab Assessment",
      date: "2025-04-20",
      time: "01:30 PM",
      type: "assessment",
      classes: ["Grade 10 A", "Grade 10 B"],
      status: "completed",
    },
    {
      id: 103,
      title: "Grammar Quiz",
      date: "2025-04-22",
      time: "11:00 AM",
      type: "quiz",
      classes: ["Grade 8 A", "Grade 8 B", "Grade 8 C"],
      status: "completed",
    },
  ];

  // Filter events based on search text and selected filters
  const filteredUpcomingEvents = upcomingEvents.filter(
    (event) =>
      (searchText === "" ||
        event.title.toLowerCase().includes(searchText.toLowerCase())) &&
      (selectedClass === "" ||
        event.classes.some((cls) => cls.includes(selectedClass))) &&
      (selectedSection === "" ||
        event.classes.some((cls) =>
          cls.includes(`${selectedClass} ${selectedSection}`)
        ))
  );

  const filteredPastEvents = pastEvents.filter(
    (event) =>
      (searchText === "" ||
        event.title.toLowerCase().includes(searchText.toLowerCase())) &&
      (selectedClass === "" ||
        event.classes.some((cls) => cls.includes(selectedClass))) &&
      (selectedSection === "" ||
        event.classes.some((cls) =>
          cls.includes(`${selectedClass} ${selectedSection}`)
        ))
  );

  // Event type badge
  const getEventTypeBadge = (type) => {
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

  // Status badge
  const getStatusBadge = (status) => {
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

  // Toggle Create Event Modal
  const handleCreateEvent = () => {
    setShowCreateModal(true);
    // Simulate conflict detection after 1 second for demo purposes
    setTimeout(() => {
      setShowConflictWarning(true);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule Events
          </h2>

          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium flex items-center"
              onClick={handleCreateEvent}
            >
              <Plus size={16} className="mr-1" />
              Create Event
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 py-2 pr-3 block w-64 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search events..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Class:</span>
            <select
              className="block w-32 rounded-md border border-gray-300 py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Section:</span>
            <select
              className="block w-32 rounded-md border border-gray-300 py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <Filter size={16} className="mr-1" />
            More Filters
          </button>
        </div>

        {/* Tabs */}
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

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Classes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === "upcoming"
                ? filteredUpcomingEvents
                : filteredPastEvents
              ).map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEventTypeBadge(event.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.classes.length > 2
                        ? `${event.classes[0]}, ${event.classes[1]} +${
                            event.classes.length - 2
                          } more`
                        : event.classes.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {activeTab === "upcoming" ? (
                        <>
                          <button className="text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          {event.status === "draft" && (
                            <button className="text-green-600 hover:text-green-800">
                              Publish
                            </button>
                          )}
                          <button className="text-red-600 hover:text-red-800">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="text-blue-600 hover:text-blue-800">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            Clone
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {((activeTab === "upcoming" && filteredUpcomingEvents.length === 0) ||
            (activeTab === "past" && filteredPastEvents.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No events found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Event
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowConflictWarning(false);
                }}
              >
                ✕
              </button>
            </div>

            {/* Conflict Warning */}
            {showConflictWarning && (
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
                    This event may conflict with "Science Test - Grade 9" on May
                    5, 2025, 2:00 PM. Students in Grade 9 A and 9 B have both
                    events on the same day.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Modal content would go here - simplified for the example */}
              <p className="text-sm text-gray-600">
                This modal would contain fields for event title, date, time,
                type, class selection, and description.
              </p>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowConflictWarning(false);
                  }}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600">
                  Save as Draft
                </button>
                <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Schedule Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherScheduling;
