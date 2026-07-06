"""
Phase 7 - Synthetic dataset generator for Expense Prediction.

Why synthetic data at all?
FinHer is a brand-new platform - there isn't enough real user history yet to
train a reliable model. This script generates a realistic, structured dataset
that mimics how income and category-wise expenses actually behave over time
(income grows slowly, expenses scale with income + noise, festive/seasonal
months spike Shopping, etc.) so the Linear Regression model has something
sensible to learn from on day one.

Once FinHer has real user data (via Expense + Income collections in MongoDB),
utils/mongo_export.py shows how to swap this CSV for a real export - the rest
of the pipeline (preprocessing -> train/test split -> LinearRegression ->
evaluation -> save) does not change at all.
"""
import numpy as np
import pandas as pd
import os

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "expense_dataset.csv")


def generate_expense_dataset(n_users: int = 60, months_per_user: int = 12, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []

    for user_id in range(n_users):
        # Each synthetic "user" has a base income tier (student/working/homemaker-ish spread)
        base_income = rng.choice([15000, 25000, 35000, 45000, 60000], p=[0.2, 0.25, 0.25, 0.2, 0.1])
        income_growth = rng.uniform(0, 400)  # slow monthly salary growth/increment

        # Each user has a personal "spending style" multiplier per category
        style = {
            "Food": rng.uniform(0.12, 0.20),
            "Shopping": rng.uniform(0.05, 0.18),
            "Transport": rng.uniform(0.04, 0.09),
            "Healthcare": rng.uniform(0.02, 0.07),
            "Education": rng.uniform(0.03, 0.10),
            "Entertainment": rng.uniform(0.03, 0.09),
            "Utilities": rng.uniform(0.04, 0.08),
            "Others": rng.uniform(0.02, 0.05),
        }

        for month in range(1, months_per_user + 1):
            income = base_income + income_growth * month + rng.normal(0, 300)
            income = max(income, 5000)

            # Festive-season bump for Shopping/Entertainment
            seasonal_multiplier = 1.4 if (month % 12) in (10, 11, 0) else 1.0

            food = income * style["Food"] * rng.normal(1.0, 0.08)
            shopping = income * style["Shopping"] * seasonal_multiplier * rng.normal(1.0, 0.15)
            transport = income * style["Transport"] * rng.normal(1.0, 0.10)
            healthcare = income * style["Healthcare"] * rng.normal(1.0, 0.20)
            education = income * style["Education"] * rng.normal(1.0, 0.10)
            entertainment = income * style["Entertainment"] * seasonal_multiplier * rng.normal(1.0, 0.15)
            utilities = income * style["Utilities"] * rng.normal(1.0, 0.05)
            others = income * style["Others"] * rng.normal(1.0, 0.20)

            categories = [food, shopping, transport, healthcare, education, entertainment, utilities, others]
            categories = [max(0, round(c, 2)) for c in categories]
            total_expense = round(sum(categories), 2)

            rows.append([user_id, month, round(income, 2), *categories, total_expense])

    columns = [
        "UserId", "Month", "Income", "Food", "Shopping", "Transport",
        "Healthcare", "Education", "Entertainment", "Utilities", "Others", "TotalExpense",
    ]
    return pd.DataFrame(rows, columns=columns)


if __name__ == "__main__":
    df = generate_expense_dataset()
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Generated {len(df)} rows -> {OUTPUT_PATH}")
    print(df.describe().round(2))


    print(df.shape)
    print(df.head())