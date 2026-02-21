import { useEffect, useState } from "react";
import axiosSecure from "../../services/axiosSecure";

export default function UserAnalytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    axiosSecure.get("/analytics/user").then((res) => setData(res.data));
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">My Analytics</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Total Trips" value={data.trips} />

        <Stat title="Total Spent" value={`৳${data.spent}`} />

        <Stat title="Completed Trips" value={data.completed} />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="border p-4 rounded text-center">
      <p className="text-gray-500">{title}</p>

      <h3 className="text-xl font-bold">{value || 0}</h3>
    </div>
  );
}
