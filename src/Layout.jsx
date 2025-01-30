import React, { useEffect, useState, useRef } from "react";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Footer from "./Components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import Firebase auth instance

function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef(null);

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set true if a user is logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const hideHeaderFooter =
    location.pathname === "/SignIn" || location.pathname === "/signup";

  // Detect when footer is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Adjust this value to fine-tune when the effect triggers
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header at the Top */}
      {!hideHeaderFooter && <Header />}

      <div className="flex flex-grow">
        {/* Sidebar - dynamically positioned */}
        {isAuthenticated && !hideHeaderFooter && (
          <div
            className={`${
              isFooterVisible ? "relative" : "fixed left-0 top-16"
            } w-24 h-full bg-[#152d46] flex flex-col items-center py-6 space-y-6 shadow-lg z-30 transition-all duration-300`}
          >
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          <Outlet />
        </div>
      </div>

      {/* Footer positioned above the Sidebar */}
      <div ref={footerRef} className="absolute bottom-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
