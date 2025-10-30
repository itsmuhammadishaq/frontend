import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import Image from "react-bootstrap/Image";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandle = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="py-3">
      <Container fluid>
        {/* ✅ Brand */}
        <Navbar.Brand as={Link} to="/" style={{ color: "white", fontWeight: 600 }}>
          Note Zipper
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* ✅ Search bar (centered) */}
        

          {/* ✅ Right side navigation */}
          {userInfo ? (
            <Nav className="ms-auto align-items-center">
              {/* My Notes link */}
              <Nav.Link as={Link} to="/mynotes" className="text-white me-3">
                My Notes
              </Nav.Link>

              {/* Profile image with spacing */}
              <Image
                src={userInfo.pic}
                roundedCircle
                width="40"
                height="40"
                className="me-2 border border-light"
                style={{ objectFit: "cover" }}
              />

              {/* Dropdown menu */}
              <NavDropdown title={userInfo?.name} id="navbarScrollingDropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandle}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            // ✅ If not logged in
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="text-white">
                Login
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
