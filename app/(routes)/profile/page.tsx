"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import { ProfileComponent } from "./ProfileComponent";

// Placeholder components - you'll implement these separately
const ProfilePage = () => <ProfileComponent />;
const AccountPage = () => <div>Account Settings</div>;
const SupportPage = () => <div>Support Center</div>;

export default function ProfileLayout() {
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "support">(
    "profile"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfilePage />;
      case "account":
        return <AccountPage />;
      case "support":
        return <SupportPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <FadeInOnScroll>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your Citely profile and preferences
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  onClick={() => setActiveTab("profile")}
                  className={`w-full justify-start ${
                    activeTab === "profile"
                      ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
                      : ""
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "ghost"}
                  onClick={() => setActiveTab("account")}
                  className={`w-full justify-start ${
                    activeTab === "account"
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-100"
                      : ""
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "support" ? "default" : "ghost"}
                  onClick={() => setActiveTab("support")}
                  className={`w-full justify-start ${
                    activeTab === "support"
                      ? "bg-purple-100 text-purple-900 hover:bg-purple-100"
                      : ""
                  }`}
                >
                  <HelpCircle className="w-5 h-5 mr-3" />
                  Support
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 mt-8"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Log Out
                </Button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </FadeInOnScroll>
    </div>
  );
}