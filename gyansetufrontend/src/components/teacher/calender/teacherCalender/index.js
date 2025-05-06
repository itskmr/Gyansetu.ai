// File: components/calendar/index.js
// This file exports all components to make imports cleaner

// Main Container
export { default as TeacherCalendarView } from "./TeacherCalendarView";

// Calendar Controls
export { default as CalendarHeader } from "./CalendarHeader";
export { default as FilterMenu } from "./FilterMenu";
export { default as UpcomingEvents } from "./UpcomingEvents";

// Views
export { default as DayView } from "./views/DayView";
export { default as WeekView } from "./views/WeekView";
export { default as MonthView } from "./views/MonthView";
export { default as QuarterView } from "./views/QuarterView";
export { default as YearView } from "./views/YearView";

// Modals
export { default as EventModal } from "./modals/EventModal";
export { default as ViewEventModal } from "./modals/ViewEventModal";

// Badges
export { default as EventTypeBadge } from "./badges/EventTypeBadge";
export { default as EventScopeBadge } from "./badges/EventScopeBadge";
export { default as PriorityBadge } from "./badges/PriorityBadge";
