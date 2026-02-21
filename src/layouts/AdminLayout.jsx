// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <Outlet />
    </div>
  );
}
