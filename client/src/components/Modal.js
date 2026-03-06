import React, { useEffect } from "react";

// Toast-style side popup used across the app
const Modal = ({ open, title, message, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 1050,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "12px 16px",
          minWidth: "260px",
          maxWidth: "340px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          borderLeft: title === "Error" ? "4px solid #dc3545" : "4px solid #0d6efd",
          pointerEvents: "auto",
        }}
      >
        {title && (
          <h6 style={{ marginBottom: 4, fontWeight: 700, color: "#212529" }}>
            {title}
          </h6>
        )}
        <p style={{ marginBottom: 0, color: "#495057", fontSize: "13px" }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Modal;

