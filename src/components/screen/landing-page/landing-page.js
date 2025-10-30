import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
// import { useNavigate } from "react-router-dom";
import "./landing-page.css";

const LandingPage = () => {
  // const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (userInfo) {
      setIsLoggedIn(true);
      // navigate("/mynotes");
    }
    
  }, [userInfo]);

  return (
    <div className="main">
      <Container>
        <Row>
          <div className="intro-text">
            <div>
              <h1 className="title">
                Welcome to Note <br /> Zipper
              </h1>
              <p className="subtitle">One Safe Place for all your notes.</p>
            </div>

            {/* Only show buttons if user is NOT logged in */}
            {!isLoggedIn && (
              <div className="buttomContainer">
                <a href="/login">
                  <Button size="lg" className="landinbutton">
                    Login
                  </Button>
                </a>
                <a href="/register">
                  <Button
                    size="lg"
                    className="landinbutton"
                    variant="outline-primary"
                  >
                    Signup
                  </Button>
                </a>
              </div>
            )}
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
