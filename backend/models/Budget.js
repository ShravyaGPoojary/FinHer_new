const mongoose = require("mongoose");

// Implements a customizable Needs / Wants / Savings framework (default 50-30-20)
const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    userType: { type: String, enum: ["student", "working_woman", "homemaker"], required: true },
    monthlyIncome: { type: Number, required: true, min: 0 },
    needsPercent: { type: Number, default: 50 },
    wantsPercent: { type: Number, default: 30 },
    savingsPercent: { type: Number, default: 20 },
    categoryLimits: {
      type: Map,
      of: Number, // category -> monthly limit amount
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);