import { Outlet } from "react-router-dom";

export default function DriverLayout() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Driver Dashboard</h2>
      <Outlet />
    </div>
  );
}
