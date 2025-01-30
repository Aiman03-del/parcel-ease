/* eslint-disable react/prop-types */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Shared/Sidebar";

const DashboardLayout = ({ userType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <div>
        <Sidebar
          userType={userType}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-18" : "ml-0"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
