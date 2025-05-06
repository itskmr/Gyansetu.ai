import React, { useState } from "react";

const ClassActivity = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock activity data - would come from props or API in a real application
  const activities = [
    {
      id: 1,
      title: "Math Quiz",
      type: "Assessment",
      time: "09:00",
      duration: "45 min",
      participants: 28,
      status: "Completed",
    },
    {
      id: 2,
      title: "Science Experiment",
      type: "Lab Work",
      time: "10:30",
      duration: "60 min",
      participants: 26,
      status: "In Progress",
    },
    {
      id: 3,
      title: "English Reading",
      type: "Group Activity",
      time: "12:00",
      duration: "40 min",
      participants: 30,
      status: "Upcoming",
    },
    {
      id: 4,
      title: "History Discussion",
      type: "Discussion",
      time: "14:00",
      duration: "50 min",
      participants: 29,
      status: "Upcoming",
    },
  ];

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Navigate to previous day
  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="bg-gray-100 p-6 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Class Activity</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevDay}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="font-medium">{formatDate(selectedDate)}</span>
            <button
              onClick={nextDay}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-lg text-gray-600 font-medium text-sm mb-3">
          <div className="col-span-3">Activity</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-1 text-center">Students</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="grid grid-cols-12 bg-white border border-gray-100 p-3 rounded-lg items-center hover:bg-gray-50 transition duration-150"
            >
              <div className="col-span-3 font-medium">{activity.title}</div>
              <div className="col-span-2 text-gray-600">{activity.type}</div>
              <div className="col-span-2 text-gray-600">{activity.time}</div>
              <div className="col-span-2 text-gray-600">
                {activity.duration}
              </div>
              <div className="col-span-1 text-center">
                {activity.participants}
              </div>
              <div className="col-span-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium inline-block text-center w-full
                  ${
                    activity.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Add New Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassActivity;
