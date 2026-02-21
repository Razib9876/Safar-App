// src/features/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import CurrentTrip from "./CurrentTrip";
import PendingTrips from "./PendingTrips";
import CompletedTrips from "./CompletedTrips";
import PendingBooking from "./PendingTrips";

export default function DriverDashboard() {
  return (
    <div className="tabs tabs-lift">
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Current Trip"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <CurrentTrip></CurrentTrip>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Pending Trip"
        defaultChecked
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <PendingBooking></PendingBooking>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Completed Trip"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <CompletedTrips></CompletedTrips>
      </div>
    </div>
  );
}
