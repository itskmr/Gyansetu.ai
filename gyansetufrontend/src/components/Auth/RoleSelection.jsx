import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaSchool,
} from "react-icons/fa";
import "./RoleSelection.css";

const RoleSelection = ({
  selectedRole,
  onRoleSelect,
  errorMessage = null,
  suggestedRole = null,
  themeColors,
}) => {
  // Default theme colors if not provided
  const defaultThemeColors = {
    bgColor: "#F8F5FF",
    cardBg: "#F0E6FF",
    primaryColor: "#8A2BE2",
    borderColor: "#D1C2F0",
    buttonBg: "#9370DB",
    buttonHover: "#7B68EE",
    textPrimary: "#4B0082",
    textSecondary: "#663399",
    errorColor: "#FF3333",
    successColor: "#4CAF50",
  };

  // Use provided theme colors or defaults
  const colors = themeColors || defaultThemeColors;

  const roles = [
    {
      id: "student",
      label: "Student",
      icon: (
        <FaUserGraduate
          className="ml-2"
          style={{ color: colors.textSecondary }}
        />
      ),
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: (
        <FaChalkboardTeacher
          className="ml-2"
          style={{ color: colors.textSecondary }}
        />
      ),
    },
    {
      id: "parent",
      label: "Parent",
      icon: (
        <FaUserFriends
          className="ml-2"
          style={{ color: colors.textSecondary }}
        />
      ),
    },
    {
      id: "institute",
      label: "Institute",
      icon: (
        <FaSchool className="ml-2" style={{ color: colors.textSecondary }} />
      ),
    },
  ];

  return (
    <div className="role-selection">
      <p
        className="role-selection-title"
        style={{ color: colors.textSecondary }}
      >
        Select your role:
      </p>
      <div className="role-options">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-option ${
              selectedRole === role.id ? "selected" : ""
            } ${suggestedRole === role.id ? "correct-role-highlight" : ""}`}
            data-role={role.id}
            style={{
              backgroundColor:
                selectedRole === role.id ? "#D1C2F0" : colors.cardBg,
              borderColor:
                selectedRole === role.id
                  ? colors.primaryColor
                  : colors.borderColor,
              color: colors.textPrimary,
            }}
            onClick={() => onRoleSelect(role.id)}
          >
            {role.icon}
            <span className="ml-2">{role.label}</span>
          </div>
        ))}
      </div>
      {errorMessage && (
        <p
          className="role-error-message"
          style={{
            color: colors.errorColor,
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default RoleSelection;
