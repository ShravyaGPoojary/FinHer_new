const axios = require("axios");

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Thin client that talks to the Python (Flask) ML microservice
const mlService = {
  predictNextMonthExpense: async (payload) => {
    const { data } = await axios.post(`${ML_BASE_URL}/predict-expense`, payload, { timeout: 8000 });
    return data;
  },

  getSpendingCluster: async (payload) => {
    const { data } = await axios.post(`${ML_BASE_URL}/spending-cluster`, payload, { timeout: 8000 });
    return data;
  },

  getRecommendations: async (payload) => {
    const { data } = await axios.post(`${ML_BASE_URL}/recommendations`, payload, { timeout: 8000 });
    return data;
  },
};

module.exports = mlService;