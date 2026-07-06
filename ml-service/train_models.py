import os

from data.generate_expense_dataset import generate_expense_dataset
from data.generate_clustering_dataset import generate_clustering_dataset

from models.expense_prediction import train_expense_model
from models.spending_clustering import train_clustering_model

EXPENSE_DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "expense_dataset.csv"
)

CLUSTER_DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "clustering_dataset.csv"
)

if __name__ == "__main__":

    if not os.path.exists(EXPENSE_DATASET_PATH):
        generate_expense_dataset().to_csv(
            EXPENSE_DATASET_PATH,
            index=False
        )

    if not os.path.exists(CLUSTER_DATASET_PATH):
        generate_clustering_dataset().to_csv(
            CLUSTER_DATASET_PATH,
            index=False
        )

    train_expense_model(EXPENSE_DATASET_PATH)

    train_clustering_model(CLUSTER_DATASET_PATH)

    print("All FinHer ML models trained successfully!")