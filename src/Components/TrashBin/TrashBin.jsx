import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { restoreAndCleanupProject } from "../../Firestore/UserDocument";
import { useNavigate } from "react-router-dom";

function TrashBin() {
  const [userEmail, setUserEmail] = useState("");
  const [trashProjects, setTrashProjects] = useState([]);
  const [isAuthenticated,setisauthenticated] =useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisauthenticated(true);
        setUserEmail(user.email);
      } else {
        navigate("/SignIn");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch projects from TrashBin collection
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
        const deletedAt = docData.deletedAt?.toMillis();

        if (deletedAt) {
          const timeDifference = currentTime - deletedAt;

          if (timeDifference > thirtyDaysInMillis) {
            const docRef = doc(db, "users", userEmail, "TrashBin", docSnap.id);
            await deleteDoc(docRef);
            console.log(`Document ${docSnap.id} deleted permanently.`);
          } else {
            trashData.push({
              id: docSnap.id,
              ...docData,
            });
          }
        } else {
          console.warn(
            `Document ${docSnap.id} does not have a valid deletedAt field.`
          );
        }
      }

      console.log("Fetched trash projects:", trashData);
      setTrashProjects(trashData);
    } catch (error) {
      console.error("Error fetching trash projects:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userEmail) {  // Only fetch when both conditions are met
      fetchTrashProjects();
    }
  }, [isAuthenticated, userEmail]); // Add isAuthenticated to dependencies

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

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0e141b] text-[32px] font-bold leading-tight">
                Trash Bin
              </p>
            </div>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[200px] text-sm font-medium">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[300px] text-sm font-medium">
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
                      <th className="px-4 py-3 text-left text-[#0e141b] w-[150px] text-sm font-medium">
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
                        className="relative border-t border-t-[#d0dbe7] hover:bg-gray-100"
                      >
                        <td className="h-[72px] px-4 py-2 w-[200px] text-[#0e141b] text-sm font-normal">
                          {project.projectName}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[300px] text-[#4e7297] text-sm font-normal">
                          {project.description}
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
                        <td className="h-[72px] px-4 py-2 w-[150px] text-[#4e7297] text-sm font-normal">
                          {project.startTime}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[150px]">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePermanentDelete(project.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete Permanently
                            </button>
                            <button
                              onClick={() => handleRestore(project.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrashBin;