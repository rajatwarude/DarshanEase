import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: "40px",
        background:
          "radial-gradient(circle at top, #0d6efd 0, #0b5ed7 35%, #052c65 100%)",
        color: "white",
        padding: "18px 24px",
      }}
    >
      <div
        className="container d-flex flex-column flex-md-row justify-content-between align-items-center"
        style={{ gap: "12px" }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "0.5px" }}>
            DarshanEase
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Seamless temple darshan and donation experience.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
          }}
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            <i className="bi bi-facebook" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            <i className="bi bi-instagram" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            <i className="bi bi-twitter-x" />
          </a>
        </div>

        <div style={{ fontSize: "12px", opacity: 0.8, textAlign: "right" }}>
          © {year} DarshanEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

