import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Form from "react-bootstrap/Form";
import EmotionPicker from "../components/EmotionPicker";
import DateSelector from "../components/DateSelector";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";

const EditTransaction = ({ transaction, onClose, onUpdate }) => {
  const [date, setDate] = useState(new Date());
  const [emotion, setEmotion] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    setType(transaction.type || "");
    setAmount(transaction.amount || "");
    setDate(new Date(transaction.date));
    setNote(transaction.note || "");
    setCategory(transaction.category || "");
    setEmotion(transaction.emotion || "");
  }, [transaction]);

  const handleEmotionSelect = (selectedEmotion) => {
    setEmotion(selectedEmotion);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log({ date, type, emotion, amount, category, note });

      const updatedData = {
        date,
        type,
        emotion,
        amount: Number(amount),
        category,
        note,
      };

      const res = await axios.patch(
        `/transactions/edit/${transaction._id}`,
        updatedData
      );

      console.log("Transaction updated:", res.data);

      // Notify parent
      if (onUpdate) {
        onUpdate(res.data.transaction);
      }

      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(
        "Transaction creation failed : ",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error || "Failed to add transaction. Try again."
      );
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {/* Type (Expense/Income) */}
        <Form.Group className="mb-4" controlId="typeSelect">
          <Form.Label style={{ fontWeight: "500" }}>
            Transaction Type
          </Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">Select Type</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Form.Select>
        </Form.Group>

        {/* Amount */}
        <Form.Group className="mb-3" controlId="amountInput">
          <Form.Label style={{ fontWeight: "500" }}>Amount (in ₹)</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            required
          />
        </Form.Group>

        {/* Category (only if expense) */}
        {type === "expense" && (
          <Form.Group className="mb-4" controlId="categorySelect">
            <Form.Label style={{ fontWeight: "500" }}>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="bills">Bills</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
        )}

        <Row className="mb-4">
          {/* Emotion (only if expense) */}
          {type === "expense" && (
            <Col md={6}>
              <Form.Label style={{ fontWeight: "500", marginBottom: "8px" }}>
                Emotion
              </Form.Label>
              <EmotionPicker
                selectedEmotion={emotion}
                onSelect={handleEmotionSelect}
              />
            </Col>
          )}

          {/* Date Picker */}
          <Col md={type === "expense" ? 6 : 12}>
            <Form.Label style={{ fontWeight: "500", marginBottom: "8px" }}>
              Date
            </Form.Label>
            <DateSelector selectedDate={date} onDateChange={setDate} />
          </Col>
        </Row>

        {/* Note */}
        <Form.Group className="mb-4" controlId="noteTextArea">
          <Form.Label style={{ fontWeight: "500" }}>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Add a short note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ ...inputStyle, resize: "none" }}
          />
        </Form.Group>

        <div style={{ textAlign: "right" }}>
          <Button
            variant="success"
            type="submit"
            className="w-100"
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#28a745",
              border: "none",
            }}
          >
            Save Transaction
          </Button>
        </div>
      </Form>
    </div>
  );
};

const inputStyle = {
  padding: "10px 12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
};

export default EditTransaction;
