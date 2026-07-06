"""
Phase 8: Spending Pattern Analysis
K-Means clustering that groups users into behavioural segments:
Saver, Balanced Spender, Heavy Spender.

Features used (see analysis/cluster_analysis.py for why these two + k=3):
  1. spend_ratio        = TotalExpense / MonthlyIncome   (capped at 1.5)
  2. category_diversity = (# categories with any spend) / 8

Both are engineered, scale-free ratios rather than raw amounts, so the same
model works for a student spending ₹15,000/month and a working woman spending
₹80,000/month - it's their *behaviour*, not their income bracket, being clustered.
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "kmeans_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "kmeans_scaler.pkl")
DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "clustering_dataset.csv")

CATEGORIES = ["Food", "Shopping", "Transport", "Healthcare", "Education", "Entertainment", "Utilities", "Others"]

RECOMMENDATIONS_BY_CLUSTER = {
    "Saver": [
        "Great discipline! Consider directing extra savings into a SIP for long-term wealth creation.",
        "You're spending well below your income - explore a recurring deposit or index fund for idle savings.",
    ],
    "Balanced Spender": [
        "Your spending is fairly balanced. Track discretionary categories like Shopping and Entertainment monthly.",
        "Consider automating a fixed savings transfer right after payday to lock in your 20% savings goal.",
    ],
    "Heavy Spender": [
        "Your expenses are consuming most of your income. Review Shopping and Entertainment spends first.",
        "Try the 50-30-20 budget planner to cap discretionary categories and rebuild your savings buffer.",
    ],
}


def _engineer_features(df: pd.DataFrame) -> np.ndarray:
    spend_ratio = (df["TotalExpense"] / df["MonthlyIncome"]).clip(upper=1.5)
    category_diversity = (df[CATEGORIES] > 0).sum(axis=1) / len(CATEGORIES)
    return np.column_stack([spend_ratio.values, category_diversity.values])


def train_clustering_model(dataset_path: str = DATASET_PATH, k: int = 3):
    df = pd.read_csv(dataset_path)
    X = _engineer_features(df)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)

    # Map arbitrary cluster indices -> meaningful labels by ordering centroids
    # by their mean spend_ratio (ascending -> Saver, Balanced, Heavy Spender)
    centroids_unscaled = scaler.inverse_transform(kmeans.cluster_centers_)
    order = np.argsort(centroids_unscaled[:, 0])
    label_names = ["Saver", "Balanced Spender", "Heavy Spender"]
    label_map = {int(order[i]): label_names[i] for i in range(len(order))}

    # Optional sanity check against the synthetic ground-truth labels (validation only,
    # NEVER used during fitting - KMeans remains fully unsupervised)
    if "true_segment" in df.columns:
        predicted_labels = pd.Series([label_map[c] for c in kmeans.labels_])
        agreement = (predicted_labels.values == df["true_segment"].values).mean()
        print(f"[spending_clustering] agreement with synthetic ground truth: {agreement*100:.1f}%")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump({"model": kmeans, "label_map": label_map}, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print(f"[spending_clustering] trained on {len(df)} rows. label_map = {label_map}")
    return kmeans, scaler, label_map


def load_model():
    if not os.path.exists(MODEL_PATH):
        return None, None, None
    bundle = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return bundle["model"], scaler, bundle["label_map"]


def get_cluster_for_user(category_totals: dict, monthly_income: float):
    model, scaler, label_map = load_model()
    if model is None:
        train_clustering_model()
        model, scaler, label_map = load_model()

    total_spend = sum(category_totals.values())
    spend_ratio = min(total_spend / monthly_income, 1.5) if monthly_income else 1.0

    nonzero_categories = sum(1 for v in category_totals.values() if v > 0)
    category_diversity = min(nonzero_categories / len(CATEGORIES), 1.0)

    features = scaler.transform([[spend_ratio, category_diversity]])
    cluster_idx = int(model.predict(features)[0])
    label = label_map.get(cluster_idx, "Balanced Spender")

    return {
        "cluster": label,
        "spendRatio": round(spend_ratio, 2),
        "categoryDiversity": round(category_diversity, 2),
        "recommendations": RECOMMENDATIONS_BY_CLUSTER[label],
    }