import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import Image from "react-bootstrap/Image";
import { useState } from "react";

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
          className="fw-bold fs-4 text-white"
          style={{ letterSpacing: "0.5px" }}
        >
          📝 NoteZipper
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll" className="align-items-center">
         
        

          {/* ✅ Right Side Navigation */}
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

                {/* Profile Avatar */}
                <div className="d-flex align-items-center">
                  <Image
                    src={userInfo.pic}
                    roundedCircle
                    width="42"
                    height="42"
                    className="border border-light me-2"
                    style={{
                      objectFit: "cover",
                      boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {/* Dropdown */}
                  <NavDropdown
                    title={
                      <span className="fw-semibold text-white">
                        {userInfo?.name}
                      </span>
                    }
                    id="navbarScrollingDropdown"
                    align="end"
                    menuVariant="light"
                    className="custom-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandle}>
                      Logout
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
