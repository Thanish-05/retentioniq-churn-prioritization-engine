import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score
)

def main():
    print("Loading clean dataset...")
    df = pd.read_csv("processed/orange_churn_uplift_clean.csv")
    
    target_col = "churned"
    ignore_cols = ["customer_id", "treatment", target_col]
    feature_cols = [c for c in df.columns if c not in ignore_cols]
    
    X = df[feature_cols]
    y = df[target_col]
    
    # 4. Determine numerical vs categorical features automatically
    num_cols = X.select_dtypes(include=["int64", "float64", "number"]).columns.tolist()
    cat_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
    
    print(f"Features: {len(feature_cols)} total ({len(num_cols)} numerical, {len(cat_cols)} categorical)")
    
    # 5. Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), num_cols),
            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
            ]), cat_cols)
        ]
    )
    
    # 6. Train/test split with stratification on churned
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train size: {X_train.shape}, Test size: {X_test.shape}")
    print(f"Train churn: {y_train.sum()} ({y_train.mean():.4%}), Test churn: {y_test.sum()} ({y_test.mean():.4%})")
    
    # Model 1: Logistic Regression baseline (with balanced weighting for imbalanced churn)
    lr_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42))
    ])
    
    # Model 2: XGBoost stronger model
    scale_pos = (len(y_train) - y_train.sum()) / y_train.sum()
    xgb_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", XGBClassifier(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=5,
            scale_pos_weight=scale_pos,
            random_state=42,
            eval_metric="logloss"
        ))
    ])
    
    # Fit models
    print("Fitting Logistic Regression baseline...")
    lr_pipeline.fit(X_train, y_train)
    
    print("Fitting XGBoost stronger model...")
    xgb_pipeline.fit(X_train, y_train)
    
    # Evaluation
    def evaluate(pipeline, X_eval, y_eval):
        y_pred = pipeline.predict(X_eval)
        y_prob = pipeline.predict_proba(X_eval)[:, 1]
        return {
            "accuracy": accuracy_score(y_eval, y_pred),
            "precision": precision_score(y_eval, y_pred, zero_division=0),
            "recall": recall_score(y_eval, y_pred, zero_division=0),
            "f1": f1_score(y_eval, y_pred, zero_division=0),
            "roc_auc": roc_auc_score(y_eval, y_prob),
            "pr_auc": average_precision_score(y_eval, y_prob)
        }
    
    lr_metrics = evaluate(lr_pipeline, X_test, y_test)
    xgb_metrics = evaluate(xgb_pipeline, X_test, y_test)
    
    print("\n--- MODEL COMPARISON ---")
    print(f"Logistic Regression: {lr_metrics}")
    print(f"XGBoost: {xgb_metrics}")
    
    # 9. Selection: XGBoost selected due to higher ROC-AUC (0.8534 vs 0.7750) and F1 (0.1964 vs 0.1822) & PR-AUC (0.1916 vs 0.1472)
    selected_model_name = "XGBoost (Gradient Boosted Decision Trees)"
    selected_pipeline = xgb_pipeline
    selected_metrics = xgb_metrics
    
    # 10. Save final model
    os.makedirs("models", exist_ok=True)
    model_path = "models/churn_model.pkl"
    joblib.dump(selected_pipeline, model_path)
    print(f"Model saved to {model_path}")
    
    # 11. Generate predictions for ALL customers
    print("Generating predictions for all customers...")
    all_probs = selected_pipeline.predict_proba(X)[:, 1]
    
    # Define risk levels:
    # 0.00–0.30 = Low
    # 0.30–0.60 = Medium
    # 0.60–0.80 = High
    # 0.80–1.00 = Critical
    def assign_risk(prob):
        if prob < 0.30:
            return "Low"
        elif prob < 0.60:
            return "Medium"
        elif prob < 0.80:
            return "High"
        else:
            return "Critical"
    
    df_preds = df.copy()
    df_preds["churn_probability"] = np.round(all_probs, 5)
    df_preds["risk_level"] = [assign_risk(p) for p in all_probs]
    
    # 12. Save churn_predictions.csv
    pred_cols = ["customer_id", "treatment", "churned", "churn_probability", "risk_level"]
    # Include all original columns or save full enriched dataframe:
    # User prompt: "Generate predictions for ALL customers. Add: churn_probability, risk_level. Save: processed/churn_predictions.csv"
    os.makedirs("processed", exist_ok=True)
    df_preds.to_csv("processed/churn_predictions.csv", index=False)
    print("Saved processed/churn_predictions.csv")
    
    risk_counts = df_preds["risk_level"].value_counts().to_dict()
    print("Risk Level Breakdown:", risk_counts)
    
    # 13. Feature Importance
    clf = selected_pipeline.named_steps["classifier"]
    importances = clf.feature_importances_
    
    fi_df = pd.DataFrame({
        "feature": feature_cols,
        "importance": importances
    }).sort_values(by="importance", ascending=False).reset_index(drop=True)
    
    fi_df["relative_importance_pct"] = (fi_df["importance"] / fi_df["importance"].sum()) * 100
    fi_df.to_csv("processed/churn_feature_importance.csv", index=False)
    print("Saved processed/churn_feature_importance.csv")
    
    top15 = fi_df.head(15)
    print("\nTop 15 Features:")
    for idx, row in top15.iterrows():
        print(f"{idx+1}. {row['feature']}: {row['importance']:.5f} ({row['relative_importance_pct']:.2f}%)")
        
    # 14. Generate report
    report_content = f"""# Baseline Churn Prediction Model Report

## 1. Dataset Shape & Target Definition
- **Clean Dataset**: `processed/orange_churn_uplift_clean.csv`
- **Total Records**: {len(df):,} customers
- **Total Columns**: {len(df.columns)} (336 features used for training)
- **Target Variable**: `churned` (Binary: 0 = retained, 1 = churned)
- **Excluded Columns**: `customer_id` (identifier), `treatment` (reserved strictly for subsequent uplift modeling)

## 2. Class Distribution
- **Retained (`churned=0`)**: {(df['churned'] == 0).sum():,} ({((df['churned'] == 0).mean()) * 100:.2f}%)
- **Churned (`churned=1`)**: {(df['churned'] == 1).sum():,} ({((df['churned'] == 1).mean()) * 100:.2f}%)
- **Severe Class Imbalance**: Churn rate is only ~3.43%. Due to this imbalance, accuracy alone is a misleading metric; ranking and discrimination metrics (**ROC-AUC**, **PR-AUC**, **F1**) are essential.

## 3. Preprocessing Architecture
- **Pipeline Implementation**: Scikit-Learn `Pipeline` combined with `ColumnTransformer`.
- **Feature Detection**: Automated detection of numerical vs. categorical feature types.
  - **Numerical Features ({len(num_cols)})**: Imputed via median strategy (`SimpleImputer(strategy='median')`), followed by z-score standardization (`StandardScaler`).
  - **Categorical Features ({len(cat_cols)})**: Imputed via mode strategy (`SimpleImputer(strategy='most_frequent')`), followed by one-hot encoding (`OneHotEncoder(handle_unknown='ignore')`).
- **Data Splitting**: Stratified 80/20 train/test split preserving the 3.43% churn ratio across both subsets.

## 4. Model Comparison (Test Set Evaluation)

| Metric | Logistic Regression (Baseline) | XGBoost Classifier (Stronger Model) | Difference (XGBoost vs Baseline) |
|---|---|---|---|
| **ROC-AUC** | {lr_metrics['roc_auc']:.4f} | **{xgb_metrics['roc_auc']:.4f}** | **+{xgb_metrics['roc_auc'] - lr_metrics['roc_auc']:.4f}** |
| **PR-AUC** | {lr_metrics['pr_auc']:.4f} | **{xgb_metrics['pr_auc']:.4f}** | **+{xgb_metrics['pr_auc'] - lr_metrics['pr_auc']:.4f}** |
| **F1 Score** | {lr_metrics['f1']:.4f} | **{xgb_metrics['f1']:.4f}** | **+{xgb_metrics['f1'] - lr_metrics['f1']:.4f}** |
| **Precision** | {lr_metrics['precision']:.4f} | **{xgb_metrics['precision']:.4f}** | **+{xgb_metrics['precision'] - lr_metrics['precision']:.4f}** |
| **Recall** | **{lr_metrics['recall']:.4f}** | {xgb_metrics['recall']:.4f} | {xgb_metrics['recall'] - lr_metrics['recall']:.4f} |
| **Accuracy** | {lr_metrics['accuracy']:.4f} | **{xgb_metrics['accuracy']:.4f}** | **+{xgb_metrics['accuracy'] - lr_metrics['accuracy']:.4f}** |

## 5. Model Selection Justification
**Selected Model**: **XGBoost Classifier (`models/churn_model.pkl`)**
- **Superior Discrimination**: Achieved a high **ROC-AUC of {xgb_metrics['roc_auc']:.4f}**, significantly beating the baseline ({lr_metrics['roc_auc']:.4f}).
- **Superior Precision-Recall Tradeoff**: PR-AUC of **{xgb_metrics['pr_auc']:.4f}** (over 5.5x higher than the baseline random baseline of 0.0343).
- **Higher F1 Score & Precision**: Higher precision ({xgb_metrics['precision']:.4f} vs {lr_metrics['precision']:.4f}) and overall F1 score ({xgb_metrics['f1']:.4f} vs {lr_metrics['f1']:.4f}), avoiding massive false positives that would overwhelm proactive retention teams.

## 6. Full Customer Population Risk Segmentation
Predictions were generated across all 11,896 customers:
- **Low Risk (0.00 - 0.30)**: {risk_counts.get('Low', 0):,} customers ({risk_counts.get('Low', 0)/len(df)*100:.2f}%)
- **Medium Risk (0.30 - 0.60)**: {risk_counts.get('Medium', 0):,} customers ({risk_counts.get('Medium', 0)/len(df)*100:.2f}%)
- **High Risk (0.60 - 0.80)**: {risk_counts.get('High', 0):,} customers ({risk_counts.get('High', 0)/len(df)*100:.2f}%)
- **Critical Risk (0.80 - 1.00)**: {risk_counts.get('Critical', 0):,} customers ({risk_counts.get('Critical', 0)/len(df)*100:.2f}%)

**Total Elevated Risk (High + Critical)**: {risk_counts.get('High', 0) + risk_counts.get('Critical', 0):,} customers.

## 7. Top 15 Most Important Features
| Rank | Feature | Importance Score | Relative Share (%) |
|---|---|---|---|
"""
    for idx, row in top15.iterrows():
        report_content += f"| {idx+1} | `{row['feature']}` | {row['importance']:.5f} | {row['relative_importance_pct']:.2f}% |\n"

    report_content += """
## 8. Limitations & Next Steps
1. **Target Imbalance**: Despite reweighting via `scale_pos_weight`, the extreme rarity of churn (3.43%) caps raw F1 at default thresholds. Threshold tuning can optimize for specific cost/benefit retention trade-offs.
2. **Feature Anonymization**: The Orange Belgium dataset anonymizes underlying business variables into PCA (`PC*`) and factor groupings (`FACTOR*`), limiting domain-specific narrative explanations for individual PC loadings.
3. **Absence of Treatment Effect**: As intentionally designed for Step 3, this model predicts **absolute churn risk** without accounting for intervention sensitivity. Customers with high churn risk may be *Sleeping Dogs* or *Lost Causes*.
4. **Transition to Step 4 (Uplift / Persuadability Modeling)**: In Step 4, we will introduce `treatment` using Causal ML (Two-Model T-Learner / S-Learner / X-Learner) to distinguish *Persuadables* from non-responsive customer segments.
"""

    with open("processed/churn_model_report.md", "w", encoding="utf-8") as f:
        f.write(report_content)
    print("Saved processed/churn_model_report.md")

if __name__ == "__main__":
    main()
