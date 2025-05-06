import React from "react";
import { X, Plus, HelpCircle } from "lucide-react";

export default function TestContent({ assignment, setAssignment }) {
  // Question types
  const questionTypes = [
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "short-answer", label: "Short Answer" },
    { value: "long-answer", label: "Long Answer" },
    { value: "true-false", label: "True/False" },
    { value: "fill-blank", label: "Fill-in-the-blank" },
  ];

  // Handle adding a new section
  const handleAddSection = () => {
    const newSectionId = assignment.sections.length + 1;
    const newSection = {
      id: newSectionId,
      title: `Section ${newSectionId}`,
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
        // If changing question type, update all questions in the section
        if (field === "questionType") {
          const updatedQuestions = section.questions.map((question) => {
            let updatedQuestion = { ...question, type: value };

            // Reset question-specific fields based on new type
            if (value === "multiple-choice") {
              updatedQuestion.options = [
                { id: 1, text: "" },
                { id: 2, text: "" },
                { id: 3, text: "" },
                { id: 4, text: "" },
              ];
              updatedQuestion.correctAnswers = [];
              updatedQuestion.explanation = "";
              // Remove any fields that don't apply to multiple choice
              delete updatedQuestion.sampleAnswer;
              delete updatedQuestion.wordLimit;
              delete updatedQuestion.correctAnswer;
              delete updatedQuestion.blanks;
              delete updatedQuestion.caseSensitive;
            } else if (value === "true-false") {
              updatedQuestion.correctAnswer = null;
              updatedQuestion.explanation = "";
              // Remove any fields that don't apply to true/false
              delete updatedQuestion.options;
              delete updatedQuestion.correctAnswers;
              delete updatedQuestion.sampleAnswer;
              delete updatedQuestion.wordLimit;
              delete updatedQuestion.blanks;
              delete updatedQuestion.caseSensitive;
            } else if (value === "short-answer" || value === "long-answer") {
              updatedQuestion.sampleAnswer = "";
              updatedQuestion.wordLimit = "";
              // Remove any fields that don't apply to text answers
              delete updatedQuestion.options;
              delete updatedQuestion.correctAnswers;
              delete updatedQuestion.correctAnswer;
              delete updatedQuestion.explanation;
              delete updatedQuestion.blanks;
              delete updatedQuestion.caseSensitive;
            } else if (value === "fill-blank") {
              updatedQuestion.blanks = [{ id: 1, answer: "" }];
              updatedQuestion.caseSensitive = false;
              // Remove any fields that don't apply to fill-blank
              delete updatedQuestion.options;
              delete updatedQuestion.correctAnswers;
              delete updatedQuestion.correctAnswer;
              delete updatedQuestion.explanation;
              delete updatedQuestion.sampleAnswer;
              delete updatedQuestion.wordLimit;
            }

            return updatedQuestion;
          });

          return {
            ...section,
            [field]: value,
            questions: updatedQuestions,
          };
        }

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

    let newQuestion = {
      id: newQuestionId,
      text: "",
      type: section.questionType,
    };

    // Template-specific question properties
    if (section.questionType === "multiple-choice") {
      newQuestion.options = [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ];
      newQuestion.correctAnswers = [];
      newQuestion.explanation = "";
    } else if (section.questionType === "true-false") {
      newQuestion.correctAnswer = null;
      newQuestion.explanation = "";
    } else if (
      section.questionType === "short-answer" ||
      section.questionType === "long-answer"
    ) {
      newQuestion.sampleAnswer = "";
      newQuestion.wordLimit = "";
    } else if (section.questionType === "fill-blank") {
      newQuestion.blanks = [{ id: 1, answer: "" }];
      newQuestion.caseSensitive = false;
    }

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
          Test Sections
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
                Question Type
              </label>
              <select
                value={section.questionType}
                onChange={(e) =>
                  handleSectionChange(
                    section.id,
                    "questionType",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Instructions (optional)
              </label>
              <input
                type="text"
                value={section.instructions}
                onChange={(e) =>
                  handleSectionChange(
                    section.id,
                    "instructions",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter instructions for this section"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-medium text-purple-700">Questions</h5>
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

                {/* Question-type specific fields based on section type */}
                {section.questionType === "multiple-choice" && (
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
                            let newCorrectAnswers = [
                              ...question.correctAnswers,
                            ];
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
                    <div className="flex items-center text-xs text-gray-500">
                      <HelpCircle className="w-3 h-3 mr-1" /> Check the correct
                      answer option(s)
                    </div>
                  </div>
                )}

                {section.questionType === "true-false" && (
                  <div className="pl-4 border-l-2 border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`true-false-${section.id}-${question.id}`}
                          value="true"
                          checked={question.correctAnswer === true}
                          onChange={() =>
                            handleQuestionChange(
                              section.id,
                              question.id,
                              "correctAnswer",
                              true
                            )
                          }
                          className="mr-1 h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`true-false-${section.id}-${question.id}`}
                          value="false"
                          checked={question.correctAnswer === false}
                          onChange={() =>
                            handleQuestionChange(
                              section.id,
                              question.id,
                              "correctAnswer",
                              false
                            )
                          }
                          className="mr-1 h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span>False</span>
                      </label>
                    </div>
                  </div>
                )}

                {(section.questionType === "short-answer" ||
                  section.questionType === "long-answer") && (
                  <div className="pl-4 border-l-2 border-purple-200">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample Answer/Key Points
                      </label>
                      <textarea
                        value={question.sampleAnswer || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            section.id,
                            question.id,
                            "sampleAnswer",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        rows="2"
                        placeholder="Enter sample answer for grading reference"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Word/Character Limit (optional)
                      </label>
                      <input
                        type="text"
                        value={question.wordLimit || ""}
                        onChange={(e) =>
                          handleQuestionChange(
                            section.id,
                            question.id,
                            "wordLimit",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 200 words"
                      />
                    </div>
                  </div>
                )}

                {section.questionType === "fill-blank" && (
                  <div className="pl-4 border-l-2 border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Blanks (Correct Answers)
                    </p>
                    {(question.blanks || []).map((blank, blankIndex) => (
                      <div key={blank.id} className="mb-2">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            Blank {blankIndex + 1}:
                          </span>
                          <input
                            type="text"
                            value={blank.answer}
                            onChange={(e) => {
                              const updatedBlanks = [
                                ...(question.blanks || []),
                              ];
                              updatedBlanks[blankIndex].answer = e.target.value;
                              handleQuestionChange(
                                section.id,
                                question.id,
                                "blanks",
                                updatedBlanks
                              );
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                            placeholder="Correct answer"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newBlankId = (question.blanks || []).length + 1;
                        const updatedBlanks = [
                          ...(question.blanks || []),
                          { id: newBlankId, answer: "" },
                        ];
                        handleQuestionChange(
                          section.id,
                          question.id,
                          "blanks",
                          updatedBlanks
                        );
                      }}
                      className="mt-1 text-xs text-purple-600 hover:text-purple-800"
                    >
                      + Add another blank
                    </button>

                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={question.caseSensitive || false}
                          onChange={(e) => {
                            handleQuestionChange(
                              section.id,
                              question.id,
                              "caseSensitive",
                              e.target.checked
                            );
                          }}
                          className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Case sensitive answers
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <HelpCircle className="w-3 h-3 mr-1" /> Use underscores in
                      your question text to indicate blank spaces
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
