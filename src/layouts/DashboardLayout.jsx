/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Shared/Sidebar";
const DashboardLayout = ({ userType }) => {
  return (
    <div className="relative min-h-screen flex bg-background text-foreground">
      <Sidebar userType={userType} />
      <div className="flex-1 md:ml-18">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
