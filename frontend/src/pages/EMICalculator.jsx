import React, { useState } from "react";
import api from "../api/axiosConfig";

const EMICalculator = () => {
  const [form, setForm] = useState({ principal: "", annualRate: "", tenureMonths: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/calculators/emi", form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not calculate EMI.");
    }
  };

  return (
    <div>
      <h1>EMI Calculator</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Loan amount (₹)</label>
              <input type="number" min="0" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Annual interest rate (%)</label>
              <input type="number" step="0.01" value={form.annualRate} onChange={(e) => setForm({ ...form, annualRate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Tenure (months)</label>
              <input type="number" min="1" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} required />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-gold">Calculate EMI</button>
        </form>
      </div>
      {result && (
        <div className="grid grid-3">
          <div className="card"><div className="stat-label">Monthly EMI</div><div className="stat-value">₹{result.emi.toLocaleString()}</div></div>
          <div className="card card--expense"><div className="stat-label">Total Interest</div><div className="stat-value amount-expense">₹{result.totalInterest.toLocaleString()}</div></div>
          <div className="card"><div className="stat-label">Total Payment</div><div className="stat-value">₹{result.totalPayment.toLocaleString()}</div></div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
