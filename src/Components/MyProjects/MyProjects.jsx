import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { moveToTrashBin } from "../../Firestore/UserDocument";
import { db, app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editProject, setEditProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isauthenticated, setisauthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleRowClick = (project, event) => {
    // Prevent modal from opening if clicking on Edit/Delete buttons
    if (event.target.closest("button")) return;
    setSelectedProject(project);
  };

  const closeModal = () => setSelectedProject(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisauthenticated(true);
        setUserEmail(user.email);
      } else {
        setisauthenticated(false);
        navigate("/SignIn");
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userEmail) return;

      try {
        const projectsRef = collection(db, "users", userEmail, "Projects");
        const snapshot = await getDocs(projectsRef);

        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userEmail]);

  // Filter projects
  useEffect(() => {
    if (filter === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.category?.toLowerCase() === filter.toLowerCase()
      );
      setFilteredProjects(filtered);
    }
  }, [filter, projects]);

  // Prevent rendering until initialization is complete
  if (isInitializing) {
    return <div>Loading...</div>;
  }

  // Prevent rendering if not authenticated
  if (!isauthenticated) {
    return null;
  }

  const handleEditClick = (project) => {
    setEditProject(project);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditProject(null);
    setIsDialogOpen(false);
  };

  const handleUpdateProject = async () => {
    if (!editProject) return;

    try {
      // Parse fields back to their correct types
      const updatedProject = {
        ...editProject,
        completion: parseFloat(editProject.completion), // Ensure it's a number
        deadline: editProject.deadline
          ? new Date(editProject.deadline).toISOString().split("T")[0]
          : null, // Ensure it's a valid date
        startTime: editProject.startTime
          ? new Date(editProject.startTime).toISOString()
          : null, // Ensure it's a valid timestamp
      };

      const projectRef = doc(
        db,
        "users",
        userEmail,
        "Projects",
        editProject.id
      );

      // Update Firestore
      await updateDoc(projectRef, updatedProject);

      // Update state
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === editProject.id ? { ...proj, ...updatedProject } : proj
        )
      );

      setFilteredProjects((prev) =>
        prev.map((proj) =>
          proj.id === editProject.id ? { ...proj, ...updatedProject } : proj
        )
      );

      // Close the dialog
      handleDialogClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleMoveToTrashBin = async (project) => {
    await moveToTrashBin(userEmail, project, async () => {
      const fetchProjects = async () => {
        try {
          const projectsRef = collection(db, "users", userEmail, "Projects");
          const snapshot = await getDocs(projectsRef);
          const projectsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectsData);
          setFilteredProjects(projectsData);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      await fetchProjects();
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="px-4 flex flex-1 justify-center py-5" style={{
          '@media (min-width: 768px)': {
            paddingLeft: '2rem',
            paddingRight: '2rem'
          },
          '@media (min-width: 1281px)': {
            paddingLeft: '10rem',
            paddingRight: '10rem'
          }
        }}>
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0e141b] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight">
                All Projects
              </p>
            </div>
            <div className="flex gap-3 p-3 flex-wrap">
              {["All", "Must do", "Should Do", "Can do"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`flex h-8 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 transition-colors duration-200 ${
                    filter === category
                      ? "bg-[#d0dbe6]"
                      : "bg-[#e7edf3] hover:bg-[#d0dbe6]"
                  }`}
                >
                  <p className="text-[#0e141b] text-sm font-medium">
                    {category} Tasks
                  </p>
                </button>
              ))}
            </div>

            {/* Projects Table */}
            <div className="px-4 py-3">
              <style jsx>{`
                @media (max-width: 480px) {
                  .desktop-table { display: none; }
                  .mobile-cards { display: block; }
                }
                
                @media (min-width: 481px) and (max-width: 767px) {
                  .desktop-table { display: none; }
                  .mobile-cards { display: block; }
                }
                
                @media (min-width: 768px) and (max-width: 1024px) {
                  .desktop-table { display: table; }
                  .mobile-cards { display: none; }
                  .hide-tablet { display: none; }
                }
                
                @media (min-width: 1025px) {
                  .desktop-table { display: table; }
                  .mobile-cards { display: none; }
                }
              `}</style>

              {/* Desktop and Tablet View */}
              <div className="overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                <table className="desktop-table w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium hide-tablet">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Completion
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium hide-tablet">
                        Start Time
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, index) => (
                      <tr
                        key={index}
                        onClick={(e) => handleRowClick(project, e)}
                        className="relative border-t border-t-[#d0dbe7] hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#0e141b] text-sm font-normal">
                          {project.projectName}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7297] text-sm font-normal hide-tablet">
                          {project.description.length > 50
                            ? project.description.substring(0, 50) + "..."
                            : project.description}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-sm font-normal">
                          <div className="flex items-center gap-3">
                            <div className="w-[88px] overflow-hidden rounded-sm bg-[#d0dbe7]">
                              <div
                                className="h-1 rounded-full bg-[#2884e6]"
                                style={{
                                  width: `${project.completion}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-[#0e141b] text-sm font-medium">
                              {project.completion}%
                            </p>
                          </div>
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7297] text-sm font-normal">
                          {project.deadline}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7297] text-sm font-normal hide-tablet">
                          {project.startTime}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[150px]">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleMoveToTrashBin(project)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="mobile-cards space-y-4">
                {filteredProjects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-[#d0dbe7] overflow-hidden shadow-sm"
                  >
                    <div
                      onClick={(e) => handleRowClick(project, e)}
                      className="cursor-pointer p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[#0e141b] font-medium">
                          {project.projectName}
                        </h3>
                        <span className="text-[#4e7297] text-xs">
                          {project.deadline}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-full overflow-hidden rounded-sm bg-[#d0dbe7]">
                          <div
                            className="h-2 rounded-full bg-[#2884e6]"
                            style={{
                              width: `${project.completion}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-[#0e141b] text-sm font-medium whitespace-nowrap">
                          {project.completion}%
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-[#d0dbe7] flex">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="flex-1 py-2 text-center text-blue-500 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <div className="w-px bg-[#d0dbe7]"></div>
                      <button
                        onClick={() => handleMoveToTrashBin(project)}
                        className="flex-1 py-2 text-center text-red-500 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 md:max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {selectedProject.projectName}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Description:</strong> {selectedProject.description}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Completion:</strong> {selectedProject.completion}%
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Deadline:</strong> {selectedProject.deadline}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Start Time:</strong> {selectedProject.startTime}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDialogOpen && editProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Edit Project
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={editProject.projectName}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
                placeholder="Project Name"
              />
              <textarea
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
              />
              <input
                type="number"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={editProject.completion}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    completion: e.target.value, // Allow only numeric input
                  }))
                }
                placeholder="Completion Percentage"
              />
              <input
                type="date"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={editProject.deadline}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
                placeholder="Deadline"
              />
              <input
                type="datetime-local"
                className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={editProject.startTime}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                placeholder="Start Time"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleUpdateProject}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleDialogClose}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
