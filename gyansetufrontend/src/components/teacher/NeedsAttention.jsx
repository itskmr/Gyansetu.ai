import React, { useState } from "react";
import { FiZoomIn } from "react-icons/fi";

const NeedsAttention = ({
  selectedClass,
  selectedSection,
  allStudentsNeedingAttention = [], // Use allStudentsNeedingAttention for both main view and popup
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("classAndSection"); // Filter mode: 'all', 'class', 'classAndSection'
  const [filterClass, setFilterClass] = useState(selectedClass); // Selected class for filtering
  const [filterSection, setFilterSection] = useState(selectedSection); // Selected section for filtering

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleFilterModeChange = (e) => {
    setFilterMode(e.target.value);
    // Reset filters to current class/section when switching to classAndSection mode
    if (e.target.value === "classAndSection") {
      setFilterClass(selectedClass);
      setFilterSection(selectedSection);
    }
  };

  const handleFilterClassChange = (e) => {
    setFilterClass(e.target.value);
  };

  const handleFilterSectionChange = (e) => {
    setFilterSection(e.target.value);
  };

  // Filter students for the main view based on selectedClass and selectedSection
  const mainViewStudents = allStudentsNeedingAttention.filter(
    (student) =>
      student.class === selectedClass && student.section === selectedSection
  );

  // Filter students for the popup based on the selected mode
  const filteredStudents = () => {
    if (filterMode === "all") {
      return allStudentsNeedingAttention;
    } else if (filterMode === "class") {
      return allStudentsNeedingAttention.filter(
        (student) => student.class === filterClass
      );
    } else {
      // classAndSection
      return allStudentsNeedingAttention.filter(
        (student) =>
          student.class === filterClass && student.section === filterSection
      );
    }
  };

  return (
    <div className="bg-gray-200 p-6 rounded-[2rem]">
      {/* Gray Top Border Area for Heading and Icon */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Needs Attention</h2>
        <button
          onClick={togglePopup}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Explore students needing attention"
        >
          <FiZoomIn className="w-6 h-6" />
        </button>
      </div>

      {/* White Layer with Thicker Top Border */}
      <div className="bg-white rounded-[1.5rem] pt-8 px-4 pb-4">
        <div className="space-y-4">
          {mainViewStudents.length > 0 ? (
            mainViewStudents.map((student, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {student.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {student.issue}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {student.subject}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No students need attention in Class {selectedClass}-
              {selectedSection}.
            </p>
          )}
        </div>
      </div>

      {/* Popup Modal with Blur Backdrop */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white w-[800px] h-[600px] rounded-[2rem] p-8 shadow-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Students Needing Attention
              </h3>
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
            <div className="mb-6 flex space-x-4">
              <div className="flex items-center">
                <label
                  htmlFor="filterMode"
                  className="mr-2 text-gray-600 text-sm"
                >
                  Filter By:
                </label>
                <select
                  id="filterMode"
                  value={filterMode}
                  onChange={handleFilterModeChange}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="mr-2 text-gray-600 text-sm"
                  >
                    Class:
                  </label>
                  <select
                    id="filterClass"
                    value={filterClass}
                    onChange={handleFilterClassChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={6 + i}>
                        Class {6 + i}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {filterMode === "classAndSection" && (
                <div className="flex items-center">
                  <label
                    htmlFor="filterSection"
                    className="mr-2 text-gray-600 text-sm"
                  >
                    Section:
                  </label>
                  <select
                    id="filterSection"
                    value={filterSection}
                    onChange={handleFilterSectionChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            {/* Filtered Student List */}
            <div className="overflow-y-auto h-[450px]">
              {filteredStudents().length > 0 ? (
                filteredStudents().map((student, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg mb-3 last:mb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {student.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{student.issue}</p>
                        <p className="text-gray-500 text-sm">
                          Class {student.class}-{student.section}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {student.subject}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No students need attention for the selected filter.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedsAttention;
