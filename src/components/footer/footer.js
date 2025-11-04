import React from "react";
import { Container } from "react-bootstrap";
import { Github, Linkedin, Envelope } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #0b0d10 0%, #111418 100%)",
        color: "#d1d5db",
        padding: "40px 0 25px",
        borderTop: "2px solid rgba(13,110,253,0.15)",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.4)",
      }}
    >
      <Container className="text-center">
        {/* Brand + tagline */}
        <h4
          style={{
            fontWeight: 700,
            letterSpacing: "1px",
            color: "#ffffff",
            marginBottom: "10px",
          }}
        >
          NoteZipper
        </h4>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.95rem",
            marginBottom: "20px",
          }}
        >
          Your all-in-one place to capture, edit, and organize notes effortlessly.
        </p>

        {/* Gradient line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background:
              "linear-gradient(90deg, #0d6efd 0%, #00c6ff 100%)",
            borderRadius: "5px",
            margin: "0 auto 20px",
          }}
        ></div>

        {/* Social icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          {[
            { Icon: Github, link: "https://github.com" },
            { Icon: Linkedin, link: "https://linkedin.com" },
            { Icon: Envelope, link: "mailto:support@notezipper.com" },
          ].map(({ Icon, link }, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#9ca3af",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#0d6efd")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.85rem",
            margin: 0,
            letterSpacing: "0.3px",
          }}
        >
          © {new Date().getFullYear()} <strong>NoteZipper</strong> • All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
