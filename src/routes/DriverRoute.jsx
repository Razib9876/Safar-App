// src/routes/DriverRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function DriverRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user || user.role !== "driver") return <Navigate to="/dashboard" />;

  return children;
}
