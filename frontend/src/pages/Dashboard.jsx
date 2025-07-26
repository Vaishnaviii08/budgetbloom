import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaWallet, FaMoneyBillWave, FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TransactionItem from "../components/TransactionComponent"; // make sure the path is correct

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/transactions/get");
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to bottom, #e8f9f0, #f7fff9)",
        padding: "40px 20px",
      }}
    >
      <Container fluid>
        <h2
          style={{
            marginBottom: "30px",
            fontWeight: "600",
            color: "#2a2a2a",
            textAlign: "center",
          }}
        >
          Dashboard Overview
        </h2>

        <Row className="g-4 align-items-stretch">
          {/* Balance Summary */}
          <Col md={8}>
            <Card
              style={{
                borderRadius: "16px",
                padding: "30px",
                background:
                  "linear-gradient(to bottom right, #ffffff, #ecfdf5)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Row className="text-center">
                {[
                  {
                    icon: <FaWallet size={28} color="#28a745" />,
                    title: "Current Balance",
                    value: "₹ 3,200",
                  },
                  {
                    icon: <FaMoneyBillWave size={28} color="#007bff" />,
                    title: "Monthly Income",
                    value: "₹ 10,000",
                  },
                  {
                    icon: <FaArrowDown size={28} color="#dc3545" />,
                    title: "Monthly Expenses",
                    value: "₹ 6,800",
                  },
                ].map((item, idx) => (
                  <Col key={idx} style={{ padding: "10px 20px" }}>
                    <div style={{ marginBottom: "8px" }}>{item.icon}</div>
                    <h6 style={{ fontWeight: "600", color: "#333" }}>
                      {item.title}
                    </h6>
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#28a745",
                      }}
                    >
                      {item.value}
                    </p>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Add Transaction */}
          <Col md={4}>
            <Card
              style={{
                borderRadius: "16px",
                background: "linear-gradient(to top left, #d4f5e0, #f6fffa)",
                padding: "20px",
                height: "100%",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Card.Body>
                <Card.Title
                  style={{
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#063b15",
                    fontSize: "20px",
                  }}
                >
                  Add a Transaction
                </Card.Title>
                <Card.Text style={{ color: "#444", fontSize: "15px" }}>
                  Start logging your income and expenses to understand your
                  financial patterns and improve savings over time.
                </Card.Text>
              </Card.Body>

              <div>
                <Button
                  variant="success"
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "15px",
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                  onClick={() => navigate("/transaction")}
                >
                  + Add Transaction
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Card
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "linear-gradient(to bottom right, #ffffff, #ecfdf5)",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h5
            style={{
              marginBottom: "20px",
              fontWeight: "600",
              color: "#2c3e50",
            }}
          >
            Recent Transactions
          </h5>

          {transactions.map((transaction, index) => (
            <div key={index}>
              <TransactionItem
                transaction={transaction}
              />
              {index !== transactions.length - 1 && (
                <hr
                  style={{ margin: "10px 0", borderTop: "1px solid #e0e0e0" }}
                />
              )}
            </div>
          ))}
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
