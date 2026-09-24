# RETENTIONIQ — Retention-ROI Churn Prioritization Engine

> **Predict churn. Understand why. Spend smarter.**

RETENTIONIQ is an enterprise-grade retention decision platform built on the **Orange Belgium Churn Uplift Dataset**. It moves beyond traditional churn prediction by combining **Predictive Machine Learning (XGBoost)**, **Causal Uplift Modeling (Two-Model T-Learner)**, and **Algorithmic Capital Allocation (0/1 Knapsack Dynamic Programming)** to maximize the net economic value of every retention rupee spent.

---

## 🌟 Key Capabilities

1. **Predictive Churn Risk**: XGBoost classifier achieving **0.8534 ROC-AUC** and **0.1916 PR-AUC** (5.6× the random baseline) on 336 customer features.
2. **Causal Uplift / Persuadability (T-Learner)**: Disentangles *Persuadables* (customers whose churn drops by up to **32.35 percentage points** when targeted) from *Sleeping Dogs* and *Sure Things*.
3. **Simulated Customer Lifetime Value (CLV)**: Defensible European telecom ARPU & tenure model (€326 to €2,093) avoiding reliance on raw unobserved billing.
4. **Dynamic Knapsack Budget Optimizer (Hero Page)**: Solves the exact **0/1 Knapsack Optimization Problem** in real-time (<50ms) to maximize net protected value under any arbitrary budget cap (e.g., ₹25k, ₹50k, ₹1 Lakh, ₹2 Lakh, ₹5 Lakh).
5. **Customer 360 & Explainability**: Granular counterfactual breakdown (*Without Intervention* vs *With Intervention*) with clear, model-grounded reasoning.

---

## 🏗️ Architecture & Project Structure

```text
Thanga/
├── backend/
│   ├── main.py                     # FastAPI REST API with real-time Knapsack solver
│   └── requirements.txt            # Backend dependencies (fastapi, uvicorn, etc.)
├── frontend/
│   ├── package.json                # React 18, Vite 5, Tailwind CSS, Recharts, Lucide
│   ├── vite.config.js              # Vite dev server with proxy to backend :8000
│   ├── tailwind.config.js          # Dark enterprise SaaS theme configuration
│   └── src/
│       ├── api.js                  # Centralized REST client
│       ├── components/             # Reusable Sidebar and Header components
│       └── pages/                  # 6 distinct enterprise workflow views
├── models/
│   ├── churn_model.pkl             # Trained baseline churn pipeline (XGBoost)
│   └── uplift_model.pkl            # Trained T-Learner bundle (Control + Treatment models)
├── processed/
│   ├── orange_churn_uplift_clean.csv       # 11,896 cleaned records
│   ├── churn_predictions.csv               # Churn probabilities & risk levels
│   ├── uplift_predictions.csv              # Causal uplift & persuadability segments
│   ├── customer_value.csv                  # Simulated customer lifetime values
│   ├── customer_offer_recommendations.csv  # 14-column customer-action recommendations
│   ├── optimized_retention_plan.csv        # Final allocation for default ₹1 Lakh budget
│   ├── budget_scenarios.csv                # Comparison across ₹25k to ₹500k scenarios
│   ├── budget_priority_table.csv           # Master priority-ranked candidate pool
│   ├── churn_model_report.md               # Empirical churn model metrics
│   ├── uplift_model_report.md              # Causal T-Learner validation report
│   └── offer_recommendation_report.md      # Business assumptions & offer economics
└── src/
    ├── train_churn_model.py        # Step 3 script
    ├── train_uplift_model.py       # Step 4 script
    ├── recommend_offers.py         # Step 5 script
    └── optimize_retention_budget.py# Step 6 script
```

---

## 🚀 Quickstart & Setup Commands

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup (FastAPI)
Open a terminal in the project root:
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
Open a second terminal:
```bash
cd frontend

# Install npm packages
npm install

# Start the Vite development server on port 3000
npm run dev -- --host 127.0.0.1 --port 3000
```
Open your browser and navigate to: `http://localhost:3000`

---

## 🧭 Interactive Demo Walkthrough for Judges

1. **Dashboard (`/`)**:
   - Inspect overall customer health: 11,896 customers, 342 at elevated risk.
   - Review default budget (₹1,00,000) delivering **₹2,13,257 Expected Value Saved (2.13x ROI)**.
   - View the 5 distribution charts (Risk, Uplift, Value, Offers, Diminishing Returns curve).
2. **Customer Risk (`Customer Risk` tab)**:
   - Filter by **Critical Risk** or **Highly Persuadable**.
   - Sort by Highest Churn Risk or Highest Uplift.
   - Click on any customer (e.g. `C10828` or `C09561`) to jump into Customer 360.
3. **Customer 360 (`Customer 360` tab)**:
   - Check counterfactual visual bars: **Without Intervention** vs **With Intervention**.
   - See recommended offer, cost, expected value saved, and ROI.
   - Read the **WHY THIS CUSTOMER?** explainability card.
4. **Segmentation (`Segmentation` tab)**:
   - Review the 4 Persuadability Segments and empirical validation metrics.
   - Inspect the **2×2 Risk vs. Value Matrix** with actionable playbooks.
5. **Retention Optimizer (Hero Page)**:
   - Drag the budget slider or click preset buttons (**₹25,000**, **₹50,000**, **₹1,00,000**, **₹2,00,000**, **₹5,00,000**).
   - Observe real-time dynamic recalculation powered by the backend Knapsack algorithm.
   - Inspect the table showing customers updated to **SELECTED** vs **NOT SELECTED**.
6. **Model Insights (`Model Insights` tab)**:
   - Review verified model metrics: **0.8534 ROC-AUC**, **0.006365 Qini**, and top predictive feature rankings.

---

## 📊 Summary of Optimization Scenarios

| Budget Scenario | Customers Targeted | Budget Used | Remaining Budget | Expected Value Saved | Portfolio ROI |
|---|---|---|---|---|---|
| **₹25,000** | 10 | ₹24,750.00 | ₹250.00 | **₹64,201.50** | **2.59x** |
| **₹50,000** | 20 | ₹49,950.00 | ₹50.00 | **₹1,15,349.40** | **2.31x** |
| **₹1,00,000 (Default)** | **60** | **₹99,900.00** | **₹100.00** | **₹2,13,257.70** | **2.13x** |
| **₹2,00,000** | 145 | ₹1,99,800.00 | ₹200.00 | **₹3,96,063.90** | **1.98x** |
| **₹5,00,000** | 390 | ₹499,950.00 | ₹50.00 | **₹8,64,724.50** | **1.73x** |
