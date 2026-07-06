import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FinHer</Link>
      {user ? (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/income">Income</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/calculators/emi">Calculators</Link>
          <Link to="/prediction">Prediction</Link>
          <Link to="/analysis">Analysis</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout} className="btn-link">Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
