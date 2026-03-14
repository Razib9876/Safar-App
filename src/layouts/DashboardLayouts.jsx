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
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Layout/Navbar";

/**
 * NavItem Component
 * Declared outside the main render to avoid React state reset errors.
 */
const NavItem = ({
  to,
  label,
  icon,
  isActive,
  roles = [],
  userRole,
  isDrawerOpen = true,
}) => {
  // Role-based access control
  if (roles.length > 0 && !roles.includes(userRole)) return null;

  return (
    <li>
      <Link
        to={to}
        className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 mb-1 ${
          isActive
            ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-[1.02]"
            : "hover:bg-primary/10 text-base-content/80 hover:text-primary"
        }`}
      >
        <div
          className={`${isActive ? "text-primary-content" : "text-primary group-hover:scale-110 transition-transform"}`}
        >
          {icon}
        </div>
        {isDrawerOpen && (
          <span className="font-semibold tracking-wide">{label}</span>
        )}
      </Link>
    </li>
  );
};

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-lg text-primary"></span>
          <p className="text-xs font-bold uppercase tracking-widest animate-pulse opacity-50">
            Loading Experience
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center p-20 text-center min-h-[80vh]">
          <div className="bg-error/10 p-10 rounded-[3rem] border border-error/20 shadow-2xl backdrop-blur-sm">
            <div className="text-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-error mb-2 tracking-tighter uppercase">
              Access Denied
            </h2>
            <p className="text-base-content/60 max-w-xs mx-auto font-medium">
              Your session has expired or you do not have permission to view
              this floor.
            </p>
            <Link
              to="/login"
              className="btn btn-error btn-outline mt-6 rounded-2xl px-8"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getTitle = () => {
    const path = location.pathname;
    const routes = {
      "/dashboard": "Overview",
      "/dashboard/create": "Create Booking",
      "/dashboard/profile": "User Profile",
      "/dashboard/users": "User Directory",
      "/dashboard/rides": "Ride Management",
      "/dashboard/driver-management": "Driver Fleet",
      "/dashboard/user-management": "Client Access",
      "/dashboard/my-trips": "My Journey History",
    };
    return routes[path] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-base-100 selection:bg-primary selection:text-primary-content">
      <Navbar />

      <div className="drawer lg:drawer-open pt-16 min-h-screen bg-base-200">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        {/* Main Content Viewport */}
        <div className="drawer-content flex flex-col bg-base-200/50 overflow-x-hidden">
          {/* Enhanced Sticky Header */}
          <nav className="navbar w-full bg-base-100/80 backdrop-blur-md border-b border-base-300 px-6 sticky top-0 z-20">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-square btn-ghost hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </label>
            </div>
            <div className="flex-1 ml-2">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-primary opacity-70">
                  Portal
                </span>
                <h1 className="font-black text-xl tracking-tight text-base-content uppercase leading-none">
                  {getTitle()}
                </h1>
              </div>
            </div>
            <div className="flex-none gap-2">
              <div className="badge badge-outline border-base-300 font-mono text-[10px] p-3 uppercase tracking-tighter opacity-50 hidden sm:flex">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </nav>

          {/* Dynamic Stage Area */}
          <main className="p-4 sm:p-6 lg:p-8 grow animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-base-100 rounded-[2.5rem] shadow-xl shadow-base-300/40 border border-base-300 min-h-full p-6 lg:p-10 transition-all duration-500">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Premium Sidebar */}
        <div className="drawer-side z-40">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <div className="flex min-h-full flex-col items-start bg-base-100 border-r border-base-300 pt-20 lg:pt-6 w-80 transition-all">
            {/* Fancy User Card */}
            <div className="px-6 py-4 w-full">
              <div className="bg-gradient-to-br from-base-200 to-base-300 p-4 rounded-[2rem] border border-base-300/50 flex items-center gap-4 group">
                <div className="avatar">
                  <div className="w-12 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform group-hover:rotate-12">
                    <div className="bg-primary text-primary-content h-full flex items-center justify-center text-xl font-black">
                      {user.role?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">
                    {user.role}
                  </span>
                  <p className="font-bold text-base-content truncate">
                    Active Session
                  </p>
                </div>
              </div>
            </div>

            <div className="divider px-8 opacity-30"></div>

            <ul className="menu w-full px-4 gap-1">
              {/* Universal Routes */}
              <NavItem
                to="/"
                label="Homepage"
                userRole={user.role}
                isActive={location.pathname === "/"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                }
              />

              {/* Admin Logic */}
              <div className="mt-4 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                Administration
              </div>
              <NavItem
                to="/dashboard"
                label="Trip Manager"
                roles={["admin"]}
                userRole={user.role}
                isActive={location.pathname === "/dashboard"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <NavItem
                to="/dashboard/driver-management"
                label="Fleet Management"
                roles={["admin"]}
                userRole={user.role}
                isActive={location.pathname === "/dashboard/driver-management"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                }
              />

              {/* Driver Logic */}
              <div className="mt-4 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                Operation
              </div>
              <NavItem
                to="/dashboard"
                label="Active Trip"
                roles={["driver"]}
                userRole={user.role}
                isActive={location.pathname === "/dashboard"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.026a2.999 2.999 0 00-1.098-2.312L16.5 8.25h-4.875a1.125 1.125 0 00-1.125 1.125v4.125"
                    />
                  </svg>
                }
              />

              {/* Shared Account Links */}
              <div className="mt-4 mb-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                Personal
              </div>
              <NavItem
                to="/dashboard/profile"
                label="Settings"
                userRole={user.role}
                isActive={location.pathname === "/dashboard/profile"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                }
              />
            </ul>

            {/* Logout Footer */}
            <div className="mt-auto w-full p-6">
              <button className="btn btn-error btn-outline w-full rounded-2xl gap-3 border-2 hover:bg-error transition-all duration-300 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-5 group-hover:-translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <span className="font-bold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
