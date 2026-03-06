// clien/src/pages/Admin.js
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "../components/Modal";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [name, setName] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [temples, setTemples] = useState([]);
  const [editingTempleId, setEditingTempleId] = useState(null);
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const [donationStats, setDonationStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
  });

  // Smooth scroll if navigated from navbar
  useEffect(() => {
    if (location.hash === "#addTemple") {
      const element = document.getElementById("addTemple");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // Load temples for management
  useEffect(() => {
    const fetchData = async () => {
      try {
        const templesRes = await api.get("/temples", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTemples(templesRes.data);

        // Only admins should see donation stats
        if (user.user && user.user.role === "ADMIN") {
          const statsRes = await api.get("/donations/stats/summary", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setDonationStats({
            totalAmount: statsRes.data.totalAmount || 0,
            totalDonations: statsRes.data.totalDonations || 0,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Provide default image if empty
      const finalImageUrl =
        imageUrl.trim() === ""
          ? "https://via.placeholder.com/400x250.png?text=Temple+Image"
          : imageUrl;

      if (editingTempleId) {
        // Update existing temple
        const res = await api.put(
          `/temples/${editingTempleId}`,
          {
            name,
            location: locationInput,
            description,
            imageUrl: finalImageUrl,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setModal({
          open: true,
          title: "Updated",
          message: "Temple updated successfully.",
        });

        setTemples((prev) =>
          prev.map((t) => (t._id === editingTempleId ? res.data : t))
        );
      } else {
        // Create new temple
        const res = await api.post(
          "/temples",
          {
            name,
            location: locationInput,
            description,
            imageUrl: finalImageUrl,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setModal({
          open: true,
          title: "Success",
          message: "Temple added successfully.",
        });

        // Add to local list
        setTemples((prev) => [...prev, res.data]);
      }

      // Reset form
      setName("");
      setLocationInput("");
      setDescription("");
      setImageUrl("");
      setEditingTempleId(null);
    } catch (err) {
      setModal({
        open: true,
        title: "Error",
        message:
          err.response?.data?.message ||
          (editingTempleId ? "Failed to update temple" : "Failed to add temple"),
      });
    }
  };

  const handleDeleteTemple = async (id) => {
    if (!window.confirm("Are you sure you want to delete this temple?")) return;
    try {
      await api.delete(`/temples/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTemples((prev) => prev.filter((t) => t._id !== id));
      setModal({
        open: true,
        title: "Deleted",
        message: "Temple deleted successfully.",
      });
    } catch (err) {
      setModal({
        open: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to delete temple",
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
          "linear-gradient(135deg, #e3f2fd 0, #ffffff 40%, #fff3e0 75%, #fce4ec 100%)",
        borderRadius: "16px",
        padding: "24px 28px 32px",
        minHeight: "80vh",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="mb-3 text-center" style={{ fontWeight: 700, color: "#343a40" }}>
        Admin Dashboard
      </h2>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <div
            className="card shadow-sm"
            style={{
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #e3f2fd 0, #ffffff 60%, #bbdefb 100%)",
            }}
          >
            <div className="card-body">
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#0d47a1" }}>
                Temples
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>{temples.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div
            className="card shadow-sm"
            style={{
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #e8f5e9 0, #ffffff 60%, #c8e6c9 100%)",
            }}
          >
            <div className="card-body">
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#1b5e20" }}>
                Total Donations
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>
                ₹{donationStats.totalAmount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div
            className="card shadow-sm"
            style={{
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #fff3e0 0, #ffffff 60%, #ffe0b2 100%)",
            }}
          >
            <div className="card-body">
              <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#e65100" }}>
                Donation Count
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>
                {donationStats.totalDonations}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick navigation for admin */}
      <div className="mb-4 d-flex justify-content-center" style={{ gap: "12px" }}>
        <a href="/admin/recent-bookings" className="btn btn-outline-primary btn-sm">
          Recent Bookings
        </a>
        <a
          href="/admin/recent-cancellations"
          className="btn btn-outline-danger btn-sm"
        >
          Recent Cancellations
        </a>
      </div>

      {/* Add/Edit Temple Form (Bootstrap Card) */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-7">
          <div
            className="card shadow-sm"
            style={{
              border: "none",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                background:
                  "linear-gradient(90deg, rgba(13,110,253,0.12), rgba(102,16,242,0.12))",
              }}
            >
              <h4 className="m-0" style={{ fontWeight: 800, color: "#212529" }}>
                {editingTempleId ? "Edit Temple" : "Add Temple"}
              </h4>
              <div style={{ fontSize: "13px", color: "#6c757d" }}>
                Manage temple details and image URL.
              </div>
            </div>

            <div className="card-body">
              <form id="addTemple" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Temple Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Leave empty for default image"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  style={{
                    borderRadius: "999px",
                    padding: "10px 0",
                    fontWeight: 600,
                    boxShadow: "0 3px 10px rgba(25,135,84,0.35)",
                    border: "none",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(25,135,84,0.45)";
                    e.currentTarget.style.opacity = "0.98";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 10px rgba(25,135,84,0.35)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {editingTempleId ? "Update Temple" : "Add Temple"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Temples */}
      <h4 className="mb-3">Manage Temples</h4>
      {temples.length === 0 && (
        <p className="text-muted">No temples created yet.</p>
      )}
      {temples.map((t) => (
        <div key={t._id} className="card mb-2 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">{t.name}</h5>
              <p className="mb-0">
                <strong>Location:</strong> {t.location}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
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
                    "0 4px 10px rgba(13,110,253,0.35)";
                  e.currentTarget.style.backgroundColor = "rgba(13,110,253,0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => {
                  setEditingTempleId(t._id);
                  setName(t.name || "");
                  setLocationInput(t.location || "");
                  setDescription(t.description || "");
                  setImageUrl(t.imageUrl || "");
                  const element = document.getElementById("addTemple");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-danger btn-sm"
                style={{
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  boxShadow: "0 2px 6px rgba(220,53,69,0.4)",
                  transition:
                    "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(220,53,69,0.6)";
                  e.currentTarget.style.opacity = "0.95";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 6px rgba(220,53,69,0.4)";
                  e.currentTarget.style.opacity = "1";
                }}
                onClick={() => handleDeleteTemple(t._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Admin;