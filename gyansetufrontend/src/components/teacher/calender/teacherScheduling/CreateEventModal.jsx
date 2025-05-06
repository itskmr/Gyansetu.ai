// File: components/CreateEventModal.jsx
import React, { useState } from "react";
import ConflictWarning from "./ConflictWarning";

const CreateEventModal = ({ showConflictWarning, onClose }) => {
  // State for form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState(""); // Optional publish date
  const [happeningDate, setHappeningDate] = useState(""); // Required happening date
  const [classSelection, setClassSelection] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Options for dropdowns
  const classes = ["6", "7", "8", "9"];
  const sections = ["A", "B", "C", "D"];

  // Handler for "Save as Draft"
  const handleSaveDraft = () => {
    const eventData = {
      title,
      type,
      description,
      publishDate: null, // Draft has no publish date
      happeningDate,
      classSelection,
      selectedClass:
        classSelection === "class" || classSelection === "classSection"
          ? selectedClass
          : null,
      selectedSection:
        classSelection === "classSection" ? selectedSection : null,
    };
    // For now, log the data (replace with actual save logic)
    console.log("Saving as draft:", eventData);
    onClose(); // Close the modal
  };

  // Handler for "Schedule Event"
  const handleScheduleEvent = () => {
    const publishDateValue =
      publishDate || new Date().toISOString().split("T")[0]; // Default to today if empty
    const eventData = {
      title,
      type,
      description,
      publishDate: publishDateValue, // Use selected date or today
      happeningDate,
      classSelection,
      selectedClass:
        classSelection === "class" || classSelection === "classSection"
          ? selectedClass
          : null,
      selectedSection:
        classSelection === "classSection" ? selectedSection : null,
    };
    // For now, log the data (replace with actual save logic)
    console.log("Scheduling event:", eventData);
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Event
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Conflict Warning */}
        {showConflictWarning && <ConflictWarning />}

        <div className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter event title"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., Workshop, Exam"
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
              placeholder="Describe the event"
            />
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Publish Date (optional)
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to publish immediately when scheduling.
            </p>
          </div>

          {/* Happening Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Happening Date
            </label>
            <input
              type="date"
              value={happeningDate}
              onChange={(e) => setHappeningDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Event will appear on the calendar on this date.
            </p>
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Selection
            </label>
            <select
              value={classSelection}
              onChange={(e) => {
                setClassSelection(e.target.value);
                setSelectedClass(""); // Reset class when selection type changes
                setSelectedSection(""); // Reset section when selection type changes
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All Classes</option>
              <option value="class">Specific Class</option>
              <option value="classSection">Specific Class and Section</option>
            </select>
          </div>

          {/* Specific Class Dropdown */}
          {classSelection === "class" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Specific Class and Section Dropdowns */}
          {classSelection === "classSection" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Select Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </button>
          <button
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            onClick={handleScheduleEvent}
          >
            Schedule Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
