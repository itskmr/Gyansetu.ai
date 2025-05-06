import React, { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  AlertTriangle,
  Plus,
  Filter,
} from "lucide-react";

const TeacherTimetable = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showConflictAlert, setShowConflictAlert] = useState(false);

  // Sample data for timetable
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
  ];

  const timetableData = [
    {
      id: 1,
      day: "Monday",
      start: "08:00",
      end: "09:00",
      title: "Mathematics",
      class: "Grade 10-A",
      room: "Room 101",
      type: "class",
    },
    {
      id: 2,
      day: "Monday",
      start: "10:00",
      end: "11:00",
      title: "Mathematics",
      class: "Grade 9-B",
      room: "Room 203",
      type: "class",
    },
    {
      id: 3,
      day: "Monday",
      start: "13:00",
      end: "14:00",
      title: "Office Hours",
      class: "Faculty",
      room: "Staff Room",
      type: "office-hours",
    },
    {
      id: 4,
      day: "Tuesday",
      start: "09:00",
      end: "10:00",
      title: "Mathematics",
      class: "Grade 11-A",
      room: "Room 305",
      type: "class",
    },
    {
      id: 5,
      day: "Tuesday",
      start: "11:00",
      end: "12:00",
      title: "Department Meeting",
      class: "Faculty",
      room: "Conference Room",
      type: "meeting",
    },
    {
      id: 6,
      day: "Tuesday",
      start: "14:00",
      end: "16:00",
      title: "Math Club",
      class: "All Grades",
      room: "Room 101",
      type: "activity",
    },
    {
      id: 7,
      day: "Wednesday",
      start: "08:00",
      end: "09:00",
      title: "Mathematics",
      class: "Grade 10-B",
      room: "Room 102",
      type: "class",
    },
    {
      id: 8,
      day: "Wednesday",
      start: "10:00",
      end: "11:00",
      title: "Mathematics",
      class: "Grade 9-A",
      room: "Room 203",
      type: "class",
    },
    {
      id: 9,
      day: "Thursday",
      start: "09:00",
      end: "10:00",
      title: "Mathematics",
      class: "Grade 11-B",
      room: "Room 305",
      type: "class",
    },
    {
      id: 10,
      day: "Thursday",
      start: "13:00",
      end: "14:00",
      title: "Faculty Training",
      class: "Faculty",
      room: "Conference Room",
      type: "training",
    },
    {
      id: 11,
      day: "Friday",
      start: "08:00",
      end: "10:00",
      title: "Mathematics Exam",
      class: "Grade 10-A,B",
      room: "Hall A",
      type: "exam",
    },
    {
      id: 12,
      day: "Friday",
      start: "11:00",
      end: "12:00",
      title: "Office Hours",
      class: "Faculty",
      room: "Staff Room",
      type: "office-hours",
    },
    {
      id: 13,
      day: "Friday",
      start: "14:00",
      end: "15:00",
      title: "Parent Meeting",
      class: "Individual",
      room: "Room 101",
      type: "meeting",
    },
  ];

  // Filter timetable data based on selected day
  const filteredTimeslots = timetableData.filter(
    (item) => item.day === selectedDay
  );

  // Function to get event color based on type
  const getEventColor = (type) => {
    switch (type) {
      case "class":
        return "bg-blue-100 border-blue-400 text-blue-800";
      case "meeting":
        return "bg-purple-100 border-purple-400 text-purple-800";
      case "office-hours":
        return "bg-teal-100 border-teal-400 text-teal-800";
      case "activity":
        return "bg-green-100 border-green-400 text-green-800";
      case "training":
        return "bg-amber-100 border-amber-400 text-amber-800";
      case "exam":
        return "bg-red-100 border-red-400 text-red-800";
      default:
        return "bg-gray-100 border-gray-400 text-gray-800";
    }
  };

  // Open add event modal
  const handleAddEvent = () => {
    setShowAddEventModal(true);

    // Simulate conflict detection after a short delay for demo
    setTimeout(() => {
      setShowConflictAlert(true);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Weekly Timetable
          </h2>

          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
              onClick={handleAddEvent}
            >
              <Plus size={16} className="mr-1" />
              Add Free Slot Activity
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 text-sm font-medium">
              Print Timetable
            </button>
          </div>
        </div>

        {/* Day Selection */}
        <div className="flex border-b border-gray-200 mb-4">
          {weekdays.map((day) => (
            <button
              key={day}
              className={`px-4 py-2 text-sm font-medium ${
                selectedDay === day
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Classes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Meetings</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Office Hours</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Activities</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Training</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
            <span className="text-sm text-gray-600">Exams</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="relative bg-white rounded-lg border border-gray-200">
          {/* Time column */}
          <div className="grid grid-cols-[80px_1fr] border-b border-gray-200">
            <div className="p-2 bg-gray-50 font-medium text-gray-700 border-r border-gray-200">
              Time
            </div>
            <div className="p-2 bg-gray-50 font-medium text-gray-700">
              {selectedDay}
            </div>
          </div>

          {/* Time slots */}
          {timeSlots.map((slot, index) => {
            // Find events for this time slot
            const events = filteredTimeslots.filter(
              (event) =>
                event.start === slot.start ||
                (event.start < slot.start && event.end > slot.start)
            );

            // Check if this is a lunch break
            const isLunchBreak = slot.start === "12:00";

            return (
              <div
                key={index}
                className={`grid grid-cols-[80px_1fr] border-b border-gray-200 ${
                  isLunchBreak ? "bg-gray-50" : ""
                }`}
              >
                <div className="p-2 text-sm text-gray-600 border-r border-gray-200">
                  {slot.start} - {slot.end}
                </div>
                <div className="p-2 relative min-h-16">
                  {events.length > 0 ? (
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-md border px-3 py-2 ${getEventColor(
                            event.type
                          )}`}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs">
                            {event.class} | {event.room}
                          </div>
                          <div className="text-xs">
                            {event.start} - {event.end}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isLunchBreak ? (
                    <div className="text-center py-2 text-gray-500">
                      Lunch Break
                    </div>
                  ) : (
                    <div
                      className="h-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      onClick={handleAddEvent}
                    >
                      <span className="text-sm text-gray-400">Free Slot</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add Activity to Free Slot
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowAddEventModal(false);
                  setShowConflictAlert(false);
                }}
              >
                ✕
              </button>
            </div>

            {/* Conflict Warning */}
            {showConflictAlert && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertTriangle
                  size={20}
                  className="text-red-600 mr-2 mt-0.5 flex-shrink-0"
                />
                <div>
                  <h4 className="font-medium text-red-800">
                    Schedule Conflict Detected!
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This slot overlaps with "Faculty Training" in Conference
                    Room on Thursday, 1:00 PM - 2:00 PM. Please choose a
                    different time or reschedule the conflicting event.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Simplified modal content for the example */}
              <p className="text-sm text-gray-600">
                This modal would contain fields for activity title, time
                selection, location, and other details.
              </p>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setShowAddEventModal(false);
                    setShowConflictAlert(false);
                  }}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Add to Timetable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
