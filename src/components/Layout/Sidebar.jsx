import { NavLink } from "react-router-dom";

export default function Sidebar({ menu }) {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white">
      <div className="p-5 text-2xl font-bold border-b border-gray-700">
        Safar
      </div>

      <ul className="p-3 space-y-2">
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded 
                 ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
