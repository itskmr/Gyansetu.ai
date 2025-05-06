import React from "react";
import {
  CheckCircle,
  Edit,
  Calendar,
  Clock,
  Award,
  Settings as SettingsIcon,
  List,
  Target,
  FileText,
  Link as LinkIcon,
  Users,
  User,
  Percent,
  Eye,
  ClipboardCheck,
  AlertTriangle,
  Info,
  Type,
  BookOpen,
  PenTool,
  FileText as TestIcon,
  Folder,
  X,
} from "lucide-react";

// --- Helper Functions ---

// Format Date and Time (Improved Robustness)
const formatDateTime = (dateString, time = {}) => {
  if (!dateString) return "Not specified";
  try {
    // Basic validation of dateString format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.warn("Invalid date string format received:", dateString);
        return "Invalid Date";
    }

    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(5, 7)) - 1; // Month is 0-indexed
    const day = parseInt(dateString.substring(8, 10));

    // Basic validation of parsed date components
    const tempDate = new Date(Date.UTC(year, month, day)); // Use UTC to check validity
    if (isNaN(tempDate.getTime()) || tempDate.getUTCFullYear() !== year || tempDate.getUTCMonth() !== month || tempDate.getUTCDate() !== day) {
        console.warn("Invalid date components after parsing:", year, month, day);
        return "Invalid Date";
    }

    // Proceed with time parsing
    const hour = parseInt(time.hour || "12", 10);
    const minute = parseInt(time.minute || "0", 10);
    const isPM = (time.amPm || "AM").toUpperCase() === "PM";

    // Validate hour/minute ranges
    if (isNaN(hour) || hour < 1 || hour > 12 || isNaN(minute) || minute < 0 || minute > 59) {
        console.warn("Invalid time components:", time);
        return formatDate(dateString); // Fallback to date only if time is invalid
    }

    let adjustedHour = hour;
    if (isPM && hour < 12) adjustedHour += 12;
    if (!isPM && hour === 12) adjustedHour = 0; // Midnight case

    // Construct final date object using local timezone interpretation of date + parsed time
    const finalDate = new Date(year, month, day, adjustedHour, minute);

    if (isNaN(finalDate.getTime())) {
       console.error("Constructed invalid date in formatDateTime:", year, month, day, adjustedHour, minute);
       return formatDate(dateString); // Fallback if final combination is invalid
    }

    return finalDate.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  } catch (error) {
    console.error("Error formatting date/time:", dateString, time, error);
    return "Invalid Date/Time";
  }
};

// Format Date Only
const formatDate = (dateString) => {
   if (!dateString) return "Not specified";
  try {
     // Basic validation of dateString format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.warn("Invalid date string format received for formatDate:", dateString);
        return "Invalid Date";
    }
    // Use UTC interpretation to avoid timezone issues when only date is relevant
    const date = new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) {
        console.error("Invalid date value received in formatDate:", dateString);
        return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      timeZone: "UTC", // Specify timezone consistent with input interpretation
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// Difficulty Badge
const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null;
  const styles = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };
  const lowerDifficulty = difficulty.toLowerCase();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[lowerDifficulty] || "bg-gray-100 text-gray-800"
      }`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

// Template Info (Primary source is the passed 'template' field)
const getTemplateInfo = (assignment) => {
    const templateType = assignment?.template?.toLowerCase();
     switch (templateType) {
        case "quiz": return { name: "Quiz", icon: BookOpen };
        case "written": return { name: "Written", icon: PenTool };
        case "test": return { name: "Test", icon: TestIcon };
        case "project": return { name: "Project", icon: Folder };
        default:
            console.warn("Template type missing or unrecognized in assignment data, attempting fallback detection:", templateType);
            // Fallback heuristics (less reliable)
            if (assignment?.projectType) return { name: "Project", icon: Folder };
            if (assignment?.grading?.rubric !== undefined) return { name: "Written", icon: PenTool };
            if (assignment?.sections?.[0]?.questions?.[0]?.options) return { name: "Quiz/Test", icon: BookOpen }; // Can't easily distinguish quiz/test here
            return { name: "Assignment", icon: FileText }; // Generic fallback
    }
};

// --- Component ---
export default function EnhancedReview({ onPrevious, onPublish, finalAssignment }) {
  // Ensure assignment and settings are always objects
  const assignment = finalAssignment || {};
  const settings = assignment.settings || {};
  const templateInfo = getTemplateInfo(assignment);

  // --- Handlers ---
  const handlePublish = () => {
    console.log("Publishing:", assignment);
    if (onPublish) {
      onPublish(assignment); // Pass the complete assignment data
    }
    // Consider adding user feedback (e.g., success message, navigation)
  };

  const handleSaveDraft = () => {
    console.log("Saving Draft:", assignment);
    // Add save draft logic here (e.g., API call)
    // Consider adding user feedback
  };

  // --- Display Helpers ---
  const renderValue = (value, placeholder = "Not specified") => {
    // Check for null, undefined, or empty string
    const isEmpty = value === null || value === undefined || value === "";
    return isEmpty ? <span className="text-gray-500 italic">{placeholder}</span> : value;
  };

  const renderBoolean = (value) => {
     // Default to false if value is not explicitly true
     const boolValue = value === true;
    return boolValue ? <CheckCircle className="w-5 h-5 text-green-500 inline" /> : <X className="w-5 h-5 text-red-500 inline" />;
  };

  const renderList = (items, renderItem, placeholder = "None") => {
        if (!Array.isArray(items) || items.length === 0) {
       return <p className="text-gray-500 italic text-xs">{placeholder}</p>;
    }
    if (typeof renderItem !== 'function') {
        console.error("renderList expects renderItem to be a function.");
        return <p className="text-red-500 italic">Error rendering list.</p>;
    }
    // Using ul for semantic list structure
    return <ul className="list-none pl-0 space-y-1">{items.map(renderItem)}</ul>;
  };

  // --- Content Rendering Functions ---
  const renderQuizTestContent = (sections) => (
    renderList(sections, (section, secIndex) => (
      // Use React.Fragment for key when mapping without a dedicated wrapper element
      <React.Fragment key={`sec-${section.id || secIndex}`}>
       <li className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
         <h5 className="font-semibold text-purple-700">Section {secIndex + 1}: {renderValue(section.title)}</h5>
         {/* Display section details concisely */}
         <p className="text-sm text-gray-600">
           Type: {renderValue(section.questionType)} • Points/Q: {renderValue(section.pointsPerQuestion)}
         </p>
         {section.instructions && <p className="text-xs text-gray-600 mt-1 italic">Instructions: {section.instructions}</p>}
         {/* Render questions within the section */}
         {renderList(section.questions, (q, qIndex) => (
           <React.Fragment key={`q-${q.id || qIndex}`}>
            <li className="mt-2 text-sm border-t border-gray-200 pt-2">
             <span className="font-medium">Q{qIndex + 1}:</span> {renderValue(q.text, "Question text missing")}
             {/* Display options if multiple-choice */}
             {q.type === 'multiple-choice' && q.options && renderList(q.options, (opt, optIndex) => (
               <React.Fragment key={`opt-${opt.id || optIndex}`}>
                <li className="text-xs ml-4 flex items-center">
                   {opt.text || <span className="italic text-gray-400">Empty Option</span>}
                   {/* Indicate correct answer(s) */}
                   {Array.isArray(q.correctAnswers) && q.correctAnswers.includes(opt.id) ?
                     <CheckCircle className="w-3 h-3 inline text-green-500 ml-2 flex-shrink-0"/> : ''
                   }
                 </li>
               </React.Fragment>
             ), "No options defined.", "list-disc ml-4")} {/* Use list-disc for options */}
             {/* Display correct answer if true/false */}
             {q.type === 'true-false' && q.correctAnswer !== undefined && q.correctAnswer !== null &&
               <p className="text-xs ml-4">Correct Answer: <span className="font-medium">{renderValue(q.correctAnswer.toString())}</span></p>
             }
             {/* Display sample answer if short/long answer */}
             {(q.type === 'short-answer' || q.type === 'long-answer') && q.sampleAnswer &&
                <p className="text-xs text-blue-600 ml-4 mt-1">Sample Answer: {q.sampleAnswer}</p>
             }
             {/* Display blanks if fill-in-the-blank */}
             {q.type === 'fill-blank' && q.blanks &&
                <div className="ml-4 mt-1">
                    <span className="text-xs font-medium">Blanks:</span>
                    {renderList(q.blanks, (blank, bIndex) => (
                        <React.Fragment key={`b-${blank.id || bIndex}`}>
                        <li className="text-xs">Blank {bIndex+1} Answer: <span className="font-mono bg-gray-200 px-1 rounded text-xs">{blank.answer || <span className="italic text-gray-400">empty</span>}</span></li>
                        </React.Fragment>
                    ), "No blanks defined.")}
                </div>
             }
             {/* Display explanation if provided */}
             {q.explanation && <p className="text-xs text-gray-500 italic ml-4 mt-1">Explanation: {q.explanation}</p>}
            </li>
           </React.Fragment>
         ), "No questions in this section.")}
       </li>
      </React.Fragment>
    ), "No sections defined.")
  );

  const renderWrittenContent = (sections, grading) => (
    <>
      {/* Display Rubric if enabled and exists */}
      {grading?.enabled && Array.isArray(grading.rubric) && grading.rubric.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
           <h5 className="font-semibold text-yellow-800">Grading Rubric:</h5>
           {renderList(grading.rubric, (item, i) => (
                <li key={i} className="text-xs">{item.criteria} ({item.points} points)</li>
            ), "No rubric items defined.")}
        </div>
      )}
      {/* Render sections and questions (can reuse quiz/test logic) */}
      {renderQuizTestContent(sections)}
    </>
  );

 const renderProjectContent = (projData) => (
     <div className="space-y-4"> {/* Increased spacing */}
      <p><span className="font-medium">Project Type:</span> {projData.projectType === 'group' ? <><Users className="inline w-4 h-4 mr-1 text-blue-600"/> Group</> : <><User className="inline w-4 h-4 mr-1 text-green-600"/> Individual</>}</p>
      {/* Learning Objectives */}
      <div>
        <h5 className="font-medium text-purple-700 border-b pb-1 mb-1">Learning Objectives:</h5>
        {renderList(projData.learningObjectives, (obj, i) => <li key={i} className="text-xs flex items-start"><Target className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-purple-400"/>{obj}</li>, "No objectives listed.")}
      </div>
      {/* Resources */}
      <div>
        <h5 className="font-medium text-purple-700 border-b pb-1 mb-1">Resources:</h5>
        {renderList(projData.resources, (res, i) => (
          <li key={i} className="text-xs flex items-start">
            <FileText className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-blue-400"/>
            {res.title}: {res.link ? <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center ml-1"><LinkIcon className="w-3 h-3 mr-1"/>{res.link}</a> : <span className="italic text-gray-500 ml-1">No link</span>}
          </li>
        ), "No resources listed.")}
      </div>
      {/* Deliverables */}
       <div>
        <h5 className="font-medium text-purple-700 border-b pb-1 mb-1">Deliverables:</h5>
        {renderList(projData.deliverables, (del, i) => (
          <li key={i} className="text-xs flex items-start"><ClipboardCheck className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-green-400"/>{del.description} ({del.points || 0} points)</li>
        ), "No deliverables listed.")}
      </div>
      {/* Milestones */}
      <div>
        <h5 className="font-medium text-purple-700 border-b pb-1 mb-1">Milestones:</h5>
        {renderList(projData.milestones, (mile, i) => (
          <li key={i} className="text-xs flex items-start"><Calendar className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-red-400"/>{mile.title} (Due: {formatDate(mile.dueDate)}) - {mile.description}</li>
        ), "No milestones listed.")}
      </div>
      {/* Add Evaluation Criteria if present in data structure */}
    </div>
  );

  // Decides which content renderer to use
  const renderContentDetails = () => {
    const templateName = templateInfo.name.toLowerCase();
    // Check specifically for project type or sections array existence
    const hasContent = templateName === 'project' || (Array.isArray(assignment.sections) && assignment.sections.length > 0);

    if (!assignment || !hasContent) {
         return <p className="text-gray-500 italic p-4 text-center">No content details added.</p>;
    }

    switch (templateName) {
      case "quiz":
      case "test":
        return renderQuizTestContent(assignment.sections);
      case "written":
        return renderWrittenContent(assignment.sections, assignment.grading);
      case "project":
        // Ensure the main assignment object is passed if it contains project details directly
        return renderProjectContent(assignment);
      default:
        return <p className="text-gray-500 italic">Content type not recognized.</p>;
    }
  };

  // --- Main JSX ---
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-purple-500 max-w-5xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-1 text-purple-800">
        Review Assignment
      </h2>
      <p className="text-gray-500 mb-8">
        Check all the details below before publishing or saving.
      </p>

      {/* Section 1: Overview */}
      <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-purple-800 flex items-center">
             {/* Dynamically render icon based on template */}
             {React.createElement(templateInfo.icon, { className: "w-6 h-6 mr-2 text-purple-600 flex-shrink-0"})}
            {renderValue(assignment.title, "Untitled Assignment")}
          </h3>
          {/* Add Edit button logic if needed (e.g., onClick={() => onPrevious('overview')}) */}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Description/Instructions</h4>
          <div className="text-gray-700 bg-white p-3 rounded-md border border-gray-200 text-sm min-h-[4em]"> {/* Added min-height */}
            {renderValue(assignment.description, "No description provided.")}
          </div>
        </div>

        {/* Overview Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
           {/* Subject */}
           <div className="bg-white p-3 rounded-md border border-gray-200">
             <h5 className="text-xs font-medium text-gray-500 mb-1">Subject</h5>
             <p className="font-medium flex items-center">
               <Award className="w-4 h-4 text-purple-500 mr-1.5 flex-shrink-0" />
               {renderValue(settings.subject)}
             </p>
           </div>
           {/* Start Time */}
           <div className="bg-white p-3 rounded-md border border-gray-200">
             <h5 className="text-xs font-medium text-gray-500 mb-1">Start Time</h5>
             <p className="font-medium flex items-center">
               <Calendar className="w-4 h-4 text-green-500 mr-1.5 flex-shrink-0" />
               {renderValue(formatDateTime(assignment.dueDate, { hour: assignment.startTimeHour, minute: assignment.startTimeMinute, amPm: assignment.startTimeAmPm }), "Not set")}
            </p>
          </div>
          {/* End Time / Due */}
           <div className="bg-white p-3 rounded-md border border-gray-200">
             <h5 className="text-xs font-medium text-gray-500 mb-1">End Time / Due</h5>
             <p className="font-medium flex items-center">
               <Calendar className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0" />
               {renderValue(formatDateTime(assignment.dueDate, { hour: assignment.endTimeHour, minute: assignment.endTimeMinute, amPm: assignment.endTimeAmPm }), "Not set")}
             </p>
          </div>
          {/* Time Limit */}
          <div className="bg-white p-3 rounded-md border border-gray-200">
             <h5 className="text-xs font-medium text-gray-500 mb-1">Time Limit</h5>
             <p className="font-medium flex items-center">
               <Clock className="w-4 h-4 text-blue-500 mr-1.5 flex-shrink-0" />
               {renderValue(assignment.timeLimit ? `${assignment.timeLimit} minutes` : null, "No limit")}
             </p>
          </div>
        </div>
      </div>

       {/* Section 2: Content Details */}
       <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
         <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
           <List className="w-6 h-6 mr-2"/> Content Details ({templateInfo.name})
         </h3>
         <div className="text-sm text-gray-800 bg-white p-4 rounded border border-blue-200">
           {renderContentDetails()}
         </div>
       </div>

      {/* Section 3: Settings */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <SettingsIcon className="w-6 h-6 mr-2"/> Configuration Settings
        </h3>
        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">

          {/* Column 1: Academic & Grading */}
          <div className="space-y-6">
             {/* Academic Settings */}
             <div className="space-y-1">
                 <h4 className="font-semibold text-purple-700 mb-2 border-b pb-1">Academic</h4>
                 <p><span className="font-medium w-28 inline-block">Class:</span> {renderValue(settings.class)}</p>
                 <p><span className="font-medium w-28 inline-block">Section:</span> {renderValue(settings.section)}</p>
                 {/* Conditionally render Stream */}
                 {settings.stream && <p><span className="font-medium w-28 inline-block">Stream:</span> {renderValue(settings.stream)}</p>}
                 <p><span className="font-medium w-28 inline-block">Subject:</span> {renderValue(settings.subject)}</p>
                 <p><span className="font-medium w-28 inline-block">Difficulty:</span> {getDifficultyBadge(settings.difficulty) || renderValue(null)}</p>
                 <p><span className="font-medium w-28 inline-block">Passing Score:</span> {settings.passingScore !== undefined ? `${settings.passingScore}%` : renderValue(null)}</p>
             </div>

             {/* Grading & Feedback Settings */}
             <div className="space-y-1">
                 <h4 className="font-semibold text-purple-700 mb-2 border-b pb-1 flex items-center"><ClipboardCheck className="w-4 h-4 mr-1.5"/>Grading & Feedback</h4>
                 <p><span className="font-medium w-32 inline-block">Grading Type:</span> {renderValue(settings.gradingType)}</p>
                 <p><span className="font-medium w-32 inline-block">Feedback Type:</span> {renderValue(settings.feedbackType)}</p>
            </div>
          </div>

          {/* Column 2: Display & Late Submission */}
           <div className="space-y-6">
             {/* Display Settings */}
             <div className="space-y-1">
               <h4 className="font-semibold text-purple-700 mb-2 border-b pb-1 flex items-center"><Eye className="w-4 h-4 mr-1.5"/>Display</h4>
               <p><span className="font-medium w-32 inline-block">Question Order:</span> {renderValue(settings.questionOrder)}</p>
               <p><span className="font-medium w-32 inline-block">Display Mode:</span> {renderValue(settings.displayMode)}</p>
               <p><span className="font-medium w-32 inline-block">Show Points:</span> {renderBoolean(settings.showPoints)}</p>
               <p><span className="font-medium w-32 inline-block">Show Timer:</span> {renderBoolean(settings.showTimer)}</p>
               <p><span className="font-medium w-32 inline-block">Show Progress:</span> {renderBoolean(settings.showProgress)}</p>
             </div>

             {/* Late Submission Policy */}
             <div className="space-y-1">
                <h4 className="font-semibold text-purple-700 mb-2 border-b pb-1 flex items-center"><AlertTriangle className="w-4 h-4 mr-1.5"/>Late Submission</h4>
                <p><span className="font-medium w-32 inline-block">Policy:</span> {renderValue(settings.latePolicy)}</p>
                {/* Show Deadline only if policy is 'accept' */}
                {settings.latePolicy === 'accept' && (
                 <p><span className="font-medium w-32 inline-block">Final Deadline:</span>
                   {settings.setLateDeadline ? formatDate(settings.lateSubmissionDeadline) : <span className="text-gray-500 italic">No final deadline set</span>}
                 </p>
                )}
                {/* Show Penalty Rules only if policy is 'penalty' */}
                 {settings.latePolicy === 'penalty' && (
                   <div className="mt-1">
                     <h5 className="font-medium text-gray-600 text-xs">Penalty Rules:</h5>
                      {renderList(settings.penaltyRules, (rule, i) => (
                       <React.Fragment key={i}>
                         <li className="text-xs">After {renderValue(rule.time, 'N/A')} minutes, deduct {renderValue(rule.points, 'N/A')} points</li>
                       </React.Fragment>
                     ), "No penalty rules defined.")}
                   </div>
                 )}
             </div>
           </div>
        </div>
      </div>


      {/* Navigation Buttons */}
       <div className="mt-10 flex justify-between items-center">
        {/* Back Button */}
        <button
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
        >
          Back to Settings
        </button>
        {/* Action Buttons */}
        <div className="space-x-4">
           <button
             onClick={handleSaveDraft}
             className="px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 font-medium text-sm"
           >
             Save Draft
           </button>
           <button
             onClick={handlePublish}
             className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm text-sm"
           >
             Publish Assignment
           </button>
        </div>
      </div>
    </div>
  );
}
