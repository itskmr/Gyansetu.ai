import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Calendar, Plus, ChevronRight } from "lucide-react";

const ButtonsDemo = () => {
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const navigate = useNavigate();

  const handleContactClick = () => {
    setShowContactOptions(!showContactOptions);
    setShowScheduleOptions(false);
  };

  const handleScheduleClick = () => {
    setShowScheduleOptions(!showScheduleOptions);
    setShowContactOptions(false);
  };

  const handleCreateAssignmentClick = () => {
    navigate("/teacher/create-assignment");
  };

  return (
    // Container with flex-col for mobile (vertical) and flex-row for larger screens (horizontal)
    <div className="flex flex-col w-full gap-4 md:flex-row md:gap-6">
      {/* Create Assignment Button */}
      <button
        className="bg-gray-100 text-purple-800 font-bold text-xl md:text-lg lg:text-xl py-3 px-6 rounded-full flex items-center justify-between border-2 border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
        onClick={handleCreateAssignmentClick}
      >
        <div className="flex items-center">
          <Plus className="mr-2" size={20} />
          <span>Create Assignment</span>
        </div>
      </button>

      {/* Contact Button */}
      <div className="relative w-full md:w-auto">
        <button
          className="bg-white text-purple-800 font-bold text-xl md:text-lg lg:text-xl py-3 px-6 rounded-full flex items-center justify-between border-2 border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          onClick={handleContactClick}
        >
          <div className="flex items-center">
            <MessageCircle className="mr-2" size={20} />
            <span>Contact</span>
          </div>
          <div className="ml-6 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
            <ChevronRight size={16} />
          </div>
        </button>
        {showContactOptions && (
          <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10 left-0">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Student
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Parent
            </button>
          </div>
        )}
      </div>

      {/* Schedule Meeting Button */}
      <div className="relative w-full md:w-auto">
        <button
          className="bg-white text-purple-800 font-bold text-xl md:text-lg lg:text-xl py-3 px-6 rounded-full flex items-center justify-between border-2 border-purple-800 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          onClick={handleScheduleClick}
        >
          <div className="flex items-center">
            <Calendar className="mr-2" size={20} />
            <span>Schedule Meeting</span>
          </div>
          <div className="ml-6 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
            <ChevronRight size={16} />
          </div>
        </button>
        {showScheduleOptions && (
          <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10 left-0">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Student
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Parent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonsDemo;