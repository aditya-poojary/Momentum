import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#152d40] text-white py-8 pl-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Logo and Description */}
        <div>
          <div className="flex items-center mb-4">
            <img src="Logo.jpg" alt="Logo" className="h-10 w-10 mr-2" />
            <span className="text-2xl font-bold font-LogoFont">Momentum</span>
          </div>
          <p className="text-gray-300 text-sm">
            Momentum provides innovative tools for project management and creative solutions to help you stay ahead.
          </p>
        </div>

        {/* Products Section */}
        {/* <div>
          <h4 className="text-lg font-semibold mb-2">Products</h4>
          <ul className="space-y-1">
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Photo Editor
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Video Editor
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Mobile Apps
              </Link>
            </li>
          </ul>
        </div> */}

        {/* About Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">About</h4>
          <ul className="space-y-1">
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Careers
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Affiliates Program
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/tos" className="text-gray-300 hover:text-white transition">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-8 border-t border-gray-700 pt-4 flex justify-between items-center">
        {/* Copyright Information */}
        <span className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Momentum. All Rights Reserved.
        </span>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <Link to="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-linkedin-in"></i> {/* LinkedIn Icon */}
          </Link>
          <Link to="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-twitter"></i> {/* Twitter Icon */}
          </Link>
          <Link to="#" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-facebook-f"></i> {/* Facebook Icon */}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
