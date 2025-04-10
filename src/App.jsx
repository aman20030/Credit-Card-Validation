import React, { useState, useEffect } from "react";
import validator from "validator";
import creditCardType from "credit-card-type";
import "./App.css";

const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const detectCardType = (number) => {
  const result = creditCardType(number.replace(/\s/g, ""));
  return result.length > 0 ? result[0].niceType : "Unknown";
};

const App = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const [cardType, setCardType] = useState("");

  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (cleanNumber.length >= 12) {
      const isValid = validator.isCreditCard(cleanNumber);
      const type = detectCardType(cleanNumber);
      setCardType(type);
      setMessage(isValid ? "✅ Valid Credit Card Number!" : "❌ Invalid Credit Card Number!");
    } else {
      setMessage("");
      setCardType("");
    }
  }, [cardNumber]);

  const handleChange = (e) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px", fontFamily: "sans-serif" }}>
      <h2>💳 Credit Card Validator</h2>
      <input
        type="text"
        placeholder="Enter Credit Card Number"
        value={cardNumber}
        onChange={handleChange}
        maxLength="19"
        style={{
          padding: "12px",
          width: "320px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <br /><br />
      {cardType && (
        <p style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
          Card Type: <strong>{cardType}</strong>
        </p>
      )}
      <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px", color: message.includes("Valid") ? "green" : "red" }}>
        {message}
      </p>
    </div>
  );
};

export default App;
