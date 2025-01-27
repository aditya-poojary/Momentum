import React, { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Footer from "./Components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Import your Firebase auth instance

function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set true if a user is logged in, false otherwise
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const hideHeaderFooter =
    location.pathname === "/SignIn" || location.pathname === "/signup";

  return (
    <div className="flex">
      {/* Show Sidebar only if the user is authenticated */}
      {isAuthenticated && !hideHeaderFooter && <Sidebar />}
      <div className="flex flex-col flex-grow">
        {!hideHeaderFooter && <Header />}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
