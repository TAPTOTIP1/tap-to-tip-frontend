import React, { useState } from "react";

export default function TipForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     const res = await fetch("https://tap-to-tip-backend-production.up.railway.app/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // convert dollars to cents
        }),
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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>💸 Tip a Worker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "10px", fontSize: "1rem", marginBottom: "10px", width: "200px" }}
        />
        <br />
        <button
          type="submit"
          disabled={loading || !amount}
          style={{ padding: "10px 20px", fontSize: "1rem" }}
        >
          {loading ? "Loading..." : "Send Tip"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
