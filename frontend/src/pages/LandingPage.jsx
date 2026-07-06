import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero">
        <h1>Your money, in your own words.</h1>
        <p>
          FinHer helps students, working women, and homemakers track spending,
          build savings habits, and plan ahead — with a budget model shaped
          around real life, not a generic template.
        </p>
        {/* Signature element: the running ledger tick-line */}
        <div className="ledger-line" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className={`tick ${i % 4 === 0 ? "major" : ""}`} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-gold">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-gold">Get started free</Link>
              <Link to="/login" className="btn btn-outline" style={{ color: "var(--paper)", borderColor: "var(--gold-light)" }}>
                I already have an account
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="grid grid-3">
        <div className="card">
          <h3>Track every rupee</h3>
          <p className="muted">Log expenses and income across 8 categories, filter by date, and see exactly where your money goes.</p>
        </div>
        <div className="card card--income">
          <h3>Budget that fits your life</h3>
          <p className="muted">A customizable Needs / Wants / Savings split — different defaults for students, working women, and homemakers.</p>
        </div>
        <div className="card card--expense">
          <h3>See what's coming</h3>
          <p className="muted">Machine learning predicts next month's spend and groups your habits into Saver, Balanced, or Heavy Spender.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
