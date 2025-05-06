// File: utils/eventUtils.js

/**
 * Get the CSS class for an event based on its type and scope
 * @param {string} type - The event type
 * @param {string} eventScope - The event scope (personal or student)
 * @returns {string} - CSS class string
 */
export const getEventColorClass = (type = 'event', eventScope = 'personal') => {
  // First determine base color by event type
  let baseColor;
  switch (type) {
    case "meeting":
      baseColor = "purple";
      break;
    case "conference":
      baseColor = "indigo";
      break;
    case "exam":
      baseColor = "red";
      break;
    case "event":
      baseColor = "green";
      break;
    case "training":
      baseColor = "blue";
      break;
    case "holiday":
      baseColor = "amber";
      break;
    default:
      baseColor = "gray";
  }

  // Add pattern or border for student events
  const scopeModifier = eventScope === "student" ? "border-dashed" : "";

  return `bg-${baseColor}-100 border-${baseColor}-400 hover:bg-${baseColor}-200 ${scopeModifier}`;
};
