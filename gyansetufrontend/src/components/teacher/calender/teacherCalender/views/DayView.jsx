// File: components/calendar/views/DayView.jsx
import React from "react";
import EventScopeBadge from "../badges/EventScopeBadge";
import EventTypeBadge from "../badges/EventTypeBadge";

const DayView = ({
  currentDate,
  events,
  handleEventClick,
  getEventColorClass,
}) => {
  // Generate hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Filter events for the current time slots
  const getEventsAtHour = (hour) => {
    return events.filter((event) => {
      if (event.allDay) return false;
      if (!event.start) return false;

      const eventHour = parseInt(event.start.split(":")[0]);
      return eventHour === hour;
    });
  };

  // Get all-day events
  const allDayEvents = events.filter((event) => event.allDay);

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
          const eventsAtHour = getEventsAtHour(hour);

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
                      event.type,
                      event.eventScope
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
                    {event.eventScope === "student" && (
                      <div className="text-xs mt-1">
                        <EventScopeBadge
                          eventScope={event.eventScope}
                          targetClass={event.targetClass}
                          targetSection={event.targetSection}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* All-day events section */}
        {allDayEvents.length > 0 && (
          <div className="flex border-b border-t mt-4">
            <div className="w-20 p-2 text-right text-sm text-gray-500 border-r bg-gray-50">
              All Day
            </div>
            <div className="flex-1 p-2">
              {allDayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-2 mb-1 rounded border ${getEventColorClass(
                    event.type,
                    event.eventScope
                  )} cursor-pointer`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="flex space-x-1 mt-1">
                    <EventTypeBadge type={event.type} />
                    <EventScopeBadge
                      eventScope={event.eventScope}
                      targetClass={event.targetClass}
                      targetSection={event.targetSection}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
