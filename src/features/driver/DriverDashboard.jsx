// src/features/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import CompletedTrips from "./CompletedTrips";
import PendingBooking from "./PendingTrips";
import CurrentTrip from "./CurrentTrip";

export default function DriverDashboard() {
  return (
    <div className="tabs tabs-lift w-full max-w-full">
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Current Trip"
      />
      <div className="tab-content bg-base-100 border-base-300 border-r-0 border-b-0 p-6">
        <CurrentTrip></CurrentTrip>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Pending Trip"
        defaultChecked
      />
      <div className="tab-content bg-base-100 border-t border-base-300 p-6">
        <PendingBooking></PendingBooking>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Completed Trip"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6 w-full h-screen">
        <CompletedTrips></CompletedTrips>
      </div>
    </div>
  );
}
