import React, { useState } from "react";
import validator from "validator";

const App = () => {
  const [creditCard, setCreditCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cardType, setCardType] = useState("");

  const detectCardType = (number) => {
    const cardPatterns = {
      Visa: /^4/,
      MasterCard: /^5[1-5]/,
      Amex: /^3[47]/,
      Discover: /^6/,
    };

    for (let type in cardPatterns) {
      if (cardPatterns[type].test(number)) return type;
    }
    return "";
  };

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedValue = value.replace(/(\d{4})/g, "$1 ").trim(); // Add spaces

    setCreditCard(formattedValue);
    setCardType(detectCardType(value));

    if (validator.isCreditCard(value)) {
      setErrorMessage("✅ Valid Credit Card Number");
    } else {
      setErrorMessage("❌ Enter a valid Credit Card Number");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Credit Card Validator</h2>
      <input
        type="text"
        placeholder="Enter Credit Card Number"
        value={creditCard}
        onChange={handleChange}
        maxLength="19"
      />
      <p>{cardType ? `Card Type: ${cardType}` : "Card Type: Unknown"}</p>
      <p style={{ color: errorMessage.includes("❌") ? "red" : "green" }}>
        {errorMessage}
      </p>
    </div>
  );
};

export default App;
