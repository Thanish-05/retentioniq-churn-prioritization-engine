# Baseline Churn Prediction Model Report

## 1. Dataset Shape & Target Definition
- **Clean Dataset**: `processed/orange_churn_uplift_clean.csv`
- **Total Records**: 11,896 customers
- **Total Columns**: 339 (336 features used for training)
- **Target Variable**: `churned` (Binary: 0 = retained, 1 = churned)
- **Excluded Columns**: `customer_id` (identifier), `treatment` (reserved strictly for subsequent uplift modeling)

## 2. Class Distribution
- **Retained (`churned=0`)**: 11,488 (96.57%)
- **Churned (`churned=1`)**: 408 (3.43%)
- **Severe Class Imbalance**: Churn rate is only ~3.43%. Due to this imbalance, accuracy alone is a misleading metric; ranking and discrimination metrics (**ROC-AUC**, **PR-AUC**, **F1**) are essential.

## 3. Preprocessing Architecture
- **Pipeline Implementation**: Scikit-Learn `Pipeline` combined with `ColumnTransformer`.
- **Feature Detection**: Automated detection of numerical vs. categorical feature types.
  - **Numerical Features (336)**: Imputed via median strategy (`SimpleImputer(strategy='median')`), followed by z-score standardization (`StandardScaler`).
  - **Categorical Features (0)**: Imputed via mode strategy (`SimpleImputer(strategy='most_frequent')`), followed by one-hot encoding (`OneHotEncoder(handle_unknown='ignore')`).
- **Data Splitting**: Stratified 80/20 train/test split preserving the 3.43% churn ratio across both subsets.

## 4. Model Comparison (Test Set Evaluation)

| Metric | Logistic Regression (Baseline) | XGBoost Classifier (Stronger Model) | Difference (XGBoost vs Baseline) |
|---|---|---|---|
| **ROC-AUC** | 0.7750 | **0.8534** | **+0.0784** |
| **PR-AUC** | 0.1472 | **0.1916** | **+0.0444** |
| **F1 Score** | 0.1822 | **0.1964** | **+0.0143** |
| **Precision** | 0.1083 | **0.3667** | **+0.2584** |
| **Recall** | **0.5732** | 0.1341 | -0.4390 |
| **Accuracy** | 0.8227 | **0.9622** | **+0.1395** |

## 5. Model Selection Justification
**Selected Model**: **XGBoost Classifier (`models/churn_model.pkl`)**
- **Superior Discrimination**: Achieved a high **ROC-AUC of 0.8534**, significantly beating the baseline (0.7750).
- **Superior Precision-Recall Tradeoff**: PR-AUC of **0.1916** (over 5.5x higher than the baseline random baseline of 0.0343).
- **Higher F1 Score & Precision**: Higher precision (0.3667 vs 0.1083) and overall F1 score (0.1964 vs 0.1822), avoiding massive false positives that would overwhelm proactive retention teams.

## 6. Full Customer Population Risk Segmentation
Predictions were generated across all 11,896 customers:
- **Low Risk (0.00 - 0.30)**: 11,257 customers (94.63%)
- **Medium Risk (0.30 - 0.60)**: 297 customers (2.50%)
- **High Risk (0.60 - 0.80)**: 14 customers (0.12%)
- **Critical Risk (0.80 - 1.00)**: 328 customers (2.76%)

**Total Elevated Risk (High + Critical)**: 342 customers.

## 7. Top 15 Most Important Features
| Rank | Feature | Importance Score | Relative Share (%) |
|---|---|---|---|
| 1 | `FACTOR15_V9` | 0.05552 | 5.55% |
| 2 | `FACTOR6_V19` | 0.03435 | 3.44% |
| 3 | `PC2` | 0.01106 | 1.11% |
| 4 | `FACTOR16_V12` | 0.00968 | 0.97% |
| 5 | `FACTOR5_V2` | 0.00964 | 0.96% |
| 6 | `PC36` | 0.00932 | 0.93% |
| 7 | `PC12` | 0.00919 | 0.92% |
| 8 | `PC53` | 0.00906 | 0.91% |
| 9 | `PC145` | 0.00883 | 0.88% |
| 10 | `PC85` | 0.00851 | 0.85% |
| 11 | `PC42` | 0.00840 | 0.84% |
| 12 | `PC15` | 0.00834 | 0.83% |
| 13 | `PC82` | 0.00825 | 0.83% |
| 14 | `PC24` | 0.00809 | 0.81% |
| 15 | `FACTOR2_V2` | 0.00803 | 0.80% |

## 8. Limitations & Next Steps
1. **Target Imbalance**: Despite reweighting via `scale_pos_weight`, the extreme rarity of churn (3.43%) caps raw F1 at default thresholds. Threshold tuning can optimize for specific cost/benefit retention trade-offs.
2. **Feature Anonymization**: The Orange Belgium dataset anonymizes underlying business variables into PCA (`PC*`) and factor groupings (`FACTOR*`), limiting domain-specific narrative explanations for individual PC loadings.
3. **Absence of Treatment Effect**: As intentionally designed for Step 3, this model predicts **absolute churn risk** without accounting for intervention sensitivity. Customers with high churn risk may be *Sleeping Dogs* or *Lost Causes*.
4. **Transition to Step 4 (Uplift / Persuadability Modeling)**: In Step 4, we will introduce `treatment` using Causal ML (Two-Model T-Learner / S-Learner / X-Learner) to distinguish *Persuadables* from non-responsive customer segments.
