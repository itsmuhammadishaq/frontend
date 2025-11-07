import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import Image from "react-bootstrap/Image";
import { useState } from "react";

const DEFAULT_AVATAR =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [search, setSearch] = useState("");

  const logoutHandle = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/mynotes?search=${search}`);
    }
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="py-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #007bff 0%, #0056b3 100%)",
      }}
    >
      <Container fluid>
        {/* ✅ Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 text-white d-flex align-items-center"
          style={{ letterSpacing: "0.2px" }}
        >
          <Image
            width={20}
            height={25}
            src="/favicon.ico"
            alt="NoteZipper logo"
            className="me-2" // 👈 adds space to the right
          />
          NoteZipper
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll" className="align-items-center">
          <Nav className="ms-auto align-items-center">
            {userInfo ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/mynotes"
                  className="text-white fw-semibold me-3"
                  style={{
                    transition: "0.2s",
                  }}
                >
                  My Notes
                </Nav.Link>

                {/* ✅ Avatar & Dropdown */}
                <div className="d-flex align-items-center">
                  <Image
                    src={
                      userInfo.pic && userInfo.pic.trim() !== ""
                        ? userInfo.pic
                        : DEFAULT_AVATAR
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                    roundedCircle
                    width="42"
                    height="42"
                    className="border border-light me-2"
                    style={{
                      objectFit: "cover",
                      boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                      e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(255,255,255,0.5)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 0 8px rgba(255,255,255,0.3)";
                    }}
                  />

                  <NavDropdown
                    // title={
                    //   <span className="fw-semibold text-white d-flex align-items-center jsutify-content-center">
                    //     {userInfo?.name}
                    //   </span>
                    // }
                    id="navbarScrollingDropdown"
                    align="end"
                    menuVariant="light"
                    className="custom-dropdown"
                  >
                    {/* Dropdown Header */}
                    <div
                      className="px-3 py-2 d-flex align-items-center border-bottom"
                      style={{
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <Image
                        src={
                          userInfo.pic && userInfo.pic.trim() !== ""
                            ? userInfo.pic
                            : DEFAULT_AVATAR
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_AVATAR;
                        }}
                        roundedCircle
                        width="40"
                        height="40"
                        className="me-2"
                        style={{
                          objectFit: "cover",
                          border: "2px solid #007bff",
                        }}
                      />
                      <div className="d-flex flex-column">
                        <strong className="text-dark">{userInfo?.name}</strong>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {userInfo?.email}
                        </small>
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    <NavDropdown.Item
                      as={Link}
                      to="/profile"
                      className="fw-semibold d-flex align-items-center"
                      style={{
                        transition: "0.2s",
                        gap: "8px",
                      }}
                    >
                      👤 My Profile
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      onClick={logoutHandle}
                      className="fw-semibold text-danger d-flex align-items-center"
                      style={{
                        transition: "0.2s",
                        gap: "8px",
                      }}
                    >
                      🚪 Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="text-white fw-semibold"
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
