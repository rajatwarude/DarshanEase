// clien/src/pages/Home.js
import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get("/temples", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setTemples(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemples();
  }, [user]);

  const getTempleImage = (temple) => {
    const raw = (temple.imageUrl || "").trim();
    if (!raw) {
      return "https://via.placeholder.com/400x250.png?text=Temple+Image";
    }

    // If user pasted an Unsplash *page* URL, convert it to a source endpoint
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
          // Use Unsplash source endpoint; it returns a proper image URL
          return `https://source.unsplash.com/${photoId}`;
        }
      }
    } catch {
      // ignore and fall through
    }

    // For normal direct image URLs, just use as-is
    return raw;
  };

  return (
    <>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, rgba(13,110,253,0.12), rgba(102,16,242,0.16))",
              marginBottom: "6px",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1.3px",
              color: "#0d6efd",
              fontWeight: 600,
            }}
          >
            Explore Sacred Places
          </div>
          <h1
            className="text-center"
            style={{
              fontWeight: 800,
              letterSpacing: "1.2px",
              background:
                "linear-gradient(90deg, #0d6efd, #6610f2, #fd7e14)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "4px",
            }}
          >
            Temples
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            Choose a temple to view darshan slots or offer your donation.
          </p>
        </div>

      {temples.length === 0 && (
        <p className="text-center text-muted">No temples found.</p>
      )}

      <div className="row">
        {temples.map((temple) => {
          const image = getTempleImage(temple);

          return (
            <div key={temple._id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "none",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8fafc 40%, #f3e5f5 100%)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.18)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "62%", // 16:10 ratio, keeps all images same height
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image}
                    alt={temple.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scale(1.02)",
                      transition: "transform 0.25s ease",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x250.png?text=Temple+Image";
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
                      left: "14px",
                      bottom: "10px",
                      color: "white",
                    }}
                  >
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
                    <div style={{ fontSize: "18px", fontWeight: 700 }}>
                      {temple.name}
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "14px 16px 16px",
                    flexGrow: 1,
                  }}
                >
                  <p
                    className="card-text"
                    style={{
                      minHeight: "48px",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    {temple.description}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      style={{
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                      onClick={() => {
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        navigate(`/donate/${temple._id}`);
                      }}
                    >
                      Donate
                    </button>

                    <Link
                      to={`/slots/${temple._id}`}
                      className="btn btn-primary btn-sm"
                      style={{
                        borderRadius: "999px",
                        padding: "6px 16px",
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
                    >
                      View Slots
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default Home;