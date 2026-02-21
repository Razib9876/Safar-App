// ToastProvider.jsx
import React, { createContext, useRef } from "react";
import { Toast } from "primereact/toast";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showToast = ({
    severity = "info",
    summary = "",
    detail = "",
    life = 3000,
  }) => {
    toast.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};
