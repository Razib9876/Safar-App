import React from "react";
import useDriverCount from "../../../hooks/useDriverCount";
import AdminControll from "./AdminControll";
import DriverControll from "./DriverControll";
import AllUsers from "./All-userControll";
import AllAdmin from "./AllAdmin";

const UserManager = () => {
  const pendingCount = useDriverCount("pending");
  const availableCount = useDriverCount("available");
  const suspendedCount = useDriverCount("suspended");

  return (
    <div>
      <div className="tabs tabs-lift">
        {/* ================= PENDING ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`All (${pendingCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <AllUsers></AllUsers>
        </div>

        {/* ================= AVAILABLE ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Admin (${availableCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <AllAdmin />
        </div>

        {/* ================= SUSPENDED ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Suspended (${suspendedCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <DriverControll />
        </div>
      </div>
    </div>
  );
};

export default UserManager;
