import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFromHeroPage } from "../../store/animationSlice";
import { clearUser } from "../../store/userSlice";
import { logoutUser } from "../Logout/Logout";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth, app } from "../../firebase"; // Replace with your actual Firebase config path
import { HiMenuAlt3, HiX } from "react-icons/hi"; // Importing icon

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser); // Set true if user exists, false otherwise
    });
  }, []);

  const handleLogout = () => {
    logoutUser(dispatch, navigate, clearUser);
    setIsSidebarOpen(false);
    localStorage.clear();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-[#152d46] shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:hidden z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-600">
        <h1 className="text-2xl font-bold text-white">Momentum</h1>
        <button
          className="text-white text-3xl cursor-pointer hover:text-gray-300"
          onClick={() => setIsSidebarOpen(false)}
        >
          <HiX />
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col space-y-3 p-6">
        {isAuthenticated
          ? // Display all project-related links if user is signed in
            [
              {
                to: user.username ? "/Dashboard" : "/",
                label: user.username ? "Dashboard" : "Home",
              },
              { to: "/CreateProject", label: "Create Project" },
              { to: "/MyProjects", label: "My Projects" },
              { to: "/successful-projects", label: "Successful Projects" },
              { to: "/TrashBin", label: "Trash Bin" },
              { to: "/Features", label: "Features" },
              { to: "/AboutUs", label: "About Us" },
              { to: "/ContactUs", label: "Contact Us" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-white text-lg px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))
          : // Display only general navigation links if user is not signed in
            [
              { to: "/", label: "Home" },
              { to: "/Features", label: "Features" },
              { to: "/AboutUs", label: "About Us" },
              { to: "/ContactUs", label: "Contact Us" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-white text-lg px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))}

        {/* Logout or Login Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-white text-lg px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300 text-left"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/SignIn"
            className="bg-white text-[#152d46] text-center font-medium rounded-lg text-lg px-4 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutUser(dispatch, navigate, clearUser);
    localStorage.clear();
  };

  const goToLogin = () => {
    dispatch(setFromHeroPage(true));
  };

  const defaultAvatar = "/default-avatar.png";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if a user is logged in
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full  bg-gradient-to-br from-[#152d30] to-[#152d70] text-white p-4 shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setIsSidebarOpen(true)}
        >
          <HiMenuAlt3 style={{ transform: "scaleX(-1)" }} />
        </button>
        <Link
          to={isAuthenticated ? "/Dashboard" : "/"}
          className="flex items-center ml-2 md:ml-[80px]"
        >
          <img
            src="Logo.jpg"
            alt="Logo"
            className="h-8 w-8 md:h-10 md:w-10 mr-2 md:mr-3"
          />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide font-LogoFont">
            Momentum
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4 lg:space-x-6">
          <Link
            to={isAuthenticated ? "/Dashboard" : "/"}
            className="text-white hover:text-gray-300 transition duration-300 whitespace-nowrap"
          >
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <Link
            to="/Features"
            className="text-white hover:text-gray-300 transition duration-300 whitespace-nowrap"
          >
            Features
          </Link>
          <Link
            to="/AboutUs"
            className="text-white hover:text-gray-300 transition duration-300 whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            to="/ContactUs"
            className="text-white hover:text-gray-300 transition duration-300 whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>

        {/* User Section */}
        {isAuthenticated ? (
          <div ref={dropdownRef} className="relative hidden md:block">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <img
                src={user.avatar || defaultAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span>{user.username}</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/SignIn"
            onClick={goToLogin}
            className="hidden md:block bg-white text-[#152d46] font-medium rounded-lg text-sm px-5 py-2 hover:bg-gray-100 transition duration-300 focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Log In
          </Link>
        )}
      </nav>

      {/* Sidebar for Mobile View */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </header>
  );
}

export default Header;
