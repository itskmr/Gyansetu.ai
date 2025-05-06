import React, { useState, useEffect } from "react";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import Navbar from "../../components/teacher/TeacherNavbar";
import ButtonsDemo from "../../components/teacher/TopButtons";
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';

import ClassOverview from "../../components/teacher/ClassOverview";
import ClassPerformance from "../../components/teacher/ClassPerformance";
import NeedsAttention from "../../components/teacher/NeedsAttention";

const TeacherDashboard = () => {
  const [navExpanded, setNavExpanded] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedClass, setSelectedClass] = useState("6");
  const [selectedSection, setSelectedSection] = useState("A");
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Mock data for different classes and sections
  const classData = {
    "6-A": {
      totalStudents: 28,
      avgAttendance: "90%",
      completionRate: "82%",
      needAttention: 2,
      performanceData: { avgScore: "85%", topPerformers: "5" },
      studentsNeedingAttention: [
        {
          name: "Varun Singh",
          issue: "Missed last two homework assignments",
          subject: "English",
        },
      ],
    },
    "6-B": {
      totalStudents: 26,
      avgAttendance: "88%",
      completionRate: "80%",
      needAttention: 3,
      performanceData: { avgScore: "82%", topPerformers: "4" },
      studentsNeedingAttention: [
        {
          name: "Aditya Verma",
          issue: "Struggling with reading comprehension",
          subject: "English",
        },
      ],
    },
    "7-A": {
      totalStudents: 30,
      avgAttendance: "88%",
      completionRate: "79%",
      needAttention: 3,
      performanceData: { avgScore: "88%", topPerformers: "3" },
      studentsNeedingAttention: [
        {
          name: "Priya Sharma",
          issue: "Score dropped by 12% in recent tests",
          subject: "Science",
        },
      ],
    },
    "7-B": {
      totalStudents: 29,
      avgAttendance: "86%",
      completionRate: "78%",
      needAttention: 4,
      performanceData: { avgScore: "84%", topPerformers: "4" },
      studentsNeedingAttention: [
        {
          name: "Ananya Reddy",
          issue: "Missing homework submissions",
          subject: "Science",
        },
      ],
    },
    "8-A": {
      totalStudents: 29,
      avgAttendance: "87%",
      completionRate: "81%",
      needAttention: 2,
      performanceData: { avgScore: "87%", topPerformers: "2" },
      studentsNeedingAttention: [
        {
          name: "Arun Patel",
          issue: "Irregular attendance in the last week",
          subject: "Math",
        },
      ],
    },
    "8-B": {
      totalStudents: 28,
      avgAttendance: "85%",
      completionRate: "79%",
      needAttention: 3,
      performanceData: { avgScore: "83%", topPerformers: "3" },
      studentsNeedingAttention: [
        {
          name: "Ravi Kumar",
          issue: "Needs extra help with algebra",
          subject: "Math",
        },
      ],
    },
    "9-A": {
      totalStudents: 31,
      avgAttendance: "86%",
      completionRate: "78%",
      needAttention: 3,
      performanceData: { avgScore: "86%", topPerformers: "3" },
      studentsNeedingAttention: [
        {
          name: "Meera Joshi",
          issue: "Participation has decreased in class",
          subject: "Social Studies",
        },
      ],
    },
    "9-B": {
      totalStudents: 30,
      avgAttendance: "84%",
      completionRate: "76%",
      needAttention: 4,
      performanceData: { avgScore: "81%", topPerformers: "4" },
      studentsNeedingAttention: [
        {
          name: "Suresh Nair",
          issue: "Struggling with history concepts",
          subject: "Social Studies",
        },
      ],
    },
    "10-A": {
      totalStudents: 32,
      avgAttendance: "85%",
      completionRate: "76%",
      needAttention: 4,
      performanceData: { avgScore: "85%", topPerformers: "4" },
      studentsNeedingAttention: [
        {
          name: "Rahul Kumar",
          issue: "Performance dropped by 15% in recent tests",
          subject: "Math",
        },
      ],
    },
    "10-B": {
      totalStudents: 31,
      avgAttendance: "83%",
      completionRate: "74%",
      needAttention: 5,
      performanceData: { avgScore: "80%", topPerformers: "5" },
      studentsNeedingAttention: [
        {
          name: "Neha Sharma",
          issue: "Needs support with geometry",
          subject: "Math",
        },
      ],
    },
    "11-A": {
      totalStudents: 27,
      avgAttendance: "83%",
      completionRate: "74%",
      needAttention: 5,
      performanceData: { avgScore: "83%", topPerformers: "5" },
      studentsNeedingAttention: [
        {
          name: "Isha Gupta",
          issue: "Struggling with new syllabus topics",
          subject: "Physics",
        },
      ],
    },
    "11-B": {
      totalStudents: 26,
      avgAttendance: "81%",
      completionRate: "72%",
      needAttention: 6,
      performanceData: { avgScore: "79%", topPerformers: "6" },
      studentsNeedingAttention: [
        {
          name: "Vikram Singh",
          issue: "Needs help with physics concepts",
          subject: "Physics",
        },
      ],
    },
    "12-A": {
      totalStudents: 25,
      avgAttendance: "89%",
      completionRate: "85%",
      needAttention: 3,
      performanceData: { avgScore: "89%", topPerformers: "3" },
      studentsNeedingAttention: [
        {
          name: "Karan Malhotra",
          issue: "Needs support for upcoming board exams",
          subject: "Chemistry",
        },
      ],
    },
    "12-B": {
      totalStudents: 24,
      avgAttendance: "87%",
      completionRate: "83%",
      needAttention: 4,
      performanceData: { avgScore: "85%", topPerformers: "4" },
      studentsNeedingAttention: [
        {
          name: "Pooja Desai",
          issue: "Preparing for board exams",
          subject: "Chemistry",
        },
      ],
    },
  };

  // Prepare allStudentsNeedingAttention for NeedsAttention component
  const allStudentsNeedingAttention = Object.keys(classData).flatMap((key) => {
    const [classNum, section] = key.split("-");
    return classData[key].studentsNeedingAttention.map((student) => ({
      ...student,
      class: classNum,
      section,
    }));
  });

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good Morning");
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

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

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const classKey = `${selectedClass}-${selectedSection}`;
  const currentClassData = classData[classKey] || classData["6-A"];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-purple-300">
      <div className="flex flex-col md:flex-row">
        <Navbar onNavToggle={handleNavToggle} />
        {isMobile && (
          <div className="fixed top-3 right-16 z-50">
            <UtilityIcons />
          </div>
        )}
        <div
          className={`flex-1 transition-all duration-300 pt-[20px] md:pt-0 ${
            navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"
          }`}
        >
          <div className="p-6 md:p-8">
            {!isMobile && (
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
                    {greeting}, {user?.firstName || 'Teacher'}!
                  </h1>
                  <h2 className="text-gray-500 text-lg mt-2">
                    Let's make this day productive.
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <UtilityIcons />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <ButtonsDemo />

            {/* Class Overview and Performance */}
            <div className="p-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 tablet:grid-cols-1">
                <div className="md:col-span-2 tablet:col-span-1">
                  <ClassOverview
                    selectedClass={selectedClass}
                    selectedSection={selectedSection}
                    handleClassChange={handleClassChange}
                    handleSectionChange={handleSectionChange}
                    currentClassData={currentClassData}
                  />
                  <ClassPerformance
                    selectedClass={selectedClass}
                    selectedSection={selectedSection}
                  />
                </div>
                <div className="md:col-span-1 tablet:col-span-1 flex flex-col gap-6">
                  <NeedsAttention
                    studentsNeedingAttention={currentClassData.studentsNeedingAttention}
                    selectedClass={selectedClass}
                    selectedSection={selectedSection}
                    allStudentsNeedingAttention={allStudentsNeedingAttention}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .p-6 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          h1, h2 {
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
          .p-6, .md\\:p-8 {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
          .flex-1 {
            margin-left: ${navExpanded ? "330px" : "100px"};
          }
          .mb-10, .p-5 {
            width: 100%;
          }
          .mb-4, .mb-6, .mt-6 {
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
};

export default TeacherDashboard;
