// clien/src/pages/MyDonations.js
import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const MyDonations = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donations/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchDonations();
  }, [user]);

  return (
    <div
      className="container mt-4"
      style={{
        background:
          "radial-gradient(circle at top left, #fff3e0 0, #ffffff 45%, #e3f2fd 100%)",
        borderRadius: "16px",
        padding: "24px 28px",
        minHeight: "70vh",
        boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="mb-4 text-center" style={{ fontWeight: 700, color: "#343a40" }}>
        My Donations
      </h2>

      {donations.length === 0 && (
        <p className="text-center text-muted">No donations made yet.</p>
      )}

      <div className="row">
        {donations.map((d) => (
          <div key={d._id} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-1">
                  {d.temple?.name || "Temple"}{" "}
                  <span className="text-muted" style={{ fontSize: "12px" }}>
                    {d.temple?.location}
                  </span>
                </h5>
                <p className="mb-1">
                  <strong>Amount:</strong> ₹{d.amount}
                </p>
                <p className="mb-1" style={{ fontSize: "13px" }}>
                  <strong>Date:</strong>{" "}
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>
                {d.message && (
                  <p className="mb-0" style={{ fontSize: "13px", color: "#495057" }}>
                    <strong>Message:</strong> {d.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonations;

