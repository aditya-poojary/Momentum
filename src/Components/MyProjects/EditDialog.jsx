import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditProject, setDialogOpen } from "../../store/projectsSlice";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function EditProjectDialog({ userEmail }) {
  const editProject = useSelector((state) => state.projects.editProject);
  const dispatch = useDispatch();

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
      dispatch(setDialogOpen(false));
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return editProject ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <input
          type="text"
          value={editProject.projectName}
          onChange={(e) =>
            dispatch(
              setEditProject({ ...editProject, projectName: e.target.value })
            )
          }
        />
        {/* Additional inputs */}
        <button onClick={handleUpdateProject}>Save</button>
        <button onClick={() => dispatch(setDialogOpen(false))}>Cancel</button>
      </div>
    </div>
  ) : null;
}
