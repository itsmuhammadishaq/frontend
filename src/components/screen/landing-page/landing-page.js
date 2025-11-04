import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { PencilSquare, Folder, CloudCheck, ShieldCheck } from "react-bootstrap-icons";
import "./landing-page.css";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) setIsLoggedIn(true);
  }, []);

  return (
    <div className="landing-page d-flex flex-column align-items-center justify-content-center text-center">
      <Container>
        <Row>
          <Col className="intro-text mx-auto">
            <h1 className="landing-title mb-3">
              Welcome to <span className="highlight">NoteZipper</span>
            </h1>
            <p className="landing-subtitle mb-5">
              Organize your thoughts, tasks, and plans — securely in one place.
              Create, edit, and access your notes anytime, anywhere.
            </p>

            {!isLoggedIn && (
              <div className="button-container d-flex justify-content-center gap-3 mb-5">
                <a href="/login">
                  <Button size="lg" className="landing-btn primary-btn">
                    Login
                  </Button>
                </a>
                <a href="/register">
                  <Button size="lg" className="landing-btn secondary-btn" variant="outline-primary">
                    Sign Up
                  </Button>
                </a>
              </div>
            )}
          </Col>
        </Row>

        {/* 🌟 Hero Feature Section */}
        <Row className="mt-4 g-4 justify-content-center text-center feature-row">
          <Col xs={6} md={3}>
            <div className="feature-card">
              <PencilSquare className="feature-icon" />
              <h5>Create Notes</h5>
              <p>Write and save notes effortlessly with a clean interface.</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-card">
              <Folder className="feature-icon" />
              <h5>Organize</h5>
              <p>Keep your notes sorted and categorized for easy access.</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-card">
              <CloudCheck className="feature-icon" />
              <h5>Sync Anywhere</h5>
              <p>Access your notes securely from any device, anytime.</p>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="feature-card">
              <ShieldCheck className="feature-icon" />
              <h5>Secure</h5>
              <p>Your notes are safely encrypted and protected in the cloud.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
