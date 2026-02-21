import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axiosSecure from "../services/axiosSecure";

export default function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => setRole(res.data.role))
      .catch(() => setRole(null))
      .finally(() => setRoleLoading(false));
  }, [user?.email]);

  return { role, roleLoading };
}
