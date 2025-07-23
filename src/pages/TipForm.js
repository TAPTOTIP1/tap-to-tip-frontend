import React, { useState } from "react";
import "./styles/TipForm.css";

export default function TipForm() {
  const presetOptions = [1, 5, 10, 20];
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePresetClick = (value) => {
    setSelectedPreset(value);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedPreset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalAmount = selectedPreset || parseFloat(customAmount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError("Please enter or select a valid amount.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://tap-to-tip-backend-production.up.railway.app/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount * 100 }), // convert to cents
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
    }

    setLoading(false);
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
              className={`preset-button ${selectedPreset === value ? "selected" : ""}`}
              onClick={() => handlePresetClick(value)}
            >
              ${value}
            </button>
          ))}
        </div>
        <p className="or">or enter custom amount</p>
        <input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={handleCustomChange}
          className="tip-input"
        />
        <button type="submit" disabled={loading} className="tip-button">
          {loading ? "Processing..." : "Send Tip"}
        </button>
      </form>
      {error && <p className="tip-error">{error}</p>}
    </div>
  );
}
