const Budget = require("../models/Budget");
const asyncHandler = require("../utils/asyncHandler");

// Presets that adjust the classic 50-30-20 rule per user segment
const USER_TYPE_PRESETS = {
  student: { needsPercent: 45, wantsPercent: 30, savingsPercent: 25 },
  working_woman: { needsPercent: 50, wantsPercent: 30, savingsPercent: 20 },
  homemaker: { needsPercent: 60, wantsPercent: 20, savingsPercent: 20 },
};

// POST /api/budget  - create or update the user's budget plan
const upsertBudget = asyncHandler(async (req, res) => {
  const { userType, monthlyIncome, needsPercent, wantsPercent, savingsPercent, categoryLimits } = req.body;

  const preset = USER_TYPE_PRESETS[userType] || USER_TYPE_PRESETS.working_woman;

  const finalNeeds = needsPercent ?? preset.needsPercent;
  const finalWants = wantsPercent ?? preset.wantsPercent;
  const finalSavings = savingsPercent ?? preset.savingsPercent;

  const total = finalNeeds + finalWants + finalSavings;
  if (Math.abs(total - 100) > 0.01) {
    res.status(400);
    throw new Error("needsPercent + wantsPercent + savingsPercent must equal 100");
  }

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id },
    {
      userId: req.user._id,
      userType,
      monthlyIncome,
      needsPercent: finalNeeds,
      wantsPercent: finalWants,
      savingsPercent: finalSavings,
      categoryLimits,
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.json({
    budget,
    breakdown: {
      needsAmount: (monthlyIncome * finalNeeds) / 100,
      wantsAmount: (monthlyIncome * finalWants) / 100,
      savingsAmount: (monthlyIncome * finalSavings) / 100,
    },
  });
});

// GET /api/budget
const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ userId: req.user._id });
  if (!budget) {
    return res.status(404).json({ message: "No budget plan found. Create one first." });
  }
  res.json(budget);
});

module.exports = { upsertBudget, getBudget, USER_TYPE_PRESETS };