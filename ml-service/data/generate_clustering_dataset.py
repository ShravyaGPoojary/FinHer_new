"""
Phase 8 - Synthetic dataset generator for Spending Pattern Analysis (K-Means).

A `true_segment` column is included ONLY for demo/validation purposes (to
sanity check that unsupervised KMeans rediscovers the 3 groups on its own) -
it is never fed into the model as a feature, since KMeans is unsupervised.
"""
import numpy as np
import pandas as pd
import os

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "clustering_dataset.csv")
CATEGORIES = ["Food", "Shopping", "Transport", "Healthcare", "Education", "Entertainment", "Utilities", "Others"]

SEGMENT_PROFILES = {
    "Saver": {"spend_ratio_mean": 0.35, "spend_ratio_std": 0.08, "active_categories": (3, 5)},
    "Balanced Spender": {"spend_ratio_mean": 0.60, "spend_ratio_std": 0.08, "active_categories": (5, 7)},
    "Heavy Spender": {"spend_ratio_mean": 0.90, "spend_ratio_std": 0.10, "active_categories": (6, 8)},
}


def generate_clustering_dataset(n_samples: int = 450, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []

    for _ in range(n_samples):
        segment = rng.choice(list(SEGMENT_PROFILES.keys()), p=[0.34, 0.33, 0.33])
        profile = SEGMENT_PROFILES[segment]

        income = rng.choice([15000, 25000, 35000, 45000, 60000]) + rng.normal(0, 2000)
        income = max(income, 5000)

        spend_ratio = np.clip(rng.normal(profile["spend_ratio_mean"], profile["spend_ratio_std"]), 0.1, 1.3)
        total_expense = income * spend_ratio

        n_active = rng.integers(profile["active_categories"][0], profile["active_categories"][1] + 1)
        active_categories = rng.choice(CATEGORIES, size=n_active, replace=False)

        weights = rng.dirichlet(np.ones(n_active))
        category_totals = {cat: 0.0 for cat in CATEGORIES}
        for cat, w in zip(active_categories, weights):
            category_totals[cat] = round(total_expense * w, 2)

        rows.append({
            "MonthlyIncome": round(income, 2),
            "TotalExpense": round(total_expense, 2),
            **category_totals,
            "true_segment": segment,
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate_clustering_dataset()
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Generated {len(df)} rows -> {OUTPUT_PATH}")
    print(df["true_segment"].value_counts())