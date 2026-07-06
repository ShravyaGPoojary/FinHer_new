import React, { useState } from "react";
import api from "../api/axiosConfig";

const ExpensePrediction = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ml/predict-expense", { monthsBack: 6 });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Prediction failed. Log a few months of expenses first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Expense Prediction</h1>
      <p className="muted">
        A Linear Regression model trained on monthly spending patterns forecasts your total expense for next month,
        based on your last 6 months of history.
      </p>
      <button className="btn btn-gold" onClick={runPrediction} disabled={loading}>
        {loading ? "Predicting..." : "Predict next month's expense"}
      </button>

      {error && <p className="error-text" style={{ marginTop: 16 }}>{error}</p>}

      {result && (
        <div className="card card--expense" style={{ marginTop: 20 }}>
          <div className="stat-label">Predicted expense — next month</div>
          <div className="stat-value amount-expense">₹{result.predictedNextMonthExpense.toLocaleString()}</div>
          <h3 style={{ marginTop: 18 }}>Based on your recent averages</h3>
          <table className="ledger">
            <tbody>
              {Object.entries(result.basedOn).map(([k, v]) => (
                <tr key={k}><td>{k}</td><td className="figure">₹{Number(v).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensePrediction;
