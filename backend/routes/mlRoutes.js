const express = require("express");
const { predictExpense, getSpendingCluster, getRecommendations } = require("../controllers/mlController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/predict-expense", predictExpense);
router.post("/spending-cluster", getSpendingCluster);
router.post("/recommendations", getRecommendations);

module.exports = router;