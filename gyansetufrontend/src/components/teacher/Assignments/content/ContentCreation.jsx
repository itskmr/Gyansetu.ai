import React, { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import QuizContent from "./QuizContent";
import WrittenContent from "./WrittenContent";
import TestContent from "./TestContent";
import ProjectContent from "./ProjectContent";

// Time selector component to ensure consistent styling and alignment
const TimeSelector = ({ label, name, value, onChange }) => {
  // Generate hour options for 12-hour clock (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour.toString();
  });

  // Generate minute options (00, 05, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    return minute.toString().padStart(2, "0");
  });

  // Extract the hour, minute, and AM/PM values from the props
  const hourValue = `${name}Hour`;
  const minuteValue = `${name}Minute`;
  const amPmValue = `${name}AmPm`;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-purple-400" />
        <div className="flex items-center">
          <select
            name={hourValue}
            value={value[hourValue]}
            onChange={onChange}
            className="w-20 px-2 py-2 border border-gray-300 rounded-l-md focus:ring-purple-500 focus:border-purple-500"
          >
            {hours.map((hour) => (
              <option key={`${name}-hour-${hour}`} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <span className="mx-1">:</span>
          <select
            name={minuteValue}
            value={value[minuteValue]}
            onChange={onChange}
            className="w-20 px-2 py-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          >
            {minutes.map((minute) => (
              <option key={`${name}-minute-${minute}`} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          <select
            name={amPmValue}
            value={value[amPmValue]}
            onChange={onChange}
            className="w-20 px-2 py-2 border border-gray-300 rounded-r-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default function ContentCreation({
  onNext,
  onPrevious,
  selectedTemplate,
}) {
  // Initialize assignment state based on template
  const [assignment, setAssignment] = useState(() => {
    // Default state for all templates
    const baseState = {
      title: "",
      description: "",
      timeLimit: "",
      dueDate: "",
      startTimeHour: "9",
      startTimeMinute: "00",
      startTimeAmPm: "AM",
      endTimeHour: "10",
      endTimeMinute: "00",
      endTimeAmPm: "AM",
    };

    // Template-specific initializations
    switch (selectedTemplate) {
      case "quiz":
        return {
          ...baseState,
          sections: [
            {
              id: 1,
              title: "Section 1",
              questionType: "multiple-choice", // Fixed as multiple-choice
              pointsPerQuestion: 5,
              instructions: "",
              questions: [
                {
                  id: 1,
                  text: "",
                  type: "multiple-choice",
                  options: [
                    { id: 1, text: "" },
                    { id: 2, text: "" },
                    { id: 3, text: "" },
                    { id: 4, text: "" },
                  ],
                  correctAnswers: [],
                  explanation: "",
                },
              ],
            },
          ],
        };
      case "written":
        return {
          ...baseState,
          grading: {
            enabled: false,
            rubric: [],
          },
          sections: [
            {
              id: 1,
              title: "Section 1",
              questionType: "long-answer",
              pointsPerQuestion: 10,
              instructions: "",
              questions: [
                {
                  id: 1,
                  text: "",
                  type: "long-answer",
                  sampleAnswer: "",
                  wordLimit: "",
                },
              ],
            },
          ],
        };
      case "test":
        return {
          ...baseState,
          sections: [
            {
              id: 1,
              title: "Section 1",
              questionType: "multiple-choice",
              pointsPerQuestion: 5,
              instructions: "",
              questions: [
                {
                  id: 1,
                  text: "",
                  type: "multiple-choice",
                  options: [
                    { id: 1, text: "" },
                    { id: 2, text: "" },
                    { id: 3, text: "" },
                    { id: 4, text: "" },
                  ],
                  correctAnswers: [],
                  explanation: "",
                },
              ],
            },
          ],
        };
      case "project":
        return {
          ...baseState,
          projectType: "individual",
          learningObjectives: [],
          resources: [],
          deliverables: [],
          evaluationCriteria: [],
          milestones: [],
        };
      default:
        return baseState;
    }
  });

  // Basic assignment info change handler
  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignment({
      ...assignment,
      [name]: value,
    });
  };

  // Get template name for display
  const getTemplateName = () => {
    switch (selectedTemplate) {
      case "quiz":
        return "Quiz";
      case "written":
        return "Written Assignment";
      case "test":
        return "Test Module";
      case "project":
        return "Project Based";
      default:
        return "Assignment";
    }
  };

  // Get title label based on template type
  const getTitleLabel = () => {
    switch (selectedTemplate) {
      case "quiz":
        return "Quiz Title";
      case "written":
        return "Assignment Title";
      case "test":
        return "Test Title";
      case "project":
        return "Project Title";
      default:
        return "Assignment Title";
    }
  };

  // Get description label based on template type
  const getDescriptionLabel = () => {
    switch (selectedTemplate) {
      case "quiz":
        return "Quiz Description/Instructions";
      case "written":
        return "Assignment Description/Instructions";
      case "test":
        return "Test Description/Instructions";
      case "project":
        return "Project Description/Instructions";
      default:
        return "Description/Instructions";
    }
  };

  // Render template-specific content
  const renderTemplateContent = () => {
    switch (selectedTemplate) {
      case "quiz":
        return (
          <QuizContent assignment={assignment} setAssignment={setAssignment} />
        );
      case "written":
        return (
          <WrittenContent
            assignment={assignment}
            setAssignment={setAssignment}
          />
        );
      case "test":
        return (
          <TestContent assignment={assignment} setAssignment={setAssignment} />
        );
      case "project":
        return (
          <ProjectContent
            assignment={assignment}
            setAssignment={setAssignment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-1 text-purple-700">
        Create Content
      </h2>
      <p className="text-gray-500 mb-6">Template: {getTemplateName()}</p>

      {/* Basic Assignment Info - common to all templates */}
      <div className="mb-8 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getTitleLabel()}
            </label>
            <input
              type="text"
              name="title"
              value={assignment.title}
              onChange={handleAssignmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder={`Enter ${getTitleLabel().toLowerCase()}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getDescriptionLabel()}
            </label>
            <textarea
              name="description"
              value={assignment.description}
              onChange={handleAssignmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              rows="4"
              placeholder={`Enter ${getDescriptionLabel().toLowerCase()}`}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (optional)
              </label>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-400 mr-2" />
                <input
                  type="text"
                  name="timeLimit"
                  value={assignment.timeLimit}
                  onChange={handleAssignmentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., 60 minutes"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (optional)
              </label>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                <input
                  type="date"
                  name="dueDate"
                  value={assignment.dueDate}
                  onChange={handleAssignmentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Time Selection - Using the reusable components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time - Using the TimeSelector component */}
            <TimeSelector
              label="Start Time"
              name="startTime"
              value={assignment}
              onChange={handleAssignmentChange}
            />

            {/* End Time - Using the TimeSelector component */}
            <TimeSelector
              label="End Time"
              name="endTime"
              value={assignment}
              onChange={handleAssignmentChange}
            />
          </div>
        </div>
      </div>

      {/* Template-specific content */}
      {renderTemplateContent()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Back to Template
        </button>
        <button
          onClick={() => onNext(assignment)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm"
        >
          Continue to Settings
        </button>
      </div>
    </div>
  );
}
