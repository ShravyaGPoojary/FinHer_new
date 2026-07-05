const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, required: true, default: "Salary" }, // Salary, Allowance, Freelance, Other
    amount: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

incomeSchema.index({ userId: 1, year: 1, month: 1 });

module.exports = mongoose.model("Income", incomeSchema);