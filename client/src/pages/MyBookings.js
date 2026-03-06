import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "../components/Modal";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", message: "" });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setModal({
        open: true,
        title: "Cancelled",
        message: "Booking cancelled successfully.",
      });
    } catch (err) {
      setModal({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to cancel booking",
      });
    }
  };

  return (
    <>
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ open: false, title: "", message: "" })}
      />
      <div
      className="container mt-4"
      style={{
        background:
          "radial-gradient(circle at top left, #e3f2fd 0, #ffffff 45%, #f3e5f5 100%)",
        borderRadius: "16px",
        padding: "24px 28px",
        minHeight: "80vh",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="mb-4 text-center" style={{ fontWeight: 700, color: "#343a40" }}>
        My Bookings
      </h2>
      {bookings.length === 0 && <p className="text-center text-muted">No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b._id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{b.temple.name}</h5>
            <p><strong>Date:</strong> {b.slot.date}</p>
            <p><strong>Time:</strong> {b.slot.time}</p>
            <p><strong>Persons:</strong> {b.numberOfPersons}</p>
            <button
              className="btn btn-danger btn-sm mt-2"
              style={{
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                boxShadow: "0 2px 6px rgba(220,53,69,0.4)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(220,53,69,0.6)";
                e.currentTarget.style.opacity = "0.95";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(220,53,69,0.4)";
                e.currentTarget.style.opacity = "1";
              }}
              onClick={() => handleCancel(b._id)}
            >
              Cancel Booking
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default MyBookings;