// File: components/calendar/UpcomingEvents.jsx
import React from "react";
import { Calendar } from "lucide-react";
import EventTypeBadge from "./badges/EventTypeBadge";

const UpcomingEvents = ({
  filteredEvents = [],
  handleEventClick,
  getEventColorClass,
}) => {
  // Add default empty array if filteredEvents is undefined
  const events = Array.isArray(filteredEvents) ? filteredEvents : [];
  
  const upcomingEvents = events
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
    .slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Upcoming Events
      </h3>
      <div className="space-y-2">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer ${getEventColorClass(
                event.type,
                event.eventScope
              )}`}
              onClick={() => handleEventClick(event)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{event.title}</h4>
                <div>
                  <EventTypeBadge type={event.type} />
                </div>
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
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            No upcoming events
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
