import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", userType: "working_woman", age: "", occupation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 440, margin: "40px auto" }}>
      <h2>Create your FinHer account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password (min 6 characters)</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
        </div>
        <div className="form-group">
          <label>I am a...</label>
          <select name="userType" value={form.userType} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="working_woman">Working woman</option>
            <option value="homemaker">Homemaker</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input name="occupation" value={form.occupation} onChange={handleChange} />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-gold btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 14 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
