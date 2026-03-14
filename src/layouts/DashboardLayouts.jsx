// import React from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import Navbar from "../components/Layout/Navbar";

// export default function DashboardLayout() {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return;

//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <div className="p-6 text-center text-red-500">
//           Unauthorized or session expired.
//         </div>
//       </>
//     );
//   }

//   const getTitle = () => {
//     const path = location.pathname;
//     if (path === "/dashboard") return "Dashboard";
//     if (path === "/dashboard/create") return "Create Booking";
//     if (path === "/dashboard/profile") return "Profile";
//     if (path === "/dashboard/users") return "Manage Users";
//     if (path === "/dashboard/rides") return "Manage Rides";
//     if (path === "/dashboard/driver-management") return "Driver Management";
//     if (path === "/dashboard/user-management") return "User Management";
//     if (path === "/dashboard/") return "All Trip";
//     if (path === "/dashboard/") return "Trip Management";
//     if (path === "/dashboard/my-trips") return "My Bookings";
//     return "Dashboard";
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="drawer lg:drawer-open pt-16">
//         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

//         <div className="drawer-content">
//           <nav className="navbar w-full bg-base-300">
//             <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="inline-block w-6 h-6 my-1.5"
//               >
//                 <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
//                 <path d="M9 4v16"></path>
//                 <path d="M14 10l2 2l-2 2"></path>
//               </svg>
//             </label>
//             <div className="px-4 font-semibold">{getTitle()}</div>
//           </nav>

//           <div className="tabs tabs-lift">
//             <Outlet />
//           </div>
//         </div>

//         <div className="drawer-side is-drawer-close:overflow-visible">
//           <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

//           <div className="flex min-h-full flex-col items-start bg-base-200 pt-20 sm:pt-0 is-drawer-close:w-14 is-drawer-open:w-64">
//             <ul className="menu w-full grow">
//               {/* Homepage (rider/admin/driver) */}
//               {(user.role === "rider" ||
//                 user.role === "admin" ||
//                 user.role === "driver") && (
//                 <li>
//                   <Link to="/">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Homepage"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
//                         <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//                       </svg>
//                       <span className="is-drawer-close:hidden">Homepage</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}

//               {/* Trip Manager (admin only) */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Trip Management"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <circle cx="6" cy="6" r="2"></circle>
//                         <circle cx="18" cy="18" r="2"></circle>
//                         <path d="M8 6h4a4 4 0 0 1 4 4v4"></path>
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         Trip Management
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}

//               {/* Driver Manager (admin only) */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard/driver-management">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Driver Management"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <circle cx="9" cy="7" r="4"></circle>
//                         <path d="M3 21v-2a4 4 0 0 1 4-4h4"></path>
//                         <circle cx="18" cy="17" r="3"></circle>
//                         <path d="M18 14v1"></path>
//                         <path d="M18 19v1"></path>
//                         <path d="M15 17h1"></path>
//                         <path d="M20 17h1"></path>
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         Driver Management
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* user Manager (admin only) */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard/user-management">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="User Management"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <circle cx="9" cy="7" r="4"></circle>
//                         <path d="M3 21v-2a4 4 0 0 1 4-4h4"></path>
//                         <circle cx="18" cy="17" r="3"></circle>
//                         <path d="M18 14v1"></path>
//                         <path d="M18 19v1"></path>
//                         <path d="M15 17h1"></path>
//                         <path d="M20 17h1"></path>
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         User Management
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}

//               {/* Trip (driver only) */}
//               {user.role === "driver" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="All Trip"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeWidth="2"
//                         stroke="currentColor"
//                         fill="none"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M3 11l1-4h16l1 4"></path>
//                         <path d="M5 11v6"></path>
//                         <path d="M19 11v6"></path>
//                         <circle cx="7" cy="17" r="2"></circle>
//                         <circle cx="17" cy="17" r="2"></circle>
//                       </svg>

//                       <span className="is-drawer-close:hidden">Trip</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}

//               {/* Payments (driver only) */}
//               {user.role === "driver" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Payments"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M20 7h-9"></path>
//                         <path d="M14 17H5"></path>
//                         <circle cx="17" cy="17" r="3"></circle>
//                         <circle cx="7" cy="7" r="3"></circle>
//                       </svg>
//                       <span className="is-drawer-close:hidden">Payments</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Drivers earnings */}
//               {user.role === "driver" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Earnings"
//                     >
//                       {user.earnings > 1000 ? (
//                         // High earnings icon
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           strokeLinejoin="round"
//                           strokeLinecap="round"
//                           strokeWidth="2"
//                           fill="none"
//                           stroke="currentColor"
//                           className="my-1.5 inline-block size-4 mr-2"
//                         >
//                           <path d="M12 2L15 8H9L12 2Z" />{" "}
//                           {/* Example: upward arrow */}
//                         </svg>
//                       ) : (
//                         // Low earnings icon
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           strokeLinejoin="round"
//                           strokeLinecap="round"
//                           strokeWidth="2"
//                           fill="none"
//                           stroke="currentColor"
//                           className="my-1.5 inline-block size-4 mr-2"
//                         >
//                           <path d="M12 22L9 16H15L12 22Z" />{" "}
//                           {/* Example: downward arrow */}
//                         </svg>
//                       )}
//                       <span className="is-drawer-close:hidden">Earnings</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Create Offer by driver */}
//               {user.role === "driver" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Create Offer"
//                     >
//                       {/* Plus / New Offer Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <rect
//                           x="3"
//                           y="3"
//                           width="18"
//                           height="18"
//                           rx="2"
//                           ry="2"
//                         ></rect>
//                         <line x1="12" y1="8" x2="12" y2="16"></line>
//                         <line x1="8" y1="12" x2="16" y2="12"></line>
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         Create Offer
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Admin Earnings */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Revenue"
//                     >
//                       {/* Dollar / Earnings Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M12 1v22"></path> {/* Vertical line for $ */}
//                         <path d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H7"></path>{" "}
//                         {/* Curves for $ sign */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">Revenue</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Admin Edit */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Edit"
//                     >
//                       {/* Pencil / Edit Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M12 20h9"></path> {/* Horizontal base line */}
//                         <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"></path>{" "}
//                         {/* Pencil body */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">Edit</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Track Driver */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Track Driver"
//                     >
//                       {/* Location Pin / Track Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <path d="M12 21s-6-7-6-11a6 6 0 1112 0c0 4-6 11-6 11z"></path>{" "}
//                         {/* Pin */}
//                         <circle cx="12" cy="10" r="2"></circle>{" "}
//                         {/* Pin center */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         Track Driver
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* All Vehicles */}
//               {user.role === "admin" && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="All Vehicles"
//                     >
//                       {/* Car Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <rect x="3" y="11" width="18" height="6" rx="2"></rect>{" "}
//                         {/* Car body */}
//                         <circle cx="7.5" cy="17.5" r="1.5"></circle>{" "}
//                         {/* Left wheel */}
//                         <circle cx="16.5" cy="17.5" r="1.5"></circle>{" "}
//                         {/* Right wheel */}
//                         <path d="M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4"></path>{" "}
//                         {/* Car top */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">
//                         All Vehicles
//                       </span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Trip History */}
//               {(user.role === "rider" ||
//                 user.role === "admin" ||
//                 user.role === "driver") && (
//                 <li>
//                   <Link to="/dashboard">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="History"
//                     >
//                       {/* Clock Icon for Trip History */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <circle cx="12" cy="12" r="10"></circle>
//                         <path d="M12 6v6l4 2"></path> {/* clock hands */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">History</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//               {/* Profile */}
//               {(user.role === "rider" ||
//                 user.role === "admin" ||
//                 user.role === "driver") && (
//                 <li>
//                   <Link to="/dashboard/profile">
//                     <button
//                       className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
//                       data-tip="Profile"
//                     >
//                       {/* User / Profile Icon */}
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         fill="none"
//                         stroke="currentColor"
//                         className="my-1.5 inline-block size-4 mr-2"
//                       >
//                         <circle cx="12" cy="8" r="4"></circle> {/* Head */}
//                         <path d="M6 20v-2a6 6 0 0112 0v2"></path>{" "}
//                         {/* Shoulders/body */}
//                       </svg>
//                       <span className="is-drawer-close:hidden">Profile</span>
//                     </button>
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// ___________________________________________________________________________________
// ___________________________________________________________________________________
// ___________________________________________________________________________________
// ___________________________________________________________________________________
// ___________________________________________________________________________________
// ___________________________________________________________________________________
// ___________________________________________________________________________________
import React, { useMemo } from "react";
import { Link, Outlet, useLocation, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Layout/Navbar";

/* Sidebar Item */
const SidebarItem = ({ to, icon, label, dataTip }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/dashboard"}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-3 transition-colors ${
            isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
          }`
        }
      >
        <div
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center"
          data-tip={dataTip || label}
        >
          {icon}
          <span className="is-drawer-close:hidden ml-2">{label}</span>
        </div>
      </NavLink>
    </li>
  );
};

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const titles = useMemo(
    () => ({
      "/dashboard": "Dashboard",
      "/dashboard/create": "Create Booking",
      "/dashboard/profile": "Profile",
      "/dashboard/users": "Manage Users",
      "/dashboard/rides": "Manage Rides",
      "/dashboard/driver-management": "Driver Management",
      "/dashboard/user-management": "User Management",
      "/dashboard/my-trips": "My Bookings",
    }),
    [],
  );

  const currentTitle = titles[location.pathname] || "Dashboard";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-error text-center">
            Unauthorized or session expired.
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="drawer lg:drawer-open pt-16">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* CONTENT */}
        <div className="drawer-content flex flex-col">
          {/* SUB HEADER */}
          <nav className="navbar bg-base-200 border-b border-base-300 sticky top-16 z-10">
            {/* DRAWER TOGGLE BUTTON */}
            <div className="flex-none">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>

            <div className="flex-1 px-4 font-semibold">{currentTitle}</div>
          </nav>

          {/* PAGE CONTENT */}
          <main className="p-6">
            <div className="tabs tabs-lift">
              <Outlet />
            </div>
          </main>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side z-20">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

          <div className="flex min-h-full flex-col bg-base-200 border-r border-base-300 is-drawer-close:w-16 is-drawer-open:w-64 transition-all duration-300">
            <ul className="menu w-full grow overflow-y-auto">
              {(user.role === "rider" ||
                user.role === "admin" ||
                user.role === "driver") && (
                <SidebarItem
                  to="/"
                  label="Homepage"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2z"></path>
                    </svg>
                  }
                />
              )}

              {user.role === "admin" && (
                <>
                  <div className="divider text-xs uppercase font-bold opacity-60">
                    Admin
                  </div>

                  <SidebarItem
                    to="/dashboard"
                    label="Trip Management"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="6" cy="6" r="2" />
                        <circle cx="18" cy="18" r="2" />
                        <path d="M8 6h4a4 4 0 0 1 4 4v4" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard/driver-management"
                    label="Driver Management"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="9" cy="7" r="4" />
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
                        <circle cx="18" cy="17" r="3" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard/user-management"
                    label="User Management"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="9" cy="7" r="4" />
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
                      </svg>
                    }
                  />
                </>
              )}

              {user.role === "driver" && (
                <>
                  <div className="divider text-xs uppercase font-bold opacity-60">
                    Driver
                  </div>

                  <SidebarItem
                    to="/dashboard"
                    label="Trip"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 11l1-4h16l1 4" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard"
                    label="Payments"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="17" cy="17" r="3" />
                        <circle cx="7" cy="7" r="3" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard"
                    label="Create Offer"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="18" height="18" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard"
                    label="Earnings"
                    icon={
                      user.earnings > 1000 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L15 8H9L12 2Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 22L9 16H15L12 22Z" />
                        </svg>
                      )
                    }
                  />
                </>
              )}

              {(user.role === "rider" ||
                user.role === "admin" ||
                user.role === "driver") && (
                <>
                  <div className="divider text-xs uppercase font-bold opacity-60">
                    Account
                  </div>

                  <SidebarItem
                    to="/dashboard"
                    label="History"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    }
                  />

                  <SidebarItem
                    to="/dashboard/profile"
                    label="Profile"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0112 0v2" />
                      </svg>
                    }
                  />
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
