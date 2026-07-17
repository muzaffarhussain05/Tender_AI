import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
