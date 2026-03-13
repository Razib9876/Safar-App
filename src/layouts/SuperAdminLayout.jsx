// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";

export default function SuperAdminLayout() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4"> Super Admin Dashboard</h2>
      <Outlet />
    </div>
  );
}
