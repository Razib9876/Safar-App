import React from "react";
import PendingDriver from "./PendingDriver";
import AvailableDriver from "./AvailableDrivers";
import SuspendedDriver from "./SuspendedDriver";
import RejectedDriver from "./RejectedDrivers";
import OnRideDriver from "./OnRideDrivers";
import useDriverCount from "../../../hooks/useDriverCount";

const DriverManagement = () => {
  const pendingCount = useDriverCount("pending");
  const availableCount = useDriverCount("available");
  const suspendedCount = useDriverCount("suspended");
  const rejectedCount = useDriverCount("rejected");
  const onRideCount = useDriverCount("on-ride");

  return (
    <div>
      <div className="tabs tabs-lift">
        {/* ================= PENDING ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Pending (${pendingCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <PendingDriver />
        </div>

        {/* ================= AVAILABLE ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Available (${availableCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <AvailableDriver />
        </div>

        {/* ================= SUSPENDED ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Suspended (${suspendedCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <SuspendedDriver />
        </div>

        {/* ================= REJECTED ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Rejected (${rejectedCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <RejectedDriver />
        </div>

        {/* ================= ON RIDE ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`On Ride (${onRideCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <OnRideDriver />
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
