import { useEffect, useState } from "react";
import axiosSecure from "../../services/axiosSecure";

export default function StatsCards() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosSecure.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Total Users" value={stats.users} />

      <Card title="Drivers" value={stats.drivers} />

      <Card title="Bookings" value={stats.bookings} />

      <Card title="Revenue" value={`৳${stats.revenue}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>

      <h2 className="text-2xl font-bold">{value || 0}</h2>
    </div>
  );
}
