import React from "react";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Footer from "./Components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/SignIn" || location.pathname === "/signup";

  return (
    <div className="flex">
      {!hideHeaderFooter && <Sidebar />}
      <div className="flex flex-col flex-grow">
        {!hideHeaderFooter && <Header />}
        <Outlet />
        <Footer/>
      </div>
    </div>
  );
}

export default Layout;
