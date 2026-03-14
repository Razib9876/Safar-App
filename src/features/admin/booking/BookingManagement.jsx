import React from "react";
import HandleTrips from "./handleTrips";
import CompletedBooking from "./CompletedBooking";
import PendingBooking from "./PendingBooking";
import RejectedBooking from "./RejectedBooking";
import AdminLogisticsMaster from "./AllBookings";

const BookingManagement = () => {
  return (
    <div>
      <div className="tabs tabs-lift w-full max-w-full">
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
        <div className="tab-content bg-base-100 border-t border-base-300 p-6">
          <AdminLogisticsMaster></AdminLogisticsMaster>
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
