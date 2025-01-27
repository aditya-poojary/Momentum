import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFromHeroPage } from "../../store/animationSlice";
import { clearUser } from "../../store/userSlice";
import { logoutUser } from "../Logout/Logout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Replace with your actual Firebase config path

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <header className="bg-gradient-to-br from-[#152d30] to-[#152d70] text-white p-4 shadow-md ml-[-80px]">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={isAuthenticated ? "/Dashboard" : "/HeroPage"} className="flex items-center ml-[80px]">
          <img src="Logo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-3xl font-bold tracking-wide font-LogoFont">
            Momentum
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            to={isAuthenticated ? "/Dashboard" : "/HeroPage"}
            className="text-white hover:text-gray-300 transition duration-300"
          >
            {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <Link to="/Features" className="text-white hover:text-gray-300 transition duration-300">
            Features
          </Link>
          <Link to="/AboutUs" className="text-white hover:text-gray-300 transition duration-300">
            About Us
          </Link>
          <Link to="/ContactUs" className="text-white hover:text-gray-300 transition duration-300">
            Contact Us
          </Link>
        </div>

        {/* User Section */}
        {user.avatar || user.username ? (
          <div ref={dropdownRef} className="relative">
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
            className="bg-white text-[#152d46] font-medium rounded-lg text-sm px-5 py-2 hover:bg-gray-100 transition duration-300 focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Log In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
