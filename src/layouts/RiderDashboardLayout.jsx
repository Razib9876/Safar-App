// src/features/booking/MyBookings.jsx
import React from "react";

export default function RiderDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rider Dashboard</h1>
      <p>
        Welcome, this is your Rider dashboard where you can see your bookings.
      </p>

      <div className="mt-4 space-y-2">
        <button className="btn bg-blue-500 text-white px-3 py-1 rounded">
          Create New Booking
        </button>
        <button className="btn bg-green-500 text-white px-3 py-1 rounded">
          My Bookings
        </button>
      </div>
    </div>
  );
}
