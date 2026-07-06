import React, { useState } from "react";
import api from "../api/axiosConfig";

const SIPCalculator = () => {
  const [form, setForm] = useState({ monthlyInvestment: "", annualRate: "", tenureYears: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/calculators/sip", form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not calculate SIP.");
    }
  };

  return (
    <div>
      <h1>SIP Calculator</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Monthly investment (₹)</label>
              <input type="number" min="0" value={form.monthlyInvestment} onChange={(e) => setForm({ ...form, monthlyInvestment: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Expected annual return (%)</label>
              <input type="number" step="0.01" value={form.annualRate} onChange={(e) => setForm({ ...form, annualRate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Tenure (years)</label>
              <input type="number" min="1" value={form.tenureYears} onChange={(e) => setForm({ ...form, tenureYears: e.target.value })} required />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-gold">Calculate SIP</button>
        </form>
      </div>
      {result && (
        <div className="grid grid-3">
          <div className="card"><div className="stat-label">Total Invested</div><div className="stat-value">₹{result.totalInvested.toLocaleString()}</div></div>
          <div className="card card--income"><div className="stat-label">Estimated Returns</div><div className="stat-value amount-income">₹{result.estimatedReturns.toLocaleString()}</div></div>
          <div className="card"><div className="stat-label">Maturity Value</div><div className="stat-value">₹{result.maturityValue.toLocaleString()}</div></div>
        </div>
      )}
    </div>
  );
};

export default SIPCalculator;
