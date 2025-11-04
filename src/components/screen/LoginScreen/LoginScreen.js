import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import { login, googleLogin, facebookLogin } from "../../../actions/userAction";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) navigate("/mynotes");
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleGoogleSuccess = (tokenResponse) => {
    dispatch(googleLogin(tokenResponse.credential));
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
  };

  const handleFacebookSuccess = (response) => {
    if (response.accessToken) {
      dispatch(facebookLogin(response.accessToken));
    }
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook Login Failed:", error);
  };

  return (
    <Container>
      <Row md={2}>
        <Col
          className="d-none d-sm-block"
          style={{ backgroundColor: "#F9FAFA", paddingTop: 40 }}
        >
          <div className="loginLeft text-center">
            <h2>Hi, Welcome back 👋</h2>
            <p>More effectively with optimized workflows.</p>
            <img
              height={"100%"}
              width={"90%"}
              src="/illustration-dashboard.webp"
              alt="login illustration"
              className="loginImage"
            />
          </div>
        </Col>

        <Col xs={12} md={6} className="mx-auto my-4">
          <div className="loginContainer">
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {loading && <Loading />}

            <Row className="py-3">
              <Col>
                <h3>Sign in to your account</h3>
                <p className="mb-3">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary text-decoration-none"
                  >
                    Get started
                  </Link>
                </p>
              </Col>
            </Row>

            {/* Email / Password Login */}
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

              <Button
                type="submit"
                className="w-100 mt-3 py-2 fw-semibold"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Form>

            {/* Divider + Social Buttons */}
            <div className="mt-4 text-center">
              <p className="text-muted mb-3">or continue with</p>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {/* Custom Google Button */}
                <div style={{ flex: "1 1 45%" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    render={({ onClick }) => (
                      <button
                        onClick={onClick}
                        className="btn btn-light border d-flex align-items-center justify-content-center gap-2 w-100 py-2 rounded-pill shadow-sm"
                      >
                        <FaGoogle color="#DB4437" size={18} />
                        <span>Sign in with Google</span>
                      </button>
                    )}
                  />
                </div>

                {/* Custom Facebook Button */}
                <div style={{ flex: "1 1 45%" }}>
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    onSuccess={handleFacebookSuccess}
                    onFail={handleFacebookFailure}
                    render={({ onClick }) => (
                      <button
                        onClick={onClick}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 py-2 rounded-pill shadow-sm"
                        style={{ backgroundColor: "#1877F2", border: "none" }}
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
    </Container>
  );
};

export default LoginScreen;
