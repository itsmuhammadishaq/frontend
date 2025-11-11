import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import { login, googleLogin, facebookLogin } from "../../../actions/userAction";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {  FaFacebookF } from "react-icons/fa";
import ForgotPasswordModal from "../frogetpassword/forgetpasswordModel";
import "./LoginScreen.css";
import usePageTitle from "../../../hooks/usePageTitle";

const LoginScreen = () => {
    usePageTitle("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) {
      // Navigate immediately without reload
      navigate("/mynotes", { replace: true });
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleGoogleSuccess = (tokenResponse) => {
    if (tokenResponse?.credential) {
      dispatch(googleLogin(tokenResponse.credential));
    }
  };
  const handleGoogleError = () => console.error("Google Sign-In failed");

  const handleFacebookSuccess = (response) => {
    if (response?.accessToken) dispatch(facebookLogin(response.accessToken));
  };
  const handleFacebookFailure = (error) =>
    console.error("Facebook Login Failed:", error);

  return (
    <Container>
      <Row>
        {/* LEFT SIDE ILLUSTRATION */}
        <Col
          className="d-none d-sm-block"
          style={{ backgroundColor: "#F9FAFA", paddingTop: 40 }}
        >
          <div className="loginLeft text-center">
            <h2>Hi, Welcome back 👋</h2>
            <p>Work more effectively with optimized workflows.</p>
            <img
              height="100%"
              width="90%"
              src="/illustration-dashboard.webp"
              alt="Dashboard illustration"
              className="loginImage"
            />
          </div>
        </Col>

        {/* RIGHT SIDE LOGIN FORM */}
        <Col xs={12} md={6} className="mx-auto my-4">
          <div className="loginContainer">
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {loading && <Loading />}

            <Row className="py-3">
              <Col>
                <h3>Sign in to your account</h3>
                <p className="mb-3">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary text-decoration-none"
                  >
                    Get started
                  </Link>
                </p>
              </Col>
            </Row>

            {/* EMAIL LOGIN */}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <div></div>
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-100 mt-3 py-2 fw-semibold d-flex justify-content-center align-items-center"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            {/* SOCIAL LOGIN */}
            <div className="mt-4 text-center">
              <p className="text-muted mb-3">or continue with</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {/* GOOGLE LOGIN */}
                <div style={{ flex: "1 1 45%" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>

                {/* FACEBOOK LOGIN */}
                <div style={{ flex: "1 1 30%" }}>
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    onSuccess={handleFacebookSuccess}
                    onFail={handleFacebookFailure}
                    render={({ onClick }) => (
                      <button
                        onClick={onClick}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 py-2 shadow-sm"
                        style={{ backgroundColor: "#1877F2", border: "none" }}
                        disabled={loading}
                      >
                        <FaFacebookF size={18} />
                        <span>Sign in with Facebook</span>
                      </button>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        show={showForgot}
        handleClose={() => setShowForgot(false)}
      />
    </Container>
  );
};

export default LoginScreen;
