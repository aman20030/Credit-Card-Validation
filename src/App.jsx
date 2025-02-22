import React, { useState } from "react";
import validator from "validator";
import "./App.css"; 
const App = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");

  const validateCard = () => {
    if (validator.isCreditCard(cardNumber)) {
      setMessage("✅ Valid Credit Card Number!");
    } else {
      setMessage("❌ Invalid Credit Card Number! Please check again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px",  }}>
      <h2>Credit Card Validator</h2>
      <input
        type="text"
        placeholder="Enter Credit Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <br /><br />
      <button onClick={validateCard} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Validate
      </button>
      <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px" }}>{message}</p>
    </div>
  );
};

export default App;
