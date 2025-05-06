// File: components/calendar/views/MonthView.jsx
import React from "react";
import { Users } from "lucide-react";

const MonthView = ({
  days,
  getEventsForDay,
  handleEventClick,
  getEventColorClass,
}) => {
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
          const isToday = new Date().toDateString() === day.full.toDateString();
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
                      event.type,
                      event.eventScope
                    )}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center">
                      {event.title}
                      {event.eventScope === "student" && (
                        <Users size={10} className="ml-1 shrink-0" />
                      )}
                    </div>
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

export default MonthView;
