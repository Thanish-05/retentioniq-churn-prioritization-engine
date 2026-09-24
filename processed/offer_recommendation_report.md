# Customer Value Simulation & Retention Offer Recommendation Report

## 1. Executive Summary
This report documents Step 5 of the retention decision engine: transforming uplift estimates and customer profile metrics into economically sound, personalized retention actions.

- **Total Customer Base Analyzed**: 11,896 customers
- **Customers Recommended for Intervention**: **668** (5.62%)
- **Customers Recommended for "No Action"**: **11,228** (94.38%)
- **Total Expected Incremental Value Saved**: **EUR 13,004.30**
- **Average Expected Value per Active Recommendation**: **EUR 19.47**
- **Average Return on Investment (ROI)**: **1.48x**

---

## 2. Business Value Simulation Assumptions
Because the Orange Belgium research dataset is anonymized and does not contain raw financial billing or ARPU fields, we implement a transparent, defensible **Business Simulation Layer**:

### Assumptions & Formulas:
1. **Activity Index**: Derived from normalized principal components `PC1` and `PC2` (which capture continuous usage, contract size, and network traffic):
   $$\text{activity\_score} = 0.60 \times \text{rank\_pct}(PC1) + 0.40 \times \text{rank\_pct}(PC2) \in [0, 1]$$
2. **Simulated Monthly ARPU**: Calibrated to representative European telecom postpaid tiers (EUR 25 to EUR 70/month):
   $$\text{monthly\_arpu} = 25.0 + 45.0 \times \text{activity\_score}$$
3. **Customer Retention Horizon**: Projected customer lifetime based on baseline retention probability $(1 - \text{churn\_probability})$:
   $$\text{horizon\_years} = 1.0 + 1.5 \times (1.0 - \text{churn\_probability})$$
4. **Customer Lifetime Value (EUR)**:
   $$\text{customer\_value\_eur} = \text{monthly\_arpu} \times 12 \times \text{horizon\_years}$$

> [!NOTE]
> **Data Integrity Guarantee**: `customer_id`, actual `churned` status, and actual `treatment` assignment were **NOT** used as direct inputs to the customer value calculation.

---

## 3. Customer Value Segmentation

| Value Segment | EUR Value Range | Customer Count | Share (%) | Mean Value (EUR) |
|---|---|---|---|---|
| **Low Value** | EUR 326.80 – EUR 1036.69 | 2,974 | 25.00% | EUR 857.51 |
| **Medium Value** | EUR 1036.69 – EUR 1359.38 | 2,974 | 25.00% | EUR 1194.57 |
| **High Value** | EUR 1359.38 – EUR 1689.22 | 2,973 | 25.00% | EUR 1523.90 |
| **Very High Value** | EUR 1689.22 – EUR 2093.55 | 2,975 | 25.00% | EUR 1863.19 |

---

## 4. Retention Offer Library & Economic Framework

From `offers.csv`:

| Offer ID | Action Name | Cost (EUR) | Action Type | Eligibility Condition |
|---|---|---|---|---|
| **O04** | Premium Retention Offer | EUR 70 | Premium Offer | $\text{EV} \ge 100$, Very High Value, Highly Persuadable |
| **O03** | Medium Discount | EUR 40 | Discount | $\text{EV} \ge 60$, High / Very High Value |
| **O06** | Free Premium Trial | EUR 30 | Trial | $\text{EV} \ge 45$, Persuadable / Highly Persuadable |
| **O02** | Small Discount | EUR 20 | Discount | $\text{EV} \ge 30$, Positive Uplift |
| **O05** | Priority Support | EUR 15 | Service Recovery | $\text{EV} \ge 20$, Moderate Uplift |
| **O01** | Loyalty Reward | EUR 10 | Loyalty Reward | $\text{EV} \ge 10$, Moderate Uplift |
| **O00** | No Action | EUR 0 | Control | $\text{EV} < 10$ or Uplift $\le 0$ |

### Core Economic Definitions:
- $\text{expected\_value\_saved} = \max(\text{uplift}, 0) \times \text{customer\_value\_eur}$
- $\text{net\_expected\_value} = \text{expected\_value\_saved} - \text{offer\_cost\_eur}$
- $\text{roi} = \frac{\text{expected\_value\_saved}}{\text{offer\_cost\_eur}}$ *(For No Action: cost = 0, EV = 0, ROI = 0)*

---

## 5. Offer Recommendation Distribution

| Recommended Offer | Offer Cost (EUR) | Customers | Share (%) | Total EV Saved (EUR) | Avg ROI |
|---|---|---|---|---|---|
| **Free Premium Trial** | EUR 30.00 | 18 | 0.15% | EUR 1,064.34 | 1.97x |
| **Loyalty Reward** | EUR 10.00 | 476 | 4.00% | EUR 6,609.81 | 1.39x |
| **Medium Discount** | EUR 40.00 | 7 | 0.06% | EUR 500.06 | 1.79x |
| **No Action** | EUR 0.00 | 11,228 | 94.38% | EUR 0.00 | 0.00x |
| **Premium Retention Offer** | EUR 70.00 | 2 | 0.02% | EUR 318.25 | 2.27x |
| **Priority Support** | EUR 15.00 | 120 | 1.01% | EUR 2,888.83 | 1.60x |
| **Small Discount** | EUR 20.00 | 45 | 0.38% | EUR 1,623.01 | 1.80x |

---

## 6. Recommendation Reason Distribution

| Reason | Customers | Share (%) | Primary Driver |
|---|---|---|---|
| High churn risk but low estimated intervention response | 368 | 3.09% | Model Decision Rule |
| High positive uplift + high customer value | 9 | 0.08% | Model Decision Rule |
| Moderate uplift but low offer cost | 476 | 4.00% | Model Decision Rule |
| Moderate uplift with low offer cost | 120 | 1.01% | Model Decision Rule |
| Negative estimated treatment uplift (avoid contact) | 7,510 | 63.13% | Model Decision Rule |
| No Action because expected benefit does not justify offer cost | 3,350 | 28.16% | Model Decision Rule |
| Positive uplift with solid net expected value | 45 | 0.38% | Model Decision Rule |
| Substantial uplift justifies premium trial | 18 | 0.15% | Model Decision Rule |

---

## 7. Top 20 Recommended Customer-Action Pairs

| Rank | Customer ID | Churn Prob | Uplift | Customer Value (EUR) | Recommended Offer | Cost (EUR) | Expected Value Saved | ROI | Recommendation Reason |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `C10828` | 0.0824 | +0.0975 | EUR 1831.88 | **Premium Retention Offer** | EUR 70 | EUR 178.57 | **2.55x** | High positive uplift + high customer value |
| 2 | `C11299` | 0.0059 | +0.0724 | EUR 1930.34 | **Premium Retention Offer** | EUR 70 | EUR 139.68 | **2.00x** | High positive uplift + high customer value |
| 3 | `C09561` | 0.0081 | +0.1177 | EUR 1140.00 | **Free Premium Trial** | EUR 30 | EUR 134.12 | **4.47x** | Substantial uplift justifies premium trial |
| 4 | `C10604` | 0.9717 | +0.1073 | EUR 803.13 | **Free Premium Trial** | EUR 30 | EUR 86.16 | **2.87x** | Substantial uplift justifies premium trial |
| 5 | `C09383` | 0.0283 | +0.0444 | EUR 1862.49 | **Medium Discount** | EUR 40 | EUR 82.62 | **2.07x** | High positive uplift + high customer value |
| 6 | `C10406` | 0.0064 | +0.0401 | EUR 2005.61 | **Medium Discount** | EUR 40 | EUR 80.42 | **2.01x** | High positive uplift + high customer value |
| 7 | `C11786` | 0.0268 | +0.0396 | EUR 2014.24 | **Medium Discount** | EUR 40 | EUR 79.86 | **2.00x** | High positive uplift + high customer value |
| 8 | `C09657` | 0.0017 | +0.0345 | EUR 1999.08 | **Medium Discount** | EUR 40 | EUR 68.87 | **1.72x** | High positive uplift + high customer value |
| 9 | `C03425` | 0.0167 | +0.0366 | EUR 1829.17 | **Medium Discount** | EUR 40 | EUR 66.97 | **1.67x** | High positive uplift + high customer value |
| 10 | `C09583` | 0.1323 | +0.0507 | EUR 1307.33 | **Free Premium Trial** | EUR 30 | EUR 66.28 | **2.21x** | Substantial uplift justifies premium trial |
| 11 | `C11227` | 0.0118 | +0.0368 | EUR 1663.76 | **Medium Discount** | EUR 40 | EUR 61.19 | **1.53x** | High positive uplift + high customer value |
| 12 | `C10288` | 0.0286 | +0.0312 | EUR 1930.28 | **Medium Discount** | EUR 40 | EUR 60.13 | **1.50x** | High positive uplift + high customer value |
| 13 | `C11288` | 0.0335 | +0.0306 | EUR 1913.31 | **Free Premium Trial** | EUR 30 | EUR 58.47 | **1.95x** | Substantial uplift justifies premium trial |
| 14 | `C11257` | 0.0066 | +0.0297 | EUR 1955.65 | **Free Premium Trial** | EUR 30 | EUR 58.08 | **1.94x** | Substantial uplift justifies premium trial |
| 15 | `C11121` | 0.0049 | +0.0277 | EUR 2056.05 | **Free Premium Trial** | EUR 30 | EUR 56.91 | **1.90x** | Substantial uplift justifies premium trial |
| 16 | `C01037` | 0.0039 | +0.0324 | EUR 1753.07 | **Free Premium Trial** | EUR 30 | EUR 56.85 | **1.90x** | Substantial uplift justifies premium trial |
| 17 | `C02375` | 0.0230 | +0.0317 | EUR 1720.60 | **Free Premium Trial** | EUR 30 | EUR 54.54 | **1.82x** | Substantial uplift justifies premium trial |
| 18 | `C11660` | 0.0066 | +0.0268 | EUR 1958.73 | **Free Premium Trial** | EUR 30 | EUR 52.42 | **1.75x** | Substantial uplift justifies premium trial |
| 19 | `C03311` | 0.0044 | +0.0260 | EUR 1992.63 | **Free Premium Trial** | EUR 30 | EUR 51.79 | **1.73x** | Substantial uplift justifies premium trial |
| 20 | `C03179` | 0.0225 | +0.0312 | EUR 1646.12 | **Free Premium Trial** | EUR 30 | EUR 51.29 | **1.71x** | Substantial uplift justifies premium trial |

---

## 8. Limitations & Business Governance
1. **Simulated Revenue Inputs**: While calibrated to European telecom market norms, customer value reflects simulation logic rather than actual Orange Belgium billing logs.
2. **Static Offer Cost**: Offers assume a fixed per-customer direct cost without operational fulfillment overhead or volume-discount tiers.
3. **No Cannibalization Modeling**: The model assumes customers only take the offer if targeted; self-selection or customer-inquiry spillover effects are not modeled.
4. **Budget Constraints**: This recommendation policy identifies all economically justifiable actions. If a fixed budget cap is imposed, actions should be greedily selected in descending order of `recommended_roi` or `net_expected_value`.
