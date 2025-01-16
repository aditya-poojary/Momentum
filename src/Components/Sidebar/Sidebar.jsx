import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-20 min-h-screen bg-[#152d46] flex flex-col items-center py-4 space-y-8 mt-[70px]">
      <button onClick={() => navigate("/CreateProject")} className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-full h-full">
          <rect x="40" y="40" width="160" height="160" rx="20" ry="20" fill="#4CAF50" stroke="#45a049" strokeWidth="4" />
          <line x1="120" y1="80" x2="120" y2="160" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="80" y1="120" x2="160" y2="120" stroke="white" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </button>
      <button onClick={() => navigate("/MyProjects")} className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-full h-full">
          <rect x="40" y="40" width="160" height="160" rx="20" ry="20" fill="#2196F3" stroke="#1976D2" strokeWidth="4" />
          <rect x="70" y="80" width="100" height="60" fill="white" rx="10" ry="10" />
          <rect x="70" y="150" width="100" height="20" fill="white" rx="5" ry="5" />
          <circle cx="120" cy="110" r="15" fill="#2196F3" stroke="white" strokeWidth="3" />
        </svg>
      </button>
      <button onClick={() => navigate("/successful-projects")} className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-full h-full">
          <rect x="40" y="40" width="160" height="160" rx="20" ry="20" fill="#8BC34A" stroke="#689F38" strokeWidth="4" />
          <polyline points="70,120 100,150 170,80" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={() => navigate("/TrashBin")} className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="w-full h-full">
          <rect x="40" y="40" width="160" height="160" rx="20" ry="20" fill="#F44336" stroke="#D32F2F" strokeWidth="4" />
          <path d="M80,80 L160,80 L150,170 Q120,180 90,170 Z" fill="#FFCDD2" />
          <rect x="90" y="70" width="60" height="20" rx="10" ry="10" fill="#FFCDD2" />
          <line x1="110" y1="110" x2="110" y2="150" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <line x1="130" y1="110" x2="130" y2="150" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default Sidebar;
