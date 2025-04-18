import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { restoreAndCleanupProject } from "../../Firestore/UserDocument";
import { useNavigate } from "react-router-dom";

function TrashBin() {
  const [userEmail, setUserEmail] = useState("");
  const [trashProjects, setTrashProjects] = useState([]);
  const [isAuthenticated, setisauthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisauthenticated(true);
        setUserEmail(user.email || `${user.providerData[0].uid}@gmail.com`);
      } else {
        navigate("/SignIn");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchTrashProjects = async () => {
    if (!userEmail) {
      console.error("User email not set. Cannot fetch projects.");
      return;
    }

    try {
      const trashRef = collection(db, "users", userEmail, "TrashBin");
      const snapshot = await getDocs(trashRef);

      const currentTime = new Date().getTime();
      const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;

      const trashData = [];

      for (const docSnap of snapshot.docs) {
        const docData = docSnap.data();
        // Convert Firestore timestamp to Date object properly
        const deletedAt = docData.deletedAt?.toDate();

        if (deletedAt) {
          const deletedAtTime = deletedAt.getTime();
          const timeDifference = currentTime - deletedAtTime;

          if (timeDifference > thirtyDaysInMillis) {
            // Project is older than 30 days, delete it
            const docRef = doc(db, "users", userEmail, "TrashBin", docSnap.id);
            await deleteDoc(docRef);
            console.log(
              `Document ${docSnap.id} deleted permanently after ${Math.floor(
                timeDifference / (24 * 60 * 60 * 1000)
              )} days`
            );
          } else {
            // Project is still within 30 days, add to list
            const daysLeft = Math.ceil(
              (thirtyDaysInMillis - timeDifference) / (24 * 60 * 60 * 1000)
            );
            trashData.push({
              id: docSnap.id,
              ...docData,
              daysLeft, // Add days left for reference
            });
          }
        } else {
          console.warn(
            `Document ${docSnap.id} does not have a valid deletedAt field.`
          );
        }
      }

      setTrashProjects(trashData);
    } catch (error) {
      console.error("Error fetching trash projects:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      fetchTrashProjects();
    }
  }, [isAuthenticated, userEmail]);

  const handleRestore = async (projectId) => {
    const result = await restoreAndCleanupProject(userEmail, projectId);
    console.log(result);
    if (result.success) {
      setTrashProjects((prev) =>
        prev.filter((project) => project.id !== projectId)
      );
    } else {
      console.error(
        "Failed to restore project:",
        result.message || result.error
      );
    }
  };

  const handlePermanentDelete = async (projectId) => {
    try {
      const projectRef = doc(db, "users", userEmail, "TrashBin", projectId);
      await deleteDoc(projectRef);

      setTrashProjects((prev) =>
        prev.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error permanently deleting project:", error);
    }
  };

  const handleRowClick = (project, event) => {
    if (event.target.closest("button")) return;
    setSelectedProject(project);
  };

  const closeModal = () => setSelectedProject(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex justify-center items-center p-4">
              <p className="text-[#0e141b] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight flex items-center">
                🗑️ Trash Bin
              </p>
            </div>

            {/* Projects Table */}
            <div className="px-4 py-3">
              <style jsx>{`
                @media (max-width: 480px) {
                  .desktop-table {
                    display: none;
                  }
                  .mobile-cards {
                    display: block;
                  }
                }

                @media (min-width: 481px) and (max-width: 767px) {
                  .desktop-table {
                    display: none;
                  }
                  .mobile-cards {
                    display: block;
                  }
                }

                @media (min-width: 768px) and (max-width: 1024px) {
                  .desktop-table {
                    display: table;
                  }
                  .mobile-cards {
                    display: none;
                  }
                  .hide-tablet {
                    display: none;
                  }
                }

                @media (min-width: 1025px) {
                  .desktop-table {
                    display: table;
                  }
                  .mobile-cards {
                    display: none;
                  }
                }
              `}</style>

              {/* Desktop and Tablet View */}
              <div className="overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                <table className="desktop-table w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[300px] text-sm font-medium hide-tablet">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[100px] text-sm font-medium">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium">
                        Completion
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium hide-tablet">
                        Start Time
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trashProjects.map((project, index) => (
                      <tr
                        key={index}
                        onClick={(e) => handleRowClick(project, e)}
                        className="relative border-t border-t-[#d0dbe7] hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="h-[72px] px-4 py-2 w-[200px] text-[#0e141b] text-sm font-normal ">
                          {project.projectName}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[300px] text-[#4e7297] text-sm font-normal hide-tablet">
                          {project.description.length > 50
                            ? project.description.substring(0, 50) + "..."
                            : project.description}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[100px] text-[#0e141b] text-sm font-normal">
                          {project.category}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[150px] text-sm font-normal">
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
                        <td className="h-[72px] px-4 py-2 w-[150px] text-[#4e7297] text-sm font-normal">
                          {project.deadline}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[150px] text-[#4e7297] text-sm font-normal hide-tablet">
                          {project.startTime}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[150px]">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handlePermanentDelete(project.id)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200"
                            >
                              Delete Permanently
                            </button>
                            <button
                              onClick={() => handleRestore(project.id)}
                              className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200"
                            >
                              Restore
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
                {trashProjects.map((project, index) => (
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
                    <div className="border-t border-[#d0dbe7]">
                      <div className="flex flex-col p-2 gap-2">
                        <button
                          onClick={() => handlePermanentDelete(project.id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                        >
                          Delete Permanently
                        </button>
                        <button
                          onClick={() => handleRestore(project.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
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
    </div>
  );
}

export default TrashBin;
