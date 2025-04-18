import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function SuccessProject() {
  const [successProjects, setSuccessProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  // Ensure user authentication
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || `${user.providerData[0].uid}@gmail.com`);
      } else {
        navigate("/SignIn");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch successful projects
  useEffect(() => {
    const fetchSuccessProjects = async () => {
      if (!userEmail) return;

      try {
        const projectsRef = collection(db, "users", userEmail, "Projects");
        const q = query(projectsRef, where("completion", "==", 100));
        const querySnapshot = await getDocs(q);

        const fetchedProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSuccessProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching successful projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessProjects();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-lg min-h-screen overflow-y-auto pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🎉 Successful Projects
      </h1>

      {successProjects.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-500">No successful projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {successProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 break-words">
                  {project.projectName || "Untitled Project"}
                </CardTitle>
                <CardDescription className="text-gray-600 break-words">
                {project.description && project.description.length > 50
                  ? project.description.substring(0, 50) + "..."
                  : project.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  <strong>Deadline:</strong>{" "}
                  <span className="font-medium text-gray-700">{project.deadline || "N/A"}</span>
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Start Time:</strong>{" "}
                  <span className="font-medium text-gray-700">{project.startTime || "N/A"}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Completion:</strong>{" "}
                  <span className="font-medium text-green-600">100%</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
