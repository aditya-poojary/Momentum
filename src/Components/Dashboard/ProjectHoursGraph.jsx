import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db, app } from "../../Backend";
import { getAuth } from "firebase/auth";

export default function ProjectHoursGraph() {
  const [userEmail, setUserEmail] = useState("");
  const [graphData, setGraphData] = useState([]);

  // Fetch current user email
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Fetch the latest 7 documents from the DailyProgress collection
  const fetchDailyProgress = async () => {
    if (!userEmail) return;

    try {
      const progressRef = collection(db, "users", userEmail, "DailyProgress");
      const q = query(progressRef, orderBy("date", "desc"), limit(7)); // Query for the latest 7 documents
      const snapshot = await getDocs(q);

      const data = snapshot.docs
        .map((doc) => ({
          date: doc.id, // Assuming the document ID is the date
          totalProgress: doc.data().totalProgress || 0,
        }))
        .reverse(); // Reverse to show oldest first for proper graph order

      setGraphData(data);
    } catch (error) {
      console.error("Error fetching daily progress:", error);
    }
  };

  useEffect(() => {
    fetchDailyProgress();
  }, [userEmail]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="totalProgress" fill="#4a90e2" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-500 text-center mt-4">
        Visualizing your progress for the past 7 days.
      </p>
    </div>
  );
}
