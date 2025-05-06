import React, { useState, useEffect } from "react";
import { Check, ChevronDown, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

// Import components
import Navbar from "../TeacherNavbar"; // Reusing the same Navbar component
import TemplateSelection from "./TemplateSelection";
import ContentCreation from "./content/ContentCreation";
import SettingsConfiguration from "./SettingConfig";
import ReviewComponent from "./EnhancedReview";

export default function AssignmentCreatorMain() {
  const location = useLocation();

  // Original state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("quiz");
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    timeLimit: "",
    dueDate: "",
    subject: "",
    gradeLevel: "",
    difficulty: "medium",
    sections: [],
  });

  // Navbar state (added from TeacherDashboard)
  const [navExpanded, setNavExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Reset state when navigating to this component
  useEffect(() => {
    setCurrentStep(1);
    setSelectedTemplate("quiz");
    setAssignmentData({
      title: "",
      description: "",
      timeLimit: "",
      dueDate: "",
      subject: "",
      gradeLevel: "",
      difficulty: "medium",
      sections: [],
    });
  }, [location.pathname]);

  // Check for mobile screen size - matching TeacherDashboard approach
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle moving to next step
  const handleNextStep = (data) => {
    console.log(`--- Step ${currentStep} -> Step ${currentStep + 1} ---`);
    console.log("Data received from previous step:", data);
    console.log("assignmentData BEFORE update:", assignmentData);

    let nextAssignmentData = assignmentData; // Keep current data by default

    if (data) { // Only merge if data is provided
        // Special handling if data contains 'settings' (from Step 3)
        if (data.settings !== undefined) {
             // Ensure we are merging settings onto the existing data correctly
             // The data passed from SettingConfig should already contain ...assignmentData
             // So, just using 'data' should be sufficient if SettingConfig sends everything
             nextAssignmentData = data;
             console.log("Received settings, using data as next state:", nextAssignmentData);
        } else {
            // Merge data from ContentCreation (Step 2)
            nextAssignmentData = { ...assignmentData, ...data };
            console.log("Merging data from Content step:", nextAssignmentData);
        }
    } else {
        console.log("No data received, proceeding to next step without data merge.");
    }


    if (currentStep < 4) {
      setAssignmentData(nextAssignmentData); // Update state
      console.log("assignmentData AFTER update (will reflect on next render):", nextAssignmentData);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
       console.log("Already on last step or attempting to go beyond.");
    }
  };

  // Handle moving to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  // Handle navbar toggle (from TeacherDashboard)
  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Toggle theme (from TeacherDashboard)
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle profile click (from TeacherDashboard)
  const handleProfileClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Utility Icons component (from TeacherDashboard)
  const UtilityIcons = () => (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {darkMode ? (
          <IoSunnyOutline className="text-xl" />
        ) : (
          <IoMoonOutline className="text-xl" />
        )}
      </button>
      <button
        onClick={handleProfileClick}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <IoPersonCircleOutline className="text-xl" />
        )}
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-purple-200 via-white to-purple-300"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Navbar Integration - Using same approach as TeacherDashboard */}
        <Navbar onNavToggle={handleNavToggle} />

        {/* Mobile Utility Icons - Using same positioning as TeacherDashboard */}
        {isMobile && (
          <div className="fixed top-3 right-16 z-50">
            <UtilityIcons />
          </div>
        )}

        {/* Main Content Area - Using same margin and transition as TeacherDashboard */}
        <div
          className={`flex-1 transition-all duration-300 pt-[20px] md:pt-0 ${
            navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"
          }`}
        >
          <div className="p-6 md:p-8">
            {/* Desktop Utility Icons - Using same layout as TeacherDashboard */}
            {!isMobile && (
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
                    Create Assignment
                  </h1>
                  <h2 className="text-gray-500 text-lg mt-2">
                    Build a new learning experience for your students
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <UtilityIcons />
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 mt-1 mb-8 sm:mb-10 transition-all duration-300">
              <div className="flex items-center justify-between">
                {["Template", "Content", "Settings", "Review"].map(
                  (step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative"
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-sm font-medium ${
                          currentStep > index + 1
                            ? "bg-purple-600 text-white"
                            : currentStep === index + 1
                            ? "bg-purple-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        } shadow-sm transition-all duration-200`}
                      >
                        {currentStep > index + 1 ? (
                          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs sm:text-sm hidden sm:block ${
                          currentStep === index + 1
                            ? "font-medium text-purple-800"
                            : "text-gray-600"
                        }`}
                      >
                        {step}
                      </span>

                      {/* Connecting line */}
                      {index < 3 && (
                        <div className="absolute left-10 sm:left-12 top-5 sm:top-6 w-full h-0.5 bg-gray-200">
                          <div
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{
                              width: currentStep > index + 1 ? "100%" : "0%",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Template Cards */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              {currentStep === 1 && (
                <TemplateSelection
                  onSelectTemplate={handleTemplateSelect}
                  onNext={() => handleNextStep()}
                />
              )}

              {currentStep === 2 && (
                <ContentCreation
                  onNext={handleNextStep}
                  onPrevious={handlePrevStep}
                  selectedTemplate={selectedTemplate}
                />
              )}

              {currentStep === 3 && (
                <SettingsConfiguration
                  onNext={handleNextStep}
                  onPrevious={handlePrevStep}
                  assignmentData={assignmentData}
                />
              )}

              {currentStep === 4 && (
                <ReviewComponent
                  onPrevious={handlePrevStep}
                  finalAssignment={{
                    ...assignmentData,
                    template: selectedTemplate,
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Adding TeacherDashboard's responsive styling */}
      <style jsx>{`
        @media (max-width: 767px) {
          .p-6 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          h1,
          h2 {
            text-align: left;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .tablet\\:grid-cols-1 {
            grid-template-columns: 1fr;
          }
          .tablet\\:col-span-1 {
            grid-column: span 1 / span 1;
          }
          .p-6,
          .md\\:p-8 {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
          .flex-1 {
            margin-left: ${navExpanded ? "330px" : "100px"};
          }
          .mb-10,
          .p-5 {
            width: 100%;
          }
          .mb-4,
          .mb-6,
          .mt-6 {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .flex.justify-end {
            justify-content: flex-end;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
