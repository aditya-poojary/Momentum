import React, { useState, useEffect } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { addProjectToUserCollection } from "../../Firestore/UserDocument";
import { useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox/DialogBox";

const db = getDatabase(app);
function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [category, setCategory] = useState("Can Do");
  const [deadline, setDeadline] = useState("");
  const [completion, setCompletion] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleCloseDialog = () => setShowDialog(false);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Set the user's email only once
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = userEmail; // Replace with the logged-in user's email
    const projectData = {
      projectName,
      description,
      startTime,
      category,
      deadline,
      completion,
    };

    try {
      const isDuplicate = await addProjectToUserCollection(email, projectData);
      if (isDuplicate) {
        setShowDialog(true); // Show dialog box if project is duplicate
      } else {
        console.log("Project created successfully!");
        navigate("/Dashboard");
        // Navigate after successful creation
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-2xl lg:max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Create Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Project Name:
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Project Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter project description"
                rows="3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="Must Do">M - Must Do</option>
                  <option value="Should Do">S - Should Do</option>
                  <option value="Can Do">C - Can Do</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Project Start Time/Date:
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Deadline:
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              % Completed:
            </label>
            <input
              type="number"
              value={completion}
              onChange={(e) => {
                const value = Math.max(
                  0,
                  Math.min(100, Number(e.target.value))
                );
                setCompletion(value);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter percentage completed"
              min="0"
              max="100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
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
