// src/routes/SuperAdminRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function SuperAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  // Allow only super admin
  if (!user || user.role !== "super_admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
