import React, { useState } from "react";
import api from "../api/axiosConfig";

const CLUSTER_COLOR = {
  Saver: "card--income",
  "Balanced Spender": "",
  "Heavy Spender": "card--expense",
};

const SpendingAnalysis = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ml/spending-cluster");
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Analysis failed. Log some expenses and income first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Spending Pattern Analysis</h1>
      <p className="muted">
        K-Means clustering groups your last 3 months of spending behaviour into one of three profiles:
        Saver, Balanced Spender, or Heavy Spender — then gives you tailored tips.
      </p>
      <button className="btn btn-gold" onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze my spending pattern"}
      </button>

      {error && <p className="error-text" style={{ marginTop: 16 }}>{error}</p>}

      {result && (
        <div className={`card ${CLUSTER_COLOR[result.cluster]}`} style={{ marginTop: 20 }}>
          <div className="stat-label">Your spending profile</div>
          <h2>{result.cluster}</h2>
          <p className="muted">Spend ratio: {(result.spendRatio * 100).toFixed(0)}% of income · Category diversity: {(result.categoryDiversity * 100).toFixed(0)}%</p>
          <h3 style={{ marginTop: 16 }}>Recommendations</h3>
          <ul>
            {result.recommendations.map((r, i) => <li key={i} style={{ marginBottom: 8 }}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpendingAnalysis;
