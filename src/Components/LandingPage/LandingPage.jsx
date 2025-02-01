import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LandingPage = () => {
  const features = [
    {
      title: "Create & Manage Projects",
      description:
        "Easily create new projects, edit details, and keep everything organized.",
      image: "/LandingPage Images/CreateProject.png",
    },
    {
      title: "Track Progress Visually",
      description:
        "Monitor progress using dynamic bar graphs and see real-time updates.",
      image: "/LandingPage Images/TrackProgress.png",
    },
    {
      title: "Plan Weekly Schedules",
      description:
        "Stay on top of deadlines with an intuitive planner for the current week.",
      image: "/LandingPage Images/WeeklySchedule.png",
    },
    {
      title: "Search & Retrieve Projects",
      description:
        "Find past projects instantly with a powerful search feature.",
      image: "/LandingPage Images/SearchProject.png",
    },
    {
      title: "Successful Project Showcase",
      description:
        "Highlight completed projects and track achievements effortlessly.",
      image: "/LandingPage Images/ProjectShowcase.png",
    },
    {
      title: "Restore & Manage Trash",
      description:
        "Recover deleted projects anytime or permanently remove unwanted ones.",
      image: "/LandingPage Images/TrashManagement.png",
    },
  ];

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    navigate(isAuthenticated ? "/dashboard" : "/signin");
  };

  return (
    <div className="relative min-h-screen bg-[#0f1e30] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Elevate Your{" "}
              <span className="text-[#1a75ff]">Project Management</span>
            </h1>
            <p className="text-lg text-gray-300">
              Momentum is your personal project management web app, helping you
              plan, track progress, and achieve your goals efficiently.
            </p>
            <button
              onClick={handleClick}
              className="bg-[#1a75ff] hover:bg-[#0056b3] text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Right Column - Image */}
          <div className="relative rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
            <img
              src="/LandingPage Images/LandingPageImage.png"
              className="w-full max-w-md mx-auto"
              alt="Dashboard Preview"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#152d40] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-[#1a75ff]">Momentum?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a3a60] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#152d46] to-[#1a75ff] text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Start Managing Your Projects Today!
          </h2>
          <p className="text-lg text-gray-200 mb-6">
            Take control of your project workflow and boost productivity with
            Momentum.
          </p>
          <button
            className="bg-white text-[#1a75ff] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300"
            onClick={handleClick}
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
