import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import { login, googleLogin, facebookLogin } from "../../../actions/userAction";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./LoginScreen.css";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebookF } from "react-icons/fa";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/mynotes");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    dispatch(googleLogin(token));
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
  };

  // Facebook Login Success Handler
  const handleFacebookSuccess = (response) => {
    console.log("Facebook Login Success:", response);

    // The response contains accessToken which we send to our backend
    if (response.accessToken) {
      dispatch(facebookLogin(response.accessToken));
    }
  };

  // Facebook Login Failure Handler
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
            <div className="mt-3 text-center">
              <p>or</p>

              {/* Google Button */}
              
              <div className="d-flex justify-content-center mb-3">
                <div className="w-49   ">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    shape="pill"
                    size="large"
                    width="100%"
                
                  />
                </div>
              </div>

              {/* Facebook Button */}
              <div className="d-flex justify-content-center mb-3">
                <div className="w-49">
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    onSuccess={handleFacebookSuccess}
                    onFail={handleFacebookFailure}
                    render={({ onClick }) => (
                      <button
                        onClick={onClick}
                        className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100 py-2  rounded-pill"
                      >
                        <FaFacebookF size={18} />
                        <span>Sign in Facebook</span>
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
