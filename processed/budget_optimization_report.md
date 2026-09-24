# Budget-Constrained Retention Optimizer Report

## 1. Executive Summary
This report details Step 6 of the retention pipeline: allocating a fixed capital retention budget to maximize total net economic value saved.

- **Default Available Budget**: **₹100,000**
- **Optimal Customers Targeted**: **60**
- **Budget Deployed**: **₹99,900.00** (99.90% utilization)
- **Remaining Unallocated Budget**: **₹100.00**
- **Total Expected Incremental Value Saved**: **₹213,257.70**
- **Portfolio ROI**: **2.13x** (₹2.13 returned per ₹1.00 deployed)

---

## 2. Mathematical Optimization Formulation

### Objective Function:
Maximize sum(x_i * expected_value_saved_i) for i = 1 to N

### Subject to Budget Constraint:
sum(x_i * offer_cost_i) <= Available Budget
x_i in (0, 1) for each customer i

Where:
- x_i = 1 if customer i is selected for intervention, and 0 otherwise.
- expected_value_saved_i = max(uplift_i, 0) * customer_value_eur_i * 90.0
- offer_cost_i = recommended_offer_cost_i * 90.0

### Algorithm Selection:
We employ the **0/1 Knapsack Dynamic Programming (DP)** algorithm. Because offer costs in INR are discrete multiples of ₹450 (₹900, ₹1,350, ₹1,800, ₹2,700, ₹3,600, ₹6,300), exact global optimality is guaranteed in O(N * W) time (executed in < 50ms), outperforming greedy heuristics by capturing optimal boundary-packings without leaving wasted budget fragments.

---

## 3. Scenario Comparison Across Budget Bands

| Budget Scenario | Customers Targeted | Budget Used | Remaining Budget | Expected Value Saved | Portfolio ROI |
|---|---|---|---|---|---|
| **₹25,000** | 10 | ₹24,750.00 | ₹250.00 | **₹64,201.50** | **2.59x** |
| **₹50,000** | 20 | ₹49,950.00 | ₹50.00 | **₹115,349.40** | **2.31x** |
| **₹100,000** | 60 | ₹99,900.00 | ₹100.00 | **₹213,257.70** | **2.13x** |
| **₹200,000** | 145 | ₹199,800.00 | ₹200.00 | **₹396,063.90** | **1.98x** |
| **₹500,000** | 390 | ₹499,950.00 | ₹50.00 | **₹864,724.50** | **1.73x** |

### Key Diminishing Marginal Returns Findings:
- At **₹25,000**, the optimizer selects the highest-density retention opportunities (**2.59x ROI**).
- As capital increases to **₹1,00,000**, coverage expands to 60 high-impact customers while preserving a strong **2.13x ROI**.
- At **₹5,00,000**, 390 customers are funded, generating over **₹8.64 Lakh** in saved customer value (**1.73x ROI**).

---

## 4. Default ₹1,00,000 Retention Plan Breakdown

| Metric | Allocated Value |
|---|---|
| **Available Budget** | ₹1,00,000.00 |
| **Total Expenditure** | ₹99,900.00 |
| **Budget Slack / Unspent** | ₹100.00 |
| **Customers Reached** | 60 |
| **Total Value Protected** | ₹2,13,257.70 |
| **Net Value Gain (EV - Cost)** | **+₹1,13,357.70** |
| **Portfolio ROI** | **2.13x** |

---

## 5. Top 20 Selected Customers (Default ₹1,00,000 Budget)

| Priority Rank | Customer ID | Churn Risk | Uplift | Customer Value (EUR) | Action Taken | Offer Cost (INR) | Expected Value Saved (INR) | ROI |
|---|---|---|---|---|---|---|---|---|
| 1 | `C09561` | Low (0.01) | +0.1177 | €1140.00 | **Free Premium Trial** | ₹2,700 | ₹12,070.80 | **4.47x** |
| 2 | `C10604` | Critical (0.97) | +0.1073 | €803.13 | **Free Premium Trial** | ₹2,700 | ₹7,754.40 | **2.87x** |
| 3 | `C10828` | Low (0.08) | +0.0975 | €1831.88 | **Premium Retention Offer** | ₹6,300 | ₹16,071.30 | **2.55x** |
| 4 | `C00752` | Low (0.01) | +0.0258 | €1723.40 | **Small Discount** | ₹1,800 | ₹4,003.20 | **2.22x** |
| 5 | `C09583` | Low (0.13) | +0.0507 | €1307.33 | **Free Premium Trial** | ₹2,700 | ₹5,965.20 | **2.21x** |
| 6 | `C05566` | Low (0.05) | +0.0230 | €1921.61 | **Small Discount** | ₹1,800 | ₹3,972.60 | **2.21x** |
| 7 | `C11319` | Low (0.02) | +0.0237 | €1850.02 | **Small Discount** | ₹1,800 | ₹3,947.40 | **2.19x** |
| 8 | `C10545` | Low (0.06) | +0.0236 | €1851.79 | **Small Discount** | ₹1,800 | ₹3,934.80 | **2.19x** |
| 9 | `C10853` | Critical (0.97) | +0.0604 | €695.54 | **Small Discount** | ₹1,800 | ₹3,783.60 | **2.10x** |
| 10 | `C09383` | Low (0.03) | +0.0444 | €1862.49 | **Medium Discount** | ₹3,600 | ₹7,435.80 | **2.07x** |
| 11 | `C05878` | Low (0.00) | +0.0239 | €1732.59 | **Small Discount** | ₹1,800 | ₹3,726.90 | **2.07x** |
| 12 | `C10703` | Low (0.01) | +0.0204 | €2018.03 | **Small Discount** | ₹1,800 | ₹3,712.50 | **2.06x** |
| 13 | `C10811` | Low (0.01) | +0.0203 | €2033.78 | **Small Discount** | ₹1,800 | ₹3,706.20 | **2.06x** |
| 14 | `C11709` | Low (0.03) | +0.0221 | €1853.11 | **Small Discount** | ₹1,800 | ₹3,690.90 | **2.05x** |
| 15 | `C02562` | Low (0.01) | +0.0221 | €1823.94 | **Small Discount** | ₹1,800 | ₹3,636.00 | **2.02x** |
| 16 | `C11109` | Low (0.03) | +0.0215 | €1874.19 | **Small Discount** | ₹1,800 | ₹3,631.50 | **2.02x** |
| 17 | `C10406` | Low (0.01) | +0.0401 | €2005.61 | **Medium Discount** | ₹3,600 | ₹7,237.80 | **2.01x** |
| 18 | `C11299` | Low (0.01) | +0.0724 | €1930.34 | **Premium Retention Offer** | ₹6,300 | ₹12,571.20 | **2.00x** |
| 19 | `C11786` | Low (0.03) | +0.0396 | €2014.24 | **Medium Discount** | ₹3,600 | ₹7,187.40 | **2.00x** |
| 20 | `C02801` | Low (0.03) | +0.0167 | €1793.33 | **Priority Support** | ₹1,350 | ₹2,698.20 | **2.00x** |

---

## 6. Business Governance & Deployment Limitations
1. **Dynamic Execution**: The optimizer recalculates instantaneously when marketing leadership modifies available budget thresholds.
2. **Deterministic Fairness**: Allocations are mathematically optimal with zero subjective bias.
3. **Execution Constraints**: Field teams must deliver the exact offer paired to each customer; downgrading or substituting offers invalidates the modeled uplift and ROI guarantees.
