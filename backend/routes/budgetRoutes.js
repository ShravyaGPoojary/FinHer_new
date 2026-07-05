const express = require("express");
const { body } = require("express-validator");
const { upsertBudget, getBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");

const router = express.Router();
router.use(protect);

router.post(
  "/",
  [
    body("userType").isIn(["student", "working_woman", "homemaker"]).withMessage("Invalid userType"),
    body("monthlyIncome").isFloat({ gt: 0 }).withMessage("monthlyIncome must be greater than 0"),
    body("needsPercent").optional().isFloat({ min: 0, max: 100 }),
    body("wantsPercent").optional().isFloat({ min: 0, max: 100 }),
    body("savingsPercent").optional().isFloat({ min: 0, max: 100 }),
  ],
  validateRequest,
  upsertBudget
);
router.get("/", getBudget);

module.exports = router;