import React, { useEffect, useState } from "react";
import MainScreen from "../../mainscreen";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  googleLogin,
  facebookLogin,
} from "../../../actions/userAction";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import usePageTitle from "../../../hooks/usePageTitle";

const RegisterScreen = () => {
    usePageTitle("register");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Redux state
  const userRegister = useSelector((state) => state.userRegister);
  const userLogin = useSelector((state) => state.userLogin);

  const { loading, error, userInfo } = userRegister;
  const { userInfo: loggedInUser } = userLogin;

  // ✅ Redirect after login/register/google/facebook
  useEffect(() => {
    if (userInfo || loggedInUser) {
      navigate("/mynotes");
    }
  }, [navigate, userInfo, loggedInUser]);

  // ✅ Field validation
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "name":
        if (!value.trim()) message = "Name is required";
        break;
      case "email":
        if (!value.trim()) message = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          message = "Enter a valid email address";
        break;
      case "password":
        if (!value.trim()) message = "Password is required";
        else if (value.length < 6)
          message = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value.trim()) message = "Please confirm your password";
        else if (value !== formData.password)
          message = "Passwords do not match";
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ✅ Cloudinary Image Upload
  const postDetails = (file) => {
    if (!file)
      return setFieldErrors((prev) => ({
        ...prev,
        pic: "Please select an image",
      }));

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return setFieldErrors((prev) => ({
        ...prev,
        pic: "Only JPEG or PNG images allowed",
      }));

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "notezipper");
    data.append("cloud_name", "domeaganh");

    fetch("https://api.cloudinary.com/v1_1/domeaganh/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({ ...prev, pic: data.url.toString() }));
        setFieldErrors((prev) => ({ ...prev, pic: "" }));
        setUploading(false);
      })
      .catch(() => {
        setFieldErrors((prev) => ({
          ...prev,
          pic: "Image upload failed. Try again.",
        }));
        setUploading(false);
      });
  };

  // ✅ Submit form
  const submitHandler = (e) => {
    e.preventDefault();
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));
    const hasErrors = Object.values(fieldErrors).some((msg) => msg);
    if (hasErrors) return;

    const { name, email, password, pic } = formData;
    dispatch(register(name, email, password, pic));
  };

  // ✅ Google Login Success
  const handleGoogleSuccess = (tokenResponse) => {
    dispatch(googleLogin(tokenResponse.credential));
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
  };

  // ✅ Facebook Login Success
  const handleFacebookSuccess = (response) => {
    if (response.accessToken) {
      dispatch(facebookLogin(response.accessToken));
    }
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook Login Failed:", error);
  };

  return (
    <MainScreen title="Register">
      <div
        className="loginContainer p-4 pb-5 shadow rounded bg-white mx-auto"
        style={{
          maxWidth: "500px",
          marginTop: "50px",
          marginBottom: "60px",
        }}
      >
        <h3 className="text-center mb-4 fw-bold">Create Your Account</h3>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <Form onSubmit={submitHandler} noValidate>
          {/* Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!fieldErrors.name}
              placeholder="Enter your name"
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!fieldErrors.email}
              placeholder="Enter your email"
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!fieldErrors.password}
                placeholder="Enter password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {fieldErrors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!fieldErrors.confirmPassword}
                placeholder="Confirm password"
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {fieldErrors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Profile Picture */}
          <Form.Group className="mb-3" controlId="pic">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => postDetails(e.target.files[0])}
              isInvalid={!!fieldErrors.pic}
            />
            {uploading && (
              <div className="mt-2 text-center">
                <Spinner animation="border" size="sm" /> Uploading...
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {fieldErrors.pic}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit Button */}
          <div className="d-grid mt-4 mb-3">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </Form>

        {/* OR Divider */}
        <div className="text-center my-3 text-muted">— or register with —</div>

        {/* ✅ Social Login Buttons */}
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {/* Google Button */}
          <div style={{ flex: "1 1 45%" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* Facebook Button */}
          <div style={{ flex: "1 1 45%" }}>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              onSuccess={handleFacebookSuccess}
              onFail={handleFacebookFailure}
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 py-2 shadow-sm"
                  style={{ backgroundColor: "#1877F2", border: "none" }}
                >
                  <FaFacebookF size={18} />
                  <span>Sign up with Facebook</span>
                </button>
              )}
            />
          </div>
        </div>

        {/* Login Link */}
        <Row className="py-3 text-center">
          <Col>
            Already have an account?{" "}
            <Link to="/login" className="fw-bold text-decoration-none">
              Login
            </Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterScreen;
