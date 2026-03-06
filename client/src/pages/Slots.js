// client/src/pages/Slots.js

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";

const Slots = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [slots, setSlots] = useState([]);

  // Match backend fields: date, time, availableSeats
  const [newSlot, setNewSlot] = useState({
    date: "",
    time: "",
    availableSeats: "",
  });
  const [modal, setModal] = useState({ open: false, title: "", message: "" });

  const getTempleImage = (slot) => {
    const raw = (slot.temple && slot.temple.imageUrl ? slot.temple.imageUrl : "").trim();
    if (!raw) {
      return "https://via.placeholder.com/400x220.png?text=Temple+Image";
    }

    // Handle Unsplash page URLs the same way as on Home
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

        if (photoId) {
          return `https://source.unsplash.com/${photoId}`;
        }
      }
    } catch {
      // ignore and fall through
    }

    return raw;
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, templeId]);

  const fetchSlots = async () => {
    try {
      const res = await api.get(`/slots/${templeId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setModal({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to load slots",
      });
    }
  };

  const handleChange = (e) => {
    setNewSlot({
      ...newSlot,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/slots",
        {
          templeId,
          date: newSlot.date,
          time: newSlot.time,
          availableSeats: newSlot.availableSeats,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setModal({
        open: true,
        title: "Success",
        message: "Slot added successfully.",
      });

      setNewSlot({
        date: "",
        time: "",
        availableSeats: "",
      });

      fetchSlots();
    } catch (err) {
      console.error(err);
      setModal({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to add slot",
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
            "radial-gradient(circle at top left, #e3f2fd 0, #ffffff 40%, #f1f8e9 100%)",
          borderRadius: "16px",
          padding: "24px 26px 30px",
          minHeight: "75vh",
          boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
        }}
      >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Darshan Slots</h2>
          <p style={{ margin: 0, color: "#6c757d", fontSize: "14px" }}>
            Choose a slot for your visit or manage temple availability.
          </p>
        </div>
      </div>

      {/* SLOT LIST */}
      {slots.length === 0 && (
        <p className="text-muted mt-3">No slots available for this temple yet.</p>
      )}

      <div className="row justify-content-center">
        {slots.map((slot) => (
          <div key={slot._id} className="col-md-6 col-lg-4 mb-3 d-flex">
            <div
              className="card h-100 w-100"
              style={{
                border: "none",
                borderRadius: "14px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "transform 0.16s ease, box-shadow 0.16s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 22px rgba(0,0,0,0.14)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.08)";
              }}
            >
                  {/* Temple image banner */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "48%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={getTempleImage(slot)}
                      alt={slot.temple?.name || "Temple"}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.03)",
                        transition: "transform 0.25s ease",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x220.png?text=Temple+Image";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05))",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "12px",
                        bottom: "8px",
                        color: "white",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          opacity: 0.9,
                        }}
                      >
                        {slot.temple?.location}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 700 }}>
                        {slot.temple?.name}
                      </div>
                    </div>
                  </div>

              <div
                className="card-body"
                style={{ padding: "14px 16px 12px" }}
              >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                          color: "#0d6efd",
                        }}
                      >
                        {new Date(slot.date).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          backgroundColor: "#e3f2fd",
                          color: "#0d47a1",
                          fontWeight: 500,
                        }}
                      >
                        {slot.time}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        marginBottom: 4,
                        color: "#495057",
                      }}
                    >
                      <strong>Available Seats:</strong> {slot.availableSeats}
                    </p>

                    <div className="d-flex justify-content-between mt-2">
                      {/* Both USER and ADMIN can book */}
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          borderRadius: "999px",
                          padding: "6px 14px",
                          fontSize: "13px",
                          fontWeight: 500,
                          boxShadow: "0 2px 6px rgba(13,110,253,0.35)",
                          border: "none",
                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 10px rgba(13,110,253,0.55)";
                          e.currentTarget.style.opacity = "0.97";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 6px rgba(13,110,253,0.35)";
                          e.currentTarget.style.opacity = "1";
                        }}
                        onClick={() => navigate(`/book/${slot._id}`)}
                      >
                        Book This Slot
                      </button>

                      {/* Admin can delete slot */}
                      {user && user.user && user.user.role === "ADMIN" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{
                            borderRadius: "999px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            fontWeight: 500,
                            borderWidth: "1px",
                            transition:
                              "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease, background-color 0.15s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 10px rgba(220,53,69,0.4)";
                            e.currentTarget.style.backgroundColor =
                              "rgba(220,53,69,0.06)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Are you sure you want to delete this slot?"
                              )
                            )
                              return;
                            try {
                              await api.delete(`/slots/${slot._id}`, {
                                headers: {
                                  Authorization: `Bearer ${user.token}`,
                                },
                              });
                              setSlots((prev) =>
                                prev.filter((s) => s._id !== slot._id)
                              );
                              setModal({
                                open: true,
                                title: "Deleted",
                                message: "Slot deleted successfully.",
                              });
                            } catch (err) {
                              setModal({
                                open: true,
                                title: "Error",
                                message:
                                  err.response?.data?.message ||
                                  "Failed to delete slot",
                              });
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN SLOT FORM BELOW SLOTS */}
      {user && user.user && user.user.role === "ADMIN" && (
        <div className="mt-4">
          <div
            className="card"
            style={{
              borderRadius: "14px",
              border: "none",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div className="card-body">
              <h5 className="card-title mb-3">Add Darshan Slot</h5>

              <form onSubmit={handleAddSlot}>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={newSlot.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control"
                    value={newSlot.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Available Seats</label>
                  <input
                    type="number"
                    name="availableSeats"
                    className="form-control"
                    placeholder="Available Seats"
                    value={newSlot.availableSeats}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  style={{
                    borderRadius: "999px",
                    padding: "8px 20px",
                    fontWeight: 500,
                    boxShadow: "0 3px 8px rgba(25,135,84,0.45)",
                    border: "none",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 14px rgba(25,135,84,0.6)";
                    e.currentTarget.style.opacity = "0.97";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 8px rgba(25,135,84,0.45)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Add Slot
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Slots;