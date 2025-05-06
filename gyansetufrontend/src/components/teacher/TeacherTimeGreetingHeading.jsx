import React, { useState, useEffect } from "react";
import Navbar from "./TeacherNavbar";

const TimeBasedGreeting = () => {
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("User"); // Default username
  const [navExpanded, setNavExpanded] = useState(false);

  // Update the greeting based on the current time
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

    // Set greeting immediately
    updateGreeting();

    // Update greeting every minute
    const timer = setInterval(updateGreeting, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // This handles the navbar toggle state
  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Allow user to update their name
  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="flex">
      <Navbar onNavToggle={handleNavToggle} />
      <div
        className={`flex-1 transition-all duration-300 ${
          navExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-8 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-md w-full">
            <h1 className="text-4xl font-bold mb-6 text-purple-800">
              {greeting}, {username}!
            </h1>

            <div className="text-lg text-gray-600 mb-8">
              {new Date().toLocaleDateString()} |{" "}
              {new Date().toLocaleTimeString()}
            </div>

            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Your Name:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBasedGreeting;
