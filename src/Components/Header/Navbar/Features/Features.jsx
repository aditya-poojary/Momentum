import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, ClipboardList, Users, Trash2, Share2 } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <ClipboardList className="w-8 h-8 text-blue-500" />,
      title: "Project Management",
      description:
        "Easily create, organize, and manage your projects with a user-friendly interface. Momentum allows you to track progress, set deadlines, and keep everything in one place.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Team Collaboration",
      description:
        "Collaborate with your team seamlessly. Share projects, assign tasks, and track updates in real-time, ensuring everyone stays on the same page.",
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-purple-500" />,
      title: "Track Completion",
      description:
        "Visualize your progress with real-time completion tracking. Monitor your team's performance and ensure that all milestones are achieved on time.",
    },
    {
      icon: <Trash2 className="w-8 h-8 text-red-500" />,
      title: "Trash Management",
      description:
        "Deleted projects are safely stored in the Trash Bin, allowing you to restore them or permanently delete them after 30 days.",
    },
    {
      icon: <Share2 className="w-8 h-8 text-orange-500" />,
      title: "Project Sharing",
      description:
        "Share your projects with stakeholders or teammates. Empower others with access to view or contribute to your projects efficiently.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        🚀 Features of Momentum
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-200"
          >
            <CardHeader className="flex items-center gap-4 p-6">
              <div className="p-3 bg-gray-100 rounded-lg">{feature.icon}</div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-gray-600">
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Features;
