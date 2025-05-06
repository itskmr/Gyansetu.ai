// File: components/calendar/views/WeekView.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

const WeekView = ({
  days,
  filteredEvents,
  handleEventClick,
  getEventColorClass,
}) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
  const [visibleDays, setVisibleDays] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize the days array to prevent unnecessary re-renders
  const memoizedDays = useMemo(() => days, [JSON.stringify(days)]);

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup function
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Set visible days based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile, show only one day at a time
      setVisibleDays(memoizedDays.slice(currentDayIndex, currentDayIndex + 1));
    } else {
      // On desktop, show all days
      setVisibleDays(memoizedDays);
    }
  }, [memoizedDays, currentDayIndex, isMobile]);

  // Handle day navigation for mobile view
  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const goToNextDay = () => {
    if (currentDayIndex < memoizedDays.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  // Helper to check if event is at specific day and hour
  const getEventsForTimeSlot = (day, hour) => {
    if (!filteredEvents || !Array.isArray(filteredEvents)) {
      return [];
    }
    
    return filteredEvents.filter((event) => {
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
  };

  // Helper to get all-day events for a specific day
  const getAllDayEventsForDay = (day) => {
    if (!filteredEvents || !Array.isArray(filteredEvents)) {
      return [];
    }
    
    return filteredEvents.filter((event) => {
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
  };

  // Dynamic column classes based on viewport size
  const gridColsClass = isMobile
    ? "grid-cols-2" // Time column + 1 day column for mobile
    : "grid-cols-8"; // Time column + 7 day columns for desktop (matching the original layout)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      {/* Mobile navigation controls */}
      {isMobile && (
        <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
          <button
            onClick={goToPreviousDay}
            disabled={currentDayIndex === 0}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <div className="font-medium">{visibleDays[0]?.name}</div>
            <div className="text-sm text-gray-500">
              {visibleDays[0]?.month} {visibleDays[0]?.date}
            </div>
          </div>
          <button
            onClick={goToNextDay}
            disabled={currentDayIndex === days.length - 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Day headers - Only shown on desktop */}
      {!isMobile && (
        <div className={`grid ${gridColsClass} border-b`}>
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
      )}

      {/* Time slots */}
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: isMobile ? "calc(100vh - 200px)" : "calc(100vh - 250px)",
        }}
      >
        {hours.map((hour) => (
          <div key={hour} className={`grid ${gridColsClass} border-b`}>
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
            {visibleDays.map((day, dayIndex) => {
              const eventsForThisTime = getEventsForTimeSlot(day, hour);
              const isToday =
                new Date().toDateString() === day.full.toDateString();

              return (
                <div
                  key={dayIndex}
                  className={`h-20 border-r last:border-r-0 relative p-1 ${
                    isToday ? "bg-blue-50 bg-opacity-30" : ""
                  }`}
                >
                  {eventsForThisTime.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`absolute inset-x-1 rounded-md border px-2 py-1 overflow-hidden cursor-pointer ${getEventColorClass(
                        event.type,
                        event.eventScope
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
                      {event.eventScope === "student" && (
                        <div className="flex items-center mt-1">
                          <Users size={10} className="mr-1" />
                          <span className="text-xs truncate">
                            {event.targetClass}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* All-day events row */}
        <div className={`grid ${gridColsClass} border-b`}>
          <div className="border-r px-2 py-1 bg-gray-50 flex items-center justify-center">
            <div className="text-xs font-medium text-gray-500">All Day</div>
          </div>

          {visibleDays.map((day, dayIndex) => {
            const allDayEvents = getAllDayEventsForDay(day);
            const isToday =
              new Date().toDateString() === day.full.toDateString();

            return (
              <div
                key={dayIndex}
                className={`border-r last:border-r-0 relative p-1 ${
                  isToday ? "bg-blue-50 bg-opacity-30" : ""
                }`}
                style={{
                  minHeight: allDayEvents.length > 0 ? "80px" : "40px",
                }}
              >
                {allDayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`mb-1 rounded-md border px-2 py-1 overflow-hidden cursor-pointer ${getEventColorClass(
                      event.type,
                      event.eventScope
                    )}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium text-sm truncate">
                      {event.title}
                    </div>
                    {event.eventScope === "student" && (
                      <div className="flex items-center mt-1">
                        <Users size={10} className="mr-1" />
                        <span className="text-xs truncate">
                          {event.targetClass}
                        </span>
                      </div>
                    )}
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

export default WeekView;
