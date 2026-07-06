"""
FinHer ML Microservice
Flask API that serves three ML features to the Node/Express backend:
  1. POST /predict-expense     - Linear Regression expense forecast
  2. POST /spending-cluster    - K-Means spending behaviour segmentation
  3. POST /recommendations     - Rule-based budget recommendation engine
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from models.expense_prediction import predict_next_month, load_model as load_expense_model
from models.spending_clustering import get_cluster_for_user
from models.recommendation_engine import generate_recommendations
from utils.preprocessing import normalize_history_payload

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "FinHer ML Microservice"})


@app.route("/predict-expense", methods=["POST"])
def predict_expense():
    body = request.get_json(force=True) or {}
    history = body.get("history", [])
    income_history = body.get("incomeHistory", [])

    model, _ = load_expense_model()
    if model is None:
        return jsonify({
            "error": "Model not trained yet. Run `python train_models.py` in ml-service/ first."
        }), 503

    feature_row, readable_row = normalize_history_payload(history, income_history)
    predicted = predict_next_month(feature_row)

    return jsonify({
        "predictedNextMonthExpense": predicted,
        "basedOn": readable_row,
    })


@app.route("/spending-cluster", methods=["POST"])
def spending_cluster():
    body = request.get_json(force=True) or {}
    category_totals_raw = body.get("categoryTotals", [])
    monthly_income = body.get("monthlyIncome", 0)

    category_totals = {item["_id"]: item["total"] for item in category_totals_raw}
    result = get_cluster_for_user(category_totals, monthly_income)
    return jsonify(result)


@app.route("/recommendations", methods=["POST"])
def recommendations():
    body = request.get_json(force=True) or {}
    category_totals_raw = body.get("categoryTotals", [])
    monthly_income = body.get("monthlyIncome", 0)
    user_type = body.get("userType", "working_woman")

    category_totals = {item["_id"]: item["total"] for item in category_totals_raw}
    recs = generate_recommendations(category_totals, monthly_income, user_type)
    return jsonify({"recommendations": recs})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)