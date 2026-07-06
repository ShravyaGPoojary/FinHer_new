const asyncHandler = require("../utils/asyncHandler");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Recommendation = require("../models/Recommendation");
const mlService = require("../services/mlService");

// POST /api/ml/predict-expense
// Builds the last N months of category-wise expense history for this user
// and forwards it to the Python ML microservice for a Linear Regression prediction.
const predictExpense = asyncHandler(async (req, res) => {
  const monthsBack = Number(req.body.monthsBack) || 6;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);

  const history = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate } } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" }, category: "$category" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  const incomeHistory = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: { year: "$year", month: "$month" }, total: { $sum: "$amount" } } },
  ]);

  const result = await mlService.predictNextMonthExpense({ history, incomeHistory });
  res.json(result);
});

// POST /api/ml/spending-cluster
const getSpendingCluster = asyncHandler(async (req, res) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  const categoryTotals = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  const [incomeAgg] = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: null, avgMonthly: { $avg: "$amount" } } },
  ]);

  const result = await mlService.getSpendingCluster({
    categoryTotals,
    monthlyIncome: incomeAgg?.avgMonthly || 0,
  });

  res.json(result);
});

// POST /api/ml/recommendations
// Calls the Python rule-based/ML recommendation engine, then persists results.
const getRecommendations = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const categoryTotals = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  const [incomeAgg] = await Income.aggregate([
    { $match: { userId: req.user._id, month, year } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const result = await mlService.getRecommendations({
    categoryTotals,
    monthlyIncome: incomeAgg?.total || 0,
    userType: req.user.userType,
  });

  const docs = (result.recommendations || []).map((r) => ({
    userId: req.user._id,
    type: r.type,
    category: r.category || "",
    message: r.message,
    month,
    year,
  }));
  if (docs.length) await Recommendation.insertMany(docs);

  res.json(result);
});

module.exports = { predictExpense, getSpendingCluster, getRecommendations };