// // src/hooks/useAxiosSecure.jsx
// import axios from "axios";
// import { useEffect, useMemo } from "react";
// import useAuth from "./useAuth";

// export default function useAxiosSecure() {
//   const { logOut } = useAuth();

//   // Create axios instance
//   const axiosSecure = useMemo(
//     () =>
//       axios.create({
//         baseURL: "http://localhost:5000/api",
//       }),
//     [],
//   );

//   useEffect(() => {
//     // Attach JWT token to every request
//     const reqInterceptor = axiosSecure.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem("token");
//         if (token) config.headers.Authorization = `Bearer ${token}`;
//         return config;
//       },
//       (error) => Promise.reject(error),
//     );

//     // Handle 401/403 globally
//     const resInterceptor = axiosSecure.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           console.warn("JWT expired or unauthorized → logging out...");
//           logOut(); // auto logout
//         }
//         return Promise.reject(error);
//       },
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(reqInterceptor);
//       axiosSecure.interceptors.response.eject(resInterceptor);
//     };
//   }, [axiosSecure, logOut]);

//   return axiosSecure;
// }

// useAxiosSecure.js;

// ---------------------------------------------------------------------------------------------
// import axios from "axios";

// const axiosSecure = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// });

// axiosSecure.interceptors.request.use((config) => {
//   const token = localStorage.getItem("firebaseToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// axiosSecure.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401 || err.response?.status === 403) {
//       localStorage.removeItem("firebaseToken");
//       window.location.replace("/auth/login");
//     }
//     return Promise.reject(err);
//   },
// );

// export default axiosSecure;
