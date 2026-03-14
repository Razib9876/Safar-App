// import React from "react";
// import useDriverCount from "../../../hooks/useDriverCount";
// import AdminControll from "./AdminControll";
// import DriverControll from "./DriverControll";
// import AllUsers from "./All-userControll";
// import AllAdmin from "./AllAdmin";

// const UserManager = () => {
//   const pendingCount = useDriverCount("pending");
//   const availableCount = useDriverCount("available");
//   const suspendedCount = useDriverCount("suspended");

//   return (
//     <div>
//       <div className="tabs tabs-lift w-full max-w-full">
//         {/* ================= PENDING ================= */}
//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label={`All (${pendingCount})`}
//         />
//         <div className="tab-content bg-base-100 border-base-300 ">
//           <AllUsers></AllUsers>
//         </div>

//         {/* ================= AVAILABLE ================= */}
//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label={`Admin (${availableCount})`}
//         />
//         <div className="tab-content bg-base-100 border-base-300 ">
//           <AllAdmin />
//         </div>

//         {/* ================= SUSPENDED ================= */}
//         <input
//           type="radio"
//           name="my_tabs_3"
//           className="tab"
//           aria-label={`Suspended (${suspendedCount})`}
//         />
//         <div className="tab-content bg-base-100 border-base-300 ">
//           <DriverControll />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManager;
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
    <div className="w-full">
      <div className="tabs tabs-lift w-full max-w-full">
        {/* ================= ALL USERS ================= */}
        <input
          type="radio"
          name="user_tabs"
          className="tab"
          aria-label={`All (${pendingCount})`}
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 border-r-0 border-b-0 p-6 w-full">
          <AllUsers />
        </div>

        {/* ================= ADMIN ================= */}
        <input
          type="radio"
          name="user_tabs"
          className="tab"
          aria-label={`Admin (${availableCount})`}
        />
        <div className="tab-content bg-base-100 border-t border-base-300 p-6 w-full">
          <AllAdmin />
        </div>

        {/* ================= DRIVER CONTROL ================= */}
        <input
          type="radio"
          name="user_tabs"
          className="tab"
          aria-label={`Drivers (${suspendedCount})`}
        />
        <div className="tab-content bg-base-100 border-t border-base-300 p-6 w-full">
          <DriverControll />
        </div>
      </div>
    </div>
  );
};

export default UserManager;
