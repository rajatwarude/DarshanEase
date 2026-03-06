// clien/src/pages/AdminRecentCancellations.js
import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const AdminRecentCancellations = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/bookings/admin/recent-cancellations", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div
      className="container mt-4"
      style={{
        background:
          "linear-gradient(135deg, #ffebee 0, #ffffff 40%, #fff3e0 100%)",
        borderRadius: "16px",
        padding: "24px 28px",
        minHeight: "70vh",
        boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="mb-4 text-center" style={{ fontWeight: 700, color: "#343a40" }}>
        Recent Cancellations
      </h2>
      {bookings.length === 0 && (
        <p className="text-center text-muted">No recent cancellations.</p>
      )}
      {bookings.map((b) => (
        <div key={b._id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-1">
              {b.temple?.name}{" "}
              <span className="text-muted" style={{ fontSize: "12px" }}>
                {b.temple?.location}
              </span>
            </h5>
            <p className="mb-1" style={{ fontSize: "13px" }}>
              <strong>User:</strong> {b.user?.name} ({b.user?.email})
            </p>
            <p className="mb-1" style={{ fontSize: "13px" }}>
              <strong>Original Date:</strong>{" "}
              {new Date(b.slot?.date).toLocaleDateString()}{" "}
              <strong>Time:</strong> {b.slot?.time}
            </p>
            <p className="mb-1" style={{ fontSize: "13px" }}>
              <strong>Persons:</strong> {b.numberOfPersons}
            </p>
            <p className="mb-0" style={{ fontSize: "13px" }}>
              <strong>Cancelled At:</strong>{" "}
              {b.cancelledAt
                ? new Date(b.cancelledAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRecentCancellations;

