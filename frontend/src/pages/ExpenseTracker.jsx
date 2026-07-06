import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const CATEGORIES = ["Food", "Shopping", "Transport", "Education", "Healthcare", "Entertainment", "Utilities", "Others"];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "Food", amount: "", date: new Date().toISOString().slice(0, 10), description: "" });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ category: "", startDate: "", endDate: "" });
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    const { data } = await api.get("/expenses", { params });
    setExpenses(data.expenses);
  };

  useEffect(() => { loadExpenses(); }, [filters]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/expenses", form);
      }
      setForm({ category: "Food", amount: "", date: new Date().toISOString().slice(0, 10), description: "" });
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save expense.");
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({ category: exp.category, amount: exp.amount, date: exp.date.slice(0, 10), description: exp.description });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    loadExpenses();
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <div className="card card--expense">
        <h3>{editingId ? "Edit expense" : "Add an expense"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional note" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-gold">{editingId ? "Save changes" : "Add expense"}</button>
            {editingId && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setForm({ category: "Food", amount: "", date: new Date().toISOString().slice(0, 10), description: "" }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Filter</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>From</label>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>History</h3>
        {expenses.length === 0 ? (
          <p className="muted">No expenses match these filters yet.</p>
        ) : (
          <table className="ledger">
            <thead>
              <tr><th>Date</th><th>Category</th><th>Description</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td><span className="pill">{exp.category}</span></td>
                  <td className="muted">{exp.description || "—"}</td>
                  <td className="figure amount-expense">₹{exp.amount.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(exp)}>Edit</button>{" "}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
