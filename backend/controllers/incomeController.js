const Income = require("../models/Income");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/income
const addIncome = asyncHandler(async (req, res) => {
  const { source, amount, month, year, date } = req.body;
  const income = await Income.create({ userId: req.user._id, source, amount, month, year, date });
  res.status(201).json(income);
});

// GET /api/income?year=2026
const getIncomeHistory = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const filter = { userId: req.user._id };
  if (year) filter.year = Number(year);
  if (month) filter.month = Number(month);

  const income = await Income.find(filter).sort({ year: -1, month: -1 });
  res.json(income);
});

// GET /api/income/monthly-summary  -> total income grouped by month/year
const getMonthlyIncomeSummary = asyncHandler(async (req, res) => {
  const summary = await Income.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: { year: "$year", month: "$month" }, total: { $sum: "$amount" } } },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
  res.json(summary);
});

module.exports = { addIncome, getIncomeHistory, getMonthlyIncomeSummary };