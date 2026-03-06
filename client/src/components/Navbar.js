// clien/src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const baseNavLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  letterSpacing: "0.5px",
  position: "relative",
  padding: "4px 10px",
  borderRadius: "999px",
  transition: "background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #0d6efd, #6610f2)",
        padding: "10px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, #ffc107, #fd7e14, #dc3545)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          D
        </span>
        <Link
          to="/"
          style={{
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "22px",
            letterSpacing: "1px",
          }}
        >
          DarshanEase
        </Link>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {!user && (
          <>
            {/* Only shown when not logged in */}
            <Link
              to="/login"
              style={baseNavLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.22)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={baseNavLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.22)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {/* Shown only after login */}
            <Link
              to="/bookings/my"
              style={baseNavLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.22)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              My Bookings
            </Link>

            <Link
              to="/donations/my"
              style={baseNavLinkStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.22)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              My Donations
            </Link>

            {/* Admin-only link */}
            {user.user && user.user.role === "ADMIN" && (
              <Link
                to="/admin"
                style={baseNavLinkStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.22)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                cursor: "pointer",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.8)",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;