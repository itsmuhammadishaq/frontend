import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Image } from "react-bootstrap";
import "./profileScreen.css";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../mainscreen";
import { updateProfile } from "../../../actions/userAction";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";

const DEFAULT_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

const ProfileScreen = () => {
    usePageTitle("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState(DEFAULT_AVATAR);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picMessage, setPicMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, error, success } = userUpdate;

  // ✅ Load user info and fallback to default avatar if missing
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPic(
        userInfo.pic && userInfo.pic.trim() !== "" ? userInfo.pic : DEFAULT_AVATAR
      );
    }
  }, [navigate, userInfo]);

  // ✅ Handle Cloudinary upload
  const postDetails = (pics) => {
    if (!pics) return setPicMessage("Please select an image");

    setPicMessage(null);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "notezipper");
      data.append("cloud_name", "domeaganh");

      fetch("https://api.cloudinary.com/v1_1/domeaganh/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            setPic(data.secure_url.toString());
          } else {
            setPicMessage("Image upload failed, please try again");
          }
        })
        .catch(() => {
          setPicMessage("Error uploading image");
        });
    } else {
      setPicMessage("Please select a JPEG or PNG image");
    }
  };

  // ✅ Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPicMessage("Passwords do not match");
      return;
    }
    dispatch(updateProfile({ name, email, password, pic }));
  };

  return (
    <MainScreen title="Edit Profile">
      <div
        className="d-flex justify-content-center align-items-center mt-4 pb-5"
        style={{
          paddingBottom: "80px", // 👈 Added bottom padding
        }}
      >
        <Card
          style={{
            maxWidth: "800px",
            width: "100%",
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Row className="g-0">
            {/* Left Side - Profile Picture */}
            <Col
              md={5}
              className="d-flex flex-column align-items-center justify-content-center bg-light p-4"
            >
              <div className="position-relative mb-3">
                <Image
                  src={pic || DEFAULT_AVATAR}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                  alt={name}
                  roundedCircle
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    border: "4px solid #0d6efd",
                    transition: "0.3s",
                  }}
                  className="profilePic"
                />
              </div>
              <Form.Group controlId="pic" className="w-100 mt-2">
                <Form.Label className="fw-semibold text-center d-block">
                  Change Picture
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => postDetails(e.target.files[0])}
                  style={{
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                />
              </Form.Group>
            </Col>

            {/* Right Side - Form */}
            <Col md={7} className="p-4">
              <h4 className="fw-bold text-center mb-3 text-primary">
                Profile Information
              </h4>
              <Form onSubmit={submitHandler}>
                {loading && <Loading />}
                {success && (
                  <ErrorMessage variant="success">
                    Profile updated successfully!
                  </ErrorMessage>
                )}
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {picMessage && (
                  <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
                )}

                <Form.Group controlId="name" className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label className="fw-semibold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-4">
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-4 py-2"
                    style={{
                      borderRadius: "10px",
                      minWidth: "160px",
                      fontWeight: "600",
                    }}
                  >
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </MainScreen>
  );
};

export default ProfileScreen;
