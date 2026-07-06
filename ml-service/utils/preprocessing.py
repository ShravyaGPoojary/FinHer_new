"""
Shared preprocessing helpers for FinHer ML models.

IMPORTANT (Phase 7 design decision):
The real prediction task is "given this month's income + category spending,
predict NEXT month's total expense" - a genuine forecasting problem, not
"predict this month's total from this month's categories" (which would be a
trivial identity, since TotalExpense = sum(categories) by definition and a
linear model would trivially get R2 = 1.0 with zero real signal learned).

build_feature_matrix() therefore shifts the target forward by one month
*within each user's own history* before handing (X, y) to the model.
"""
import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    "Income", "Food", "Shopping", "Transport",
    "Healthcare", "Education", "Entertainment", "Utilities", "Others",
]


def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df = df.dropna()
    return df


def build_feature_matrix(df: pd.DataFrame):
    """
    Returns X (this month's features) and y (NEXT month's TotalExpense) as
    numpy arrays, built per UserId so history never leaks across users.
    Falls back to same-month target if no UserId column is present (e.g. a
    single-user real-data export) - documented as a known simplification.
    """
    if "UserId" not in df.columns:
        X = df[FEATURE_COLUMNS].values
        y = df["TotalExpense"].values
        return X, y

    df = df.sort_values(["UserId", "Month"]).copy()
    df["NextMonthExpense"] = df.groupby("UserId")["TotalExpense"].shift(-1)
    df = df.dropna(subset=["NextMonthExpense"])  # drop each user's last month (no "next" to predict)

    X = df[FEATURE_COLUMNS].values
    y = df["NextMonthExpense"].values
    return X, y


def normalize_history_payload(history_docs, income_docs):
    """
    Converts the raw Mongo aggregation payload from the Node backend into a
    flat feature row matching FEATURE_COLUMNS, so the trained model can score
    it directly.
    """
    totals_by_category = {}
    for doc in history_docs:
        category = doc["_id"]["category"]
        totals_by_category[category] = totals_by_category.get(category, 0) + doc["total"]

    avg_income = sum(d["total"] for d in income_docs) / len(income_docs) if income_docs else 0

    row = {
        "Income": avg_income,
        "Food": totals_by_category.get("Food", 0),
        "Shopping": totals_by_category.get("Shopping", 0),
        "Transport": totals_by_category.get("Transport", 0),
        "Healthcare": totals_by_category.get("Healthcare", 0),
        "Education": totals_by_category.get("Education", 0),
        "Entertainment": totals_by_category.get("Entertainment", 0),
        "Utilities": totals_by_category.get("Utilities", 0),
        "Others": totals_by_category.get("Others", 0),
    }
    return np.array([[row[c] for c in FEATURE_COLUMNS]]), row