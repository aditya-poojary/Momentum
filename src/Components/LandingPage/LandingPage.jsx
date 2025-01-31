import React from "react";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#0f1e30]">
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Elevate Your <span className="text-[#1a75ff]">Project Management</span>
              </h1>
              <p className="text-lg text-gray-300">
                Momentum is your personal project management web app, helping you plan,
                track progress, and achieve your goals efficiently.
              </p>
              <button className="bg-[#1a75ff] hover:bg-[#0056b3] text-white px-8 py-3 rounded-lg shadow-lg transition-all">
                Get Started
              </button>
            </div>

            {/* Right Column - Dashboard Image Placeholder */}
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-800 flex items-center justify-center">
              {/* Add Image Here */}
              <span className="text-gray-500">Dashboard Image</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#152d40] py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Choose <span className="text-[#1a75ff]">Momentum?</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Create & Manage Projects",
                  description:
                    "Easily create new projects, edit details, and keep everything organized.",
                },
                {
                  title: "Track Progress Visually",
                  description:
                    "Monitor progress using dynamic bar graphs and see real-time updates.",
                },
                {
                  title: "Plan Weekly Schedules",
                  description:
                    "Stay on top of deadlines with an intuitive planner for the current week.",
                },
                {
                  title: "Search & Retrieve Projects",
                  description:
                    "Find past projects instantly with a powerful search feature.",
                },
                {
                  title: "Successful Project Showcase",
                  description:
                    "Highlight completed projects and track achievements effortlessly.",
                },
                {
                  title: "Restore & Manage Trash",
                  description:
                    "Recover deleted projects anytime or permanently remove unwanted ones.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#1a3a60] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  {/* Add feature image here */}
                  <div className="h-40 bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Feature Image</span>
                  </div>
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
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Managing Your Projects Today!
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Take control of your project workflow and boost productivity with
              Momentum.
            </p>
            <button className="bg-white text-[#1a75ff] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-all">
              Get Started Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
