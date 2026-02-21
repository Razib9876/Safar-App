// src/features/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import MyBookings from "./MyBookings";
import CreateBooking from "./CreateBooking";
import CompleteTrip from "./CompleteTrip";

export default function BookingDashboard() {
  return (
    <div className="tabs tabs-lift">
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Booking"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <MyBookings></MyBookings>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Book Now"
        defaultChecked
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <CreateBooking></CreateBooking>
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Completed Bookings"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <CompleteTrip></CompleteTrip>
      </div>
    </div>
  );
}
