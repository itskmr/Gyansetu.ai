// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentAssignmentInterface from "./components/students/Assignment/StudentAssignment";

// Auth Pages
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ResetPasswordPage from "./pages/ResetPassword";

// Protected Routes Component
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Role-based Dashboard Pages
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import InstituteDashboard from "./pages/dashboards/InstituteDashboard";

// Teacher Features
import AssignmentPage from "./components/teacher/Assignments/AssignmentPage";
import AIGenerate from "./components/teacher/Assignments/AIGnerate";
import TeacherMainCalender from "./components/teacher/calender/MainCalenderTeacher";

// Auth Service
import authService from "./services/api/authService";
import MainChatbot from "./components/students/Chatbot/MainChatbot";

// Wrapper component to handle location-based re-rendering
function AppContent() {
  const location = useLocation();

  // Helper function to redirect based on user role
  const RoleBasedRedirect = () => {
    const user = authService.getCurrentUser();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Redirect to the appropriate dashboard based on user role
    switch (user.role) {
      case "student":
        return <Navigate to="/Studentdashboard" replace />;
      case "teacher":
        return <Navigate to="/teacher" replace />;
      case "parent":
        return <Navigate to="/parent" replace />;
      case "institute":
        return <Navigate to="/institute" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            authService.isAuthenticated() ? (
              <RoleBasedRedirect />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authService.isAuthenticated() ? (
              <RoleBasedRedirect />
            ) : (
              <SignupPage />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Teacher Routes */}
        <Route
          key={location.pathname}
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          key={location.pathname}
          path="/teacher/create-assignment"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AssignmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          key={location.pathname}
          path="/teacher/generate-assignment"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AIGenerate />
            </ProtectedRoute>
          }
        />
        <Route
          key={location.pathname}
          path="/teacher/analytics"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          key={location.pathname}
          path="/teacher/calendar"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherMainCalender />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/Studentdashboard*"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MainChatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentAssignment"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentAssignmentInterface />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Institute Routes */}
        <Route
          path="/institute/*"
          element={
            <ProtectedRoute allowedRoles={["institute"]}>
              <InstituteDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root path redirects based on user role */}
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Redirect any unknown routes to role-based dashboard or login */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;