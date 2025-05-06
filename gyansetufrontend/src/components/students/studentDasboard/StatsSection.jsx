import React from "react";

/**
 * StatsSection Component
 *
 * Displays key user statistics in a responsive grid layout
 *
 * @param {Object} props
 * @param {Object} props.stats - Object containing stats information
 * @returns {JSX.Element}
 */
const StatsSection = ({
  stats = {
    quizzesCompleted: 14,
    hoursSpent: 6,
  },
}) => {
  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-semibold mb-4 ">Your Progress Stats</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 bg-white  rounded-xl p-4 shadow-md  border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Quizzes Completed
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-semibold ">
              {stats.quizzesCompleted}
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-400  flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white "
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white  rounded-xl p-4 shadow-md  border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Hours Spent
          </div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-semibold ">
              {stats.hoursSpent} Hrs
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
