import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db,app } from "../../Backend";

import { getAuth } from "firebase/auth";

export default function CalendarOverview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
  const datesInWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const startDate = datesInWeek[0].toISOString().split("T")[0]; // Start of the week
        const endDate = datesInWeek[6].toISOString().split("T")[0]; // End of the week

        const projectsRef = collection(db, "users",userEmail,"Projects");
        const q = query(
          projectsRef,
          where("deadline", ">=", startDate),
          where("deadline", "<=", endDate)
        );
        const querySnapshot = await getDocs(q);

        const fetchedProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(fetchedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [datesInWeek]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">This Week's Overview</h2>
      <div className="grid grid-cols-7 gap-4 mb-8">
        {datesInWeek.map((date, i) => {
          const formattedDate = date.toISOString().split("T")[0];
          const projectsOnDate = projects.filter(
            (project) => project.deadline === formattedDate
          );
          const allCompleted = projectsOnDate.every(
            (project) => project.completed
          );

          return (
            <div
              key={i}
              className={`text-center p-2 rounded-lg border ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-blue-100"
                  : ""
              } ${
                allCompleted
                  ? "border-green-500 text-green-600"
                  : "border-red-500 text-red-600"
              }`}
            >
              <div className="text-sm font-medium">
                {date.toDateString().slice(0, 3)}
              </div>
              <div className="text-lg font-bold">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold mb-4">Projects This Week</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex gap-4 items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${
                project.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {new Date(project.deadline).getDate()}
            </div>
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.description}</p>
              <p className="text-sm text-gray-400">{project.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
