import React from "react";

const ClassOverview = ({
  selectedClass,
  selectedSection,
  handleClassChange,
  handleSectionChange,
  currentClassData,
}) => {
  return (
    <div className="bg-gray-200 p-4 md:p-6 rounded-4xl w-full">
      {/* Gray Top Border Area for Heading and Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">
          Class Overview
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <label htmlFor="classSelect" className="mr-2 text-gray-600 text-sm">
              Select Class:
            </label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={handleClassChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[...Array(7)].map((_, i) => (
                <option key={i} value={6 + i}>
                  Class {6 + i}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="sectionSelect"
              className="mr-2 text-gray-600 text-sm"
            >
              Select Section:
            </label>
            <select
              id="sectionSelect"
              value={selectedSection}
              onChange={handleSectionChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {["A", "B", "C", "D", "E", "F"].map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* White Layer with Thicker Top Border */}
      <div className="bg-white rounded-2xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.totalStudents || "30"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Total Students</div>
          </div>

          {/* Avg. Attendance */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.avgAttendance || "88%"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Avg. Attendance</div>
          </div>

          {/* Completion Rate */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.completionRate || "79%"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Completion Rate</div>
          </div>

          {/* Need Attention */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-800">
              {currentClassData?.needAttention || "3"}
            </div>
            <div className="text-gray-500 text-sm mt-1">Need Attention</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
