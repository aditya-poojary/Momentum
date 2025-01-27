import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        About Momentum 🚀
      </h1>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/aboutus.png"
            alt="Project Management"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Our Mission 🎯
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-600">
              At **Momentum**, we believe in empowering individuals to take control of their projects and tasks. 
              Our platform is designed to make project management seamless, efficient, and enjoyable for everyone.
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Why Momentum? 🕒
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-600">
              Momentum was built with a singular goal in mind: to help users save time and stay organized.
              With all your projects in one place, you can easily track progress, set priorities, and focus on what matters most.
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-semibold text-gray-800">
                What We Offer 📋
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-600">
              From tracking your daily progress to organizing your tasks, Momentum helps you:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Stay on top of deadlines.</li>
                <li>Visualize your progress.</li>
                <li>Identify what is left to do at a glance.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-blue-50 p-8 rounded-lg text-center shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Ready to Take Control of Your Projects?
        </h2>
        <p className="text-gray-600 mb-6">
          Join us on this journey to a more organized and efficient you. Let Momentum help you stay focused and productive!
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          Get Started Today
        </button>
      </div>
    </div>
  );
}

export default AboutUs;
