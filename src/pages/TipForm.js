import React, { useState } from "react";
import "../styles/TipForm.css";

export default function TipForm() {
  const presetOptions = [1, 5, 10, 20];
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createCheckout = async (amount) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://tap-to-tip-backend-production.up.railway.app/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), // convert to cents
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session.");
      }
    } catch (err) {
      console.error(err.message);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handlePresetClick = (value) => {
    createCheckout(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = parseFloat(customAmount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    createCheckout(finalAmount);
  };

  return (
    <div className="tip-container">
      <h1 className="title">Choose a Tip Amount</h1>
      <form onSubmit={handleSubmit}>
        <div className="preset-options">
          {presetOptions.map((value) => (
            <button
              key={value}
              type="button"
              className="preset-button"
              onClick={() => handlePresetClick(value)}
              disabled={loading}
            >
              ${value}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="tip-input"
          disabled={loading}
        />

        <button type="submit" disabled={loading} className="tip-button">
          {loading ? "Processing..." : "Send Tip"}
        </button>
      </form>
      {error && <p className="tip-error">{error}</p>}
    </div>
  );
}
