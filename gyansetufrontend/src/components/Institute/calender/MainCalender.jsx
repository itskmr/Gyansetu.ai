import React, { useState } from "react";
import { Calendar, Settings } from "lucide-react";
import CalendarView from "./CalenderView";
import SchedulingTools from "./SchedulingTool";
import TimeTableGenerator from "./TimeTableGenerator";
import AnnouncementsManager from "./AnnouncementManager";

const InstituteMain = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Staff Meeting",
      date: "2025-04-30",
      start: "09:00",
      end: "10:00",
      type: "meeting",
      priority: "medium",
      description: "Monthly staff meeting",
    },
    {
      id: 2,
      title: "Parent-Teacher Conference",
      date: "2025-05-02",
      start: "14:00",
      end: "16:00",
      type: "conference",
      priority: "high",
      description: "End of term parent-teacher meetings",
    },
    {
      id: 3,
      title: "Final Exam Week",
      startDate: "2025-05-15",
      endDate: "2025-05-22",
      allDay: true,
      type: "exam",
      priority: "urgent",
      description: "End of year examination period",
    },
    {
      id: 4,
      title: "Sports Day",
      date: "2025-05-10",
      allDay: true,
      type: "event",
      priority: "medium",
      description: "Annual school sports day",
    },
    {
      id: 5,
      title: "Teacher Development Workshop",
      date: "2025-05-05",
      start: "13:00",
      end: "16:00",
      type: "training",
      priority: "medium",
      description: "Professional development workshop",
    },
    {
      id: 6,
      title: "School Holiday - Labor Day",
      date: "2025-05-01",
      allDay: true,
      type: "holiday",
      priority: "medium",
      description: "Public holiday - school closed",
    },
  ]);

  // Notifications for scheduling
  const [scheduledNotifications, setScheduledNotifications] = useState([
    {
      id: 101,
      title: "Fee Reminder",
      date: "2025-05-05",
      target: "parents",
      priority: "high",
      message: "Monthly fee reminder for all parents",
    },
    {
      id: 102,
      title: "Grade Submission Deadline",
      date: "2025-05-10",
      target: "teachers",
      priority: "medium",
      message: "Final grades submission reminder for teachers",
    },
  ]);

  // Announcements
  const [announcements, setAnnouncements] = useState([
    {
      id: 201,
      title: "Final Exam Schedule Released",
      date: "2025-04-28",
      priority: "urgent",
      target: "all",
      content:
        "The final examination schedule has been released. Please check the academic calendar for details.",
    },
    {
      id: 202,
      title: "Teacher Evaluation Forms Due",
      date: "2025-04-29",
      priority: "high",
      target: "teachers",
      content:
        "All teacher evaluation forms must be submitted by the end of the month.",
    },
    {
      id: 203,
      title: "School Closure Due to Weather",
      date: "2025-05-03",
      priority: "urgent",
      target: "all",
      content:
        "School will be closed on May 3rd due to severe weather warnings.",
    },
  ]);

  // Time tables
  const [timeTables, setTimeTables] = useState([
    {
      id: 301,
      grade: "Grade 9",
      section: "A",
      academicYear: "2024-2025",
      schedule: {},
    },
    {
      id: 302,
      grade: "Grade 10",
      section: "B",
      academicYear: "2024-2025",
      schedule: {},
    },
  ]);

  // Add new event
  const handleAddEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: events.length + 1 };
    setEvents([...events, eventWithId]);
  };

  // Edit existing event
  const handleEditEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  // Add new notification
  const handleAddNotification = (newNotification) => {
    const notificationWithId = {
      ...newNotification,
      id: scheduledNotifications.length + 101,
    };
    setScheduledNotifications([...scheduledNotifications, notificationWithId]);
  };

  // Add new announcement
  const handleAddAnnouncement = (newAnnouncement) => {
    const announcementWithId = {
      ...newAnnouncement,
      id: announcements.length + 201,
    };
    setAnnouncements([...announcements, announcementWithId]);
  };

  // Add new time table
  const handleAddTimeTable = (newTimeTable) => {
    const timeTableWithId = { ...newTimeTable, id: timeTables.length + 301 };
    setTimeTables([...timeTables, timeTableWithId]);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="flex items-center p-4 space-x-6">
          <button
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "calendar"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar size={18} className="mr-2" />
            Calendar
          </button>

          <button
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "scheduling"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("scheduling")}
          >
            <Settings size={18} className="mr-2" />
            Scheduling
          </button>

          <button
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "timetable"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("timetable")}
          >
            <Settings size={18} className="mr-2" />
            Time Table
          </button>

          <button
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "announcements"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("announcements")}
          >
            <Settings size={18} className="mr-2" />
            Announcements
          </button>
        </div>
      </div>

      {/* Content for Calendar Tab */}
      {activeTab === "calendar" && (
        <CalendarView
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {/* Content for Scheduling Tab */}
      {activeTab === "scheduling" && (
        <SchedulingTools
          scheduledNotifications={scheduledNotifications}
          onAddNotification={handleAddNotification}
        />
      )}

      {/* Content for Timetable Tab */}
      {activeTab === "timetable" && (
        <TimeTableGenerator
          timeTables={timeTables}
          onAddTimeTable={handleAddTimeTable}
        />
      )}

      {/* Content for Announcements Tab */}
      {activeTab === "announcements" && (
        <AnnouncementsManager
          announcements={announcements}
          onAddAnnouncement={handleAddAnnouncement}
        />
      )}
    </div>
  );
};

export default InstituteMain;
