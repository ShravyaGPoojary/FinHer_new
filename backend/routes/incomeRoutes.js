const express = require("express");
const { body } = require("express-validator");
const { addIncome, getIncomeHistory, getMonthlyIncomeSummary } = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");

const router = express.Router();
router.use(protect);

router.post(
  "/",
  [
    body("source").notEmpty().withMessage("Income source is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
    body("year").isInt({ min: 2000 }).withMessage("Year is required"),
  ],
  validateRequest,
  addIncome
);

router.get("/", getIncomeHistory);
router.get("/monthly-summary", getMonthlyIncomeSummary);

module.exports = router;