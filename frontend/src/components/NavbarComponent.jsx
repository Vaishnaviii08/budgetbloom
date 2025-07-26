import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const NavbarComponent = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const linkStyle = {
    color: "#063b15",
    fontWeight: "500",
    fontSize: "1.05rem",
    textDecoration: "none",
  };

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      style={{
        background: "linear-gradient(to right, #b7efc5, #d4f5e0)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Segoe UI, sans-serif",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.6rem",
            color: "#063b15",
            letterSpacing: "0.5px",
          }}
        >
          Budget<span style={{ color: "#28a745" }}>Bloom</span> 🌿
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* LEFT NAV LINKS */}
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/" style={linkStyle}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/transaction" style={linkStyle}>Transactions</Nav.Link>
            <Nav.Link as={Link} to="/goals" style={linkStyle}>Goals</Nav.Link>
            <Nav.Link as={Link} to="/analytics" style={linkStyle}>Analytics</Nav.Link>
            <Nav.Link as={Link} to="/habits" style={linkStyle}>Habits</Nav.Link>
          </Nav>

          {/* RIGHT PROFILE DROPDOWN */}
          <Nav className="ms-auto">
            <NavDropdown
              title={<span style={{ ...linkStyle }}>Account</span>}
              id="account-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile" style={{ fontWeight: 500, color: "#063b15" }}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} style={{ fontWeight: 500, color: "#063b15" }}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
