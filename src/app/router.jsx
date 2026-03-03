import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DriverLayout from "../layouts/DriverLayout";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayouts";
import PrivateRoute from "../routes/PrivateRoutes";
import AdminRoute from "../routes/AdminRoute";
import DriverRoute from "../routes/DriverRoute";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import AdminDashboard from "../features/admin/AdminDashboard";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import AuthLayout from "../layouts/AuthLayout";
import Settings from "../pages/Setting";
import BookingManagement from "../features/admin/booking/BookingManagement";
import DriverManagement from "../features/admin/driver/DriverManagement";
import DriverDashboard from "../features/driver/DriverDashboard";
import BookingDashboard from "../features/booking/BookingDashboard";
import MyBookings from "../pages/MyBookings";
import NotFound from "../components/common/NotFound";
import BeDriver from "../pages/BeDriver";
import DashboardRedirect from "../components/Layout/DashboardRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact></Contact> },
      { path: "my-bookings", element: <MyBookings></MyBookings> },
      { path: "about", element: <About /> },
      { path: "be-driver", element: <BeDriver></BeDriver> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardRedirect />, // 🔥 role-based redirect
      },

      {
        path: "booking-management",
        element: (
          <AdminRoute>
            <BookingManagement />
          </AdminRoute>
        ),
      },

      {
        path: "driver-management",
        element: (
          <AdminRoute>
            <DriverManagement />
          </AdminRoute>
        ),
      },

      {
        path: "driver-dashboard",
        element: (
          <DriverRoute>
            <DriverDashboard />
          </DriverRoute>
        ),
      },

      {
        path: "my-trips",
        element: (
          <PrivateRoute>
            <BookingDashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/driver",
    element: (
      <DriverRoute>
        <DriverLayout />
      </DriverRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [{ index: true, element: <AdminDashboard /> }],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  { path: "be-driver", element: <BeDriver /> },
  { path: "settings", element: <Settings /> },
  {
    path: "*",
    element: <NotFound />,
  },
]);
