import React from "react";
import useDriverCount from "../../../hooks/useDriverCount";
import AllUserControll from "./All-userControll";
import AdminControll from "./AdminControll";
import DriverControll from "./DriverControll";

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
          aria-label={`Pending (${pendingCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <AllUserControll />
        </div>

        {/* ================= AVAILABLE ================= */}
        <input
          type="radio"
          name="my_tabs_3"
          className="tab"
          aria-label={`Available (${availableCount})`}
        />
        <div className="tab-content bg-base-100 border-base-300 ">
          <AdminControll />
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
