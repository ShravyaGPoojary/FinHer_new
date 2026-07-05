const Expense = require("../models/Expense");
const Income = require("../models/Income");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/dashboard/summary?month=&year=
const getDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const [totalExpenseAgg] = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const [totalIncomeAgg] = await Income.aggregate([
    { $match: { userId: req.user._id, month, year } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalExpense = totalExpenseAgg?.total || 0;
  const totalIncome = totalIncomeAgg?.total || 0;

  const categoryBreakdown = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);

  res.json({
    month,
    year,
    totalIncome,
    totalExpense,
    savings: totalIncome - totalExpense,
    savingsRate: totalIncome ? Number(((totalIncome - totalExpense) / totalIncome * 100).toFixed(2)) : 0,
    categoryBreakdown,
  });
});

// GET /api/dashboard/trends?months=6  -> monthly expense trend for charts
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const monthsBack = Number(req.query.months) || 6;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);

  const trends = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: startDate } } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        totalExpense: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json(trends);
});

module.exports = { getDashboardSummary, getMonthlyTrends };