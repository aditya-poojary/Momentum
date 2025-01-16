import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProjects } from "../store/projectsSlice";
import { getDocs, collection } from "firebase/firestore";
import { db, app } from "../Backend.js";
import ProjectFilter from "../Components/MyProjects/ProjectFilter";
import ProjectTable from "../Components/MyProjects/ProjectTable";
import EditProjectDialog from "../Components/MyProjects/EditDialog";

import { getAuth } from 'firebase/auth';

export default function MyProjects() {
  const dispatch = useDispatch();

  const fetchProjects = async () => {
    const auth = getAuth(app); // Ensure you initialize Firebase Authentication
    const user = auth.currentUser;
    if (user) {
      const projectsRef = collection(db, "users", user.email, "Projects"); // Fetch the appropriate Firestore collection path
      const snapshot = await getDocs(projectsRef); // Use getDocs to retrieve Firestore data
      const projectsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Extract document data
      dispatch(setProjects(projectsData)); // Dispatch the projects data to Redux store
    }
  };

  useEffect(() => {
    fetchProjects(); // Invoke fetchProjects when the component mounts
  }, [dispatch]);

  return (
    <div>
      <ProjectFilter />
      <ProjectTable fetchProjects={fetchProjects} /> {/* Pass fetchProjects as a prop */}
      <EditProjectDialog />
    </div>
  );
};
