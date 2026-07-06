import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const PRESET_HINT = {
  student: "45% Needs · 30% Wants · 25% Savings",
  working_woman: "50% Needs · 30% Wants · 20% Savings",
  homemaker: "60% Needs · 20% Wants · 20% Savings",
};

const BudgetPlanner = () => {
  const [form, setForm] = useState({ userType: "working_woman", monthlyIncome: "", needsPercent: "", wantsPercent: "", savingsPercent: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/budget").then(({ data }) => {
      setForm({
        userType: data.userType,
        monthlyIncome: data.monthlyIncome,
        needsPercent: data.needsPercent,
        wantsPercent: data.wantsPercent,
        savingsPercent: data.savingsPercent,
      });
    }).catch(() => {}); // no budget yet - fine, use defaults
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form };
    ["needsPercent", "wantsPercent", "savingsPercent"].forEach((k) => {
      if (payload[k] === "") delete payload[k];
    });
    try {
      const { data } = await api.post("/budget", payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save budget.");
    }
  };

  return (
    <div>
      <h1>Budget Planner</h1>
      <p className="muted">A customizable Needs / Wants / Savings split. Leave the percentages blank to use the default for your profile.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>I am a...</label>
              <select value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })}>
                <option value="student">Student</option>
                <option value="working_woman">Working woman</option>
                <option value="homemaker">Homemaker</option>
              </select>
              <p className="muted" style={{ margin: "6px 0 0", fontSize: "0.78rem" }}>Default: {PRESET_HINT[form.userType]}</p>
            </div>
            <div className="form-group">
              <label>Monthly income (₹)</label>
              <input type="number" min="0" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Needs % (optional override)</label>
              <input type="number" value={form.needsPercent} onChange={(e) => setForm({ ...form, needsPercent: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Wants % (optional override)</label>
              <input type="number" value={form.wantsPercent} onChange={(e) => setForm({ ...form, wantsPercent: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Savings % (optional override)</label>
              <input type="number" value={form.savingsPercent} onChange={(e) => setForm({ ...form, savingsPercent: e.target.value })} />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-gold">Save budget plan</button>
        </form>
      </div>

      {result && (
        <div className="grid grid-3">
          <div className="card">
            <div className="stat-label">Needs ({result.budget.needsPercent}%)</div>
            <div className="stat-value">₹{result.breakdown.needsAmount.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="stat-label">Wants ({result.budget.wantsPercent}%)</div>
            <div className="stat-value">₹{result.breakdown.wantsAmount.toLocaleString()}</div>
          </div>
          <div className="card card--income">
            <div className="stat-label">Savings ({result.budget.savingsPercent}%)</div>
            <div className="stat-value amount-savings">₹{result.breakdown.savingsAmount.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
