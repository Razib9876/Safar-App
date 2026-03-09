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
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <PendingBooking></PendingBooking>
        </div>
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="All Bookings"
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <PendingTrips></PendingTrips>
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Completed"
        />
        <div className="tab-content bg-base-100 border-base-300 pt-6 px-0 pb-0 sm:p-6">
          <CompletedBooking />
        </div>

        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label="Rejected"
        />
        <div className="tab-content bg-base-100 border-base-300 pt-6 px-0 pb-0 sm:p-6">
          <RejectedBooking></RejectedBooking>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
