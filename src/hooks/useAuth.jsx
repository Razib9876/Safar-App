// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders.jsx"; // make sure the path is correct

// Custom hook to access AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
