import React from "react";
import { X, Plus, HelpCircle } from "lucide-react";

export default function QuizContent({ assignment, setAssignment }) {
  // Handle adding a new section
  const handleAddSection = () => {
    const newSectionId = assignment.sections.length + 1;
    const newSection = {
      id: newSectionId,
      title: `Section ${newSectionId}`,
      questionType: "multiple-choice", // Fixed for Quiz
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
    };

    setAssignment({
      ...assignment,
      sections: [...assignment.sections, newSection],
    });
  };

  // Handle section changes
  const handleSectionChange = (sectionId, field, value) => {
    const updatedSections = assignment.sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, [field]: value };
      }
      return section;
    });

    setAssignment({
      ...assignment,
      sections: updatedSections,
    });
  };

  // Handle removing a section
  const handleRemoveSection = (sectionId) => {
    if (assignment.sections.length <= 1) return;

    const updatedSections = assignment.sections.filter(
      (section) => section.id !== sectionId
    );
    setAssignment({
      ...assignment,
      sections: updatedSections,
    });
  };

  // Handle question changes
  const handleQuestionChange = (sectionId, questionId, field, value) => {
    const updatedSections = assignment.sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map((question) => {
          if (question.id === questionId) {
            return { ...question, [field]: value };
          }
          return question;
        });

        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setAssignment({
      ...assignment,
      sections: updatedSections,
    });
  };

  // Handle adding a new question to a section
  const handleAddQuestion = (sectionId) => {
    const section = assignment.sections.find((s) => s.id === sectionId);
    const newQuestionId = section.questions.length + 1;

    // For quiz, always use multiple-choice
    const newQuestion = {
      id: newQuestionId,
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
    };

    const updatedSections = assignment.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          questions: [...s.questions, newQuestion],
        };
      }
      return s;
    });

    setAssignment({
      ...assignment,
      sections: updatedSections,
    });
  };

  // Handle removing a question
  const handleRemoveQuestion = (sectionId, questionId) => {
    const section = assignment.sections.find((s) => s.id === sectionId);
    if (section.questions.length <= 1) return;

    const updatedSections = assignment.sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.filter(
          (question) => question.id !== questionId
        );
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setAssignment({
      ...assignment,
      sections: updatedSections,
    });
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-purple-700 flex items-center">
          <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Quiz Sections
        </h3>
        <button
          onClick={handleAddSection}
          className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Section
        </button>
      </div>

      {assignment.sections.map((section, index) => (
        <div
          key={section.id}
          className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-purple-800">Section {index + 1}</h4>
            {assignment.sections.length > 1 && (
              <button
                onClick={() => handleRemoveSection(section.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(section.id, "title", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points per Question
              </label>
              <input
                type="number"
                value={section.pointsPerQuestion}
                onChange={(e) =>
                  handleSectionChange(
                    section.id,
                    "pointsPerQuestion",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Instructions (optional)
            </label>
            <input
              type="text"
              value={section.instructions}
              onChange={(e) =>
                handleSectionChange(section.id, "instructions", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter instructions for this section"
            />
          </div>

          {/* Multiple Choice Questions (fixed for Quiz) */}
          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-medium text-purple-700">
                Multiple Choice Questions
              </h5>
              <button
                onClick={() => handleAddQuestion(section.id)}
                className="flex items-center px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors duration-200 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </button>
            </div>

            {section.questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="mb-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-purple-700">
                    Question {qIndex + 1}
                  </span>
                  {section.questions.length > 1 && (
                    <button
                      onClick={() =>
                        handleRemoveQuestion(section.id, question.id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <textarea
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(
                        section.id,
                        question.id,
                        "text",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    rows="2"
                    placeholder="Enter question text"
                  ></textarea>
                </div>

                {/* Multiple Choice Options */}
                <div className="pl-4 border-l-2 border-purple-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </p>
                  {question.options.map((option, optIndex) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={question.correctAnswers.includes(option.id)}
                        onChange={(e) => {
                          let newCorrectAnswers = [...question.correctAnswers];
                          if (e.target.checked) {
                            newCorrectAnswers.push(option.id);
                          } else {
                            newCorrectAnswers = newCorrectAnswers.filter(
                              (id) => id !== option.id
                            );
                          }
                          handleQuestionChange(
                            section.id,
                            question.id,
                            "correctAnswers",
                            newCorrectAnswers
                          );
                        }}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updatedOptions = [...question.options];
                          updatedOptions[optIndex].text = e.target.value;
                          handleQuestionChange(
                            section.id,
                            question.id,
                            "options",
                            updatedOptions
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <HelpCircle className="w-3 h-3 mr-1" /> Check the correct
                    answer option(s)
                  </div>
                </div>

                <div className="mt-3 pl-4 border-l-2 border-purple-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation (optional)
                  </label>
                  <textarea
                    value={question.explanation || ""}
                    onChange={(e) =>
                      handleQuestionChange(
                        section.id,
                        question.id,
                        "explanation",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    rows="2"
                    placeholder="Explain the correct answer"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
