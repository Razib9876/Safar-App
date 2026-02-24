import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axiosSecure from "../services/axiosSecure";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(result.user, { displayName: name });
    return result;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const facebookLogin = () => signInWithPopup(auth, facebookProvider);

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("firebaseToken");
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        setUser(null);
        localStorage.removeItem("firebaseToken");
        setLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("firebaseToken", token);

        await axiosSecure.get(
          `/users/by-email/${encodeURIComponent(currentUser.email)}?create=true`,
        );

        const profileRes = await axiosSecure.get("/users/me");

        setUser(profileRes.data.data);
      } catch (err) {
        console.error("Auth sync error:", err.response?.data || err.message);
        localStorage.removeItem("firebaseToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        googleLogin,
        facebookLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
