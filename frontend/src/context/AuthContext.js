import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("finher_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("finher_token", data.token);
    localStorage.setItem("finher_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("finher_token", data.token);
    localStorage.setItem("finher_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("finher_token");
    localStorage.removeItem("finher_user");
    setUser(null);
  };

  useEffect(() => {
    // Keep profile fresh on load if a token exists
    const token = localStorage.getItem("finher_token");
    if (token && !user) {
      setLoading(true);
      api
        .get("/auth/profile")
        .then(({ data }) => setUser(data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
