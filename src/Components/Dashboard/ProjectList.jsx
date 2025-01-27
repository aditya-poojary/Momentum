import React, { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db, app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // Fetch the current user's email
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      if (userEmail) {
        try {
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

  // Format deadline display
  const formatDeadline = (deadline) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];

    if (deadline === today) {
      return "Due today";
    } else if (deadline === tomorrow) {
      return "Due tomorrow";
    }
    return `Due on ${deadline}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Projects</h2>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center p-4 border rounded-lg shadow-md bg-gray-50"
          >
            {/* User Avatar */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 mr-4">
              <span className="text-xl font-semibold text-gray-600">
                {project.ownerName?.charAt(0) || "A"}
              </span>
            </div>
            {/* Project Info */}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {project.projectName || "Unnamed Project"}
              </h3>
              <p className="text-sm text-gray-600">
                {project.description || "No description available."}
              </p>
            </div>
            {/* Deadline */}
            <div className="text-sm text-blue-600 font-medium">
              {formatDeadline(project.deadline)}
            </div>
          </li>
        ))}
      </ul>
      {projects.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-6">
          No projects available.
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <button
          className="px-6 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          onClick={() => navigate("/MyProjects")}
        >
          View All Projects
        </button>
      </div>
    </div>
  );
}
