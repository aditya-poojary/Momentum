import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function CalendarOverview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
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
      if (!userEmail) return;
      try {
        const startDate = datesInWeek[0].toISOString().split("T")[0];
        const endDate = datesInWeek[6].toISOString().split("T")[0];

        const projectsRef = collection(db, "users", userEmail, "Projects");
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
  }, [userEmail, datesInWeek]);

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-full max-w-[500px] mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        This Week's Overview
      </h2>
      <TooltipProvider>
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-6">
          {datesInWeek.map((date, i) => {
            const formattedDate = date.toISOString().split("T")[0];
            const projectsOnDate = projects.filter(
              (project) => project.deadline === formattedDate
            );
            const allCompleted = projectsOnDate.every(
              (project) => project.completed
            );

            return (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <div
                    className={`flex flex-col items-center justify-center p-2 md:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      date.toDateString() === new Date().toDateString()
                        ? "bg-blue-50"
                        : ""
                    } ${
                      allCompleted
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                    }`}
                  >
                    <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">
                      {date.toDateString().slice(0, 3)}
                    </div>
                    <div className="text-base md:text-2xl font-bold">
                      {date.getDate()}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {projectsOnDate.length > 0 ? (
                    <div>
                      {projectsOnDate.map((project) => (
                        <p key={project.id} className="text-sm">
                          {project.title}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No projects</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-gray-700" />
        Projects This Week
      </h2>
      <div className="grid gap-4">
        {projects.map((project) => {
          const deadlineDate = new Date(project.deadline);
          const dayName = deadlineDate.toLocaleDateString("en-US", {
            weekday: "long",
          });

          return (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-all duration-300 group border-l-4 hover:scale-[1.01]"
              style={{
                borderLeftColor: project.completed ? "#10B981" : "#EF4444",
              }}
            >
              <CardHeader className="pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold group-hover:text-gray-900">
                    {project.title}
                  </CardTitle>
                  
                  <div className="flex justify-center my-2">
                    <Badge
                      variant={project.completed ? "success" : "destructive"}
                      className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${
                        project.completed
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {project.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <span>{project.completed ? "Completed" : "Pending"}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {dayName},{" "}
                    {deadlineDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}