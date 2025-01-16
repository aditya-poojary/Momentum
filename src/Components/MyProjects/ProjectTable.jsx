import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditProject, setDialogOpen } from "../../store/projectsSlice";
import { moveToTrashBin } from "../../Firestore/UserDocument";


export default function ProjectTable ({ fetchProjects, userEmail }) {
  const filteredProjects = useSelector((state) => state.projects.filteredProjects);
  const dispatch = useDispatch();

  const handleEditClick = (project) => {
    dispatch(setEditProject(project));
    dispatch(setDialogOpen(true));
  };

  const handleMoveToTrashBin = async (project) => {
    await moveToTrashBin(userEmail, project, async () => {
      await fetchProjects();
    });
  };

  return (
    <div className="px-4 py-3">
      <div className="flex overflow-hidden rounded-xl border border-[#d0dbe7] bg-slate-50">
        <table className="flex-1">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Project Name</th>
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Description</th>
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Completion</th>
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Deadline</th>
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Start Time</th>
              <th className="px-4 py-3 text-left text-[#0e141b] text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={index} className="relative border-t border-t-[#d0dbe7] hover:bg-gray-100">
                <td className="px-4 py-2">{project.projectName}</td>
                <td className="px-4 py-2">{project.description}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-[88px] overflow-hidden rounded-sm bg-[#d0dbe7]">
                      <div className="h-1 rounded-full bg-[#2884e6]" style={{ width: `${project.completion}%` }}></div>
                    </div>
                    <p>{project.completion}%</p>
                  </div>
                </td>
                <td className="px-4 py-2">{project.deadline}</td>
                <td className="px-4 py-2">{project.startTime}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEditClick(project)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleMoveToTrashBin(project)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

