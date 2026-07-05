const express = require("express");
const { body } = require("express-validator");
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");

const router = express.Router();
router.use(protect);

router.post(
  "/",
  [
    body("category").notEmpty(),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("date").notEmpty(),
  ],
  validateRequest,
  addExpense
);

router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;