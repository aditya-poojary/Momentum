import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { moveToTrashBin } from "../../Firestore/UserDocument";
import { db, app } from "../../Backend";
import { getAuth } from "firebase/auth";

export default function MyProjects() {
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editProject, setEditProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

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
      setFilteredProjects(projectsData); // Initialize filtered projects
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userEmail]);

  useEffect(() => {
    if (filter === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.category.toLowerCase() === filter.toLowerCase()
      );
      setFilteredProjects(filtered);
    }
  }, [filter, projects]);

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
      const projectRef = doc(
        db,
        "users",
        userEmail,
        "Projects",
        editProject.id
      );
      await updateDoc(projectRef, editProject);

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === editProject.id ? { ...proj, ...editProject } : proj
        )
      );
      setFilteredProjects((prev) =>
        prev.map((proj) =>
          proj.id === editProject.id ? { ...proj, ...editProject } : proj
        )
      );

      handleDialogClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleMoveToTrashBin = async (project) => {
    await moveToTrashBin(userEmail, project, async () => {
      // Fetch updated projects after successful deletion
      await fetchProjects();
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0e141b] text-[32px] font-bold leading-tight">
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
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Completion
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[400px] text-sm font-medium">
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
                        className="relative border-t border-t-[#d0dbe7] hover:bg-gray-100"
                      >
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#0e141b] text-sm font-normal">
                          {project.projectName}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7297] text-sm font-normal">
                          {project.description}
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
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#4e7297] text-sm font-normal">
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
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && editProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="border p-2 rounded"
                value={editProject.projectName}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="border p-2 rounded"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                className="border p-2 rounded"
                value={editProject.completion}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    completion: e.target.value,
                  }))
                }
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={editProject.deadline}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
              />
              <input
                type="datetime-local"
                className="border p-2 rounded"
                value={editProject.startTime}
                onChange={(e) =>
                  setEditProject((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleUpdateProject}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleDialogClose}
                className="bg-gray-300 px-4 py-2 rounded"
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
