import { Navigate } from "react-router-dom";
import useRole from "../hooks/useRole";
import Loader from "../components/common/Loader";

export default function UserRoute({ children }) {
  const { role, roleLoading } = useRole();

  if (roleLoading) return <Loader />;

  if (role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
}
