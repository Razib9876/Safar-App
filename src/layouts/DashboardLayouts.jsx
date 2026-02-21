import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import Navbar from "../components/Layout/Navbar";

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-red-500">
          Unauthorized or session expired.
        </div>
      </>
    );
  }

  const getTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/dashboard/create") return "Create Booking";
    if (path === "/dashboard/profile") return "Profile";
    if (path === "/dashboard/users") return "Manage Users";
    if (path === "/dashboard/rides") return "Manage Rides";
    if (path === "/dashboard/driver") return "Driver Management";
    if (path === "/dashboard/trip") return "All Trip";
    if (path === "/dashboard/") return "Trip Management";
    if (path === "/dashboard/my-trips") return "My Bookings";
    return "Dashboard";
  };

  return (
    <>
      <Navbar />
      <div className="drawer lg:drawer-open pt-16">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <nav className="navbar w-full bg-base-300">
            <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor" // uses text color, not bold
                strokeWidth="3" // thicker line
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block w-6 h-6 my-1.5"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
            <div className="px-4 font-semibold">{getTitle()}</div>
          </nav>

          <div className="tabs tabs-lift">
            <Outlet />
          </div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            <ul className="menu w-full grow">
              {/* Homepage (rider/admin/driver) */}
              {(user.role === "rider" ||
                user.role === "admin" ||
                user.role === "driver") && (
                <li>
                  <Link to="/">
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Homepage"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2"
                        fill="none"
                        stroke="currentColor"
                        className="my-1.5 inline-block size-4 mr-2"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      </svg>
                      <span className="is-drawer-close:hidden">Homepage</span>
                    </button>
                  </Link>
                </li>
              )}

              {/* Trip Manager (admin only) */}
              {user.role === "admin" && (
                <li>
                  <Link to="/dashboard">
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Trip Management"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2"
                        fill="none"
                        stroke="currentColor"
                        className="my-1.5 inline-block size-4 mr-2"
                      >
                        <circle cx="6" cy="6" r="2"></circle>
                        <circle cx="18" cy="18" r="2"></circle>
                        <path d="M8 6h4a4 4 0 0 1 4 4v4"></path>
                      </svg>
                      <span className="is-drawer-close:hidden">
                        Trip Management
                      </span>
                    </button>
                  </Link>
                </li>
              )}

              {/* Driver Manager (admin only) */}
              {user.role === "admin" && (
                <li>
                  <Link to="/dashboard/driver">
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Driver Management"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2"
                        fill="none"
                        stroke="currentColor"
                        className="my-1.5 inline-block size-4 mr-2"
                      >
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4"></path>
                        <circle cx="18" cy="17" r="3"></circle>
                        <path d="M18 14v1"></path>
                        <path d="M18 19v1"></path>
                        <path d="M15 17h1"></path>
                        <path d="M20 17h1"></path>
                      </svg>
                      <span className="is-drawer-close:hidden">
                        Driver Management
                      </span>
                    </button>
                  </Link>
                </li>
              )}

              {/* My Booking (rider/admin/driver)
              {(user.role === "rider" ||
                user.role === "admin" ||
                user.role === "driver") && (
                <li>
                  <Link to="/dashboard/my-trips">
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="My Bookings"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2"
                        fill="none"
                        stroke="currentColor"
                        className="my-1.5 inline-block size-4 mr-2"
                      >
                        <rect x="8" y="3" width="8" height="4" rx="1"></rect>
                        <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                        <path d="M9 12h6"></path>
                        <path d="M9 16h6"></path>
                      </svg>
                      <span className="is-drawer-close:hidden">
                        My Bookings
                      </span>
                    </button>
                  </Link>
                </li>
              )} */}

              {/* Trip (driver only) */}
              {user.role === "driver" && (
                <li>
                  <Link to="/dashboard/trip">
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Trip"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="my-1.5 inline-block size-4 mr-2"
                      >
                        <path d="M3 11l1-4h16l1 4"></path>
                        <path d="M5 11v6"></path>
                        <path d="M19 11v6"></path>
                        <circle cx="7" cy="17" r="2"></circle>
                        <circle cx="17" cy="17" r="2"></circle>
                      </svg>

                      <span className="is-drawer-close:hidden">Trip</span>
                    </button>
                  </Link>
                </li>
              )}

              {/* Payments (driver only) */}
              {user.role === "driver" && (
                <li>
                  <button
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2"
                      fill="none"
                      stroke="currentColor"
                      className="my-1.5 inline-block size-4 mr-2"
                    >
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                    <span className="is-drawer-close:hidden">Payments</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
