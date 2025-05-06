// File: components/calendar/modals/ViewEventModal.jsx
import React from "react";
import { X, Edit, Trash2 } from "lucide-react";
import EventTypeBadge from "../badges/EventTypeBadge";
import PriorityBadge from "../badges/PriorityBadge";
import EventScopeBadge from "../badges/EventScopeBadge";

const ViewEventModal = ({
  selectedEvent,
  setShowViewEventModal,
  handleDeleteEvent,
  handleEditEvent,
  classes,
}) => {
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
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <EventTypeBadge type={selectedEvent.type} />
                <PriorityBadge priority={selectedEvent.priority} />
                <EventScopeBadge
                  eventScope={selectedEvent.eventScope}
                  targetClass={selectedEvent.targetClass}
                  targetSection={selectedEvent.targetSection}
                />
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

              {selectedEvent.eventScope === "student" && (
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-500">
                    Shared with:
                  </span>
                  <div className="text-sm">
                    {classes.find((c) => c.id === selectedEvent.targetClass)
                      ?.name || selectedEvent.targetClass}
                    {selectedEvent.targetSection
                      ? `, Section ${selectedEvent.targetSection}`
                      : " (All Sections)"}
                  </div>
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

export default ViewEventModal;
