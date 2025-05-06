// File: utils/dateUtils.js

/**
 * Get date-related helper functions
 * @param {Date} currentDate - The current selected date
 * @param {string} currentView - The current view type (day, week, month, quarter, year)
 * @param {Array} filteredEvents - The filtered events array
 * @returns {Object} - Object containing date helper functions
 */
export const getDateHelpers = (currentDate, currentView, filteredEvents = []) => {
  // Ensure filteredEvents is always an array
  const events = Array.isArray(filteredEvents) ? filteredEvents : [];
  
  // Get header title based on current view and date
  const getHeaderTitle = () => {
    if (currentView === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startMonth = startOfWeek.toLocaleDateString("en-US", {
        month: "short",
      });
      const endMonth = endOfWeek.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const year = startOfWeek.getFullYear();

      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    } else if (currentView === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (currentView === "quarter") {
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      return `Q${quarter} ${currentDate.getFullYear()}`;
    } else if (currentView === "year") {
      return currentDate.getFullYear().toString();
    }
    return "";
  };

  // Navigate to previous period
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (currentView === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (currentView === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === "quarter") {
      newDate.setMonth(currentDate.getMonth() - 3);
    } else if (currentView === "year") {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    }
    return newDate;
  };

  // Navigate to next period
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (currentView === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (currentView === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === "quarter") {
      newDate.setMonth(currentDate.getMonth() + 3);
    } else if (currentView === "year") {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    return newDate;
  };

  // Get events for the current day
  const getEventsForCurrentDay = () => {
    const currentDateStr = currentDate.toISOString().split("T")[0];
    return events.filter((event) => {
      // Single day event
      if (event.date) {
        return event.date === currentDateStr;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      }

      return false;
    });
  };

  // Get events for the current week
  const getEventsForCurrentWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Check if there's any overlap with the current week
        return eventStartDate <= endOfWeek && eventEndDate >= startOfWeek;
      }

      return false;
    });
  };

  // Get days of the week for the week view
  const getDaysOfWeek = () => {
    const days = [];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: dayNames[i],
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        full: date,
        dateString: date.toISOString().split("T")[0],
      });
    }

    return days;
  };

  // Get days of the month for the month view
  const getDaysOfMonth = () => {
    const days = [];

    // Get the first day of the month
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Get last day of previous month
    const lastDayPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // Add days from previous month to fill first week
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(lastDayPrevMonth.getDate() - i);
      days.push({
        date: date.getDate(),
        month: date.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      days.push({
        date: i,
        month: currentDate.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: true,
      });
    }

    // Add days from next month to complete the grid (6 rows of 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      );
      days.push({
        date: i,
        month: date.getMonth(),
        full: date,
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Get events for a specific day
  const getEventsForDay = (dateString) => {
    return events.filter((event) => {
      // Single day event
      if (event.date) {
        return event.date === dateString;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        return dateString >= event.startDate && dateString <= event.endDate;
      }

      return false;
    });
  };

  // Get months of the year for the year view
  const getMonthsOfYear = () => {
    const months = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      months.push({
        name: monthNames[i],
        index: i,
        year: currentDate.getFullYear(),
        full: date,
      });
    }

    return months;
  };

  // Get quarters of the year for the quarter view
  const getQuartersOfYear = () => {
    const quarters = [];
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < 4; i++) {
      const startMonth = i * 3;
      const startDate = new Date(currentYear, startMonth, 1);
      const endDate = new Date(currentYear, startMonth + 3, 0);

      quarters.push({
        number: i + 1,
        startMonth: startMonth,
        endMonth: startMonth + 2,
        startDate: startDate,
        endDate: endDate,
        year: currentYear,
      });
    }

    return quarters;
  };

  // Get events for a specific month
  const getEventsForMonth = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return events.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Check if there's any overlap with the month
        return eventStartDate <= endDate && eventEndDate >= startDate;
      }

      return false;
    });
  };

  // Get events for a specific quarter
  const getEventsForQuarter = (year, quarterStartMonth) => {
    const startDate = new Date(year, quarterStartMonth, 1);
    const endDate = new Date(year, quarterStartMonth + 3, 0);

    return events.filter((event) => {
      // Single day event
      if (event.date) {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      }

      // Multi-day event
      if (event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);

        // Check if there's any overlap with the quarter
        return eventStartDate <= endDate && eventEndDate >= startDate;
      }

      return false;
    });
  };

  return {
    getHeaderTitle,
    navigatePrevious,
    navigateNext,
    getEventsForCurrentDay,
    getEventsForCurrentWeek,
    getDaysOfWeek,
    getDaysOfMonth,
    getMonthsOfYear,
    getQuartersOfYear,
    getEventsForDay,
    getEventsForMonth,
    getEventsForQuarter,
  };
};
