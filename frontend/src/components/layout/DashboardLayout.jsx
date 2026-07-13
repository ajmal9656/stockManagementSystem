import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../../styles/layout/DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
