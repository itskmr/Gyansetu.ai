// File: components/EventsTable.jsx
import React from "react";
import EventTypeBadge from "./EventTypeBadge";
import StatusBadge from "./StatusBadge";
import TableActions from "./TableActions";

const EventsTable = ({ activeTab, events }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Event
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Classes
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{event.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-500">{event.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <EventTypeBadge type={event.type} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {event.classes.length > 2
                    ? `${event.classes[0]}, ${event.classes[1]} +${
                        event.classes.length - 2
                      } more`
                    : event.classes.join(", ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={event.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <TableActions activeTab={activeTab} status={event.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No events found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsTable;
