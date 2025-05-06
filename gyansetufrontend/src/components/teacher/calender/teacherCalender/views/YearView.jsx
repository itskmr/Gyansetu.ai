// File: components/calendar/views/YearView.jsx
import React from "react";
import { Users } from "lucide-react";

const YearView = ({
  months,
  getEventsForMonth,
  setCurrentDate,
  setCurrentView,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {months[0].year}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {months.map((month) => {
          const eventsForMonth = getEventsForMonth(month.year, month.index);
          const eventCount = eventsForMonth.length;
          const studentEventCount = eventsForMonth.filter(
            (e) => e.eventScope === "student"
          ).length;

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
                {studentEventCount > 0 && (
                  <div className="text-xs text-blue-600 mt-1 flex items-center justify-center">
                    <Users size={12} className="mr-1" />
                    {studentEventCount} for students
                  </div>
                )}
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

export default YearView;
