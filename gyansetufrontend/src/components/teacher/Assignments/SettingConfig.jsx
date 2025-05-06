import React, { useState } from "react";
import { Info } from "lucide-react";

export default function SettingsConfiguration({
  onNext,
  onPrevious,
  assignmentData,
}) {
  // State initialization for all settings
  const [settings, setSettings] = useState({
    class: "",
    section: "",
    stream: "",
    subject: "",
    difficulty: "medium",
    questionOrder: "fixed",
    displayMode: "all",
    showPoints: true,
    showTimer: true,
    showProgress: true,
    passingScore: 70,
    gradingType: "automatic",
    feedbackType: "after-submit",
    latePolicy: "accept",
    penaltyRules: [], // Array of { time: string (minutes), points: string (deduction) }
    setLateDeadline: false,
    lateSubmissionDeadline: "",
  });

  // **Data Options**

  // Class options
  const classOptions = [
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ];

  // Section options
  const sectionOptions = [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "Section E",
    "Section F",
  ];

  // Stream options for Class 11 and 12
  const streamOptions = {
    "Class 11": [
      "Non Medical",
      "Medical",
      "Medical with Maths",
      "Commerce with Maths",
      "Commerce without Maths",
      "Arts with Maths",
      "Arts without Maths",
    ],
    "Class 12": [
      "Non Medical",
      "Medical",
      "Medical with Maths",
      "Commerce with Maths",
      "Commerce without Maths",
      "Arts with Maths",
      "Arts without Maths",
    ],
  };

  // Subject options based on class and stream
  const subjectOptions = {
    "Class 6": [
      "English",
      "Maths",
      "Hindi",
      "History",
      "Geography",
      "Civics",
      "Science",
      "Sanskrit",
      "French",
    ],
    "Class 7": [
      "English",
      "Maths",
      "Hindi",
      "History",
      "Geography",
      "Civics",
      "Science",
      "Sanskrit",
      "French",
    ],
    "Class 8": [
      "English",
      "Maths",
      "Hindi",
      "History",
      "Geography",
      "Civics",
      "Science",
      "Sanskrit",
      "French",
    ],
    "Class 9": [
      "English",
      "Maths",
      "Hindi",
      "History",
      "Geography",
      "Civics",
      "Economics",
      "Science",
      "Sanskrit",
      "French",
    ],
    "Class 10": [
      "English",
      "Maths",
      "Hindi",
      "History",
      "Geography",
      "Civics",
      "Economics",
      "Science",
      "Sanskrit",
      "French",
    ],
    "Class 11": {
      "Non Medical": [
        "Physics",
        "Chemistry",
        "Maths",
        "English",
        "Physical Education",
        "Computer",
      ],
      Medical: [
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Medical with Maths": [
        "Physics",
        "Chemistry",
        "Maths",
        "Biology",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Commerce with Maths": [
        "Accounts",
        "Maths",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Commerce without Maths": [
        "Accounts",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Arts with Maths": [
        "History",
        "Political Science",
        "Sociology",
        "Geography",
        "Psychology",
        "Economics",
        "English",
        "Maths",
        "Physical Education",
        "Computer",
      ],
      "Arts without Maths": [
        "History",
        "Political Science",
        "Sociology",
        "Geography",
        "Psychology",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
    },
    "Class 12": {
      "Non Medical": [
        "Physics",
        "Chemistry",
        "Maths",
        "English",
        "Physical Education",
        "Computer",
      ],
      Medical: [
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Medical with Maths": [
        "Physics",
        "Chemistry",
        "Maths",
        "Biology",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Commerce with Maths": [
        "Accounts",
        "Maths",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Commerce without Maths": [
        "Accounts",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
      "Arts with Maths": [
        "History",
        "Political Science",
        "Sociology",
        "Geography",
        "Psychology",
        "Economics",
        "English",
        "Maths",
        "Physical Education",
        "Computer",
      ],
      "Arts without Maths": [
        "History",
        "Political Science",
        "Sociology",
        "Geography",
        "Psychology",
        "Economics",
        "English",
        "Physical Education",
        "Computer",
      ],
    },
  };

  // **Event Handlers**

  // Handle changes to input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedSettings = {
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    };

    // Reset dependent fields when class or stream changes
    if (name === "class") {
      updatedSettings.stream = "";
      updatedSettings.subject = "";
    }
    if (name === "stream") {
      updatedSettings.subject = "";
    }

    // Clear late submission deadline if checkbox is unchecked
    if (name === "setLateDeadline" && !checked) {
      updatedSettings.lateSubmissionDeadline = "";
    }

    setSettings(updatedSettings);
  };

  // Handle direct settings changes (e.g., difficulty buttons)
  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };

  // Manage penalty rules
  const addPenaltyRule = () => {
    setSettings({
      ...settings,
      penaltyRules: [...settings.penaltyRules, { time: "", points: "" }],
    });
  };

  const removePenaltyRule = (index) => {
    const newRules = settings.penaltyRules.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      penaltyRules: newRules,
    });
  };

  const updatePenaltyRule = (index, field, value) => {
    const newRules = [...settings.penaltyRules];
    newRules[index][field] = value;
    setSettings({
      ...settings,
      penaltyRules: newRules,
    });
  };

  // **Helper Functions**

  // Get available subjects based on class and stream
  const getAvailableSubjects = () => {
    if (!settings.class) return [];

    if (settings.class === "Class 11" || settings.class === "Class 12") {
      if (!settings.stream) return [];
      return subjectOptions[settings.class][settings.stream] || [];
    }

    return subjectOptions[settings.class] || [];
  };

  const showStreamSelection =
    settings.class === "Class 11" || settings.class === "Class 12";

  // **JSX Rendering**

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-purple-500 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-1 text-purple-800 text-left">
        Configure Settings
      </h2>
      <p className="text-gray-500 mb-8 text-left">
        Customize how your assignment functions and appears
      </p>

      {/* Academic Settings */}
      <div className="mb-10 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Academic Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Class
            </label>
            <select
              name="class"
              value={settings.class}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a class</option>
              {classOptions.map((classOption) => (
                <option key={classOption} value={classOption}>
                  {classOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Section
            </label>
            <select
              name="section"
              value={settings.section}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a section</option>
              {sectionOptions.map((sectionOption) => (
                <option key={sectionOption} value={sectionOption}>
                  {sectionOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showStreamSelection && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Stream
            </label>
            <select
              name="stream"
              value={settings.stream}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a stream</option>
              {streamOptions[settings.class]?.map((streamOption) => (
                <option key={streamOption} value={streamOption}>
                  {streamOption}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Subject
          </label>
          <select
            name="subject"
            value={settings.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            disabled={
              !settings.class || (showStreamSelection && !settings.stream)
            }
          >
            <option value="">Select a subject</option>
            {getAvailableSubjects().map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
            Difficulty Level
          </label>
          <div className="flex space-x-4">
            {["easy", "medium", "hard"].map((level) => {
              const capitalizedLevel =
                level.charAt(0).toUpperCase() + level.slice(1);
              const bgColor =
                settings.difficulty === level
                  ? "bg-purple-600 text-white border-purple-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50";

              return (
                <button
                  key={level}
                  className={`px-5 py-2 rounded-md border ${bgColor} transition-colors duration-200 w-32`}
                  onClick={() => handleSettingChange("difficulty", level)}
                >
                  {capitalizedLevel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="mb-10 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Display Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Question Order
            </label>
            <select
              name="questionOrder"
              value={settings.questionOrder}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="fixed">Fixed order</option>
              <option value="random">Randomized</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Question Display
            </label>
            <select
              name="displayMode"
              value={settings.displayMode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All questions at once</option>
              <option value="one">One question at a time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="showPoints"
                checked={settings.showPoints}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">Show point values</span>
            </label>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="showTimer"
                checked={settings.showTimer}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">Show timer</span>
            </label>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="showProgress"
                checked={settings.showProgress}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">
                Show progress indicator
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Grading Settings */}
      <div className="mb-6 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-6 text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            3
          </span>
          Grading Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Passing Score (%)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="passingScore"
                value={settings.passingScore}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                min="0"
                max="100"
              />
              <div className="ml-2 text-lg text-purple-700 font-medium">%</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Grading Type
            </label>
            <select
              name="gradingType"
              value={settings.gradingType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="automatic">Automatic (for quizzes)</option>
              <option value="manual">Manual</option>
              <option value="mixed">Mixed (Automatic + Manual)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Feedback Options
            </label>
            <select
              name="feedbackType"
              value={settings.feedbackType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="after-submit">After submission</option>
              <option value="after-due">After due date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Late Submission Policy
            </label>
            <select
              name="latePolicy"
              value={settings.latePolicy}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="accept">Accept late submissions</option>
              <option value="penalty">Accept with penalty</option>
              <option value="reject">Do not accept late submissions</option>
            </select>

            {settings.latePolicy === "accept" && (
              <div className="mt-4 space-y-3 bg-white p-4 rounded-md border border-gray-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="setLateDeadline"
                    checked={settings.setLateDeadline}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Set a final deadline for late submissions</span>
                </label>

                {settings.setLateDeadline && (
                  <div className="pl-6">
                    <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
                      Final Late Submission Date
                    </label>
                    <input
                      type="date"
                      name="lateSubmissionDeadline"
                      value={settings.lateSubmissionDeadline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {settings.latePolicy === "penalty" && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 text-left">
                  Late Submission Penalties
                </h4>
                {settings.penaltyRules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2 flex-wrap">
                    <span className="text-sm">After</span>
                    <input
                      type="number"
                      value={rule.time}
                      onChange={(e) =>
                        updatePenaltyRule(index, "time", e.target.value)
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="minutes"
                      min="0"
                    />
                    <span className="text-sm">minutes,</span>
                    <span className="text-sm">deduct</span>
                    <input
                      type="number"
                      value={rule.points}
                      onChange={(e) =>
                        updatePenaltyRule(index, "points", e.target.value)
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="points"
                      min="0"
                    />
                    <span className="text-sm">points</span>
                    <button
                      onClick={() => removePenaltyRule(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium ml-auto pl-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPenaltyRule}
                  className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                >
                  + Add rule
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-100 p-4 rounded-lg flex items-start mb-8">
        <Info className="w-5 h-5 text-purple-700 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-purple-800">
          These settings determine how your assignment will function for
          students. You can adjust them later if needed.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
        >
          Back to Content
        </button>
        <button
          onClick={() => onNext({ ...assignmentData, settings })}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
