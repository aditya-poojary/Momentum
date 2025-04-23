import React, { useState, useEffect } from "react";
import { getDatabase } from "firebase/database";
import { app } from "../../firebase";
import { addProjectToUserCollection } from "../../Firestore/UserDocument";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox/DialogBox";
import { useUserEmail } from "../../hooks/useUserEmail";
import { Slider } from "@/components/ui/slider";

const db = getDatabase(app);
function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [category, setCategory] = useState("Can Do");
  const [deadline, setDeadline] = useState("");
  const [completion, setCompletion] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { userEmail, loading } = useUserEmail();

  const handleCloseDialog = () => setShowDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !userEmail) {
      console.error("User email not available");
      return;
    }

    const projectData = {
      projectName,
      description,
      startTime,
      category,
      deadline,
      completion,
    };

    try {
      const isDuplicate = await addProjectToUserCollection(
        userEmail,
        projectData
      );
      if (isDuplicate) {
        setShowDialog(true);
      } else {
        console.log("Project created successfully!");
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create a New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Project Name:
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter project details"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Category and Start Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="Must Do">M - Must Do</option>
                <option value="Should Do">S - Should Do</option>
                <option value="Can Do">C - Can Do</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Start Date/Time:
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Completion */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Completion (%):{" "}
              <span className="text-blue-500 font-medium ml-1">
                {completion}%
              </span>
            </label>
            <div className="py-4">
              <Slider
                defaultValue={[0]}
                value={[completion]}
                max={100}
                step={1}
                onValueChange={(value) => setCompletion(value[0])}
                className="py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300"
          >
            Create Project
          </button>
        </form>
      </div>

      <DialogBox
        show={showDialog}
        title="Duplicate Project"
        message="A project with this name already exists. Please use a different name."
        onClose={handleCloseDialog}
      />
    </div>
  );
}

export default CreateProject;
