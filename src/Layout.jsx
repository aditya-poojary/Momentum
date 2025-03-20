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
  const [loading, setLoading] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef(null);

  // Debugging: Log current path
  useEffect(() => {
    console.log("Current Path:", location.pathname);
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false); // Stop loading once authentication is checked
    });

    return () => unsubscribe();
  }, []);

  const hideHeaderFooter = ["/signin", "/signup"].includes(
    location.pathname.toLowerCase()
  );

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

  // Prevent UI flash before auth check completes
  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header at the Top */}
      {!hideHeaderFooter && <Header />}

      <div className="flex flex-grow">
        {/* Sidebar - dynamically positioned */}
        {isAuthenticated && !hideHeaderFooter && (
          <div
            className={`hidden md:flex w-24 h-full bg-[#152d46] items-center py-6 space-y-6 shadow-lg z-30`}
          >
            <Sidebar />
          </div>
        )}

        {/* Main Content - Removes extra left margin in mobile view */}
        <div
          className={`flex flex-col flex-grow ${
            hideHeaderFooter ? "" : "mt-14"
          } w-full`}
        >
          <Outlet />
        </div>
      </div>

      {/* Footer positioned above the Sidebar */}
      <div ref={footerRef} className="bottom-0 w-full z-40">
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
}  

export default Layout;
