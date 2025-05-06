// File: components/calendar/TeacherCalendarView.jsx
import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalenderHeader";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import MonthView from "./views/MonthView";
import QuarterView from "./views/QuarterView";
import YearView from "./views/YearView";
import EventModal from "./modals/EventModal";
import ViewEventModal from "./modals/ViewEventModal";
import UpcomingEvents from "./UpcomingEvents";
import { getEventColorClass } from "../../../../utils/eventUtils";
import { getDateHelpers } from "../../../../utils/dateUtils";

const TeacherCalendarView = ({
  events = [], // Add default empty array
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  classes = [], // Array of classes the teacher teaches
}) => {
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Get date helpers
  const {
    getHeaderTitle,
    navigatePrevious,
    navigateNext,
    getEventsForCurrentDay,
    getEventsForCurrentWeek,
    getDaysOfWeek,
    getDaysOfMonth,
    getMonthsOfYear,
    getQuartersOfYear,
    getEventsForDay,
    getEventsForMonth,
    getEventsForQuarter,
  } = getDateHelpers(currentDate, currentView, filteredEvents);

  // Form state for new event
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    startDate: "",
    endDate: "",
    start: "",
    end: "",
    allDay: false,
    type: "event",
    priority: "medium",
    description: "",
    eventScope: "personal", // New field for event scope: 'personal' or 'student'
    targetClass: "", // New field for target class
    targetSection: "", // New field for target section
  });

  // Update filtered events when events change or filters change
  useEffect(() => {
    // Ensure events is an array before attempting to spread it
    const eventsArray = Array.isArray(events) ? events : [];
    let filtered = [...eventsArray];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType]);

  // Handle opening the event modal for a new event
  const handleAddEventClick = () => {
    // Set default date to current date in yyyy-MM-dd format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    setEventForm({
      title: "",
      date: formattedDate,
      startDate: formattedDate,
      endDate: formattedDate,
      start: "09:00",
      end: "10:00",
      allDay: false,
      type: "event",
      priority: "medium",
      description: "",
      eventScope: "personal", // Default to personal event
      targetClass: "",
      targetSection: "",
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };

  // Handle opening the event modal for editing an existing event
  const handleEditEvent = (event) => {
    const eventToEdit = { ...event };

    // Format date for the form (yyyy-MM-dd)
    if (event.date) {
      const dateObj = new Date(event.date);
      eventToEdit.date = dateObj.toISOString().split("T")[0];
    }

    if (event.startDate) {
      const startDateObj = new Date(event.startDate);
      eventToEdit.startDate = startDateObj.toISOString().split("T")[0];
    }

    if (event.endDate) {
      const endDateObj = new Date(event.endDate);
      eventToEdit.endDate = endDateObj.toISOString().split("T")[0];
    }

    // Ensure event scope fields exist
    eventToEdit.eventScope = event.eventScope || "personal";
    eventToEdit.targetClass = event.targetClass || "";
    eventToEdit.targetSection = event.targetSection || "";

    setEventForm(eventToEdit);
    setIsEditMode(true);
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear section when class changes
    if (name === "targetClass") {
      setEventForm((prev) => ({
        ...prev,
        targetSection: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmitEvent = () => {
    const eventData = { ...eventForm };

    // Process the form data
    if (isEditMode) {
      onEditEvent({ ...selectedEvent, ...eventData });
    } else {
      onAddEvent(eventData);
    }

    // Close the modal
    setShowEventModal(false);
  };

  // Handle event click to view details
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowViewEventModal(true);
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setShowViewEventModal(false);
    }
  };

  // Set to today
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Get sections for a selected class
  const getSectionsForClass = (classId) => {
    const selectedClass = classes.find((c) => c.id === classId);
    return selectedClass ? selectedClass.sections || [] : [];
  };

  // Render the calendar content with all components
  const renderCalendarContent = () => {
  return (
    <>
      {/* Calendar Controls */}
      <CalendarHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentDate={currentDate}
        headerTitle={getHeaderTitle()}
        navigatePrevious={navigatePrevious}
        navigateNext={navigateNext}
        handleTodayClick={handleTodayClick}
        handleAddEventClick={handleAddEventClick}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Calendar Content */}
      <div className="mb-6">
        {currentView === "day" && (
          <DayView
            currentDate={currentDate}
            events={getEventsForCurrentDay()}
            handleEventClick={handleEventClick}
            getEventColorClass={getEventColorClass}
          />
        )}
        {currentView === "week" && (
          <WeekView
            days={getDaysOfWeek()}
            filteredEvents={filteredEvents}
            handleEventClick={handleEventClick}
            getEventColorClass={getEventColorClass}
          />
        )}
        {currentView === "month" && (
          <MonthView
            days={getDaysOfMonth()}
            getEventsForDay={getEventsForDay}
            handleEventClick={handleEventClick}
            getEventColorClass={getEventColorClass}
            filteredEvents={filteredEvents}
          />
        )}
        {currentView === "quarter" && (
          <QuarterView
            quarters={getQuartersOfYear()}
            currentDate={currentDate}
            getEventsForMonth={getEventsForMonth}
            handleEventClick={handleEventClick}
            getEventColorClass={getEventColorClass}
          />
        )}
        {currentView === "year" && (
          <YearView
            months={getMonthsOfYear()}
            getEventsForMonth={getEventsForMonth}
            setCurrentDate={setCurrentDate}
            setCurrentView={setCurrentView}
          />
        )}
      </div>

      {/* Upcoming Events Section */}
      <UpcomingEvents
        filteredEvents={filteredEvents}
        handleEventClick={handleEventClick}
        getEventColorClass={getEventColorClass}
      />

      {/* Event Modals */}
      {showEventModal && (
        <EventModal
          eventForm={eventForm}
          setEventForm={setEventForm}
          isEditMode={isEditMode}
          handleInputChange={handleInputChange}
          handleSubmitEvent={handleSubmitEvent}
          setShowEventModal={setShowEventModal}
          classes={classes}
          getSectionsForClass={getSectionsForClass}
        />
      )}

      {showViewEventModal && selectedEvent && (
        <ViewEventModal
          selectedEvent={selectedEvent}
          setShowViewEventModal={setShowViewEventModal}
          handleDeleteEvent={handleDeleteEvent}
          handleEditEvent={handleEditEvent}
          classes={classes}
        />
      )}
    </>
  );
  };

  return renderCalendarContent();
};

export default TeacherCalendarView;
