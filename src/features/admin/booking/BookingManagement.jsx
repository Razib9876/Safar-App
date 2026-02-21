import React from "react";
import HandleTrips from "./handleTrips";
import PendingTrips from "./PendingTrip";
import CompletedBooking from "./CompletedBooking";
import PendingBooking from "./PendingBooking";
import RejectedBooking from "./RejectedBooking";

const BookingManagement = () => {
  return (
    <div>
      <div className="tabs tabs-lift">
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Pending"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <PendingBooking></PendingBooking>
        </div>
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="All Bookings"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <PendingTrips></PendingTrips>
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Completed"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <CompletedBooking></CompletedBooking>
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Rejected"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <RejectedBooking></RejectedBooking>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
