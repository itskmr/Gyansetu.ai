import React, { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Bell,
  AlertCircle,
} from "lucide-react";

const TeacherAnnouncements = () => {
  const [activeTab, setActiveTab] = useState("institute");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

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

  const instituteAnnouncements = [
    {
      id: 1,
      title: "Final Examination Schedule Released",
      content:
        "The final examination schedule for this semester has been released. Please check the Academic Portal for details.",
      date: "2025-04-28",
      time: "10:00 AM",
      author: "Principal Davis",
      priority: "high",
      target: "All Faculty",
    },
    {
      id: 2,
      title: "Teacher Evaluation Forms Due",
      content:
        "All teacher evaluation forms must be submitted by May 5th. Please complete them as soon as possible.",
      date: "2025-04-27",
      time: "09:30 AM",
      author: "HR Department",
      priority: "medium",
      target: "All Faculty",
    },
    {
      id: 3,
      title: "Upcoming Professional Development Day",
      content:
        "There will be a professional development day on May 10th. All teachers are required to attend.",
      date: "2025-04-25",
      time: "02:15 PM",
      author: "Vice Principal Johnson",
      priority: "medium",
      target: "All Faculty",
    },
    {
      id: 4,
      title: "School Closure Due to Weather",
      content:
        "Due to the severe weather forecast, the school will be closed on May 3rd. Please inform your students.",
      date: "2025-04-28",
      time: "04:00 PM",
      author: "Principal Davis",
      priority: "urgent",
      target: "All Faculty and Students",
    },
  ];

  const myAnnouncements = [
    {
      id: 101,
      title: "Mathematics Quiz Postponed",
      content:
        "The mathematics quiz scheduled for tomorrow has been postponed to next week due to the upcoming science fair.",
      date: "2025-04-26",
      time: "11:45 AM",
      priority: "medium",
      target: "Grade 9 A, B, Grade 10 A",
    },
    {
      id: 102,
      title: "Extra Math Practice Session",
      content:
        "There will be an extra math practice session this Friday at 3 PM in Room 101 for students who need additional help.",
      date: "2025-04-24",
      time: "01:30 PM",
      priority: "low",
      target: "Grade 8 B, C",
    },
    {
      id: 103,
      title: "Assignment Deadline Extension",
      content:
        "The deadline for the Algebra assignment has been extended to May 5th. Please submit your work by then.",
      date: "2025-04-27",
      time: "09:15 AM",
      priority: "high",
      target: "Grade 11 A, B, C, D",
    },
  ];

  // Filter announcements based on search text and filters
  const filteredInstitute = instituteAnnouncements.filter(
    (item) =>
      (searchText === "" ||
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase())) &&
      (selectedPriority === "" || item.priority === selectedPriority)
  );

  const filteredMy = myAnnouncements.filter(
    (item) =>
      (searchText === "" ||
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase())) &&
      (selectedPriority === "" || item.priority === selectedPriority) &&
      (selectedClass === "" || item.target.includes(selectedClass)) &&
      (selectedSection === "" ||
        item.target.includes(`${selectedClass} ${selectedSection}`))
  );

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Get priority color for card border
  const getPriorityBorderColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-red-300";
      case "high":
        return "border-orange-300";
      case "medium":
        return "border-blue-300";
      case "low":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  };

  // Handle create announcement
  const handleCreateAnnouncement = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>

          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium flex items-center"
              onClick={handleCreateAnnouncement}
            >
              <Plus size={16} className="mr-1" />
              Create Announcement
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
              placeholder="Search announcements..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {activeTab === "my" && (
            <>
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
            </>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <select
              className="block w-32 rounded-md border border-gray-300 py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <button
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === "institute"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("institute")}
            >
              Institute Announcements
            </button>
            <button
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === "my"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("my")}
            >
              My Announcements
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {(activeTab === "institute" ? filteredInstitute : filteredMy).map(
            (announcement) => (
              <div
                key={announcement.id}
                className={`border ${getPriorityBorderColor(
                  announcement.priority
                )} rounded-lg p-4 ${
                  announcement.priority === "urgent" ? "bg-red-50" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {announcement.title}
                  </h3>
                  {getPriorityBadge(announcement.priority)}
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  {announcement.content}
                </p>

                <div className="mt-3 flex flex-wrap justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at {announcement.time}
                    </span>
                    {announcement.author && (
                      <span>By: {announcement.author}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                    <span>Target: {announcement.target}</span>
                    {activeTab === "my" && (
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Empty state */}
          {((activeTab === "institute" && filteredInstitute.length === 0) ||
            (activeTab === "my" && filteredMy.length === 0)) && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No announcements found
              </h3>
              <p className="text-gray-500">
                {activeTab === "institute"
                  ? "There are no institute announcements matching your search criteria."
                  : "You haven't created any announcements that match your search criteria."}
              </p>
              {activeTab === "my" && (
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
                  onClick={handleCreateAnnouncement}
                >
                  Create Your First Announcement
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Announcement
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Simplified modal content for the example */}
              <p className="text-sm text-gray-600">
                This modal would contain fields for announcement title, content,
                priority selection, target audience selection, and options for
                immediate or scheduled publishing.
              </p>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600">
                  Save as Draft
                </button>
                <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Publish Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
