import SearchBar from "../Components/Dashboard/SearchBar";
import ProjectList from "../Components/Dashboard/ProjectList";
import ProjectHoursGraph from "../Components/Dashboard/ProjectHoursGraph";
import CalendarOverview from "../Components/Dashboard/CalendarOverview";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate("/SignIn");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-4 md:ml-16 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="block lg:flex lg:flex-row gap-4 md:gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-4 md:space-y-8">
              <div className="w-full mt-4">
                <SearchBar />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3 md:gap-4 text-center sm:text-left">
                <div className="w-full">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                    Start your day with Momentum
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Explore projects and track progress easily
                  </p>
                </div>
                <Link to="/CreateProject" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base">
                    Create Project
                  </button>
                </Link>
              </div>

              {/* Calendar moves into main column for mobile/tablet */}
              <div className="lg:hidden mb-4 md:mb-8">
                <CalendarOverview />
              </div>

              <div className="space-y-4 md:space-y-8">
                <ProjectList />
                <ProjectHoursGraph />
              </div>
            </div>

            {/* Right Sidebar - Only visible on desktop */}
            <div className="hidden lg:block w-full lg:w-1/3 space-y-6 md:space-y-8">
              <CalendarOverview />
              {/* <UpcomingMilestones /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
