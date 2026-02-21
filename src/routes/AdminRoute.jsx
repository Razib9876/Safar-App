// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user || user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
}
