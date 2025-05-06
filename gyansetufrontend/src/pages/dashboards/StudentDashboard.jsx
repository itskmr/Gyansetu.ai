import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Calendar,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sliders,
  Sun,
  Zap,
  Flame,
  Crown,
  Users,
  Atom,
  LogOut,
} from "lucide-react";
import ReactApexChart from "react-apexcharts";
import RecentAchievements from "../../components/students/studentDasboard/RecentAchievements";
import StatsSection from "../../components/students/studentDasboard/StatsSection";
import StudentNavbar from "../../components/students/studentDasboard/StudentNavbar";
import MiniChatbot from "../../components/students/studentDasboard/MiniChatbot";
import Cal from "../../components/students/studentDasboard/Calendar";
import { useNavigate } from "react-router-dom";
import authService from '../../services/api/authService';

// Country Bar Chart Component
const CountryBarChart = ({ darkMode }) => {
  const [state, setState] = useState({
    series: [
      {
        name: "Hours Studied",
        data: [5, 3, 7, 4, 8, 9, 6],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + " hrs";
        },
        style: {
          colors: ["#000000"],
        },
      },
      xaxis: {
        categories: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        tickAmount: 12,
        min: 0,
        max: 12,
        labels: {
          formatter: function (val) {
            return val;
          },
        },
        title: {
          text: "Hours",
          style: {
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        title: {
          text: "Day of Week",
          style: {
            fontWeight: 600,
          },
        },
      },
      colors: ["#b6d238"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " hours";
          },
        },
      },
    },
  });

  useEffect(() => {
    if (darkMode) {
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          theme: { mode: "dark" },
          xaxis: {
            ...prev.options.xaxis,
            labels: { style: { colors: "#ccc" } },
            title: {
              ...prev.options.xaxis.title,
              style: {
                color: "#ccc",
                fontWeight: 600,
              },
            },
          },
          yaxis: {
            ...prev.options.yaxis,
            labels: { style: { colors: "#ccc" } },
            title: {
              ...prev.options.yaxis.title,
              style: {
                color: "#ccc",
                fontWeight: 600,
              },
            },
          },
          dataLabels: {
            ...prev.options.dataLabels,
            style: {
              colors: ["#fff"],
            },
          },
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          theme: { mode: "light" },
          xaxis: {
            ...prev.options.xaxis,
            labels: { style: { colors: "#525252" } },
            title: {
              ...prev.options.xaxis.title,
              style: {
                color: "#525252",
                fontWeight: 600,
              },
            },
          },
          yaxis: {
            ...prev.options.yaxis,
            labels: { style: { colors: "#525252" } },
            title: {
              ...prev.options.yaxis.title,
              style: {
                color: "#525252",
                fontWeight: 600,
              },
            },
          },
          dataLabels: {
            ...prev.options.dataLabels,
            style: {
              colors: ["#000000"],
            },
          },
        },
      }));
    }
  }, [darkMode]);

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

// Dashboard Component
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [statusEnabled, setStatusEnabled] = useState(true);
  const [navExpanded, setNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Map icon strings to Lucide components
  const iconMap = {
    flame: Flame,
    crown: Crown,
    users: Users,
    atom: Atom,
  };

  const achievementsData = [
    {
      id: 1,
      icon: "flame",
      points: 100,
      title: "Learning Streak!",
      description: "A month of consistent learning",
    },
    {
      id: 2,
      icon: "crown",
      points: 500,
      title: "Subject Master",
      description: "Top scorer in Advanced Algebra",
    },
    {
      id: 3,
      icon: "users",
      points: 250,
      title: "Group Projects",
      description: "2/3 Projects",
    },
    {
      id: 4,
      icon: "atom",
      points: 300,
      title: "Quiz Champion",
      description: "Perfect score in Physics Quiz",
    },
  ].map((achievement) => ({
    ...achievement,
    IconComponent: iconMap[achievement.icon],
  }));

  const statsData = { quizzesCompleted: 14, hoursSpent: 6 };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-purple-300">

      <StudentNavbar onNavToggle={handleNavToggle} />

      <div
        className={`flex-1 transition-all duration-300 pt-[20px] md:pt-0 ${
          navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"
        }`}
      >
        <header className="px-6 py-4 flex justify-between items-center">
          {/* Profile Section */}
          <div className="w-full md:w-1/4">
            <div className="p-1 flex items-center relative">
              <div className="relative mr-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-purple-300">
                  <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64";
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sadaf</h3>
                <p className="text-gray-600 dark:text-gray-400">Class 06</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-full py-2 px-3 shadow-md">
              <button
                className="p-1 rounded-full"
                onClick={() => setDarkMode(false)}
              >
                <Sun
                  size={18}
                  className={!darkMode ? "text-purple-600" : "text-gray-400"}
                />
              </button>
              <button
                className="p-1 rounded-full"
                onClick={() => setDarkMode(true)}
              >
                <Moon
                  size={18}
                  className={darkMode ? "text-purple-600" : "text-gray-400"}
                />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-md flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shadow-md">
              <span className="text-gray-700 font-medium">EN</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">5</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Profile and Achievements Section */}
          <div className="flex flex-col md:flex-row gap-20 mb-8">
            <div className="w-full md:w-3/4">
              <RecentAchievements
                achievements={achievementsData}
                stats={statsData}
              />
            </div>

            <div className="w-full md:w-1/2">
              <MiniChatbot />
            </div>
          </div>

          {/* Time Analysis and Calendar */}
          <div className="mb-8 flex flex-col md:flex-row gap-15">
            <div className="flex justify-center py-2">
              {/* Assuming Cal is a custom component; ensure it accepts src and alt props */}
              <Cal
                src="/calendar.png"
                alt="Chatbot Image"
                className="transform translate-y-12"
              />
            </div>

            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Time spend</h3>
                    <p className="text-gray-500 text-sm">
                      Weekly time analysis
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-full bg-purple-50 dark:bg-gray-700 flex items-center justify-center">
                      <ArrowUpRight size={16} className="dark:text-gray-300" />
                    </button>
                  </div>
                </div>
                <div className="h-[350px]">
                  <CountryBarChart darkMode={darkMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <StatsSection stats={statsData} />
        </div>
      </div>
    </div>
  );
};

const StudentDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-purple-300">
      <StudentDashboard />
    </div>
  );
};

export default StudentDashboardPage;
