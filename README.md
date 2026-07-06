# FinHer_new
# 💰 FinHer – AI-Powered Financial Empowerment Platform for Women

FinHer is a full-stack financial management platform designed to help women track expenses, manage income, plan budgets, and gain intelligent financial insights through Machine Learning and AI.

---

## 🚀 Features

### 🔐 Authentication & Security
- User Registration & Login
- JWT-based Authentication
- Protected Routes
- Secure Password Hashing

### 💵 Income Management
- Add Income Records
- View Income History
- Monthly Income Tracking

### 💸 Expense Management
- Add Expenses by Category
- View Expense History
- Category-wise Expense Analysis

### 📊 Dashboard Analytics
- Total Income
- Total Expenses
- Savings Calculation
- Expense Trend Visualization
- Category-wise Spending Distribution

### 🎯 Budget Planner
- Personalized Budget Recommendations
- 50-30-20 Rule Based Planning
- Budget Tracking

### 🤖 Machine Learning Features

#### 1. Expense Prediction
Predicts next month's expenses using:

- Linear Regression
- Historical Spending Data
- Income Patterns

#### 2. Spending Behavior Analysis
Classifies users into:

- Saver
- Balanced Spender
- Heavy Spender

Using:

- K-Means Clustering
- Spending Ratio Analysis
- Category Diversity Analysis

#### 3. Smart Financial Recommendations
Generates personalized financial suggestions based on:

- Spending Habits
- Income Patterns
- Budget Performance

---

## 🏗️ System Architecture

Frontend (React)
│
▼
Node.js + Express Backend
│
├── MongoDB Atlas
│
└── Flask ML Microservice
│
├── Linear Regression
├── K-Means Clustering
└── Recommendation Engine

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt

### Machine Learning
- Python
- Flask
- Scikit-Learn
- Pandas
- NumPy
- Joblib

### Models Used
- Linear Regression
- K-Means Clustering

---

## 📂 Project Structure

```bash
FinHer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── ml-service/
│   ├── data/
│   ├── models/
│   ├── utils/
│   ├── saved_models/
│   ├── train_models.py
│   └── app.py
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd FinHer
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

Runs on:

```bash
http://localhost:5000
```

---

### ML Service Setup

```bash
cd ml-service

pip install -r requirements.txt

python app.py
```

Runs on:

```bash
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Runs on:

```bash
http://localhost:3000
```

---

## 🔗 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Expenses

```http
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

### Income

```http
GET    /api/income
POST   /api/income
PUT    /api/income/:id
DELETE /api/income/:id
```

### Budget

```http
GET  /api/budget
POST /api/budget
```

### Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/trends
```

### Machine Learning

```http
POST /api/ml/predict-expense
POST /api/ml/spending-cluster
POST /api/ml/recommendations
```

---

## 📈 Machine Learning Workflow

### Expense Prediction

1. Historical income and expense data collected
2. Data preprocessing and feature engineering
3. StandardScaler normalization
4. Linear Regression model training
5. Next-month expense prediction

### Spending Analysis

1. Calculate spending ratio
2. Calculate category diversity
3. Apply K-Means clustering
4. Generate spending segment

---

## 🔮 Future Enhancements

- AI Financial Coach (Gemini/OpenAI)
- Goal-Based Savings Planner
- Investment Recommendations
- Financial Literacy Chatbot
- Multi-language Support
- Mobile Application

---

## 👩‍💻 Developed By

**Shravya Poojary**

Information Science & Engineering

CMR Institute of Technology, Bengaluru

---

## 📜 License

This project is developed for academic and educational purposes.
