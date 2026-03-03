// src/routes/DashboardRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/dashboard/booking-management", { replace: true });
    } else if (user.role === "driver") {
      navigate("/dashboard/driver-dashboard", { replace: true });
    } else {
      navigate("/dashboard/my-trips", { replace: true });
    }
  }, [user, navigate]);

  return null;
}
