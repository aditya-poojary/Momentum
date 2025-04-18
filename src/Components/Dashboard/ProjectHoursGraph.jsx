import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db, app } from "../../firebase";
import { getAuth } from "firebase/auth";

export default function ProjectHoursGraph() {
  const [userEmail, setUserEmail] = useState("");
  const [graphData, setGraphData] = useState([]);

  // Fetch current user email
  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(`${user.providerData[0].uid}@gmail.com`);
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
        Weekly Progress
      </h2>
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={graphData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="totalProgress" fill="#4a90e2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs md:text-sm text-gray-500 text-center mt-4">
        Visualizing your progress for the past 7 days.
      </p>
    </div>
  );
}
