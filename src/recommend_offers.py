import os
import pandas as pd
import numpy as np

def main():
    print("Loading data for Step 5...")
    clean_df = pd.read_csv("processed/orange_churn_uplift_clean.csv")
    uplift_df = pd.read_csv("processed/uplift_predictions.csv")
    
    # Read offers.csv
    offers_path = "offers.csv" if os.path.exists("offers.csv") else "orange_churn_uplift_ready_pack/offers.csv"
    offers_df = pd.read_csv(offers_path)
    print("Offers library loaded:")
    print(offers_df[["offer_id", "offer_name", "cost_eur", "action_type"]])
    
    # =========================================================================
    # PART A — BUSINESS VALUE SIMULATION (Customer Lifetime Value)
    # =========================================================================
    # Assumption & Formula:
    # Telecom Customer Lifetime Value (CLV) is estimated using:
    # 1. Normalized customer activity score derived from primary PCA dimensions
    #    (PC1 and PC2, which reflect usage intensity, contract size, and traffic volume).
    #    activity_score = 0.60 * rank_pct(PC1) + 0.40 * rank_pct(PC2) in [0, 1]
    # 2. Simulated Monthly ARPU:
    #    monthly_arpu = 25.0 + 45.0 * activity_score (Ranges EUR 25 to EUR 70/month)
    # 3. Expected Retention Horizon (Tenure in Years):
    #    horizon_years = 1.0 + 1.5 * (1.0 - churn_probability) (Ranges ~1.0 to 2.5 years)
    # 4. Total Customer Value (CLV in EUR):
    #    customer_value_eur = monthly_arpu * 12 * horizon_years
    #
    # Constraints rigorously honored:
    # - customer_id is NOT used as a feature
    # - churned is NOT used as a direct value input
    # - treatment is NOT used as a direct value input
    # =========================================================================
    print("Calculating simulated customer values...")
    pc1_pct = clean_df["PC1"].rank(pct=True)
    pc2_pct = clean_df["PC2"].rank(pct=True)
    activity_score = 0.60 * pc1_pct + 0.40 * pc2_pct
    
    monthly_arpu = 25.0 + 45.0 * activity_score
    retention_factor = 1.0 - uplift_df["churn_probability"]
    horizon_years = 1.0 + 1.5 * retention_factor
    
    customer_value_eur = np.round(monthly_arpu * 12.0 * horizon_years, 2)
    
    # Quartile-based customer value segments
    q25, q50, q75 = customer_value_eur.quantile([0.25, 0.50, 0.75])
    def assign_val_seg(val):
        if val < q25:
            return "Low Value"
        elif val < q50:
            return "Medium Value"
        elif val < q75:
            return "High Value"
        else:
            return "Very High Value"
            
    customer_value_segment = customer_value_eur.apply(assign_val_seg)
    
    # Save processed/customer_value.csv
    os.makedirs("processed", exist_ok=True)
    val_export_df = pd.DataFrame({
        "customer_id": clean_df["customer_id"],
        "customer_value_eur": customer_value_eur,
        "customer_value_segment": customer_value_segment
    })
    val_export_df.to_csv("processed/customer_value.csv", index=False)
    print("Saved processed/customer_value.csv")
    
    # =========================================================================
    # PART B & C — RETENTION OFFER EVALUATION & PERSONALIZATION
    # =========================================================================
    # For every customer and offer:
    # - expected_value_saved = max(uplift, 0) * customer_value_eur
    # - net_expected_value = expected_value_saved - offer_cost_eur
    # - roi = expected_value_saved / offer_cost_eur
    # - For No Action: cost = 0, expected_value_saved = 0, roi = 0
    #
    # Economic Selection Policy:
    # Select the best economically meaningful offer that produces positive net expected value.
    # Expensive offers are NOT recommended automatically.
    # If no offer has positive net EV (or uplift <= 0), recommend "No Action".
    # =========================================================================
    print("Evaluating retention offers for all customers...")
    
    recommendations = []
    
    for idx in range(len(clean_df)):
        c_id = clean_df.loc[idx, "customer_id"]
        c_prob = uplift_df.loc[idx, "churn_probability"]
        r_level = uplift_df.loc[idx, "risk_level"]
        ctrl_prob = uplift_df.loc[idx, "control_churn_probability"]
        treat_prob = uplift_df.loc[idx, "treatment_churn_probability"]
        up = uplift_df.loc[idx, "uplift"]
        p_seg = uplift_df.loc[idx, "persuadability_segment"]
        c_val = customer_value_eur.loc[idx]
        v_seg = customer_value_segment.loc[idx]
        
        pos_uplift = max(up, 0.0)
        ev_saved_base = pos_uplift * c_val
        
        # Determine recommended offer based on economic benefit tiers:
        # Tier 1: Premium Retention Offer (Cost €70) - Requires EV >= €100, Very High Value & Highly Persuadable
        # Tier 2: Medium Discount (Cost €40) - Requires EV >= €60, High/Very High Value
        # Tier 3: Free Premium Trial (Cost €30) - Requires EV >= €45, Persuadable/Highly Persuadable
        # Tier 4: Small Discount (Cost €20) - Requires EV >= €30
        # Tier 5: Priority Support (Cost €15) - Requires EV >= €20
        # Tier 6: Loyalty Reward (Cost €10) - Requires EV >= €10
        # Else: No Action (Cost €0)
        if ev_saved_base >= 100.0 and v_seg == "Very High Value" and p_seg == "HIGHLY PERSUADABLE":
            offer = "Premium Retention Offer"
            cost = 70.0
            reason = "High positive uplift + high customer value"
        elif ev_saved_base >= 60.0 and v_seg in ["High Value", "Very High Value"]:
            offer = "Medium Discount"
            cost = 40.0
            reason = "High positive uplift + high customer value"
        elif ev_saved_base >= 45.0 and p_seg in ["HIGHLY PERSUADABLE", "PERSUADABLE"]:
            offer = "Free Premium Trial"
            cost = 30.0
            reason = "Substantial uplift justifies premium trial"
        elif ev_saved_base >= 30.0:
            offer = "Small Discount"
            cost = 20.0
            reason = "Positive uplift with solid net expected value"
        elif ev_saved_base >= 20.0:
            offer = "Priority Support"
            cost = 15.0
            reason = "Moderate uplift with low offer cost"
        elif ev_saved_base >= 10.0:
            offer = "Loyalty Reward"
            cost = 10.0
            reason = "Moderate uplift but low offer cost"
        else:
            offer = "No Action"
            cost = 0.0
            if c_prob >= 0.50 and up <= 0.001:
                reason = "High churn risk but low estimated intervention response"
            elif up < -0.001:
                reason = "Negative estimated treatment uplift (avoid contact)"
            else:
                reason = "No Action because expected benefit does not justify offer cost"
                
        if offer == "No Action":
            ev_saved = 0.0
            roi = 0.0
        else:
            ev_saved = ev_saved_base
            roi = ev_saved / cost
            
        recommendations.append({
            "customer_id": c_id,
            "churn_probability": c_prob,
            "risk_level": r_level,
            "control_churn_probability": ctrl_prob,
            "treatment_churn_probability": treat_prob,
            "uplift": up,
            "persuadability_segment": p_seg,
            "customer_value_eur": c_val,
            "customer_value_segment": v_seg,
            "recommended_offer": offer,
            "recommended_offer_cost": cost,
            "recommended_expected_value": np.round(ev_saved, 2),
            "recommended_roi": np.round(roi, 2),
            "recommendation_reason": reason
        })
        
    rec_df = pd.DataFrame(recommendations)
    
    # Save processed/customer_offer_recommendations.csv
    rec_df.to_csv("processed/customer_offer_recommendations.csv", index=False)
    print("Saved processed/customer_offer_recommendations.csv")
    
    # Calculate Summary Statistics
    active_df = rec_df[rec_df["recommended_offer"] != "No Action"]
    no_action_count = (rec_df["recommended_offer"] == "No Action").sum()
    total_ev = active_df["recommended_expected_value"].sum()
    avg_ev = active_df["recommended_expected_value"].mean() if len(active_df) > 0 else 0.0
    avg_roi = active_df["recommended_roi"].mean() if len(active_df) > 0 else 0.0
    
    offer_dist = rec_df["recommended_offer"].value_counts()
    val_dist = rec_df["customer_value_segment"].value_counts()
    
    print("\n--- SUMMARY OF RESULTS ---")
    print(f"Customer Value Distribution:\n{val_dist.to_dict()}")
    print(f"Offer Recommendation Distribution:\n{offer_dist.to_dict()}")
    print(f"No Action Count: {no_action_count:,} ({no_action_count / len(rec_df):.2%})")
    print(f"Active Recommendations: {len(active_df):,} ({len(active_df) / len(rec_df):.2%})")
    print(f"Total Expected Value Saved: EUR {total_ev:,.2f}")
    print(f"Average Expected Value (Active): EUR {avg_ev:.2f}")
    print(f"Average ROI (Active): {avg_roi:.2f}x")
    
    # Generate Top 20 Recommended Customer Pairs
    top20_df = active_df.sort_values(by="recommended_expected_value", ascending=False).head(20)
    
    # =========================================================================
    # PART E — REPORT GENERATION
    # =========================================================================
    report_md = f"""# Customer Value Simulation & Retention Offer Recommendation Report

## 1. Executive Summary
This report documents Step 5 of the retention decision engine: transforming uplift estimates and customer profile metrics into economically sound, personalized retention actions.

- **Total Customer Base Analyzed**: {len(rec_df):,} customers
- **Customers Recommended for Intervention**: **{len(active_df):,}** ({len(active_df)/len(rec_df):.2%})
- **Customers Recommended for "No Action"**: **{no_action_count:,}** ({no_action_count/len(rec_df):.2%})
- **Total Expected Incremental Value Saved**: **EUR {total_ev:,.2f}**
- **Average Expected Value per Active Recommendation**: **EUR {avg_ev:.2f}**
- **Average Return on Investment (ROI)**: **{avg_roi:.2f}x**

---

## 2. Business Value Simulation Assumptions
Because the Orange Belgium research dataset is anonymized and does not contain raw financial billing or ARPU fields, we implement a transparent, defensible **Business Simulation Layer**:

### Assumptions & Formulas:
1. **Activity Index**: Derived from normalized principal components `PC1` and `PC2` (which capture continuous usage, contract size, and network traffic):
   $$\\text{{activity\\_score}} = 0.60 \\times \\text{{rank\\_pct}}(PC1) + 0.40 \\times \\text{{rank\\_pct}}(PC2) \\in [0, 1]$$
2. **Simulated Monthly ARPU**: Calibrated to representative European telecom postpaid tiers (EUR 25 to EUR 70/month):
   $$\\text{{monthly\\_arpu}} = 25.0 + 45.0 \\times \\text{{activity\\_score}}$$
3. **Customer Retention Horizon**: Projected customer lifetime based on baseline retention probability $(1 - \\text{{churn\\_probability}})$:
   $$\\text{{horizon\\_years}} = 1.0 + 1.5 \\times (1.0 - \\text{{churn\\_probability}})$$
4. **Customer Lifetime Value (EUR)**:
   $$\\text{{customer\\_value\\_eur}} = \\text{{monthly\\_arpu}} \\times 12 \\times \\text{{horizon\\_years}}$$

> [!NOTE]
> **Data Integrity Guarantee**: `customer_id`, actual `churned` status, and actual `treatment` assignment were **NOT** used as direct inputs to the customer value calculation.

---

## 3. Customer Value Segmentation

| Value Segment | EUR Value Range | Customer Count | Share (%) | Mean Value (EUR) |
|---|---|---|---|---|
| **Low Value** | EUR {customer_value_eur.min():.2f} – EUR {q25:.2f} | {(customer_value_segment == 'Low Value').sum():,} | 25.00% | EUR {customer_value_eur[customer_value_segment == 'Low Value'].mean():.2f} |
| **Medium Value** | EUR {q25:.2f} – EUR {q50:.2f} | {(customer_value_segment == 'Medium Value').sum():,} | 25.00% | EUR {customer_value_eur[customer_value_segment == 'Medium Value'].mean():.2f} |
| **High Value** | EUR {q50:.2f} – EUR {q75:.2f} | {(customer_value_segment == 'High Value').sum():,} | 25.00% | EUR {customer_value_eur[customer_value_segment == 'High Value'].mean():.2f} |
| **Very High Value** | EUR {q75:.2f} – EUR {customer_value_eur.max():.2f} | {(customer_value_segment == 'Very High Value').sum():,} | 25.00% | EUR {customer_value_eur[customer_value_segment == 'Very High Value'].mean():.2f} |

---

## 4. Retention Offer Library & Economic Framework

From `offers.csv`:

| Offer ID | Action Name | Cost (EUR) | Action Type | Eligibility Condition |
|---|---|---|---|---|
| **O04** | Premium Retention Offer | EUR 70 | Premium Offer | $\\text{{EV}} \\ge 100$, Very High Value, Highly Persuadable |
| **O03** | Medium Discount | EUR 40 | Discount | $\\text{{EV}} \\ge 60$, High / Very High Value |
| **O06** | Free Premium Trial | EUR 30 | Trial | $\\text{{EV}} \\ge 45$, Persuadable / Highly Persuadable |
| **O02** | Small Discount | EUR 20 | Discount | $\\text{{EV}} \\ge 30$, Positive Uplift |
| **O05** | Priority Support | EUR 15 | Service Recovery | $\\text{{EV}} \\ge 20$, Moderate Uplift |
| **O01** | Loyalty Reward | EUR 10 | Loyalty Reward | $\\text{{EV}} \\ge 10$, Moderate Uplift |
| **O00** | No Action | EUR 0 | Control | $\\text{{EV}} < 10$ or Uplift $\\le 0$ |

### Core Economic Definitions:
- $\\text{{expected\\_value\\_saved}} = \\max(\\text{{uplift}}, 0) \\times \\text{{customer\\_value\\_eur}}$
- $\\text{{net\\_expected\\_value}} = \\text{{expected\\_value\\_saved}} - \\text{{offer\\_cost\\_eur}}$
- $\\text{{roi}} = \\frac{{\\text{{expected\\_value\\_saved}}}}{{\\text{{offer\\_cost\\_eur}}}}$ *(For No Action: cost = 0, EV = 0, ROI = 0)*

---

## 5. Offer Recommendation Distribution

| Recommended Offer | Offer Cost (EUR) | Customers | Share (%) | Total EV Saved (EUR) | Avg ROI |
|---|---|---|---|---|---|
"""
    for off, grp in rec_df.groupby("recommended_offer"):
        cost = grp["recommended_offer_cost"].iloc[0]
        cnt = len(grp)
        pct = cnt / len(rec_df) * 100
        ev_sum = grp["recommended_expected_value"].sum()
        avg_r = grp["recommended_roi"].mean()
        report_md += f"| **{off}** | EUR {cost:.2f} | {cnt:,} | {pct:.2f}% | EUR {ev_sum:,.2f} | {avg_r:.2f}x |\n"

    report_md += f"""
---

## 6. Recommendation Reason Distribution

| Reason | Customers | Share (%) | Primary Driver |
|---|---|---|---|
"""
    for r_reason, r_grp in rec_df.groupby("recommendation_reason"):
        cnt = len(r_grp)
        pct = cnt / len(rec_df) * 100
        report_md += f"| {r_reason} | {cnt:,} | {pct:.2f}% | Model Decision Rule |\n"

    report_md += f"""
---

## 7. Top 20 Recommended Customer-Action Pairs

| Rank | Customer ID | Churn Prob | Uplift | Customer Value (EUR) | Recommended Offer | Cost (EUR) | Expected Value Saved | ROI | Recommendation Reason |
|---|---|---|---|---|---|---|---|---|---|
"""
    for rank, (_, row) in enumerate(top20_df.iterrows(), 1):
        report_md += f"| {rank} | `{row['customer_id']}` | {row['churn_probability']:.4f} | +{row['uplift']:.4f} | EUR {row['customer_value_eur']:.2f} | **{row['recommended_offer']}** | EUR {row['recommended_offer_cost']:.0f} | EUR {row['recommended_expected_value']:.2f} | **{row['recommended_roi']:.2f}x** | {row['recommendation_reason']} |\n"

    report_md += """
---

## 8. Limitations & Business Governance
1. **Simulated Revenue Inputs**: While calibrated to European telecom market norms, customer value reflects simulation logic rather than actual Orange Belgium billing logs.
2. **Static Offer Cost**: Offers assume a fixed per-customer direct cost without operational fulfillment overhead or volume-discount tiers.
3. **No Cannibalization Modeling**: The model assumes customers only take the offer if targeted; self-selection or customer-inquiry spillover effects are not modeled.
4. **Budget Constraints**: This recommendation policy identifies all economically justifiable actions. If a fixed budget cap is imposed, actions should be greedily selected in descending order of `recommended_roi` or `net_expected_value`.
"""

    with open("processed/offer_recommendation_report.md", "w", encoding="utf-8") as f:
        f.write(report_md)
    print("Saved processed/offer_recommendation_report.md")

if __name__ == "__main__":
    main()
