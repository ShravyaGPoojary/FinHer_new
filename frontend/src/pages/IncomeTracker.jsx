import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const now = new Date();

const IncomeTracker = () => {
  const [income, setIncome] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({ source: "Salary", amount: "", month: now.getMonth() + 1, year: now.getFullYear() });
  const [error, setError] = useState("");

  const loadData = async () => {
    const [hist, sum] = await Promise.all([api.get("/income"), api.get("/income/monthly-summary")]);
    setIncome(hist.data);
    setSummary(sum.data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/income", form);
      setForm({ ...form, amount: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add income.");
    }
  };

  return (
    <div>
      <h1>Income Tracker</h1>

      <div className="card card--income">
        <h3>Add income</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Source</label>
              <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Salary, Allowance, Freelance..." required />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Month</label>
              <input type="number" min="1" max="12" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-gold">Add income</button>
        </form>
      </div>

      <div className="card">
        <h3>Monthly totals</h3>
        {summary.length === 0 ? <p className="muted">No income recorded yet.</p> : (
          <div className="grid grid-3">
            {summary.map((s) => (
              <div key={`${s._id.year}-${s._id.month}`} className="card card--income" style={{ margin: 0 }}>
                <div className="stat-label">{s._id.month}/{s._id.year}</div>
                <div className="stat-value amount-income">₹{s.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>History</h3>
        {income.length === 0 ? <p className="muted">No entries yet.</p> : (
          <table className="ledger">
            <thead><tr><th>Month/Year</th><th>Source</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
            <tbody>
              {income.map((inc) => (
                <tr key={inc._id}>
                  <td>{inc.month}/{inc.year}</td>
                  <td><span className="pill">{inc.source}</span></td>
                  <td className="figure amount-income">₹{inc.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncomeTracker;
