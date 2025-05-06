import React from "react";
import EventTypeBadge from "../badges/EventTypeBadge";
import PriorityBadge from "../badges/PriorityBadge";
import EventScopeBadge from "../badges/EventScopeBadge";

const QuarterView = ({
  quarters,
  currentDate,
  getEventsForMonth,
  handleEventClick,
  getEventColorClass,
}) => {
  // Get the current quarter
  const currentQuarter = Math.floor(currentDate.getMonth() / 3);
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
                          event.type,
                          event.eventScope
                        )}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs">
                          {event.date ||
                            (event.startDate && event.endDate
                              ? `${event.startDate} to ${event.endDate}`
                              : "")}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <EventTypeBadge type={event.type} />
                          <PriorityBadge priority={event.priority} />
                          <EventScopeBadge
                            eventScope={event.eventScope}
                            targetClass={event.targetClass}
                            targetSection={event.targetSection}
                          />
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

export default QuarterView;
