import React from "react";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
  const { logOut } = useAuth();

  return (
    <button
      className="btn btn-error"
      onClick={async () => {
        await logOut();
        window.location.href = "/auth/login";
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
