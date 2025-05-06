import React, { useState, useEffect } from "react";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoPersonCircleOutline,
  IoCalendarOutline,
  IoSettingsOutline,
  IoGridOutline,
  IoMegaphoneOutline,
} from "react-icons/io5";
import Navbar from "../TeacherNavbar";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/api/authService";

// Calendar and other components
import CalendarView from "./teacherCalender/TeacherCalenderView";
import SchedulingTools from "./teacherScheduling/TeacherScheduling";
import TimeTableGenerator from "./TeacherTimetable";
import AnnouncementsManager from "./TeacherAnnouncements";

const TeacherCalendar = () => {
  // State variables
  const [navExpanded, setNavExpanded] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Mock data for events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Staff Meeting",
      date: "2025-05-05",
      start: "09:00",
      end: "10:00",
      type: "meeting",
      priority: "medium",
      description: "Monthly staff meeting",
    },
    {
      id: 2,
      title: "Parent-Teacher Conference",
      date: "2025-05-10",
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
      date: "2025-05-12",
      start: "13:00",
      end: "16:00",
      type: "training",
      priority: "medium",
      description: "Professional development workshop",
    },
    {
      id: 6,
      title: "School Holiday",
      date: "2025-05-01",
      allDay: true,
      type: "holiday",
      priority: "medium",
      description: "Public holiday - school closed",
    },
  ]);

  // Mock data for notifications
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

  // Mock data for announcements
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

  // Mock data for timetables
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

  // Event handlers
  const handleAddEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: events.length + 1 };
    setEvents([...events, eventWithId]);
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleAddNotification = (newNotification) => {
    const notificationWithId = {
      ...newNotification,
      id: scheduledNotifications.length + 101,
    };
    setScheduledNotifications([...scheduledNotifications, notificationWithId]);
  };

  const handleAddAnnouncement = (newAnnouncement) => {
    const announcementWithId = {
      ...newAnnouncement,
      id: announcements.length + 201,
    };
    setAnnouncements([...announcements, announcementWithId]);
  };

  const handleAddTimeTable = (newTimeTable) => {
    const timeTableWithId = { ...newTimeTable, id: timeTables.length + 301 };
    setTimeTables([...timeTables, timeTableWithId]);
  };

  // Setting greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle navbar toggle
  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle profile image upload
  const handleProfileClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Utility icons component
  const UtilityIcons = () => (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {darkMode ? (
          <IoSunnyOutline className="text-xl" />
        ) : (
          <IoMoonOutline className="text-xl" />
        )}
      </button>
      <button
        onClick={handleProfileClick}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <IoPersonCircleOutline className="text-xl" />
        )}
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-200 via-white to-purple-300"
      }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="w-full bg-purple-100 flex items-center justify-between px-4 py-3 shadow-sm z-50 fixed top-0 left-0 right-0">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md mr-3">
              <div className="w-4 h-4 rounded-full bg-white opacity-80" />
            </div>
            <span className="font-bold text-lg text-gray-700">GyanSetu</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col justify-between h-5 w-5">
              <span className="h-0.5 w-full bg-gray-500 rounded"></span>
              <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
              <span className="h-0.5 w-full bg-gray-500 rounded"></span>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 h-screen w-3/4 bg-white shadow-lg z-[9999]">
            <div className="flex items-center justify-between w-full px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-white opacity-90" />
                </div>
                <span className="ml-3 font-bold text-xl whitespace-nowrap text-gray-800">
                  GyanSetu
                </span>
              </div>

              {/* Close button */}
              <button onClick={toggleMobileMenu} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation items */}
            <div className="flex flex-col space-y-2 px-4 mt-6">
              <a
                href="/teacher"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">Dashboard</span>
              </a>
              <a
                href="/teacher/create-assignment"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">Create Assignments</span>
              </a>
              <a
                href="/teacher/generate-assignment"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">Generate Assignments</span>
              </a>
              <a
                href="/teacher/analytics"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">Analytics</span>
              </a>
              <a
                href="/teacher/calendar"
                className="flex items-center px-4 py-3 rounded-lg bg-purple-100"
              >
                <span className="ml-3">Calendar</span>
              </a>

              {/* Logout Button */}
              <div
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 mt-6 cursor-pointer"
                onClick={handleLogout}
              >
                <span className="ml-3">Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add space to push content below fixed header on mobile */}
      {isMobile && <div className="h-[56px]"></div>}

      <div className="flex flex-col md:flex-row">
        <Navbar onNavToggle={handleNavToggle} />
        {isMobile && (
          <div className="fixed top-3 right-16 z-50">
            <UtilityIcons />
          </div>
        )}
        <div
          className={`flex-1 transition-all duration-300 pt-[20px] md:pt-0 ${
            navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"
          }`}
        >
          <div className="p-6 md:p-8">
            {!isMobile && (
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1
                    className={`text-3xl md:text-4xl font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {greeting}, {user?.firstName || "Teacher"}!
                  </h1>
                  <h2
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    } text-lg mt-2`}
                  >
                    Manage your school schedule and events
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <UtilityIcons />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow rounded-lg mb-6`}
            >
              <div className="flex flex-wrap items-center p-4 space-x-3 md:space-x-6">
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "calendar"
                      ? "bg-purple-100 text-purple-700"
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                  }`}
                  onClick={() => setActiveTab("calendar")}
                >
                  <IoCalendarOutline size={18} className="mr-2" />
                  Calendar
                </button>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "scheduling"
                      ? "bg-purple-100 text-purple-700"
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                  }`}
                  onClick={() => setActiveTab("scheduling")}
                >
                  <IoSettingsOutline size={18} className="mr-2" />
                  Scheduling
                </button>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "timetable"
                      ? "bg-purple-100 text-purple-700"
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                  }`}
                  onClick={() => setActiveTab("timetable")}
                >
                  <IoGridOutline size={18} className="mr-2" />
                  Time Table
                </button>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "announcements"
                      ? "bg-purple-100 text-purple-700"
                      : `${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                  }`}
                  onClick={() => setActiveTab("announcements")}
                >
                  <IoMegaphoneOutline size={18} className="mr-2" />
                  Announcements
                </button>
              </div>
            </div>

            {/* Dynamic Content based on Active Tab */}
            <div
              className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-white"
              } shadow rounded-lg p-6`}
            >
              {activeTab === "calendar" && (
                <CalendarView
                  events={events}
                  onAddEvent={handleAddEvent}
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                  classes={[
                    {
                      id: 1,
                      name: "Math 101",
                      sections: [
                        { id: 1, name: "Section A" },
                        { id: 2, name: "Section B" },
                      ],
                    },
                    {
                      id: 2,
                      name: "Science 201",
                      sections: [
                        { id: 3, name: "Section A" },
                        { id: 4, name: "Section B" },
                      ],
                    },
                  ]}
                  darkMode={darkMode}
                />
              )}

              {/* Content for Scheduling Tab */}
              {activeTab === "scheduling" && (
                <SchedulingTools
                  scheduledNotifications={scheduledNotifications}
                  onAddNotification={handleAddNotification}
                  darkMode={darkMode}
                />
              )}

              {/* Content for Timetable Tab */}
              {activeTab === "timetable" && (
                <TimeTableGenerator
                  timeTables={timeTables}
                  onAddTimeTable={handleAddTimeTable}
                  darkMode={darkMode}
                />
              )}

              {/* Content for Announcements Tab */}
              {activeTab === "announcements" && (
                <AnnouncementsManager
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                  darkMode={darkMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .p-6 {
            padding: 1rem;
          }
          /* Ensure our fixed elements aren't covered by content */
          .fixed {
            position: fixed !important;
          }
          .z-50 {
            z-index: 50 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .p-6,
          .md\\:p-8 {
            padding: 1.5rem;
          }
          .tablet\\:grid-cols-1 {
            grid-template-columns: 1fr;
          }
          .tablet\\:col-span-1 {
            grid-column: span 1 / span 1;
          }
          .flex-1 {
            margin-left: ${navExpanded ? "330px" : "100px"};
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherCalendar;
