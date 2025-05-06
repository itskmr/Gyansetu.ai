import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoChatboxOutline,
  IoDocumentTextOutline,
  IoHelpBuoyOutline,
  IoBookOutline,
  IoCalendarClearOutline,
} from "react-icons/io5";

const StudentNavbar = ({ onNavToggle }) => {
  // Initialize expanded state from localStorage or default to false
  const [expanded, setExpanded] = useState(() => {
    const savedState = localStorage.getItem("navbarExpanded");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("navbarExpanded", JSON.stringify(expanded));
    if (onNavToggle) {
      onNavToggle(expanded);
    }
  }, [expanded, onNavToggle]);

  // Handle window resize to detect mobile view
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

  const toggleNavbar = () => {
    setExpanded((prev) => !prev); // Update state and let useEffect handle persistence
  };

  // Handle navigation item click
  const handleNavClick = (e) => {
    // Don't collapse navbar when navigation items are clicked
    // Just let the Link component handle the navigation
    if (isMobile) {
      setExpanded(false); // Only collapse on mobile when a link is clicked
    }
    // On desktop, we maintain the current expanded state
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <IoHomeOutline className="text-lg" />,
      path: "/Studentdashboard",
    },
    {
      name: "Chatbot",
      icon: <IoChatboxOutline className="text-lg" />,
      path: "/chatbot",
    },
    {
      name: "Assignment",
      icon: <IoDocumentTextOutline className="text-lg" />,
      path: "/StudentAssignment",
    },
    {
      name: "Quiz",
      icon: <IoHelpBuoyOutline className="text-lg" />,
      path: "/quiz",
    },
    {
      name: "Content",
      icon: <IoBookOutline className="text-lg" />,
      path: "/content",
    },
    {
      name: "Calendar",
      icon: <IoCalendarClearOutline className="text-lg" />,
      path: "/cal",
    },
  ];

  if (isMobile && !expanded) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-white flex items-center justify-between px-4 py-6 shadow-sm z-50">
        <div className="flex items-center cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <div className="w-4 h-4 rounded-full bg-white opacity-80" />
          </div>
          <span className="ml-3 font-bold text-lg whitespace-nowrap text-gray-700">
            GyanSetu
          </span>
        </div>

        <div className="cursor-pointer" onClick={toggleNavbar}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <div className="flex flex-col justify-between h-5 w-5">
              <span className="h-0.5 w-full bg-gray-500 rounded"></span>
              <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
              <span className="h-0.5 w-full bg-gray-500 rounded"></span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-50 flex flex-col 
        ${
          isMobile
            ? "bg-gradient-to-r from-purple-50 to-gray-100"
            : "bg-gradient-to-b from-gray-100 to-purple-50"
        }
        ${expanded ? (isMobile ? "w-full" : "w-[330px]") : "w-[100px]"}`}
    >
      {isMobile && expanded && (
        <div className="flex items-center justify-between w-full px-4 py-6">
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <div className="w-4 h-4 rounded-full bg-white opacity-80" />
            </div>
            <span className="ml-3 font-bold text-lg whitespace-nowrap text-gray-700">
              GyanSetu
            </span>
          </div>

          <div className="cursor-pointer" onClick={toggleNavbar}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <div className="flex flex-col justify-between h-5 w-5">
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
                <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <div className="flex items-center px-5 py-6 cursor-pointer ml-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <div className="w-4 h-4 rounded-full bg-white opacity-80" />
            </div>
            {expanded && (
              <span className="ml-3 font-bold text-lg whitespace-nowrap text-gray-700">
                GyanSetu
              </span>
            )}
          </div>

          <div
            className="flex items-center px-5 py-3 cursor-pointer mb-4 ml-2"
            onClick={toggleNavbar}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <div className="flex flex-col justify-between h-5 w-5">
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
                <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className={`flex flex-col h-full space-y-3 px-2 ${
          isMobile && expanded ? "mt-4" : ""
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleNavClick}
            className={`relative flex items-center cursor-pointer transition-all duration-200
              ${
                expanded
                  ? `px-3 py-3 rounded-xl ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-purple-200 to-purple-50 text-purple-700 shadow-sm"
                        : "text-gray-500 hover:bg-gradient-to-r hover:from-purple-200 hover:to-purple-50 hover:text-purple-700 hover:shadow-sm"
                    }`
                  : `justify-center py-3 ${
                      location.pathname === item.path
                        ? ""
                        : "hover:bg-gradient-to-r hover:from-purple-200 hover:to-purple-50"
                    }`
              }`}
          >
            <div
              className={`flex items-center justify-center min-w-[40px] w-10 h-10 rounded-full flex-shrink-0
              ${
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
            </div>
            {expanded && (
              <span
                className={`ml-4 font-medium whitespace-nowrap ${
                  location.pathname === item.path
                    ? "text-gray-700"
                    : "text-gray-600 hover:text-gray-700"
                }`}
              >
                {item.name}
              </span>
            )}

            {!expanded && location.pathname === item.path && (
              <div className="absolute left-0 h-10 w-1 bg-purple-500 rounded-r-md"></div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-auto mb-6 mx-auto">
        {expanded ? (
          <div className="w-32 h-1 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>
        ) : (
          <div className="w-8 h-1 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;
