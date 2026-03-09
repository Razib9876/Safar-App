import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import SafarLogo from "../common/SafarLogo";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

/* Active link style */
const navStyle = ({ isActive }) =>
  isActive ? "text-primary font-semibold" : "hover:text-primary transition";

export default function Navbar() {
  const { user, logOut } = useAuth();

  const [show, setShow] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role || "guest";

  // useEffect(() => {
  //   setMenuOpen(false);
  // }, [location.pathname]);
  /* Scroll detect */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Menu by role */
  const getLinks = () => {
    if (role === "rider") {
      return [
        { name: "Home", path: "/" },
        { name: "My Bookings", path: "/my-bookings" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Be a Driver", path: "/be-driver" },
      ];
    }

    if (role === "driver" || role === "admin") {
      return [
        { name: "Home", path: "/" },
        { name: "My Bookings", path: "/my-bookings" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Dashboard", path: "/dashboard" },
      ];
    }

    return [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ];
  };

  const links = getLinks();

  /* Logout */
  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div
      className={`
        navbar fixed top-0 left-0 w-full z-50 
        bg-black/50 text-white 
        transition-all duration-500
        ${show ? "translate-y-0" : "-translate-y-full"}
        ${scroll ? "shadow-lg" : ""}
      `}
    >
      {/* LEFT */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow text-black"
          >
            {links.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            ))}
          </ul>
        </div> */}
        <div className="relative inline-block lg:hidden">
          {/* Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <ul className="absolute left-0 z-50 mt-2 w-52 rounded-lg border border-gray-100 bg-white p-2 shadow-xl">
              {links.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-md px-4 py-2 text-sm transition-colors hover:bg-gray-100 
              ${
                isActive
                  ? "font-semibold text-blue-600 bg-blue-50"
                  : "text-gray-700"
              }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          <SafarLogo></SafarLogo>
        </Link>
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-5">
          {links.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={navStyle}>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end gap-3 pr-8">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="cursor-pointer">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition">
                <FaUserCircle className="w-8 h-8 text-gray-600" />
              </div>
            </label>

            {/* Profile Menu */}
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 text-black rounded-box w-44"
            >
              <li className="px-2 py-1 text-xs opacity-70">{user?.email}</li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>

              {(role === "admin" || role === "driver") && (
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              )}

              <li className="border-t mt-1 pt-1">
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/auth/login">
            <button className="btn mr-4">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}
