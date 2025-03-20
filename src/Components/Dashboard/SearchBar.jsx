import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { getDocs, collection, doc } from "firebase/firestore"; // Firebase Firestore
import { db, app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { FiSearch } from "react-icons/fi"; // Importing search icon

export default function SearchBar() {
  const [query, setQuery] = useState(""); // User's search input
  const [projects, setProjects] = useState([]); // All projects from Firebase
  const [filteredProjects, setFilteredProjects] = useState([]); // Filtered results
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  // Fetch the current user's email
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      if (userEmail) {
        try {
          // Navigate to the user's document and access the "Projects" subcollection
          const userDoc = doc(db, "users", userEmail);
          const projectCollection = collection(userDoc, "Projects");
          const projectSnapshot = await getDocs(projectCollection);

          const projectList = projectSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectList);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [userEmail]);

  // Update filtered results as the user types
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProjects([]);
    } else {
      const results = projects.filter((project) =>
        project.projectName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(results);
    }
  }, [query, projects]);

  // Handle project selection
  const handleProjectClick = (project) => {
    navigate("/MyProjects"); // Redirect to MyProjects page
  };

  // Format deadline display
  const formatDeadline = (deadline) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]; // Get tomorrow's date in YYYY-MM-DD format

    if (deadline === today) {
      return "Today";
    } else if (deadline === tomorrow) {
      return "Tomorrow";
    }
    return deadline; // Return the original deadline if it doesn't match today or tomorrow
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 md:px-0">
      <div className="relative w-full">
        <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2 md:space-y-4 mt-2 md:mt-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-3 md:p-4 border rounded-lg shadow hover:shadow-md cursor-pointer transition duration-200 bg-white"
            onClick={() => handleProjectClick(project)}
          >
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              {project.projectName || "Unnamed Project"}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
              {project.description || "No description available"}
            </p>
            {project.deadline && (
              <p className="text-xs md:text-sm text-blue-600 mt-1 md:mt-2">
                Deadline: {formatDeadline(project.deadline)}
              </p>
            )}
          </div>
        ))}
        {query && filteredProjects.length === 0 && (
          <p className="text-sm text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}
