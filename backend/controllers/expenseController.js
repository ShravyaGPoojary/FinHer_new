const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/expenses
const addExpense = asyncHandler(async (req, res) => {
  const { category, amount, date, description } = req.body;
  const expense = await Expense.create({
    userId: req.user._id,
    category,
    amount,
    date,
    description,
  });
  res.status(201).json(expense);
});

// GET /api/expenses?category=Food&startDate=&endDate=&page=1&limit=20
const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = { userId: req.user._id };
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const expenses = await Expense.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Expense.countDocuments(filter);

  res.json({ expenses, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// PUT /api/expenses/:id
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const { category, amount, date, description } = req.body;
  expense.category = category ?? expense.category;
  expense.amount = amount ?? expense.amount;
  expense.date = date ?? expense.date;
  expense.description = description ?? expense.description;

  const updated = await expense.save();
  res.json(updated);
});

// DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  res.json({ message: "Expense deleted", id: req.params.id });
});

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };