import SearchBar from "../Components/Dashboard/SearchBar"
import ProjectList from "../Components/Dashboard/ProjectList"
import ProjectHoursGraph from "../Components/Dashboard/ProjectHoursGraph"
import CalendarOverview from "../Components/Dashboard/CalendarOverview"
import UpcomingMilestones from "../Components/Dashboard/UpcomingMilestones"
import { Link } from "react-router-dom"


export default function Dashboard() {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="ml-16 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-semibold mb-2">Start your day with Projectify</h1>
                <p className="text-gray-600">Explore projects and track progress easily</p>
              </div>
              <Link to="/CreateProject">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Project
              </button>
              </Link>
            </div>
  
            {/* Main Content */}
            <div className="flex gap-8">
              <div className="flex-1 space-y-8">
                <SearchBar />
                <ProjectList />
                <ProjectHoursGraph />
              </div>
  
              {/* Right Sidebar */}
              <div className="w-80">
                <CalendarOverview />
                <UpcomingMilestones />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }