"""
Feature A: Monthly Expense Prediction
Trains a Linear Regression model on historical monthly spending data to
predict next month's TOTAL expense.
"""
import os
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from utils.preprocessing import load_dataset, build_feature_matrix, FEATURE_COLUMNS

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "expense_predictor.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "expense_scaler.pkl")


def train_expense_model(dataset_path: str):
    df = load_dataset(dataset_path)
    X, y = build_feature_matrix(df)

    # Train/test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)

    metrics = {
        "mae": round(mean_absolute_error(y_test, y_pred), 2),
        "rmse": round(np.sqrt(mean_squared_error(y_test, y_pred)), 2),
        "r2_score": round(r2_score(y_test, y_pred), 4),
    }

    # Feature importance (coefficients on standardized features - directly comparable magnitude)
    feature_importance = dict(zip(FEATURE_COLUMNS, [round(c, 2) for c in model.coef_]))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print(f"[expense_prediction] trained on {len(df)} rows. metrics = {metrics}")
    print(f"[expense_prediction] feature importance (standardized coefficients) = {feature_importance}")
    return model, scaler, metrics


def load_model():
    if not os.path.exists(MODEL_PATH):
        return None, None
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler


def predict_next_month(feature_row: np.ndarray):
    """feature_row: shape (1, len(FEATURE_COLUMNS))"""
    model, scaler = load_model()
    if model is None:
        raise RuntimeError("Expense prediction model not trained yet. Run train_models.py first.")

    scaled = scaler.transform(feature_row)
    prediction = model.predict(scaled)[0]
    return max(0, round(float(prediction), 2))