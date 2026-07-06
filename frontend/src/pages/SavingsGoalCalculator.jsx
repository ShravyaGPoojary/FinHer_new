import React, { useState } from "react";
import api from "../api/axiosConfig";

const SavingsGoalCalculator = () => {
  const [form, setForm] = useState({ goalAmount: "", currentSavings: "0", monthlyContribution: "", annualRate: "0" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/calculators/savings-goal", form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not calculate savings goal.");
    }
  };

  return (
    <div>
      <h1>Savings Goal Calculator</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Goal amount (₹)</label>
              <input type="number" min="0" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Current savings (₹)</label>
              <input type="number" min="0" value={form.currentSavings} onChange={(e) => setForm({ ...form, currentSavings: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Monthly contribution (₹)</label>
              <input type="number" min="0" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Annual interest rate (%)</label>
              <input type="number" step="0.01" value={form.annualRate} onChange={(e) => setForm({ ...form, annualRate: e.target.value })} />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-gold">Calculate</button>
        </form>
      </div>
      {result && (
        <div className="grid grid-3">
          <div className="card"><div className="stat-label">Months Required</div><div className="stat-value">{result.monthsRequired}</div></div>
          <div className="card"><div className="stat-label">Years Required</div><div className="stat-value">{result.yearsRequired}</div></div>
          <div className="card card--income"><div className="stat-label">Final Balance</div><div className="stat-value amount-income">₹{result.projectedFinalBalance.toLocaleString()}</div></div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalCalculator;
