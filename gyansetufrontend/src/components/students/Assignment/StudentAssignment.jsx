import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookmarkIcon,
  Flag,
  Calendar,
  Clock3,
} from "lucide-react";
import StudentNavbar from "../studentDasboard/StudentNavbar";

const StudentAssignmentInterface = () => {
  // Mock data - in a real application, this would come from an API
  const [assignments] = useState([
    {
      id: "a123",
      title: "Introduction to Quadratic Equations",
      description:
        "This assignment will test your understanding of quadratic equations, their properties, and how to solve them using different methods.",
      subject: "Mathematics",
      className: "Class 10",
      section: "B",
      dueDate: "2025-05-15T23:59:59",
      startDate: "2025-05-04T01:00:00",
      endDate: "2025-05-15T23:59:59",
      duration: 60, // in minutes
      totalMarks: 30,
      passingScore: 15,
      showMarks: true,
      showTimer: true,
      showProgressIndicator: true,
      oneQuestionAtATime: false,
      status: "upcoming", // upcoming, attempted, completed
      score: null,
      questions: [
        {
          id: 1,
          text: "What is the standard form of a quadratic equation?",
          type: "mcq",
          options: [
            { id: 1, text: "ax² + bx + c = 0", isCorrect: true },
            { id: 2, text: "ax + b = 0", isCorrect: false },
            { id: 3, text: "ax³ + bx² + cx + d = 0", isCorrect: false },
            { id: 4, text: "a/x² + b/x + c = 0", isCorrect: false },
          ],
          marks: 2,
        },
        {
          id: 2,
          text: "If the roots of a quadratic equation are 3 and -5, what is the equation in standard form?",
          type: "mcq",
          options: [
            { id: 1, text: "x² + 2x - 15 = 0", isCorrect: false },
            { id: 2, text: "x² - 2x - 15 = 0", isCorrect: false },
            { id: 3, text: "x² + 2x + 15 = 0", isCorrect: false },
            { id: 4, text: "x² - 2x + 15 = 0", isCorrect: false },
            { id: 5, text: "x² + 2x - 15 = 0", isCorrect: true },
          ],
          marks: 3,
        },
        {
          id: 3,
          text: "For the quadratic equation 2x² - 4x + 1 = 0, calculate the discriminant and explain what it tells us about the roots of the equation.",
          type: "long",
          marks: 5,
        },
        {
          id: 4,
          text: "Solve the equation x² - 7x + 12 = 0 using the quadratic formula.",
          type: "short",
          marks: 4,
        },
      ],
    },
    {
      id: "a456",
      title: "Acid-Base Reactions and pH Scale",
      description:
        "This assignment covers the fundamentals of acid-base reactions, the pH scale, and their applications in chemistry.",
      subject: "Chemistry",
      className: "Class 9",
      section: "A",
      dueDate: "2025-05-20T23:59:59",
      startDate: "2025-05-06T14:30:00",
      endDate: "2025-05-20T23:59:59",
      duration: 45,
      totalMarks: 25,
      passingScore: 13,
      showMarks: true,
      showTimer: true,
      showProgressIndicator: true,
      oneQuestionAtATime: true,
      status: "upcoming",
      score: null,
      questions: [
        {
          id: 1,
          text: "What is the pH range for acidic solutions?",
          type: "mcq",
          options: [
            { id: 1, text: "0-7", isCorrect: true },
            { id: 2, text: "7", isCorrect: false },
            { id: 3, text: "7-14", isCorrect: false },
            { id: 4, text: "14", isCorrect: false },
          ],
          marks: 2,
        },
        {
          id: 2,
          text: "Explain the concept of neutralization reactions with an example.",
          type: "long",
          marks: 5,
        },
      ],
    },
    {
      id: "a789",
      title: "World War II: Causes and Consequences",
      description:
        "An in-depth analysis of the major causes, key events, and lasting impacts of World War II on global politics and society.",
      subject: "History",
      className: "Class 10",
      section: "C",
      dueDate: "2025-05-18T23:59:59",
      startDate: "2025-05-01T10:00:00",
      endDate: "2025-05-18T23:59:59",
      duration: 90,
      totalMarks: 40,
      passingScore: 20,
      showMarks: true,
      showTimer: true,
      showProgressIndicator: true,
      oneQuestionAtATime: false,
      status: "attempted",
      score: 32,
      questions: [
        {
          id: 1,
          text: "What was the immediate trigger that started World War II?",
          type: "mcq",
          options: [
            {
              id: 1,
              text: "Assassination of Archduke Franz Ferdinand",
              isCorrect: false,
            },
            { id: 2, text: "German invasion of Poland", isCorrect: true },
            { id: 3, text: "The Great Depression", isCorrect: false },
            { id: 4, text: "Russian Revolution", isCorrect: false },
          ],
          marks: 2,
        },
        {
          id: 2,
          text: "Describe the policy of appeasement and explain why it failed to prevent World War II.",
          type: "long",
          marks: 8,
        },
      ],
    },
    {
      id: "a101",
      title: "Python Programming Fundamentals",
      description:
        "Test your understanding of Python programming basics including variables, data types, control structures, and functions.",
      subject: "Computer Science",
      className: "Class 11",
      section: "A",
      dueDate: "2025-04-25T23:59:59",
      startDate: "2025-04-20T08:00:00",
      endDate: "2025-04-25T23:59:59",
      duration: 75,
      totalMarks: 50,
      passingScore: 25,
      showMarks: true,
      showTimer: true,
      showProgressIndicator: true,
      oneQuestionAtATime: true,
      status: "completed",
      score: 42,
      questions: [
        {
          id: 1,
          text: "What is the output of the following code: print(3 * 'abc')?",
          type: "mcq",
          options: [
            { id: 1, text: "9", isCorrect: false },
            { id: 2, text: "abc3", isCorrect: false },
            { id: 3, text: "abcabcabc", isCorrect: true },
            { id: 4, text: "Error", isCorrect: false },
          ],
          marks: 2,
        },
      ],
    },
  ]);

  // States
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // Initialize to 0, will be set when assignment is selected
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentTab, setCurrentTab] = useState("upcoming"); // upcoming or attempted

  // Added state for Navbar interaction
  const [navExpanded, setNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get current date and time for checking assignment availability
  const getCurrentDateTime = () => {
    return new Date();
  };

  // Update current time every minute to check assignment availability
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Added effect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if assignment is available for taking based on scheduled time
  const isAssignmentAvailable = (assignment) => {
    const currentDateTime = getCurrentDateTime();
    const startDateTime = new Date(assignment.startDate);
    const endDateTime = new Date(assignment.endDate);

    return currentDateTime >= startDateTime && currentDateTime <= endDateTime;
  };

  // Filter assignments by upcoming and attempted
  const upcomingAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "upcoming" ||
      (assignment.status !== "completed" && assignment.status !== "attempted")
  );

  const attemptedAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "attempted" || assignment.status === "completed"
  );

  // Timer effect
  useEffect(() => {
    if (!started || isSubmitted || !activeAssignment) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, isSubmitted, activeAssignment]);

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m ` : ""
    }${remainingSeconds}s`;
  };

  // Format date string for display
  const formatDateTimeRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDateStr = start.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endDateStr = end.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (startDateStr === endDateStr) {
      return `${startDateStr} (${startTimeStr} - ${endTimeStr})`;
    } else {
      return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
    }
  };

  // Define subject colors
  const subjectColors = {
    Mathematics: "bg-red-200", // Red for Maths
    Chemistry: "bg-blue-200", // Blue for Science (using Chemistry as example)
    Physics: "bg-blue-300", // Another blue shade for Science
    Biology: "bg-cyan-200", // Cyan for Biology
    History: "bg-green-200", // Green for Social Science (using History as example)
    Geography: "bg-green-300", // Another green shade for Social Science
    "Computer Science": "bg-yellow-200", // Yellow for Computer Science
    // Add more subjects and colors as needed
    default: "bg-violet-300", // Default color
  };

  // Calculate due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle answer changes
  const handleAnswerChange = (questionId, value, optionId = null) => {
    if (!activeAssignment) return;

    const question = activeAssignment.questions.find(
      (q) => q.id === questionId
    );

    if (question.type === "mcq") {
      setAnswers({
        ...answers,
        [questionId]: optionId,
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    }
  };

  // Handle saving an answer
  const handleSaveAnswer = (questionId) => {
    if (answers[questionId] !== undefined) {
      setSavedAnswers({
        ...savedAnswers,
        [questionId]: answers[questionId],
      });
    }
  };

  // Handle marking a question for review
  const handleMarkForReview = (questionId) => {
    if (markedForReview.includes(questionId)) {
      setMarkedForReview(markedForReview.filter((id) => id !== questionId));
    } else {
      setMarkedForReview([...markedForReview, questionId]);
    }
  };

  // Navigate questions
  const goToNextQuestion = () => {
    if (!activeAssignment) return;

    if (currentQuestion < activeAssignment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index) => {
    if (!activeAssignment) return;

    if (index >= 0 && index < activeAssignment.questions.length) {
      setCurrentQuestion(index);
    }
  };

  // Added handler for Navbar toggle
  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Handle selecting an assignment
  const handleSelectAssignment = (assignment) => {
    setActiveAssignment(assignment);
    setTimeRemaining(assignment.duration * 60);
    // Reset states
    setAnswers({});
    setSavedAnswers({});
    setMarkedForReview([]);
    setCurrentQuestion(0);
    return null; // Return null if no active assignment or not started
  };

  // Handle start
  const handleStart = () => {
    if (activeAssignment && isAssignmentAvailable(activeAssignment)) {
      setStarted(true);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    setIsSubmitted(true);
    // In a real app, would send only savedAnswers to the server
    console.log("Submitted answers:", savedAnswers);
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!activeAssignment) return 0;

    const answeredCount = Object.keys(answers).length;
    return Math.round(
      (answeredCount / activeAssignment.questions.length) * 100
    );
  };

  // Get question status (answered, saved, marked for review)
  const getQuestionStatus = (questionId) => {
    const isAnswered = answers[questionId] !== undefined;
    const isSaved = savedAnswers[questionId] !== undefined;
    const isMarkedForReview = markedForReview.includes(questionId);

    return { isAnswered, isSaved, isMarkedForReview };
  };

  // Render the assignments list screen
  const renderAssignmentsList = () => (
    <div className="max-w-6xl mx-auto p-6 px-4 mt-8">
      <h1 className="text-2xl font-bold text-violet-500 mb-6">
        My Assignments
      </h1>

      {/* Tabs for filtering assignments */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            currentTab === "upcoming"
              ? "border-b-2 border-violet-500 text-violet-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setCurrentTab("upcoming")}
        >
          Upcoming Assignments
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            currentTab === "attempted"
              ? "border-b-2 border-violet-500 text-violet-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setCurrentTab("attempted")}
        >
          Attempted Assignments
        </button>
      </div>

      {currentTab === "upcoming" && upcomingAssignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No upcoming assignments available.</p>
        </div>
      )}

      {currentTab === "attempted" && attemptedAssignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No attempted assignments yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTab === "upcoming" &&
          upcomingAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`${
                subjectColors[assignment.subject] || subjectColors.default
              } rounded-2xl shadow-md overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {assignment.title}
                  </h2>
                  <span className="bg-gray-300 text-violet-800 text-xs font-semibold px-2.5 py-0.5 rounded ">
                    {assignment.subject}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {assignment.className} {assignment.section}
                </p>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex items-center mb-2 text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    Available:{" "}
                    {formatDateTimeRange(
                      assignment.startDate,
                      assignment.endDate
                    )}
                  </span>
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: {assignment.duration} minutes</span>
                </div>

                <div className="flex justify-between text-sm mb-6">
                  <div>
                    <p className="font-medium text-gray-600">Total Marks:</p>
                    <p className="text-gray-800">
                      {assignment.totalMarks} marks
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Passing Score:</p>
                    <p className="text-gray-800">
                      {assignment.passingScore} marks
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectAssignment(assignment)}
                  disabled={!isAssignmentAvailable(assignment)}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isAssignmentAvailable(assignment)
                      ? "bg-violet-600 text-white hover:bg-violet-500 focus:ring-blue-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isAssignmentAvailable(assignment)
                    ? "Start Assignment"
                    : "Not Available Yet"}
                </button>
              </div>
            </div>
          ))}

        {currentTab === "attempted" &&
          attemptedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-violet-300 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {assignment.title}
                  </h2>
                  <span
                    className={`text-xs font-semibold ml-1 px-2.5 py-0.5 rounded ${
                      assignment.status === "completed"
                        ? "bg-lime-200 text-lime-800"
                        : "bg-pink-200 text-pink-600"
                    }`}
                  >
                    {assignment.status === "completed"
                      ? "Completed"
                      : "Attempted"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 ml-4">
                  {assignment.className} {assignment.section} -{" "}
                  {assignment.subject}
                </p>

                <div className="flex items-center mb-2 text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    Taken on:{" "}
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4 bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Your Score:
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {assignment.score} / {assignment.totalMarks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        assignment.score >= assignment.passingScore
                          ? "bg-violet-600"
                          : "bg-red-600"
                      }`}
                      style={{
                        width: `${
                          (assignment.score / assignment.totalMarks) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span
                      className={`text-xs font-medium ${
                        assignment.score >= assignment.passingScore
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {assignment.score >= assignment.passingScore
                        ? "Passed"
                        : "Failed"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectAssignment(assignment)}
                  className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Render the assignment welcome screen
  const renderWelcomeScreen = () => (
    <div className="max-w-3xl m-auto p-6 bg-violet-300 rounded-2xl shadow-lg mt-8">
      <div className="text-center flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {activeAssignment.title}
        </h1>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 ml-18">
          <span>{activeAssignment.subject}</span>
          <span>•</span>
          <span>
            {activeAssignment.className} {activeAssignment.section}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-4">{activeAssignment.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-violet-200 p-4 rounded-2xl">
            <p className="text-sm text-gray-700 mb-1">Available</p>
            <p className="font-semibold">
              {formatDateTimeRange(
                activeAssignment.startDate,
                activeAssignment.endDate
              )}
            </p>
          </div>

          <div className="bg-violet-200 p-4 rounded-2xl">
            <p className="text-sm text-gray-700 mb-1">Duration</p>
            <p className="font-semibold">{activeAssignment.duration} minutes</p>
          </div>

          <div className="bg-violet-200 p-4 rounded-2xl">
            <p className="text-sm text-gray-700 mb-1">Total Marks</p>
            <p className="font-semibold">{activeAssignment.totalMarks} marks</p>
          </div>

          <div className="bg-violet-200 p-4 rounded-2xl">
            <p className="text-sm text-gray-700 mb-1">Passing Score</p>
            <p className="font-semibold">
              {activeAssignment.passingScore} marks
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-violet-600 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-violet-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-violet-700">
              Once you start this assignment, the timer will begin. Make sure
              you have enough time to complete it.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveAssignment(null)}
          className="px-6 py-3 text-white rounded-lg bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
        >
          Back to Assignments
        </button>

        {activeAssignment.status === "upcoming" ? (
          <button
            onClick={handleStart}
            disabled={!isAssignmentAvailable(activeAssignment)}
            className={`px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isAssignmentAvailable(activeAssignment)
                ? "bg-lime-700 text-white hover:bg-lime-600 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAssignmentAvailable(activeAssignment)
              ? "Start Assignment"
              : "Not Available Yet"}
          </button>
        ) : (
          <div className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg">
            Assignment{" "}
            {activeAssignment.status === "completed"
              ? "Completed"
              : "Attempted"}
            : {activeAssignment.score} / {activeAssignment.totalMarks}
          </div>
        )}
      </div>
    </div>
  );

  // Render a single question
  const renderQuestion = (question, index) => {
    if (!activeAssignment) return null;

    const { isAnswered, isSaved, isMarkedForReview } = getQuestionStatus(
      question.id
    );

    return (
      <div
        className="bg-violet-300 rounded-lg shadow-md p-6 mb-6"
        key={question.id}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Question {index + 1}
          </h3>
          {activeAssignment.showMarks && (
            <span className="bg-white text-violet-500 text-sm font-medium px-2.5 py-0.5 rounded-4xl">
              {question.marks} marks
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-4">{question.text}</p>

        {question.type === "mcq" && (
          <div className="space-y-3 mb-4">
            {question.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border rounded-2xl transition-colors ${
                  answers[question.id] === option.id
                    ? "bg-violet-200 border-violet-300"
                    : "border-violet-700 hover:bg-violet-400"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === option.id}
                  onChange={() =>
                    handleAnswerChange(question.id, null, option.id)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "short" && (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows="3"
            placeholder="Enter your answer here..."
          ></textarea>
        )}

        {question.type === "long" && (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows="6"
            placeholder="Enter your answer here..."
          ></textarea>
        )}

        {/* Save and Mark for Review buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleSaveAnswer(question.id)}
            disabled={!isAnswered}
            className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-lg ${
              !isAnswered
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isSaved
                ? "bg-lime-300 text-lime-700 border border-lime-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <BookmarkIcon size={16} className="mr-1" />
            {isSaved ? "Saved" : "Save Answer"}
          </button>

          <button
            onClick={() => handleMarkForReview(question.id)}
            className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-lg ${
              isMarkedForReview
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Flag size={16} className="mr-1" />
            {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
          </button>
        </div>

        {activeAssignment.oneQuestionAtATime && (
          <div className="flex justify-between mt-2">
            <button
              onClick={goToPrevQuestion}
              disabled={index === 0}
              className={`px-4 py-2 flex items-center text-sm font-medium rounded-lg ${
                index === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </button>

            <button
              onClick={goToNextQuestion}
              disabled={index === activeAssignment.questions.length - 1}
              className={`px-4 py-2 flex items-center text-sm font-medium rounded-lg ${
                index === activeAssignment.questions.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render the questions screen
  const renderQuestionsScreen = () => (
    <div className="max-w-6xl mx-auto my-8 px-4 mt-8">
      {/* Header with timer and progress */}
      <div className="bg-violet-300 rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {activeAssignment.title}
        </h1>

        <div className="flex items-center space-x-4">
          {activeAssignment.showTimer && (
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="mr-2" />
              <span
                className={`font-medium ${
                  timeRemaining < 300 ? "text-red-600" : ""
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="lg:flex-1">
          {activeAssignment.oneQuestionAtATime
            ? renderQuestion(
                activeAssignment.questions[currentQuestion],
                currentQuestion
              )
            : activeAssignment.questions.map((question, index) =>
                renderQuestion(question, index)
              )}

          {/* Bottom navigation for one question at a time mode */}
          {!activeAssignment.oneQuestionAtATime && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit Assignment
              </button>
            </div>
          )}
        </div>

        {/* Progress sidebar */}
        {activeAssignment.showProgressIndicator && (
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Progress
              </h3>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Questions Saved</span>
                  <span>
                    {Object.keys(savedAnswers).length} /{" "}
                    {activeAssignment.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (Object.keys(savedAnswers).length /
                          activeAssignment.questions.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {activeAssignment.questions.map((question, index) => {
                  const { isAnswered, isSaved, isMarkedForReview } =
                    getQuestionStatus(question.id);

                  let buttonClass =
                    "bg-gray-100 text-gray-800 hover:bg-gray-200";
                  if (currentQuestion === index) {
                    buttonClass = "bg-blue-600 text-white";
                  } else if (isMarkedForReview) {
                    buttonClass =
                      "bg-purple-100 text-purple-800 border border-purple-300";
                  } else if (isSaved) {
                    buttonClass =
                      "bg-green-100 text-green-800 border border-green-300";
                  } else if (isAnswered) {
                    buttonClass =
                      "bg-yellow-100 text-yellow-800 border border-yellow-300";
                  }

                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`w-full aspect-square flex items-center justify-center text-sm rounded-md ${buttonClass}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-1"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
                    <span>Saved</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded mr-1"></div>
                    <span>Marked for Review</span>
                  </div>
                </div>
              </div>

              {activeAssignment.oneQuestionAtATime && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentQuestion === 0}
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      currentQuestion === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>

                  <button
                    onClick={goToNextQuestion}
                    disabled={
                      currentQuestion === activeAssignment.questions.length - 1
                    }
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      currentQuestion === activeAssignment.questions.length - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render submitted screen
  const renderSubmittedScreen = () => (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-violet-300 rounded-lg shadow-lg text-center mt-8">
      <div className="mb-6">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Assignment Submitted
        </h1>
        <p className="text-gray-600">
          Your saved answers have been successfully submitted.
        </p>
      </div>

      <div className="bg-violet-200 p-4 rounded-lg mb-6 text-left">
        <h2 className="font-semibold text-lg mb-2">Assignment Summary</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-700">Title:</span>
            <span className="font-medium">{activeAssignment.title}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-700">Subject:</span>
            <span className="font-medium">{activeAssignment.subject}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-700">Questions Attempted:</span>
            <span className="font-medium">
              {Object.keys(savedAnswers).length} /{" "}
              {activeAssignment.questions.length}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-700">Time Taken:</span>
            <span className="font-medium">
              {formatTime(activeAssignment.duration * 60 - timeRemaining)}
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          setActiveAssignment(null);
          setStarted(false);
          setIsSubmitted(false);
          setAnswers({});
          setSavedAnswers({});
          setMarkedForReview([]);
        }}
        className="px-6 py-3 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Back to Assignments
      </button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <StudentNavbar onNavToggle={handleNavToggle} />
      <div className={`flex-1 transition-all duration-300 ${navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"}`}>
        <div className="p-4 md:p-8">
          {!activeAssignment ? (
            renderAssignmentsList()
          ) : !started ? (
            renderWelcomeScreen()
          ) : isSubmitted ? (
            renderSubmittedScreen()
          ) : (
            renderQuestionsScreen()
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentInterface;
