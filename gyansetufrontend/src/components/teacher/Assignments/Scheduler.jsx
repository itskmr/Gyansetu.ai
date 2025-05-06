import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  AlertCircle,
} from "lucide-react";

export default function SubjectScheduler() {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [scheduleType, setScheduleType] = useState("immediate");

  // Mock data for available classes
  const availableClasses = [
    { id: 1, name: "Algebra I", period: "1st Period", students: 28 },
    { id: 2, name: "Algebra I", period: "3rd Period", students: 25 },
    { id: 3, name: "Geometry", period: "2nd Period", students: 24 },
    { id: 4, name: "Pre-Calculus", period: "4th Period", students: 22 },
    { id: 5, name: "AP Calculus", period: "5th Period", students: 18 },
  ];

  // Mock data for subjects
  const subjects = [
    "Mathematics",
    "Science",
    "Language Arts",
    "Social Studies",
    "Foreign Language",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "History",
    "Geography",
    "Economics",
  ];

  // Handle class selection
  const toggleClassSelection = (classId) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-1 text-purple-800">
        Class & Scheduling
      </h2>
      <p className="text-gray-500 mb-8">
        Set subject, classes, and scheduling options
      </p>

      {/* Subject Selection */}
      <div className="mb-10 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Subject & Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Subject
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <select className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                {subjects.map((subject, index) => (
                  <option
                    key={index}
                    value={subject.toLowerCase().replace(" ", "-")}
                  >
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <select className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option>Elementary School</option>
                <option>Middle School</option>
                <option selected>High School</option>
                <option>College</option>
                <option>Professional Development</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., quadratic equations, word problems, assessment"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate tags with commas. These help with searching and
            organization.
          </p>
        </div>
      </div>

      {/* Class Selection */}
      <div className="mb-10 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Class Selection
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Classes to Assign
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
            {availableClasses.map((cls) => (
              <div
                key={cls.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedClasses.includes(cls.id)
                    ? "bg-purple-100 border-purple-300"
                    : "bg-white border-gray-200 hover:border-purple-200"
                }`}
                onClick={() => toggleClassSelection(cls.id)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-3"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      {cls.name}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-3">
                        {cls.period}
                      </span>
                      <span className="text-xs flex items-center text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {cls.students} students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedClasses.length === 0 && (
            <p className="text-sm text-yellow-600 flex items-center mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              Select at least one class to assign
            </p>
          )}
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="mb-6 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            3
          </span>
          Scheduling Options
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Availability
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  scheduleType === "immediate"
                    ? "bg-purple-100 border-purple-300"
                    : "bg-white border-gray-200 hover:border-purple-200"
                }`}
                onClick={() => setScheduleType("immediate")}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={scheduleType === "immediate"}
                    onChange={() => {}}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <span className="text-sm font-medium">
                    Publish Immediately
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  Assignment is available as soon as you publish
                </p>
              </div>

              <div
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  scheduleType === "scheduled"
                    ? "bg-purple-100 border-purple-300"
                    : "bg-white border-gray-200 hover:border-purple-200"
                }`}
                onClick={() => setScheduleType("scheduled")}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={scheduleType === "scheduled"}
                    onChange={() => {}}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <span className="text-sm font-medium">Schedule</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  Set a future date and time to publish
                </p>
              </div>

              <div
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  scheduleType === "draft"
                    ? "bg-purple-100 border-purple-300"
                    : "bg-white border-gray-200 hover:border-purple-200"
                }`}
                onClick={() => setScheduleType("draft")}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={scheduleType === "draft"}
                    onChange={() => {}}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
                  />
                  <span className="text-sm font-medium">Save as Draft</span>
                </div>
                <p className="text-xs text-gray-500 pl-6">
                  Save for later, not visible to students
                </p>
              </div>
            </div>
          </div>

          {scheduleType === "scheduled" && (
            <div className="bg-white p-4 rounded-md border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-3">
                <Bell className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm text-purple-700">
                  Students will be notified when the assignment is released
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Deadline Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Deadline
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Due Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  defaultValue="23:59"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-100 p-3 rounded-md border border-purple-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 mr-2"
              />
              <span className="text-sm text-purple-800">
                Allow late submissions
              </span>
            </label>

            <div className="pl-6 mt-2">
              <select className="block w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm">
                <option>Accept without penalty</option>
                <option>Accept with penalty (10% per day)</option>
                <option>Accept with penalty (20% per day)</option>
                <option>Accept with penalty (50% flat)</option>
                <option>Accept for reduced credit (max 70%)</option>
                <option>Accept until specified date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200">
          Continue to Review
        </button>
      </div>
    </div>
  );
}
