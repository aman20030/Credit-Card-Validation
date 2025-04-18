import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import validator from "validator";
import creditCardType from "credit-card-type";
import "./App.css";

// Format and detect card details
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
  const [cardCategory, setCardCategory] = useState("credit"); // Default to Credit
  const [savedCards, setSavedCards] = useState([]);
  const [amount, setAmount] = useState("");
  const [transactionMessage, setTransactionMessage] = useState("");

  // Load saved cards from local storage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cards")) || [];
    setSavedCards(saved);
  }, []);

  // Save card to localStorage when it's valid
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

  // Handle card number input
  const handleChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Handle Save Card
  const handleSaveCard = () => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (validator.isCreditCard(cleanNumber)) {
      const newCard = {
        number: cardNumber,
        type: cardCategory,
      };
      const newCards = [...savedCards, newCard];
      setSavedCards(newCards);
      localStorage.setItem("cards", JSON.stringify(newCards));
      setCardNumber("");
    }
  };

  // Handle Transaction Simulation
  const handleTransaction = () => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (validator.isCreditCard(cleanNumber) && amount) {
      setTransactionMessage(`✅ ${cardCategory.toUpperCase()} payment of ₹${amount} done on card ending in ${cleanNumber.slice(-4)}`);
      setAmount("");
      setCardNumber("");
    } else {
      setTransactionMessage("❌ Invalid Card or Amount!");
    }
  };

  // Handle Delete Card
  const handleDelete = (index) => {
    const newCards = savedCards.filter((_, i) => i !== index);
    setSavedCards(newCards);
    localStorage.setItem("cards", JSON.stringify(newCards));
  };

  return (
    <div className="app-container fade-in">
      <h1 className="title">Credit & Debit Card Validator</h1>

      <div className="card-preview-wrapper">
        <div className="card-preview-3d">
          <div className="card-side card-front animated-glass">
            <div className="card-chip" />
            <div className="card-number">
              <AnimatePresence>
                {cardNumber
                  ? cardNumber.split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.05, delay: index * 0.03 }}
                        className="card-digit"
                      >
                        {char}
                      </motion.span>
                    ))
                  : "#### #### #### ####".split("").map((char, index) => (
                      <span key={index} className="card-digit placeholder">
                        {char}
                      </span>
                    ))}
              </AnimatePresence>
            </div>
            {cardType && <div className="card-type">{cardType}</div>}
          </div>

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
        placeholder="Enter Credit/Debit Card Number"
        value={cardNumber}
        onChange={handleChange}
        maxLength="19"
        className="card-input"
      />

      <p className={`message ${message.includes("Valid") ? "valid" : "invalid"}`}>{message}</p>

      {/* Card Type Selection */}
      <select
        value={cardCategory}
        onChange={(e) => setCardCategory(e.target.value)}
        className="card-type-selector"
      >
        <option value="credit">Credit Card</option>
        <option value="debit">Debit Card</option>
      </select>

      {/* Save Card Button */}
      <motion.button
        className="save-button"
        onClick={handleSaveCard}
        disabled={!validator.isCreditCard(cardNumber.replace(/\s/g, ""))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        💾 Save Card
      </motion.button>

      {/* Transaction Simulator */}
      <div className="transaction-section">
        <motion.input
          type="number"
          placeholder="Enter Amount (₹)"
          className="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button
          className="pay-button"
          onClick={handleTransaction}
          disabled={!validator.isCreditCard(cardNumber.replace(/\s/g, "")) || !amount}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          💳 Simulate Payment
        </motion.button>
        {transactionMessage && <p className="transaction-message">{transactionMessage}</p>}
      </div>

      {/* Saved Cards */}
      <div className="saved-cards">
        <h3>Saved Cards</h3>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {savedCards.length > 0 ? (
            savedCards.map((card, index) => (
              <motion.li
                key={index}
                className={`saved-card ${card.type}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <strong>{card.type.toUpperCase()}</strong>: {card.number}
                <button onClick={() => handleDelete(index)}>❌ Delete</button>
              </motion.li>
            ))
          ) : (
            <p>No cards saved yet!</p>
          )}
        </motion.ul>
      </div>

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
