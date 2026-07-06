import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", userType: user?.userType || "working_woman",
    age: user?.age || "", occupation: user?.occupation || "", monthlyIncome: user?.monthlyIncome || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/auth/profile", form);
    setUser(data);
    localStorage.setItem("finher_user", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1>Your Profile</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Profile type</label>
            <select value={form.userType} onChange={(e) => setForm({ ...form, userType: e.target.value })}>
              <option value="student">Student</option>
              <option value="working_woman">Working woman</option>
              <option value="homemaker">Homemaker</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Typical monthly income (₹)</label>
            <input type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} />
          </div>
          <button className="btn btn-gold">Save changes</button>
          {saved && <span className="muted" style={{ marginLeft: 12 }}>Saved ✓</span>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
