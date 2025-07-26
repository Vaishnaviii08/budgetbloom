import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import EditTransaction from "./EditTransaction";

const TransactionItem = ({ transaction }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);

  const emojis = {
    happy: "😊",
    sad: "😢",
    stressed: "😰",
    neutral: "😐",
    guilty: "😔",
    excited: "😄",
  };

  const { date, type, category, emotion, amount } = transaction;

  const edit = () => {};

  return (
    <Card
      style={{
        border: "none",
        borderRadius: "8px",
        padding: "12px 0",
        backgroundColor: "#f9fcfb",
        boxShadow: "none",
      }}
    >
      <Row
        className="align-items-center"
        style={{
          fontSize: "15px",
          color: "#333",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col md={2}>
          <strong>{new Date(date).toLocaleDateString("en-IN")}</strong>
        </Col>

        <Col md={2}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              backgroundColor: type === "income" ? "#e0f7e9" : "#ffe8e8",
              color: type === "income" ? "#28a745" : "#dc3545",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {type.toUpperCase()}
          </span>
        </Col>

        <Col md={1}>
          {type === "income" ? (
            <span style={{ fontStyle: "italic", color: "#6c757d" }}>N/A</span>
          ) : (
            <strong>{category}</strong>
          )}
        </Col>

        <Col md={1} className="text-center">
          {type === "expense" ? (
            <span style={{ fontSize: "18px", marginRight: "30px" }}>
              {emojis[emotion]}
            </span>
          ) : (
            <span style={{ fontSize: "18px", marginRight: "30px" }}>-</span>
          )}
        </Col>

        <Col md={2} style={{ fontWeight: "bold", color: "#2e7d32" }}>
          ₹ {amount}
        </Col>

        <Col md={1} className="text-end">
          <Button variant="outline-primary" size="sm" onClick={handleShow}>
            Edit
          </Button>

          <Modal show={showEdit} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditTransaction 
              transaction={transaction}
              onClose={handleClose}
              opUpdate={(updatedTx) => {
                console.log("Updated Transaction in parent:", updatedTx);
              }}
              />
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Card>
  );
};

export default TransactionItem;
