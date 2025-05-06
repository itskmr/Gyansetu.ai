import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock,
  List,
  CalendarDays,
  CalendarClock,
  Calendar,
  X,
  Edit,
  Trash2,
  Info,
} from "lucide-react";

const CalendarView = ({ events, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showViewEventModal, setShowViewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
  });

  // Update filtered events when events change or filters change
  useEffect(() => {
    let filtered = [...events];

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

  // Get header title based on current view and date
  const getHeaderTitle = () => {
    if (currentView === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startMonth = startOfWeek.toLocaleDateString("en-US", {
        month: "short",
      });
      const endMonth = endOfWeek.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const year = startOfWeek.getFullYear();

      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    } else if (currentView === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (currentView === "quarter") {
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      return `Q${quarter} ${currentDate.getFullYear()}`;
    } else if (currentView === "year") {
      return currentDate.getFullYear().toString();
    }
    return "";
  };

  // Navigate to previous/next period
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (currentView === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (currentView === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === "quarter") {
      newDate.setMonth(currentDate.getMonth() - 3);
    } else if (currentView === "year") {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (currentView === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (currentView === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === "quarter") {
      newDate.setMonth(currentDate.getMonth() + 3);
    } else if (currentView === "year") {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

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

  // Get events for the current day
  const getEventsForCurrentDay = () => {
    const currentDateStr = currentDate.toISOString().split("T")[0];
    return filteredEvents.filter((event) => {
      // Single day event
      if (event.date) {
        return event.date === currentDateStr;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      }

      return false;
    });
  };

  // Get events for the current week
  const getEventsForCurrentWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return filteredEvents.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        // Check if there's any overlap with the current week
        return startDate <= endOfWeek && endDate >= startOfWeek;
      }

      return false;
    });
  };

  // Get days of the week for the week view
  const getDaysOfWeek = () => {
    const days = [];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: dayNames[i],
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        full: date,
        dateString: date.toISOString().split("T")[0],
      });
    }

    return days;
  };

  // Get days of the month for the month view
  const getDaysOfMonth = () => {
    const days = [];

    // Get the first day of the month
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Get last day of previous month
    const lastDayPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // Add days from previous month to fill first week
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(lastDayPrevMonth.getDate() - i);
      days.push({
        date: date.getDate(),
        month: date.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      days.push({
        date: i,
        month: currentDate.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: true,
      });
    }

    // Add days from next month to complete the grid (6 rows of 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      );
      days.push({
        date: i,
        month: date.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Get events for a specific day
  const getEventsForDay = (dateString) => {
    return filteredEvents.filter((event) => {
      // Single day event
      if (event.date) {
        return event.date === dateString;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        return dateString >= event.startDate && dateString <= event.endDate;
      }

      return false;
    });
  };

  // Get months of the year for the year view
  const getMonthsOfYear = () => {
    const months = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      months.push({
        name: monthNames[i],
        index: i,
        year: currentDate.getFullYear(),
        full: date,
      });
    }

    return months;
  };

  // Get quarters of the year for the quarter view
  const getQuartersOfYear = () => {
    const quarters = [];
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < 4; i++) {
      const startMonth = i * 3;
      const startDate = new Date(currentYear, startMonth, 1);
      const endDate = new Date(currentYear, startMonth + 3, 0);

      quarters.push({
        number: i + 1,
        startMonth: startMonth,
        endMonth: startMonth + 2,
        startDate: startDate,
        endDate: endDate,
        year: currentYear,
      });
    }

    return quarters;
  };

  // Get events for a specific month
  const getEventsForMonth = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return filteredEvents.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Check if there's any overlap with the month
        return eventStartDate <= endDate && eventEndDate >= startDate;
      }

      return false;
    });
  };

  // Get events for a specific quarter
  const getEventsForQuarter = (year, quarterStartMonth) => {
    const startDate = new Date(year, quarterStartMonth, 1);
    const endDate = new Date(year, quarterStartMonth + 3, 0);

    return filteredEvents.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Check if there's any overlap with the quarter
        return eventStartDate <= endDate && eventEndDate >= startDate;
      }

      return false;
    });
  };

  // Event type badge
  const getEventTypeBadge = (type) => {
    switch (type) {
      case "meeting":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
            Meeting
          </span>
        );
      case "conference":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
            Conference
          </span>
        );
      case "exam":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Exam
          </span>
        );
      case "event":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Event
          </span>
        );
      case "training":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
            Training
          </span>
        );
      case "holiday":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
            Holiday
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
    }
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Event color class
  const getEventColorClass = (type) => {
    switch (type) {
      case "meeting":
        return "bg-purple-100 border-purple-400 hover:bg-purple-200";
      case "conference":
        return "bg-indigo-100 border-indigo-400 hover:bg-indigo-200";
      case "exam":
        return "bg-red-100 border-red-400 hover:bg-red-200";
      case "event":
        return "bg-green-100 border-green-400 hover:bg-green-200";
      case "training":
        return "bg-blue-100 border-blue-400 hover:bg-blue-200";
      case "holiday":
        return "bg-amber-100 border-amber-400 hover:bg-amber-200";
      default:
        return "bg-gray-100 border-gray-400 hover:bg-gray-200";
    }
  };

  // Render day view
  const renderDayView = () => {
    const eventsForDay = getEventsForCurrentDay();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-full">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {hours.map((hour) => {
            const eventsAtHour = eventsForDay.filter((event) => {
              if (event.allDay) return false;
              if (!event.start) return false;

              const eventHour = parseInt(event.start.split(":")[0]);
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex border-b">
                <div className="w-20 p-2 text-right text-sm text-gray-500 border-r bg-gray-50">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </div>
                <div className="flex-1 min-h-16 p-1 relative">
                  {eventsAtHour.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 mb-1 rounded border ${getEventColorClass(
                        event.type
                      )} cursor-pointer`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs">
                        {event.start && event.end
                          ? `${event.start} - ${event.end}`
                          : event.start
                          ? `${event.start}`
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* All-day events section */}
          {eventsForDay.some((event) => event.allDay) && (
            <div className="flex border-b border-t mt-4">
              <div className="w-20 p-2 text-right text-sm text-gray-500 border-r bg-gray-50">
                All Day
              </div>
              <div className="flex-1 p-2">
                {eventsForDay
                  .filter((event) => event.allDay)
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 mb-1 rounded border ${getEventColorClass(
                        event.type
                      )} cursor-pointer`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium">{event.title}</div>
                      {getEventTypeBadge(event.type)}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = getDaysOfWeek();
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-full">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="py-2 px-2 text-center border-r bg-gray-50">
            <div className="font-medium">&nbsp;</div>
          </div>
          {days.map((day, index) => {
            const isToday =
              new Date().toDateString() === day.full.toDateString();
            return (
              <div
                key={index}
                className={`py-2 px-2 text-center border-r last:border-r-0 ${
                  isToday ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-medium">{day.name}</div>
                <div className="text-sm text-gray-500">
                  {day.month} {day.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              {/* Time label */}
              <div className="border-r px-2 py-1 bg-gray-50 flex items-center justify-center">
                <div className="text-xs font-medium text-gray-500">
                  {hour === 12
                    ? "12 PM"
                    : hour < 12
                    ? `${hour} AM`
                    : `${hour - 12} PM`}
                </div>
              </div>

              {/* Day columns */}
              {days.map((day, dayIndex) => {
                const eventsForThisTime = filteredEvents.filter((event) => {
                  if (event.allDay) return false;
                  if (!event.date && !event.startDate) return false;

                  // Check if event is on this day
                  const isOnThisDay =
                    event.date === day.dateString ||
                    (event.startDate &&
                      event.endDate &&
                      day.dateString >= event.startDate &&
                      day.dateString <= event.endDate);

                  if (!isOnThisDay) return false;

                  // Check if event is at this hour
                  if (!event.start) return false;
                  const eventHour = parseInt(event.start.split(":")[0]);
                  return eventHour === hour;
                });

                return (
                  <div
                    key={dayIndex}
                    className="h-20 border-r last:border-r-0 relative p-1"
                  >
                    {eventsForThisTime.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`absolute inset-x-1 rounded-md border px-2 py-1 overflow-hidden cursor-pointer ${getEventColorClass(
                          event.type
                        )}`}
                        style={{ top: "4px", minHeight: "40px" }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium text-sm truncate">
                          {event.title}
                        </div>
                        <div className="text-xs truncate">
                          {event.start && event.end
                            ? `${event.start} - ${event.end}`
                            : event.start
                            ? `${event.start}`
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}

          {/* All-day events row */}
          <div className="grid grid-cols-8 border-b">
            <div className="border-r px-2 py-1 bg-gray-50 flex items-center justify-center">
              <div className="text-xs font-medium text-gray-500">All Day</div>
            </div>

            {days.map((day, dayIndex) => {
              const allDayEvents = filteredEvents.filter((event) => {
                if (!event.allDay) return false;

                // Check if event is on this day
                return (
                  event.date === day.dateString ||
                  (event.startDate &&
                    event.endDate &&
                    day.dateString >= event.startDate &&
                    day.dateString <= event.endDate)
                );
              });

              return (
                <div
                  key={dayIndex}
                  className="border-r last:border-r-0 relative p-1"
                  style={{
                    minHeight: allDayEvents.length > 0 ? "80px" : "40px",
                  }}
                >
                  {allDayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`mb-1 rounded-md border px-2 py-1 overflow-hidden cursor-pointer ${getEventColorClass(
                        event.type
                      )}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-medium text-sm truncate">
                        {event.title}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const days = getDaysOfMonth();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-full">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {dayLabels.map((day, index) => (
            <div
              key={index}
              className="py-2 px-2 text-center border-r last:border-r-0 bg-gray-50"
            >
              <div className="font-medium">{day}</div>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isToday =
              new Date().toDateString() === day.full.toDateString();
            const eventsForDay = getEventsForDay(day.dateString);

            return (
              <div
                key={index}
                className={`border-r border-b p-1 ${
                  day.isCurrentMonth ? "" : "bg-gray-50"
                } ${isToday ? "bg-blue-50" : ""}`}
                style={{ minHeight: "100px" }}
              >
                <div
                  className={`text-right text-sm mb-1 ${
                    day.isCurrentMonth ? "font-medium" : "text-gray-400"
                  }`}
                >
                  {day.date}
                </div>

                <div className="space-y-1 max-h-32 overflow-auto">
                  {eventsForDay.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${getEventColorClass(
                        event.type
                      )}`}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}

                  {eventsForDay.length > 3 && (
                    <div className="text-xs text-center text-blue-600 cursor-pointer hover:underline">
                      +{eventsForDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render quarter view
  const renderQuarterView = () => {
    const quarters = getQuartersOfYear();
    const currentQuarter = Math.floor(currentDate.getMonth() / 3);

    // Get the current quarter
    const quarter = quarters[currentQuarter];

    // Get months in the quarter
    const months = [];
    for (let i = quarter.startMonth; i <= quarter.endMonth; i++) {
      const date = new Date(quarter.year, i, 1);
      months.push({
        name: date.toLocaleDateString("en-US", { month: "long" }),
        index: i,
        year: quarter.year,
      });
    }

    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Q{quarter.number} {quarter.year} (
            {months.map((m) => m.name).join(", ")})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {months.map((month) => {
            const eventsForMonth = getEventsForMonth(month.year, month.index);

            return (
              <div
                key={month.index}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-2 border-b">
                  <h3 className="font-medium text-gray-700">{month.name}</h3>
                </div>

                <div className="p-2 max-h-96 overflow-y-auto">
                  {eventsForMonth.length > 0 ? (
                    <div className="space-y-2">
                      {eventsForMonth.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded border cursor-pointer ${getEventColorClass(
                            event.type
                          )}`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium text-sm">
                            {event.title}
                          </div>
                          <div className="text-xs">
                            {event.date ||
                              (event.startDate && event.endDate
                                ? `${event.startDate} to ${event.endDate}`
                                : "")}
                          </div>
                          <div className="mt-1 flex items-center space-x-1">
                            {getEventTypeBadge(event.type)}
                            {getPriorityBadge(event.priority)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      No events in {month.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render year view
  const renderYearView = () => {
    const months = getMonthsOfYear();

    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {months.map((month) => {
            const eventsForMonth = getEventsForMonth(month.year, month.index);
            const eventCount = eventsForMonth.length;

            return (
              <div
                key={month.index}
                className="border rounded-lg overflow-hidden cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  setCurrentDate(new Date(month.year, month.index, 1));
                  setCurrentView("month");
                }}
              >
                <div className="bg-gray-50 p-2 border-b">
                  <h3 className="font-medium text-gray-700">{month.name}</h3>
                </div>

                <div className="p-3 text-center">
                  <div className="font-bold text-2xl text-blue-600">
                    {eventCount}
                  </div>
                  <div className="text-sm text-gray-500">Events</div>
                </div>

                <div className="px-3 pb-3">
                  {eventsForMonth.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Top event types:
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.from(new Set(eventsForMonth.map((e) => e.type)))
                          .slice(0, 3)
                          .map((type) => (
                            <span
                              key={type}
                              className={`px-1.5 py-0.5 rounded-full ${
                                type === "meeting"
                                  ? "bg-purple-100 text-purple-800"
                                  : type === "exam"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {type}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render event form modal
  const renderEventModal = () => {
    if (!showEventModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {isEditMode ? "Edit Event" : "Add New Event"}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowEventModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="type"
                value={eventForm.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="event">Event</option>
                <option value="meeting">Meeting</option>
                <option value="conference">Conference</option>
                <option value="exam">Exam</option>
                <option value="training">Training</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={eventForm.allDay}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">All-day event</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMultiDay"
                  checked={!!eventForm.startDate}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEventForm((prev) => ({
                        ...prev,
                        startDate:
                          prev.date || new Date().toISOString().split("T")[0],
                        endDate:
                          prev.date || new Date().toISOString().split("T")[0],
                        date: undefined,
                      }));
                    } else {
                      setEventForm((prev) => ({
                        ...prev,
                        date:
                          prev.startDate ||
                          new Date().toISOString().split("T")[0],
                        startDate: undefined,
                        endDate: undefined,
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Multi-day event</span>
              </label>
            </div>

            {eventForm.startDate ? (
              // Multi-day event date inputs
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={eventForm.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={eventForm.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              // Single day event date input
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventForm.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {!eventForm.allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start"
                    value={eventForm.start}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end"
                    value={eventForm.end}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={eventForm.priority}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Add a description..."
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              onClick={() => setShowEventModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              onClick={handleSubmitEvent}
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render event details modal
  const renderViewEventModal = () => {
    if (!showViewEventModal || !selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Event Details</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowViewEventModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedEvent.title}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  {getEventTypeBadge(selectedEvent.type)}
                  {getPriorityBadge(selectedEvent.priority)}
                </div>
              </div>
            </div>

            <div className="border-t border-b py-3">
              <div className="grid grid-cols-2 gap-4">
                {selectedEvent.date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Date:
                    </span>
                    <div className="text-sm">{selectedEvent.date}</div>
                  </div>
                )}

                {selectedEvent.startDate && selectedEvent.endDate && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      Date Range:
                    </span>
                    <div className="text-sm">
                      {selectedEvent.startDate} to {selectedEvent.endDate}
                    </div>
                  </div>
                )}

                {selectedEvent.start && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Start Time:
                    </span>
                    <div className="text-sm">{selectedEvent.start}</div>
                  </div>
                )}

                {selectedEvent.end && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      End Time:
                    </span>
                    <div className="text-sm">{selectedEvent.end}</div>
                  </div>
                )}

                {selectedEvent.allDay && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      Duration:
                    </span>
                    <div className="text-sm">All Day</div>
                  </div>
                )}
              </div>
            </div>

            {selectedEvent.description && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Description:
                </span>
                <p className="text-sm mt-1">{selectedEvent.description}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
              onClick={handleDeleteEvent}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              onClick={() => {
                setShowViewEventModal(false);
                handleEditEvent(selectedEvent);
              }}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render filter menu
  const renderFilterMenu = () => {
    if (!showFilterMenu) return null;

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

  return (
    <>
      {/* Calendar Controls */}
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
              onClick={navigatePrevious}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold mx-2">{getHeaderTitle()}</h2>
            <button
              className="p-2 ml-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              onClick={navigateNext}
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
              {renderFilterMenu()}
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

      {/* Calendar Content */}
      <div className="mb-6">
        {currentView === "day" && renderDayView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "month" && renderMonthView()}
        {currentView === "quarter" && renderQuarterView()}
        {currentView === "year" && renderYearView()}
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Upcoming Events
        </h3>
        <div className="space-y-2">
          {filteredEvents
            .filter((event) => {
              const eventDate = event.date
                ? new Date(event.date)
                : event.startDate
                ? new Date(event.startDate)
                : null;
              if (!eventDate) return false;

              const now = new Date();
              return eventDate >= now;
            })
            .sort((a, b) => {
              const dateA = a.date ? new Date(a.date) : new Date(a.startDate);
              const dateB = b.date ? new Date(b.date) : new Date(b.startDate);
              return dateA - dateB;
            })
            .slice(0, 5)
            .map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border cursor-pointer ${getEventColorClass(
                  event.type
                )}`}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <div>{getEventTypeBadge(event.type)}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {event.date ||
                    (event.startDate && event.endDate
                      ? `${event.startDate} to ${event.endDate}`
                      : "")}
                  {event.start && event.end && !event.allDay && (
                    <span className="ml-3">
                      {event.start} - {event.end}
                    </span>
                  )}
                  {event.allDay && <span className="ml-3">All Day</span>}
                </div>
              </div>
            ))}

          {filteredEvents.filter((event) => {
            const eventDate = event.date
              ? new Date(event.date)
              : event.startDate
              ? new Date(event.startDate)
              : null;
            if (!eventDate) return false;

            const now = new Date();
            return eventDate >= now;
          }).length === 0 && (
            <div className="text-center text-gray-500 p-4">
              No upcoming events
            </div>
          )}
        </div>
      </div>

      {/* Event Modals */}
      {renderEventModal()}
      {renderViewEventModal()}
    </>
  );
};

export default CalendarView;
