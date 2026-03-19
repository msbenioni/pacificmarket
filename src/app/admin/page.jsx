"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Presentation, 
  Settings, 
  Users, 
  Building2, 
  FileText, 
  BarChart3,
  ChevronRight 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const adminSections = [
    {
      id: "presentations",
      title: "Presentations",
      description: "Investor and partner presentation decks",
      icon: Presentation,
      status: "active",
      path: "/admin/presentations",
      badge: "1 deck",
      color: "bg-blue-500"
    },
    {
      id: "businesses",
      title: "Business Management",
      description: "Manage business listings and approvals",
      icon: Building2,
      status: "active",
      path: "/admin/businesses",
      badge: "Manage",
      color: "bg-green-500"
    },
    {
      id: "users",
      title: "User Management",
      description: "User accounts and permissions",
      icon: Users,
      status: "coming-soon",
      path: "#",
      badge: "Coming Soon",
      color: "bg-gray-400"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Platform usage and business metrics",
      icon: BarChart3,
      status: "coming-soon",
      path: "#",
      badge: "Coming Soon",
      color: "bg-gray-400"
    },
    {
      id: "reports",
      title: "Reports",
      description: "Business and financial reports",
      icon: FileText,
      status: "coming-soon",
      path: "#",
      badge: "Coming Soon",
      color: "bg-gray-400"
    },
    {
      id: "settings",
      title: "Settings",
      description: "Platform configuration and settings",
      icon: Settings,
      status: "coming-soon",
      path: "#",
      badge: "Coming Soon",
      color: "bg-gray-400"
    }
  ];

  const handleNavigation = (path) => {
    if (path !== "#") {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your Pacific Discovery Network platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Tools</h2>
          <p className="text-gray-600">Access and manage different aspects of your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            const isComingSoon = section.status === "coming-soon";
            
            return (
              <Card 
                key={section.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  isComingSoon ? "opacity-75" : ""
                }`}
                onClick={() => handleNavigation(section.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${section.color} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${section.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <Badge 
                          variant={isComingSoon ? "secondary" : "default"}
                          className="mt-1"
                        >
                          {section.badge}
                        </Badge>
                      </div>
                    </div>
                    {!isComingSoon && (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <Button 
                    variant={isComingSoon ? "secondary" : "default"}
                    disabled={isComingSoon}
                    className="w-full"
                  >
                    {isComingSoon ? "Coming Soon" : "Access Tool"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <Presentation className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Presentation System</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Your investor presentation deck is ready to view and export. The presentation includes 15 professional slides covering your business opportunity, solution, market, and financial projections.
          </p>
          <Button 
            onClick={() => router.push("/admin/presentations")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Presentations
          </Button>
        </div>
      </div>
    </div>
  );
}
