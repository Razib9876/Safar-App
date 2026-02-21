// src/layouts/MainLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function TabContentLayout() {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
}
