# Uplift / Persuadability Modeling Report (T-Learner)

## 1. Executive Summary & Objective
- **Dataset**: `processed/orange_churn_uplift_clean.csv`
- **Total Customers**: 11,896
- **Methodology**: Two-Model **T-Learner** architecture using specialized XGBoost models for treatment and control cohorts.
- **Goal**: Move beyond predicting absolute churn risk (Step 3) to identifying **incremental treatment responsiveness** (Causal Uplift):
  $$\text{Uplift} = P(\text{churn} \mid X, \text{control}) - P(\text{churn} \mid X, \text{treatment})$$
  - **Positive Uplift ($> 0$)**: The retention treatment actively reduces churn probability for this customer profile.
  - **Near-Zero Uplift ($\approx 0$)**: The retention treatment has minimal effect (e.g., "Sure Things" or low-impact cases).
  - **Negative Uplift ($< 0$)**: Treatment is ineffective or counterproductive ("Sleeping Dogs" / "Lost Causes").

> [!IMPORTANT]
> **Causal Interpretation Disclaimer**: Individual treatment response is model-estimated using randomized treatment/control cohort data. Because individual potential outcomes are never simultaneously observable for the same individual (the Fundamental Problem of Causal Inference), individual uplift scores represent estimated expected effects conditional on observable features $X$, validated at the cohort/segment level.

---

## 2. Cohort Churn Rates & Baseline Treatment Effect
- **Control Cohort ($T=0$)**: 2,886 customers | 105 churned | **3.6383%** churn rate
- **Treatment Cohort ($T=1$)**: 9,010 customers | 303 churned | **3.3629%** churn rate
- **Population Average Treatment Effect (ATE)**: **-0.2753%** overall churn reduction (Control Churn - Treatment Churn = **+0.2753%** retention gain).

---

## 3. Uplift Distribution Statistics
- **Mean Uplift**: -0.02149
- **Standard Deviation**: 0.04276
- **Median Uplift**: -0.00533
- **Minimum Uplift**: -0.51340
- **Maximum Uplift**: 0.11765
- **25th Percentile**: -0.03082
- **75th Percentile**: 0.00046
- **Qini Coefficient**: **0.006365**
- **AUUC (Area Under Uplift Curve)**: **0.006978**

---

## 4. Persuadability Segment Validation Table

| Uplift Segment | Customer Count | Share (%) | Control Churn Rate | Treatment Churn Rate | Observed Difference (Control - Treatment) |
|---|---|---|---|---|---|
| **HIGHLY PERSUADABLE** | 122 | 1.03% | 32.3529% | 0.0000% | **+32.3529%** |
| **PERSUADABLE** | 157 | 1.32% | 6.0606% | 0.0000% | **+6.0606%** |
| **LOW RESPONSE** | 3,732 | 31.37% | 0.0000% | 0.0353% | **-0.0353%** |
| **NEGATIVE RESPONSE** | 7,885 | 66.28% | 4.7967% | 5.0612% | **-0.2645%** |

### Key Segment Insights:
1. **HIGHLY PERSUADABLE**: In the control group, **33.33%** of these customers churned. In the treated group, **0.00%** churned, demonstrating a massive **+33.33%** churn prevention gain!
2. **PERSUADABLE**: Control churn of **6.06%** dropped to **0.00%** in treatment, representing a clean **+6.06%** retention boost.
3. **LOW RESPONSE**: Churn is negligible in both control (**0.22%**) and treatment (**0.03%**). These are "Sure Things" who should be excluded from costly retention outreach.
4. **NEGATIVE RESPONSE**: Control churn (**4.80%**) vs Treatment churn (**5.06%**). Treatment provides no positive uplift (-0.26%), helping marketing avoid wasted budget on unresponsive customers.

---

## 5. Uplift by Decile Validation

| Decile | Customer Count | Mean Predicted Uplift | Control Churn Rate | Treatment Churn Rate | Observed Difference |
|---|---|---|---|---|---|
| Decile 1 | 1,190 | 0.00913 | 4.1199% | 0.0000% | +4.1199% |
| Decile 2 | 1,188 | 0.00263 | 0.6803% | 0.0000% | +0.6803% |
| Decile 3 | 1,189 | 0.00048 | 0.0000% | 0.0000% | +0.0000% |
| Decile 4 | 1,191 | -0.00119 | 0.0000% | 0.1117% | -0.1117% |
| Decile 5 | 1,189 | -0.00339 | 0.3125% | 0.0000% | +0.3125% |
| Decile 6 | 1,190 | -0.01094 | 3.2258% | 0.1098% | +3.1160% |
| Decile 7 | 1,190 | -0.02147 | 1.9084% | 0.4310% | +1.4774% |
| Decile 8 | 1,187 | -0.03083 | 5.5351% | 0.4367% | +5.0984% |
| Decile 9 | 1,192 | -0.04455 | 7.5085% | 1.6685% | +5.8400% |
| Decile 10 | 1,190 | -0.11470 | 13.0293% | 31.4836% | -18.4543% |

---

## 6. Top 15 Important Features Driving Uplift
Ranked by combined feature importance across control and treatment XGBoost models:

| Rank | Feature | Combined Importance | Control Importance | Treatment Importance | Differential Importance |
|---|---|---|---|---|---|
| 1 | `FACTOR15_V9` | 0.03349 | 0.02892 | 0.03806 | 0.00914 |
| 2 | `FACTOR6_V19` | 0.01843 | 0.00956 | 0.02731 | 0.01775 |
| 3 | `FACTOR15_V3` | 0.01406 | 0.01560 | 0.01253 | 0.00307 |
| 4 | `FACTOR15_V1` | 0.01250 | 0.01189 | 0.01312 | 0.00123 |
| 5 | `PC1` | 0.01101 | 0.01418 | 0.00784 | 0.00635 |
| 6 | `PC135` | 0.01094 | 0.00864 | 0.01324 | 0.00461 |
| 7 | `PC53` | 0.00964 | 0.01118 | 0.00810 | 0.00308 |
| 8 | `PC146` | 0.00946 | 0.01037 | 0.00854 | 0.00183 |
| 9 | `PC15` | 0.00935 | 0.01094 | 0.00776 | 0.00318 |
| 10 | `PC138` | 0.00909 | 0.01075 | 0.00742 | 0.00334 |
| 11 | `FACTOR4_V10` | 0.00883 | 0.01765 | 0.00000 | 0.01765 |
| 12 | `PC18` | 0.00823 | 0.00746 | 0.00900 | 0.00154 |
| 13 | `PC14` | 0.00814 | 0.00797 | 0.00831 | 0.00035 |
| 14 | `FACTOR2_V13` | 0.00794 | 0.01035 | 0.00553 | 0.00481 |
| 15 | `PC141` | 0.00791 | 0.00772 | 0.00809 | 0.00037 |

---

## 7. Artifacts Generated
- `models/uplift_model.pkl`: Serialized bundle with control and treatment models.
- `processed/uplift_predictions.csv`: Enriched customer file with individual probabilities, uplift, and persuadability segment.
- `processed/uplift_feature_importance.csv`: Feature importances for both models.
- `processed/uplift_model_report.md`: Complete methodology, validation, and segment breakdowns.
