import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherNavbar from "./Navbar";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong with the content.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Layout = () => {
  const [navExpanded, setNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavToggle = (isExpanded) => {
    console.log("Nav toggled, expanded:", isExpanded);
    setNavExpanded(isExpanded);
  };

  console.log("Layout rendering:", { isMobile, navExpanded });

  return (
    <div className="flex min-h-screen">
      <TeacherNavbar onNavToggle={handleNavToggle} />
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "mt-16" : navExpanded ? "ml-[330px]" : "ml-[100px]"
        }`}
      >
        <ErrorBoundary>
          <div style={{ display: "block", visibility: "visible", opacity: 1 }}>
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Layout;
