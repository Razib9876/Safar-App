// import React, { createContext, useEffect, useState } from "react";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   onAuthStateChanged,
//   signOut,
//   updateProfile,
//   GoogleAuthProvider,
//   FacebookAuthProvider,
// } from "firebase/auth";
// import app from "../firebase/firebase.config";
// import axios from "axios";

// export const AuthContext = createContext(null);

// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* Register */
//   const register = async (email, password, name) => {
//     const result = await createUserWithEmailAndPassword(auth, email, password);
//     if (name) {
//       await updateProfile(result.user, { displayName: name });
//     }
//     return result;
//   };

//   /* Email Login */
//   const login = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   /* Social Logins */
//   const googleLogin = () => signInWithPopup(auth, googleProvider);
//   const facebookLogin = () => signInWithPopup(auth, facebookProvider);

//   /* Logout */
//   const logOut = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("firebaseToken");
//       setUser(null);
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* Auth Listener */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setLoading(true);
//       try {
//         if (currentUser?.email) {
//           // 1. Get Firebase token
//           const token = await currentUser.getIdToken(true);
//           localStorage.setItem("firebaseToken", token);

//           // 2. Sync MongoDB user
//           try {
//             await axios.get(
//               `${API}/users/by-email/${encodeURIComponent(currentUser.email)}?create=true`,
//               { headers: { Authorization: `Bearer ${token}` } },
//             );
//           } catch (err) {
//             console.warn("User sync error:", err.response?.data || err.message);
//           }

//           // 3. Get user profile
//           const res = await axios.get(`${API}/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setUser(res.data.data);
//         } else {
//           setUser(null);
//           localStorage.removeItem("firebaseToken");
//         }
//       } catch (err) {
//         console.error("Auth sync error:", err.response?.data || err.message);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         register,
//         login,
//         googleLogin,
//         facebookLogin,
//         logOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
// _______________________________________________________________________________________________________________________
// import React, { createContext, useEffect, useState } from "react";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   onAuthStateChanged,
//   signOut,
//   updateProfile,
//   GoogleAuthProvider,
//   FacebookAuthProvider,
// } from "firebase/auth";
// import app from "../firebase/firebase.config";
// import axios from "axios";

// export const AuthContext = createContext(null);

// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();
// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* Register */
//   const register = async (email, password, name) => {
//     const result = await createUserWithEmailAndPassword(auth, email, password);
//     if (name) await updateProfile(result.user, { displayName: name });
//     return result;
//   };

//   /* Email login */
//   const login = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   /* Social login */
//   const googleLogin = () => signInWithPopup(auth, googleProvider);
//   const facebookLogin = () => signInWithPopup(auth, facebookProvider);

//   /* Logout */
//   const logOut = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("firebaseToken");
//       setUser(null);
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   /* Auth listener */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setLoading(true);
//       try {
//         if (currentUser?.email) {
//           const token = await currentUser.getIdToken(true);
//           localStorage.setItem("firebaseToken", token);

//           /* Sync MongoDB user */
//           await axios.get(
//             `${API}/users/by-email/${encodeURIComponent(currentUser.email)}?create=true`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             },
//           );

//           /* Fetch user profile with role */
//           const res = await axios.get(`${API}/users/me`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           setUser(res.data.data); // data must contain { role: "admin|driver|rider" }
//         } else {
//           setUser(null);
//           localStorage.removeItem("firebaseToken");
//         }
//       } catch (err) {
//         console.error("Auth sync error:", err.response?.data || err.message);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         register,
//         login,
//         googleLogin,
//         facebookLogin,
//         logOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
// _______________________________________________________________________________________________________________________
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
        // 🔥 Get fresh token
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("firebaseToken", token);

        console.log("🔥 Saved Firebase Token:", token);

        // 🔐 Sync user
        await axiosSecure.get(
          `/users/by-email/${encodeURIComponent(currentUser.email)}?create=true`,
        );

        // 👤 Get profile
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
