import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const DonationModal = ({ open, temple, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !temple) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in to make a donation.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post(
        "/donations",
        {
          templeId: temple._id,
          amount: Number(amount),
          message,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSubmitting(false);
      setAmount("");
      setMessage("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.message || "Failed to submit donation.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          padding: "20px 24px 18px",
          minWidth: "320px",
          maxWidth: "420px",
          boxShadow: "0 14px 32px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 style={{ marginBottom: 4, fontWeight: 700, color: "#212529" }}>
          Donate to {temple.name}
        </h5>
        <p style={{ marginBottom: 12, color: "#6c757d", fontSize: "13px" }}>
          Your contribution helps support temple activities and maintenance.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "13px" }}>
              Amount (₹)
            </label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "13px" }}>
              Message (optional)
            </label>
            <textarea
              className="form-control"
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., For Annadanam, Deepam, etc."
            />
          </div>

          {error && (
            <p style={{ color: "#dc3545", fontSize: "12px", marginBottom: 4 }}>
              {error}
            </p>
          )}

          <div
            className="d-flex justify-content-end"
            style={{ gap: "8px", marginTop: "8px" }}
          >
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={onClose}
              disabled={submitting}
              style={{
                borderRadius: "999px",
                padding: "5px 14px",
                fontSize: "13px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success btn-sm"
              disabled={submitting}
              style={{
                borderRadius: "999px",
                padding: "5px 16px",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "0 2px 6px rgba(25,135,84,0.45)",
                border: "none",
              }}
            >
              {submitting ? "Processing..." : "Donate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;

