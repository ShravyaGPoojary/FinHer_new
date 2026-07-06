import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../api/axiosConfig";

const COLORS = ["#c99a3c", "#b4536b", "#5b8c72", "#6b5c7a", "#241934", "#e8cf95", "#8a6fa0", "#a8845c"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/summary"), api.get("/dashboard/trends?months=6")])
      .then(([s, t]) => {
        setSummary(s.data);
        setTrends(t.data.map((d) => ({ label: `${d._id.month}/${d._id.year}`, total: d.totalExpense })));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">Your financial snapshot for this month.</p>

      <div className="grid grid-3">
        <div className="card card--income">
          <div className="stat-label">Total Income</div>
          <div className="stat-value amount-income">₹{summary.totalIncome.toLocaleString()}</div>
        </div>
        <div className="card card--expense">
          <div className="stat-label">Total Expense</div>
          <div className="stat-value amount-expense">₹{summary.totalExpense.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="stat-label">Savings ({summary.savingsRate}%)</div>
          <div className="stat-value amount-savings">₹{summary.savings.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Category-wise breakdown</h3>
          {summary.categoryBreakdown.length === 0 ? (
            <p className="muted">No expenses logged yet this month.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={summary.categoryBreakdown} dataKey="total" nameKey="_id" outerRadius={90} label={(d) => d._id}>
                  {summary.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3>Monthly expense trend</h3>
          {trends.length === 0 ? (
            <p className="muted">Not enough history yet to show a trend.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trends}>
                <CartesianGrid stroke="#e3dccf" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="total" stroke="#c99a3c" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
