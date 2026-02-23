// import axios from "axios";

// const axiosSecure = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}`,
// });

// // Attach Firebase token to every request
// axiosSecure.interceptors.request.use((config) => {
//   const token = localStorage.getItem("firebaseToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Auto logout on 401/403
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

import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach Firebase token to every request
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("firebaseToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto logout on 401/403
axiosSecure.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("firebaseToken");
      window.location.replace("/auth/login");
    }

    return Promise.reject(err);
  },
);

export default axiosSecure;
