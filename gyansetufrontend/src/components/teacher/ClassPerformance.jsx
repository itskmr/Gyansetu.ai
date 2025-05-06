import React, { useState, useEffect } from "react";
import { FiZoomIn } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClassPerformance = ({ selectedClass, selectedSection }) => {
  // Local state for ClassPerformance dropdowns
  const [localSelectedClass, setLocalSelectedClass] = useState(selectedClass);
  const [localSelectedSection, setLocalSelectedSection] =
    useState(selectedSection);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("classAndSection");
  const [filterClass, setFilterClass] = useState(localSelectedClass);
  const [filterSection, setFilterSection] = useState(localSelectedSection);

  // Mock performance data for the chart (same as in TeacherDashBoard)
  const classData = {
    "6-A": { performanceData: { avgScore: "85%", topPerformers: "5" } },
    "6-B": { performanceData: { avgScore: "82%", topPerformers: "4" } },
    "6-C": { performanceData: { avgScore: "80%", topPerformers: "3" } },
    "6-D": { performanceData: { avgScore: "78%", topPerformers: "2" } },
    "6-E": { performanceData: { avgScore: "76%", topPerformers: "3" } },
    "6-F": { performanceData: { avgScore: "74%", topPerformers: "4" } },
    "7-A": { performanceData: { avgScore: "88%", topPerformers: "3" } },
    "7-B": { performanceData: { avgScore: "84%", topPerformers: "4" } },
    "7-C": { performanceData: { avgScore: "82%", topPerformers: "5" } },
    "7-D": { performanceData: { avgScore: "80%", topPerformers: "2" } },
    "7-E": { performanceData: { avgScore: "78%", topPerformers: "3" } },
    "7-F": { performanceData: { avgScore: "76%", topPerformers: "4" } },
    "8-A": { performanceData: { avgScore: "87%", topPerformers: "2" } },
    "8-B": { performanceData: { avgScore: "83%", topPerformers: "3" } },
    "8-C": { performanceData: { avgScore: "81%", topPerformers: "4" } },
    "8-D": { performanceData: { avgScore: "79%", topPerformers: "5" } },
    "8-E": { performanceData: { avgScore: "77%", topPerformers: "2" } },
    "8-F": { performanceData: { avgScore: "75%", topPerformers: "3" } },
    "9-A": { performanceData: { avgScore: "86%", topPerformers: "3" } },
    "9-B": { performanceData: { avgScore: "81%", topPerformers: "4" } },
    "9-C": { performanceData: { avgScore: "79%", topPerformers: "5" } },
    "9-D": { performanceData: { avgScore: "77%", topPerformers: "2" } },
    "9-E": { performanceData: { avgScore: "75%", topPerformers: "3" } },
    "9-F": { performanceData: { avgScore: "73%", topPerformers: "4" } },
    "10-A": { performanceData: { avgScore: "85%", topPerformers: "4" } },
    "10-B": { performanceData: { avgScore: "80%", topPerformers: "5" } },
    "10-C": { performanceData: { avgScore: "78%", topPerformers: "2" } },
    "10-D": { performanceData: { avgScore: "76%", topPerformers: "3" } },
    "10-E": { performanceData: { avgScore: "74%", topPerformers: "4" } },
    "10-F": { performanceData: { avgScore: "72%", topPerformers: "5" } },
    "11-A": { performanceData: { avgScore: "83%", topPerformers: "5" } },
    "11-B": { performanceData: { avgScore: "79%", topPerformers: "6" } },
    "11-C": { performanceData: { avgScore: "77%", topPerformers: "3" } },
    "11-D": { performanceData: { avgScore: "75%", topPerformers: "2" } },
    "11-E": { performanceData: { avgScore: "73%", topPerformers: "4" } },
    "11-F": { performanceData: { avgScore: "71%", topPerformers: "5" } },
    "12-A": { performanceData: { avgScore: "89%", topPerformers: "3" } },
    "12-B": { performanceData: { avgScore: "85%", topPerformers: "4" } },
    "12-C": { performanceData: { avgScore: "83%", topPerformers: "5" } },
    "12-D": { performanceData: { avgScore: "81%", topPerformers: "2" } },
    "12-E": { performanceData: { avgScore: "79%", topPerformers: "3" } },
    "12-F": { performanceData: { avgScore: "77%", topPerformers: "4" } },
  };

  // Compute currentClassData based on localSelectedClass and localSelectedSection
  const classKey = `${localSelectedClass}-${localSelectedSection}`;
  const currentClassData = classData[classKey] || classData["6-A"];

  // Sync local state with global state when global state changes
  useEffect(() => {
    setLocalSelectedClass(selectedClass);
    setLocalSelectedSection(selectedSection);
    setFilterClass(selectedClass);
    setFilterSection(selectedSection);
  }, [selectedClass, selectedSection]);

  // Sync filterClass and filterSection with localSelectedClass and localSelectedSection
  useEffect(() => {
    setFilterClass(localSelectedClass);
    setFilterSection(localSelectedSection);
  }, [localSelectedClass, localSelectedSection]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleFilterModeChange = (e) => {
    setFilterMode(e.target.value);
    if (e.target.value === "classAndSection") {
      setFilterClass(localSelectedClass);
      setFilterSection(localSelectedSection);
    }
  };

  const handleFilterClassChange = (e) => {
    setFilterClass(e.target.value);
  };

  const handleFilterSectionChange = (e) => {
    setFilterSection(e.target.value);
  };

  const handleLocalClassChange = (newClass) => {
    setLocalSelectedClass(newClass);
  };

  const handleLocalSectionChange = (newSection) => {
    setLocalSelectedSection(newSection);
  };

  // Filter performance data based on the selected mode using classData
  const filteredPerformance = () => {
    const filteredData = [];

    if (filterMode === "all") {
      // Group by class and calculate average score for each class
      const classScores = {};

      Object.keys(classData).forEach((key) => {
        const [classNum] = key.split("-");
        const performance = classData[key].performanceData;
        const avgScore = parseFloat(performance.avgScore);

        if (!classScores[classNum]) {
          classScores[classNum] = { totalScore: 0, count: 0 };
        }
        classScores[classNum].totalScore += avgScore;
        classScores[classNum].count += 1;
      });

      Object.keys(classScores).forEach((classNum) => {
        const avgScore =
          classScores[classNum].totalScore / classScores[classNum].count;
        filteredData.push({
          class: classNum,
          avgScore: avgScore.toFixed(2), // Round to 2 decimal places
        });
      });

      // Sort by class number for consistent display
      filteredData.sort((a, b) => parseInt(a.class) - parseInt(b.class));
    } else if (filterMode === "class") {
      // Show all sections for the selected class
      Object.keys(classData).forEach((key) => {
        const [classNum, section] = key.split("-");
        if (classNum === filterClass) {
          const performance = classData[key].performanceData;
          filteredData.push({
            class: classNum,
            section,
            avgScore: parseFloat(performance.avgScore),
          });
        }
      });
    } else {
      // classAndSection: Show only the specific class and section
      Object.keys(classData).forEach((key) => {
        const [classNum, section] = key.split("-");
        if (classNum === filterClass && section === filterSection) {
          const performance = classData[key].performanceData;
          filteredData.push({
            class: classNum,
            section,
            avgScore: parseFloat(performance.avgScore),
          });
        }
      });
    }

    return filteredData;
  };

  // Prepare chart data for the popup
  const chartData = {
    labels: filteredPerformance().map((data) =>
      filterMode === "class"
        ? `Section ${data.section}`
        : filterMode === "all"
        ? `Class ${data.class}`
        : `Class ${data.class}-${data.section}`
    ),
    datasets: [
      {
        label: "Average Score",
        data: filteredPerformance().map((data) => data.avgScore),
        backgroundColor: "rgba(168, 85, 247, 0.5)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Average Score (%)",
        },
      },
      x: {
        title: {
          display: true,
          text:
            filterMode === "all"
              ? "Class"
              : filterMode === "class"
              ? "Section"
              : "Selection",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Class Performance Overview",
      },
    },
  };

  // Chart data for the main view (specific to local class and section)
  const mainChartData = {
    labels: [`Class ${localSelectedClass}-${localSelectedSection}`],
    datasets: [
      {
        label: "Average Score",
        data: [
          parseFloat(
            currentClassData?.performanceData?.avgScore || "85%"
          ).toFixed(0),
        ],
        backgroundColor: "rgba(168, 85, 247, 0.5)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
      },
    ],
  };

  const mainChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Average Score (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Class-Section",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Performance for Class ${localSelectedClass}-${localSelectedSection}`,
      },
    },
  };

  return (
    <div className="bg-gray-200 p-4 md:p-6 rounded-[3rem] w-full mt-6 relative">
      {/* Gray Header Area */}
      <div className="mb-4 relative">
        <div className="flex flex-col justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Class {localSelectedClass}-{localSelectedSection} Performance
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
            <div className="flex items-center w-full md:w-auto">
              <label
                htmlFor="classSelect"
                className="mr-2 text-gray-600 text-sm whitespace-nowrap"
              >
                Select Class:
              </label>
              <select
                id="classSelect"
                value={localSelectedClass}
                onChange={(e) => handleLocalClassChange(e.target.value)}
                className="border border-gray-300 rounded-md px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-24 md:w-auto"
              >
                {[...Array(7)].map((_, i) => {
                  const classValue = String(6 + i);
                  return (
                    <option key={classValue} value={classValue}>
                      Class {classValue}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-center w-full md:w-auto">
              <label
                htmlFor="sectionSelect"
                className="mr-2 text-gray-600 text-sm whitespace-nowrap"
              >
                Select Section:
              </label>
              <select
                id="sectionSelect"
                value={localSelectedSection}
                onChange={(e) => handleLocalSectionChange(e.target.value)}
                className="border border-gray-300 rounded-md px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-16 md:w-auto"
              >
                {["A", "B", "C", "D", "E", "F"].map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            {/* Explore Icon - Positioned absolute for mobile, static for tablet/laptop */}
            <button
              onClick={togglePopup}
              className="text-gray-600 hover:text-gray-800 focus:outline-none absolute top-0 right-0 md:static md:ml-auto"
              aria-label="Explore class performance"
            >
              <FiZoomIn className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* White Content Area */}
      <div className="bg-white rounded-[2rem] p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Average Score */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.performanceData?.avgScore || "85%"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Average Score</div>
          </div>

          {/* Top Performers */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.performanceData?.topPerformers || "5"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Top Performers</div>
          </div>

          {/* Visualization with Bar Chart */}
          <div className="col-span-1 md:col-span-2 p-4 bg-gray-100 rounded-lg h-64">
            {currentClassData?.performanceData ? (
              <Bar data={mainChartData} options={mainChartOptions} />
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No Data Available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Popup Modal with Blur Backdrop */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 px-4">
          <div className="bg-white w-full max-w-[90vw] h-auto max-h-[90vh] lg:w-[800px] lg:h-[600px] rounded-[2rem] p-4 md:p-6 lg:p-8 shadow-lg relative overflow-y-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Class Performance
              </h2>
              <button
                onClick={togglePopup}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Close popup"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="mb-4 md:mb-6 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <label
                  htmlFor="filterMode"
                  className="w-20 text-gray-600 text-sm whitespace-nowrap"
                >
                  Filter By:
                </label>
                <select
                  id="filterMode"
                  value={filterMode}
                  onChange={handleFilterModeChange}
                  className="border border-gray-300 rounded-md px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 md:w-36"
                >
                  <option value="all">All Students</option>
                  <option value="class">Class</option>
                  <option value="classAndSection">Class + Section</option>
                </select>
              </div>
              {filterMode !== "all" && (
                <div className="flex items-center">
                  <label
                    htmlFor="filterClass"
                    className="w-20 text-gray-600 text-sm whitespace-nowrap"
                  >
                    Class:
                  </label>
                  <select
                    id="filterClass"
                    value={filterClass}
                    onChange={handleFilterClassChange}
                    className="border border-gray-300 rounded-md px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 md:w-36"
                  >
                    {[...Array(7)].map((_, i) => {
                      const classValue = String(6 + i);
                      return (
                        <option key={classValue} value={classValue}>
                          Class {classValue}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              {filterMode === "classAndSection" && (
                <div className="flex items-center">
                  <label
                    htmlFor="filterSection"
                    className="w-20 text-gray-600 text-sm whitespace-nowrap"
                  >
                    Section:
                  </label>
                  <select
                    id="filterSection"
                    value={filterSection}
                    onChange={handleFilterSectionChange}
                    className="border border-gray-300 rounded-md px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 md:w-36"
                  >
                    {["A", "B", "C", "D", "E", "F"].map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Visualization Chart in Popup */}
            <div className="h-[200px] md:h-[250px] lg:h-[300px] mb-4 md:mb-6">
              {filteredPerformance().length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  No performance data available for the selected filter.
                </p>
              )}
            </div>

            {/* Summary Metrics Below Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                  {currentClassData?.performanceData?.avgScore || "85%"}
                </div>
                <div className="text-gray-500 text-sm mt-1">Average Score</div>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                  {currentClassData?.performanceData?.topPerformers || "5"}
                </div>
                <div className="text-gray-500 text-sm mt-1">Top Performers</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPerformance;
