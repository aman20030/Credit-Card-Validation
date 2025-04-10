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
  return result.length > 0 ? result[0].niceType : "";
};

const App = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const [cardType, setCardType] = useState("");

  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const type = detectCardType(cleanNumber);
    setCardType(type);

    if (cleanNumber.length >= 12) {
      const isValid = validator.isCreditCard(cleanNumber);
      setMessage(isValid ? "✅ Valid Credit Card Number!" : "❌ Invalid Credit Card Number!");
    } else {
      setMessage("");
    }
  }, [cardNumber]);

  const handleChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="app-container">
      <h2>💳 Credit Card Validator</h2>

      <div className="card-preview">
        <div className="card-chip" />
        <div className="card-number">
          {cardNumber || "#### #### #### ####"}
        </div>
        <div className="card-type">{cardType}</div>
      </div>

      <input
        type="text"
        placeholder="Enter Credit Card Number"
        value={cardNumber}
        onChange={handleChange}
        maxLength="19"
        className="card-input"
      />

      <p className={`message ${message.includes("Valid") ? "valid" : "invalid"}`}>
        {message}
      </p>
    </div>
  );
};

export default App;
