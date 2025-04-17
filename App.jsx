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

const detectCardDetails = (number) => {
  const result = creditCardType(number.replace(/\s/g, ""));
  if (result.length > 0) {
    return {
      type: result[0].niceType,
      cardCategory: result[0].type ? result[0].type : "Unknown",
    };
  }
  return { type: "", cardCategory: "" };
};


const App = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const [cardType, setCardType] = useState("");

  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
  
    if (cleanNumber.length >= 4) {
      const { type, cardCategory } = detectCardDetails(cleanNumber);
      setCardType(`${type} (${cardCategory.charAt(0).toUpperCase() + cardCategory.slice(1)})`);
    } else {
      setCardType("");
    }
  
    if (cleanNumber.length >= 12) {
      const isValid = validator.isCreditCard(cleanNumber);
      setMessage(isValid ? "✅ Valid Card Number!" : "❌ Invalid Card Number!");
    } else {
      setMessage("");
    }
  }, [cardNumber]);
  

  const handleChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="app-container fade-in">
      <h1 className="title">Credit Card Validator</h1>

      <div className="card-preview-wrapper">
  <div className="card-preview-3d">
    {/* Front Side */}
    <div className="card-side card-front animated-glass">
      <div className="card-chip" />
      <div className="card-number">
        {cardNumber || "#### #### #### ####"}
      </div>
      {cardType && <div className="card-type">{cardType}</div>}
    </div>

    {/* Back Side */}
    <div className="card-side card-back animated-glass">
      <div className="card-back-content">
        <p className="card-back-text">💳 Secure Transaction</p>
        <p className="card-back-text">Developed by Aman Singhal</p>
      </div>
    </div>
  </div>
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

      {/* Developer Card */}
      <div className="developer-card glass">
        <h3>👨‍💻 Developed by Aman Singhal</h3>
        <p>B.Tech CSE Student | Frontend Developer</p>
        <a
          href="https://amansinghal-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="portfolio-link"
        >
          Visit Portfolio →
        </a>
      </div>
    </div>
  );
};

export default App;
