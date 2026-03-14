// import React from "react";
// import HandleTrips from "./handleTrips";
// import CompletedBooking from "./CompletedBooking";
// import PendingBooking from "./PendingBooking";
// import RejectedBooking from "./RejectedBooking";
// import AdminLogisticsMaster from "./AllBookings";

// const BookingManagement = () => {
//   return (
//     <div>
//       <div className="tabs tabs-lift w-full max-w-full">
//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label="Pending"
//           defaultChecked
//         />
//         <div className="tab-content bg-base-100 border-base-300 ">
//           <PendingBooking></PendingBooking>
//         </div>
//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label="All Bookings"
//           defaultChecked
//         />
//         <div className="tab-content bg-base-100 border-t border-base-300 p-6">
//           <AdminLogisticsMaster></AdminLogisticsMaster>
//         </div>

//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label="Completed"
//         />
//         <div className="tab-content bg-base-100 border-base-300 pt-6 px-0 pb-0 sm:p-6">
//           <CompletedBooking />
//         </div>

//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label="Rejected"
//         />
//         <div className="tab-content bg-base-100 border-base-300 pt-6 px-0 pb-0 sm:p-6">
//           <RejectedBooking></RejectedBooking>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingManagement;
import React from "react";
import HandleTrips from "./handleTrips";
import CompletedBooking from "./CompletedBooking";
import PendingBooking from "./PendingBooking";
import RejectedBooking from "./RejectedBooking";
import AdminLogisticsMaster from "./AllBookings";

const BookingManagement = () => {
  return (
    <div className="w-full">
      <div className="tabs tabs-lift w-full max-w-full">
        {/* Pending */}
        <input
          type="radio"
          name="booking_tabs"
          className="tab"
          aria-label="Pending"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 border-r-0 border-b-0 p-6 w-full">
          <PendingBooking />
        </div>

        {/* All Bookings */}
        <input
          type="radio"
          name="booking_tabs"
          className="tab"
          aria-label="All Bookings"
        />
        <div className="tab-content bg-base-100 border-t border-base-300 p-6 w-full">
          <AdminLogisticsMaster />
        </div>

        {/* Completed */}
        <input
          type="radio"
          name="booking_tabs"
          className="tab"
          aria-label="Completed"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6 w-full">
          <CompletedBooking />
        </div>

        {/* Rejected */}
        <input
          type="radio"
          name="booking_tabs"
          className="tab"
          aria-label="Rejected"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6 w-full">
          <RejectedBooking />
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
