import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ExpenseTracker from "./pages/ExpenseTracker";
import IncomeTracker from "./pages/IncomeTracker";
import BudgetPlanner from "./pages/BudgetPlanner";
import EMICalculator from "./pages/EMICalculator";
import SIPCalculator from "./pages/SIPCalculator";
import SavingsGoalCalculator from "./pages/SavingsGoalCalculator";
import ExpensePrediction from "./pages/ExpensePrediction";
import SpendingAnalysis from "./pages/SpendingAnalysis";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
            <Route path="/income" element={<ProtectedRoute><IncomeTracker /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
            <Route path="/calculators/emi" element={<ProtectedRoute><EMICalculator /></ProtectedRoute>} />
            <Route path="/calculators/sip" element={<ProtectedRoute><SIPCalculator /></ProtectedRoute>} />
            <Route path="/calculators/savings-goal" element={<ProtectedRoute><SavingsGoalCalculator /></ProtectedRoute>} />
            <Route path="/prediction" element={<ProtectedRoute><ExpensePrediction /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><SpendingAnalysis /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
