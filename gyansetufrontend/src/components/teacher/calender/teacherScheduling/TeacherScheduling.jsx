// File: TeacherScheduling.jsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import ClassFilter from "./ClassFilter";
import SectionFilter from "./SectionFilter";
import MoreFiltersButton from "./MoreFiltersButton";
import TabNavigation from "./TabNavigation";
import EventsTable from "./EventsTable";
import CreateEventModal from "./CreateEventModal";

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
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <ClassFilter
            classes={classes}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
          <SectionFilter
            sections={sections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            disabled={!selectedClass}
          />
          <MoreFiltersButton />
        </div>

        {/* Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Events Table */}
        <EventsTable
          activeTab={activeTab}
          events={
            activeTab === "upcoming"
              ? filteredUpcomingEvents
              : filteredPastEvents
          }
        />
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          showConflictWarning={showConflictWarning}
          onClose={() => {
            setShowCreateModal(false);
            setShowConflictWarning(false);
          }}
        />
      )}
    </div>
  );
};

export default TeacherScheduling;
