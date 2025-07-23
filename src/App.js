import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Success from "./pages/Success";
import Return from "./pages/Return";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/success" element={<Success />} />
        <Route path="/return/:connectedAccountId" element={<Return />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}><h2>404 Not Found</h2></div>} />
      </Routes>
    </Router>
  );
}
