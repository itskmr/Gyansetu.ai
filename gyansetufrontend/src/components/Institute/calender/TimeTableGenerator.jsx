import React, { useState } from "react";
import {
  Upload,
  Plus,
  Save,
  Check,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  X,
} from "lucide-react";

const TimeTableGenerator = ({ timeTables, onAddTimeTable }) => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTimeTable, setSelectedTimeTable] = useState(null);
  const [timeTablePreview, setTimeTablePreview] = useState(null);

  // Sample subjects and teachers for demo
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      teachers: ["Mr. Johnson", "Mrs. Smith", "Ms. Davis"],
    },
    {
      id: 2,
      name: "Science",
      teachers: ["Ms. Wilson", "Mr. Brown", "Mrs. Taylor"],
    },
    {
      id: 3,
      name: "English",
      teachers: ["Mrs. Thompson", "Mr. Clark", "Ms. White"],
    },
    {
      id: 4,
      name: "History",
      teachers: ["Mr. Davis", "Mrs. Garcia", "Ms. Miller"],
    },
    {
      id: 5,
      name: "Geography",
      teachers: ["Mrs. Martinez", "Mr. Lee", "Ms. Wilson"],
    },
    {
      id: 6,
      name: "Physical Education",
      teachers: ["Coach Williams", "Coach Harris", "Coach Martin"],
    },
    { id: 7, name: "Art", teachers: ["Ms. King", "Mr. Green", "Mrs. Hill"] },
    {
      id: 8,
      name: "Music",
      teachers: ["Mr. Baker", "Mrs. Nelson", "Ms. Young"],
    },
  ];

  // Time slots
  const timeSlots = [
    { id: 1, start: "08:00", end: "09:00", label: "8:00 AM - 9:00 AM" },
    { id: 2, start: "09:15", end: "10:15", label: "9:15 AM - 10:15 AM" },
    { id: 3, start: "10:30", end: "11:30", label: "10:30 AM - 11:30 AM" },
    { id: 4, start: "11:45", end: "12:45", label: "11:45 AM - 12:45 PM" },
    { id: 5, start: "13:30", end: "14:30", label: "1:30 PM - 2:30 PM" },
    { id: 6, start: "14:45", end: "15:45", label: "2:45 PM - 3:45 PM" },
  ];

  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Generate empty schedule state
  const generateEmptySchedule = () => {
    const schedule = {};

    timeSlots.forEach((slot) => {
      schedule[slot.id] = {};
      daysOfWeek.forEach((day) => {
        schedule[slot.id][day] = { subject: null, teacher: null };
      });
    });

    return schedule;
  };

  // State for current working schedule
  const [currentSchedule, setCurrentSchedule] = useState(
    generateEmptySchedule()
  );

  // Handle subject selection for a time slot and day
  const handleSubjectSelect = (slotId, day, subject, teacher) => {
    setCurrentSchedule((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        [day]: { subject, teacher },
      },
    }));
  };

  // Handle save timetable
  const handleSaveTimeTable = () => {
    const newTimeTable = {
      grade: selectedGrade,
      section: selectedSection,
      academicYear: selectedYear,
      schedule: currentSchedule,
    };

    onAddTimeTable(newTimeTable);

    // Reset form
    setCurrentSchedule(generateEmptySchedule());
    setSelectedGrade("");
    setSelectedSection("");

    // Close modal if open
    setShowCreateModal(false);
  };

  // Handle create new time table
  const handleCreateTimeTable = () => {
    setCurrentSchedule(generateEmptySchedule());
    setSelectedGrade("");
    setSelectedSection("");
    setShowCreateModal(true);
  };

  // Handle preview time table
  const handlePreviewTimeTable = (timeTable) => {
    setTimeTablePreview(timeTable);
    setShowPreviewModal(true);
  };

  // Get cell background color based on subject
  const getCellBackgroundColor = (subject) => {
    if (!subject) return "bg-white";

    const subjectColors = {
      Mathematics: "bg-blue-50",
      Science: "bg-green-50",
      English: "bg-purple-50",
      History: "bg-amber-50",
      Geography: "bg-teal-50",
      "Physical Education": "bg-red-50",
      Art: "bg-pink-50",
      Music: "bg-indigo-50",
    };

    return subjectColors[subject] || "bg-gray-50";
  };

  // Render time table creator modal
  const renderCreateModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-6xl p-6 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Create New Time Table
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class/Grade
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Select Class</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              <div className="py-2 px-3 text-sm font-medium text-gray-700 border-r">
                Time/Day
              </div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-2 px-3 text-sm font-medium text-gray-700 border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="grid grid-cols-7 border-b last:border-b-0"
              >
                <div className="py-3 px-3 text-sm text-gray-700 border-r bg-gray-50">
                  {slot.label}
                </div>

                {daysOfWeek.map((day) => {
                  const cellData = currentSchedule[slot.id][day];

                  return (
                    <div
                      key={`${slot.id}-${day}`}
                      className={`py-2 px-2 text-sm border-r last:border-r-0 ${getCellBackgroundColor(
                        cellData.subject
                      )}`}
                    >
                      {cellData.subject ? (
                        <div>
                          <div className="font-medium">{cellData.subject}</div>
                          <div className="text-xs text-gray-500">
                            {cellData.teacher}
                          </div>
                          <button
                            className="mt-1 text-xs text-red-600 hover:text-red-800"
                            onClick={() =>
                              handleSubjectSelect(slot.id, day, null, null)
                            }
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <div className="relative group">
                          <div className="h-8 flex items-center justify-center cursor-pointer text-gray-400 group-hover:text-blue-500">
                            <Plus size={16} />
                          </div>

                          <div className="hidden group-hover:block absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border p-2">
                            {subjects.map((subject) => (
                              <div key={subject.id} className="mb-2">
                                <div className="font-medium text-xs mb-1">
                                  {subject.name}
                                </div>
                                <div className="pl-2 space-y-1">
                                  {subject.teachers.map((teacher) => (
                                    <div
                                      key={teacher}
                                      className="text-xs cursor-pointer hover:bg-blue-50 p-1 rounded"
                                      onClick={() =>
                                        handleSubjectSelect(
                                          slot.id,
                                          day,
                                          subject.name,
                                          teacher
                                        )
                                      }
                                    >
                                      {teacher}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              onClick={handleSaveTimeTable}
              disabled={!selectedGrade || !selectedSection}
            >
              <Save size={16} className="mr-1" />
              Save Time Table
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render time table preview modal
  const renderPreviewModal = () => {
    if (!showPreviewModal || !timeTablePreview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-6xl p-6 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Time Table Preview: {timeTablePreview.grade}{" "}
              {timeTablePreview.section} ({timeTablePreview.academicYear})
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowPreviewModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              <div className="py-2 px-3 text-sm font-medium text-gray-700 border-r">
                Time/Day
              </div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-2 px-3 text-sm font-medium text-gray-700 border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="grid grid-cols-7 border-b last:border-b-0"
              >
                <div className="py-3 px-3 text-sm text-gray-700 border-r bg-gray-50">
                  {slot.label}
                </div>

                {daysOfWeek.map((day) => {
                  const cellData =
                    timeTablePreview.schedule &&
                    timeTablePreview.schedule[slot.id] &&
                    timeTablePreview.schedule[slot.id][day]
                      ? timeTablePreview.schedule[slot.id][day]
                      : { subject: null, teacher: null };

                  return (
                    <div
                      key={`${slot.id}-${day}`}
                      className={`py-2 px-2 text-sm border-r last:border-r-0 ${getCellBackgroundColor(
                        cellData.subject
                      )}`}
                    >
                      {cellData.subject ? (
                        <div>
                          <div className="font-medium">{cellData.subject}</div>
                          <div className="text-xs text-gray-500">
                            {cellData.teacher}
                          </div>
                        </div>
                      ) : (
                        <div className="h-8 flex items-center justify-center text-gray-400">
                          <span className="text-xs">No class</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Download size={16} className="mr-1" />
              Download PDF
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <Check size={16} className="mr-1" />
              Push to Users
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Time Table Generator
          </h3>
          <div className="flex space-x-2">
            <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 flex items-center text-sm">
              <Upload size={16} className="mr-1" />
              Import
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center text-sm"
              onClick={handleCreateTimeTable}
            >
              <Plus size={16} className="mr-1" />
              Create New
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h4 className="text-md font-medium text-blue-800 mb-2">
            Quick Guide
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm text-blue-600">
              Click "Create New" to generate a time table for a class
            </li>
            <li className="text-sm text-blue-600">
              Use the subject and teacher selector to assign classes
            </li>
            <li className="text-sm text-blue-600">
              Review and save your time table
            </li>
            <li className="text-sm text-blue-600">
              Use "Push to Users" to distribute the time table to relevant
              teachers and students
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">
            Recently Created Time Tables
          </h4>

          {timeTables.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Section
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Academic Year
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
                  {timeTables.map((table) => (
                    <tr key={table.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {table.grade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {table.section}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {table.academicYear}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handlePreviewTimeTable(table)}
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Copy size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500 mb-2">No time tables created yet</p>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={handleCreateTimeTable}
              >
                <Plus size={16} className="mr-1" />
                Create Your First Time Table
              </button>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Conflict Detection</h4>
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">
                  Our system automatically checks for conflicts when creating
                  time tables such as teacher being assigned to multiple classes
                  at the same time or rooms being double-booked.
                </p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <button className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                  Run Conflict Check
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-green-600 flex items-center">
                <Check size={16} className="mr-1" />
                No conflicts detected in current time tables
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Time Table Distribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {timeTables.length}
            </div>
            <div className="text-sm text-blue-800">Active Time Tables</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-1">24</div>
            <div className="text-sm text-green-800">Classes Covered</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-1">18</div>
            <div className="text-sm text-purple-800">Teachers Assigned</div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">
            Distribution Status
          </h4>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time Table
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Recipients
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Distribution Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Grade 9A (2024-2025)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      42 students, 8 teachers
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">Apr 20, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Distributed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Grade 10B (2024-2025)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      38 students, 7 teachers
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">Apr 22, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Distributed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {renderCreateModal()}

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
};

export default TimeTableGenerator;
