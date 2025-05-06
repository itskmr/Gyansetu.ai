import React, { useState, useEffect } from "react";
import {
  IoHomeOutline,
  IoGridOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const TeacherNavbar = ({ onNavToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Define navigation items
  const navItems = [
    {
      name: "Dashboard",
      icon: <IoHomeOutline className="text-lg" />,
      path: "/teacher",
    },
    {
      name: "Create Assignments",
      icon: <IoGridOutline className="text-lg" />,
      path: "/teacher/create-assignment",
    },
    {
      name: "Generate Assignments",
      icon: <IoDocumentTextOutline className="text-lg" />,
      path: "/teacher/generate-assignment",
    },
    // {
    //   name: "Analytics",
    //   icon: <IoStatsChartOutline className="text-lg" />,
    //   path: "/teacher/analytics",
    // },
    {
      name: "Calendar",
      icon: <IoChatbubbleOutline className="text-lg" />,
      path: "/teacher/calendar",
    },
  ];

  // Check if mobile on mount and window resize
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

  // Set active item based on current path whenever location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = navItems.find((item) => item.path === currentPath);

    if (matchingItem) {
      setActiveItem(matchingItem.name);
    }
  }, [location.pathname]);

  const toggleNavbar = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onNavToggle) {
      onNavToggle(newExpandedState);
    }
  };

  const handleNavClick = (item) => {
    console.log(`Navigating to: ${item.path}`);
    setActiveItem(item.name);
    navigate(item.path);
    if (isMobile) toggleNavbar();
  };

  // Mobile view - horizontal layout at the top
  if (isMobile) {
    return (
      <>
        {/* Fixed top navbar with transition for showing/hiding on scroll */}
        <nav className="fixed top-0 left-0 w-full bg-purple-100 flex items-center justify-between px-4 py-3 shadow-sm z-10 mobile-navbar-top transition-transform duration-300 ease-in-out rounded-b-[20px]">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/teacher")}
          >
            <div className="w-8 h-8 rounded-[20px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <div className="w-4 h-4 rounded-full bg-white opacity-80" />
            </div>
            <span className="ml-3 font-bold text-lg whitespace-nowrap text-gray-700">
              GyanSetu
            </span>
          </div>

          {/* Hamburger menu */}
          <div className="cursor-pointer" onClick={toggleNavbar}>
            <div className="w-10 h-10 rounded-[20px] bg-white flex items-center justify-center shadow-sm">
              <div className="flex flex-col justify-between h-5 w-5">
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
                <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
                <span className="h-0.5 w-full bg-gray-500 rounded"></span>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile slide-out menu */}
        {expanded && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleNavbar}
          >
            <div
              className="fixed top-0 right-0 h-screen w-screen bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full px-6 py-4 border-b border-gray-100">
                {/* Logo */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/teacher")}
                >
                  <div className="w-10 h-10 rounded-[20px] bg-purple-600 flex items-center justify-center shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-white opacity-90" />
                  </div>
                  <span className="ml-3 font-bold text-xl whitespace-nowrap text-gray-800">
                    GyanSetu
                  </span>
                </div>

                {/* Close button */}
                <div className="cursor-pointer" onClick={toggleNavbar}>
                  <div className="w-10 h-10 rounded-[20px] bg-gray-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Navigation items */}
              <div className="flex flex-col space-y-2 px-4 mt-10 w-full">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className={`relative flex items-center cursor-pointer transition-all duration-200 px-5 py-4 rounded-[20px] ${
                      activeItem === item.name
                        ? "bg-purple-100 text-purple-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavClick(item)}
                  >
                    <div
                      className={`flex items-center justify-center min-w-[40px] w-10 h-10 rounded-[20px] flex-shrink-0 ${
                        activeItem === item.name
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`ml-4 font-medium whitespace-nowrap ${
                        activeItem === item.name
                          ? "text-gray-700"
                          : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Spacer div with Tailwind transitions */}
        <div className="h-16 transition-all duration-300"></div>
      </>
    );
  }

  // Desktop/Tablet view
  return (
    <nav
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-10 flex flex-col 
        bg-gradient-to-b from-gray-100 to-purple-50
        ${expanded ? "w-[330px]" : "w-[100px]"}`}
    >
      <div
        className="flex items-center px-5 py-6 cursor-pointer ml-3"
        onClick={() => navigate("/teacher")}
      >
        <div className="w-8 h-8 rounded-[20px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
          <div className="w-4 h-4 rounded-full bg-white opacity-80" />
        </div>
        {expanded && (
          <span className="ml-3 font-bold text-lg whitespace-nowrap text-gray-700">
            GyanSetu
          </span>
        )}
      </div>

      <div
        className="flex items-center px-5 py-3 cursor-pointer mb-8 ml-2"
        onClick={toggleNavbar}
      >
        <div className="w-10 h-10 rounded-[20px] bg-white flex items-center justify-center shadow-sm">
          <div className="flex flex-col justify-between h-5 w-5">
            <span className="h-0.5 w-full bg-gray-500 rounded"></span>
            <span className="h-0.5 w-3/4 bg-gray-500 rounded"></span>
            <span className="h-0.5 w-full bg-gray-500 rounded"></span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex flex-col h-full space-y-3 px-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`relative flex items-center cursor-pointer transition-all duration-200
              ${
                expanded
                  ? "px-3 py-3 rounded-[20px] " +
                    (activeItem === item.name
                      ? "bg-gradient-to-r from-purple-200 to-purple-50 text-purple-700 shadow-sm"
                      : "text-gray-500 hover:bg-purple-50")
                  : "justify-center py-3"
              }`}
            onClick={() => handleNavClick(item)}
          >
            <div
              className={`flex items-center justify-center min-w-[40px] w-10 h-10 rounded-[20px] flex-shrink-0
              ${
                activeItem === item.name
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {item.icon}
            </div>
            {expanded && (
              <span
                className={`ml-4 font-medium whitespace-nowrap ${
                  activeItem === item.name ? "text-gray-700" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            )}

            {/* Active indicator for collapsed state */}
            {!expanded && activeItem === item.name && (
              <div className="absolute left-0 h-10 w-1 bg-purple-500 rounded-r-md"></div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom decoration - subtle gradient accent */}
      <div className="mt-auto mb-6 mx-auto">
        {expanded ? (
          <div className="w-32 h-1 bg-gradient-to-r from-purple-300 to-transparent rounded-full"></div>
        ) : (
          <div className="w-8 h-1 bg-gradient-to-r from-purple-300 to-transparent rounded-full"></div>
        )}
      </div>
    </nav>
  );
};

export default TeacherNavbar;
