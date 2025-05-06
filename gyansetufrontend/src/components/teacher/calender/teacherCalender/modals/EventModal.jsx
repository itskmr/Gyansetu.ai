import React from "react";
import { X, UserCircle, Users, Calendar, Clock } from "lucide-react";

const EventModal = ({
  eventForm,
  setEventForm,
  isEditMode,
  handleInputChange,
  handleSubmitEvent,
  setShowEventModal,
  classes,
  getSectionsForClass,
}) => {
  // Get available sections for the selected class
  const availableSections = eventForm.targetClass
    ? getSectionsForClass(eventForm.targetClass)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit Event" : "Add New Event"}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowEventModal(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Event Title and Type in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Event Scope and Priority + Duration Options in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event Scope Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Scope
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="eventScope"
                    value="personal"
                    checked={eventForm.eventScope === "personal"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <UserCircle size={18} className="mr-1" />
                    Personal
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="eventScope"
                    value="student"
                    checked={eventForm.eventScope === "student"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <Users size={18} className="mr-1" />
                    Student
                  </span>
                </label>
              </div>
            </div>

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

            {/* Event Duration Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="all-day"
                    name="allDay"
                    checked={eventForm.allDay}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="all-day" className="text-sm text-gray-700">
                    All-day
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="multi-day"
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
                  <label htmlFor="multi-day" className="text-sm text-gray-700">
                    Multi-day
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Class and Section Selection (only when eventScope is student) */}
          {eventForm.eventScope === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Class
                </label>
                <select
                  name="targetClass"
                  value={eventForm.targetClass}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={eventForm.eventScope === "student"}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {eventForm.targetClass && availableSections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Section (Optional)
                  </label>
                  <select
                    name="targetSection"
                    value={eventForm.targetSection}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All sections</option>
                    {availableSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Date and Description in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {!eventForm.allDay && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="inline mr-1" />
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
                  <Clock size={16} className="inline mr-1" />
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
        </div>

        <div className="mt-8 flex justify-end space-x-4 border-t pt-4">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
            onClick={() => setShowEventModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            onClick={handleSubmitEvent}
            disabled={
              eventForm.eventScope === "student" && !eventForm.targetClass
            }
          >
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
