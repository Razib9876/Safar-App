import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const ProfileDropdown = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const [darkMode, setDarkMode] = useState(false);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative text-white" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center bg-brand text-white px-4 py-2.5 rounded-base border border-transparent hover:bg-brand-strong transition"
      >
        {user?.displayName || "User"}
        <svg
          className="w-4 h-4 ms-1.5 -me-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {/* MENU */}
      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-[#1F2A44] border border-default-medium rounded-base shadow-lg w-72">
          <div className="p-2">
            <div className="flex items-center px-2.5 p-2 space-x-1.5 bg-neutral-secondary-strong rounded">
              <img
                className="w-8 h-8 rounded-full"
                src={user?.photoURL || "/default-avatar.png"}
                alt="Profile"
              />
              <div>
                <div className="font-medium text-heading">
                  {user?.displayName || "User Name"}
                </div>
                <div className="truncate text-body">
                  {user?.email || "email@example.com"}
                </div>
              </div>
              <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded ms-auto">
                PRO
              </span>
            </div>
          </div>

          {/* MENU LIST */}
          <ul className="px-2 pb-2 text-sm text-body font-medium">
            <MenuItem title="Account" />
            <MenuItem title="Settings" />
            <MenuItem title="Privacy" />
            <MenuItem title="Notifications" />
            <MenuItem title="Help center" />

            {/* DARK MODE TOGGLE */}
            <li className="flex items-center p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded mb-1.5">
              {/* TEXT + ICON */}
              <span
                className={`flex items-center transition-colors ${
                  darkMode ? "text-brand-strong" : "text-body"
                }`}
              >
                <svg
                  className="w-4 h-4 me-1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
                  />
                </svg>
                Dark Mode
              </span>

              <DarkMoodToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </li>

            <li className="border-t border-default-medium pt-1.5">
              <MenuItem title="Upgrade to PRO" />
            </li>

            <li>
              <a className="inline-flex items-center w-full p-2 text-fg-danger hover:bg-neutral-tertiary-medium rounded">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ title }) => (
  <li>
    <a className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
      {title}
    </a>
  </li>
);

export default ProfileDropdown;
