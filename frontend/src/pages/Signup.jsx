import React, {useState} from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios"; 

const Signup = () => {
  const {login} = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call /signup
      const res = await API.post("/users/signup", formData);

      // Auto-login using the token from response
      localStorage.setItem("token", res.data.token);
      await login(formData.email, formData.password); // update context

      // Redirect to set-pin page
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e0f7ef, #c3f3d9)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col
            xs={12}
            sm={10}
            md={7}
            lg={5}
            xl={4}
            className="p-4 rounded-4 shadow-lg"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #d8f3dc",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="text-center mb-4">
              <h2 style={{ fontWeight: "600", color: "#054a29" }}>
                Welcome to BudgetBloom 🌿
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#555" }}>
                Please signup to continue
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-1 text-center">{error}</div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                style={{
                  backgroundColor: "#063b15",
                  border: "none",
                  fontWeight: "500",
                }}
              >
                Signup
              </Button>

              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#007f5f", textDecoration: "none" }}>
                    Login
                  </Link>
                </small>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
