
import { toast } from "react-hot-toast";


export const notify = {
  success: (message, options = {}) =>
    toast.success(message, {
      duration: 3000,
      position: "top-right",
      style: {
        borderRadius: "8px",
        background: "#22c55e",
        color: "#fff",
      },
      ...options,
    }),

  error: (message, options = {}) =>
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        borderRadius: "8px",
        background: "#ef4444",
        color: "#fff",
      },
      ...options,
    }),

  info: (message, options = {}) =>
    toast(message, {
      duration: 3000,
      position: "top-right",
      style: {
        borderRadius: "8px",
        background: "#3b82f6",
        color: "#fff",
      },
      ...options,
    }),

  loading: (message = "Processing...") =>
    toast.loading(message, {
      position: "top-right",
    }),

  dismiss: (toastId) => toast.dismiss(toastId),
};
