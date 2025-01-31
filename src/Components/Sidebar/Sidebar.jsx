import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ isFooterVisible }) {
  const navigate = useNavigate();

  return (
    <div
      className={`${
        isFooterVisible ? "relative" : "fixed left-0 top-16"
      } w-24 h-full bg-[#152d46] flex flex-col items-center py-6 space-y-6 shadow-lg z-40 transition-all duration-300 min-h-screen`}
    >
      <button
        onClick={() => navigate("/CreateProject")}
        className="w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <img
          src="/Sidebar Images/CreateProject.png"
          alt="Create Project"
          className="w-14 h-14"
        />
      </button>
      <button
        onClick={() => navigate("/MyProjects")}
        className="w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <img
          src="/Sidebar Images/MyProjects.png"
          alt="My Projects"
          className="w-12 h-12"
        />
      </button>
      <button
        onClick={() => navigate("/successful-projects")}
        className="w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <img
          src="/Sidebar Images/SuccessfulProjects.png"
          alt="Successful Projects"
          className="w-14 h-14"
        />
      </button>
      <button
        onClick={() => navigate("/TrashBin")}
        className="w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <img
          src="/Sidebar Images/Trashbin.png"
          alt="Trash Bin"
          className="w-14 h-14"
        />
      </button>
    </div>
  );
}

export default Sidebar;
