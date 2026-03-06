// clien/src/pages/Donate.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const Donate = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [temple, setTemple] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, title: "", message: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTemple = async () => {
      try {
        const res = await api.get(`/temples/${templeId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTemple(res.data);
      } catch (err) {
        setToast({
          open: true,
          title: "Error",
          message: err.response?.data?.message || "Failed to load temple details",
        });
      }
    };

    fetchTemple();
  }, [user, navigate, templeId]);

  const templeImage = useMemo(() => {
    const raw = (temple?.imageUrl || "").trim();
    if (!raw) return "https://via.placeholder.com/900x600.png?text=Temple+Image";

    try {
      const url = new URL(raw);
      if (
        url.hostname.includes("unsplash.com") &&
        url.pathname.startsWith("/photos/") &&
        !url.hostname.includes("images.unsplash.com") &&
        !url.hostname.includes("source.unsplash.com")
      ) {
        const segments = url.pathname.split("/");
        const lastSegment =
          segments[segments.length - 1] || segments[segments.length - 2];
        const parts = lastSegment.split("-");
        const photoId = parts[parts.length - 1];
        if (photoId) return `https://source.unsplash.com/${photoId}`;
      }
    } catch {
      // ignore
    }
    return raw;
  }, [temple]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setToast({
        open: true,
        title: "Validation",
        message: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await api.post(
        "/donations",
        { templeId, amount: Number(amount), message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSubmitting(false);
      setAmount("");
      setMessage("");
      setToast({
        open: true,
        title: "Success",
        message: "Donation submitted successfully.",
      });
      navigate("/donations/my");
    } catch (err) {
      setSubmitting(false);
      setToast({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to submit donation",
      });
    }
  };

  if (!temple) {
    return (
      <>
        <Modal
          open={toast.open}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ open: false, title: "", message: "" })}
        />
        <div className="container mt-4">
          <p className="text-center text-muted">Loading temple...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Modal
        open={toast.open}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ open: false, title: "", message: "" })}
      />
      <div className="container mt-4">
        <div className="row justify-content-center">
          {/* Temple details card */}
          <div className="col-lg-6 mb-3">
            <div
              className="card shadow-sm"
              style={{ border: "none", borderRadius: "18px", overflow: "hidden" }}
            >
              <div style={{ position: "relative", paddingTop: "56%" }}>
                <img
                  src={templeImage}
                  alt={temple.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/900x600.png?text=Temple+Image";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))",
                  }}
                />
                <div style={{ position: "absolute", left: 16, bottom: 12, color: "white" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      opacity: 0.9,
                    }}
                  >
                    {temple.location}
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800 }}>{temple.name}</div>
                </div>
              </div>

              <div className="card-body">
                <p style={{ color: "#495057", marginBottom: 0 }}>
                  {temple.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Donation form card */}
          <div className="col-lg-6 mb-3">
            <div
              className="card shadow-sm"
              style={{
                border: "none",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, #e8f5e9 0, #ffffff 45%, #e3f2fd 100%)",
              }}
            >
              <div className="card-body p-4">
                <h4 style={{ fontWeight: 800, marginBottom: 4 }}>Make a Donation</h4>
                <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: 16 }}>
                  Support temple activities and maintenance.
                </p>

                <form onSubmit={handleDonate}>
                  <div className="mb-3">
                    <label className="form-label">Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message (optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g., For Annadanam, Deepam, etc."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={submitting}
                    style={{
                      borderRadius: "999px",
                      padding: "10px 0",
                      fontWeight: 600,
                      boxShadow: "0 3px 10px rgba(25,135,84,0.35)",
                      border: "none",
                    }}
                  >
                    {submitting ? "Processing..." : "Donate Now"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;

