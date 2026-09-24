from pathlib import Path
import json
import hashlib
import pandas as pd
import openml

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
PROCESSED = ROOT / "processed"
RAW.mkdir(exist_ok=True)
PROCESSED.mkdir(exist_ok=True)

DATASET_ID = 45580
OUT = PROCESSED / "orange_churn_uplift_ready.csv"
META = PROCESSED / "dataset_metadata.json"

print(f"Loading OpenML dataset {DATASET_ID} ...")
ds = openml.datasets.get_dataset(DATASET_ID, download_data=True)

# Retrieve the complete feature table and metadata without making assumptions
# about which column OpenML chooses as the default target.
X, y_default, categorical_indicator, attribute_names = ds.get_data(
    dataset_format="dataframe",
    target=None,
)

df = X.copy()

# Normalize likely target/treatment names without altering values.
cols_lower = {str(c).lower(): c for c in df.columns}

t_col = cols_lower.get("t") or cols_lower.get("treatment")
y_col = cols_lower.get("y") or cols_lower.get("churn")

if t_col is None or y_col is None:
    raise RuntimeError(
        f"Could not find treatment/outcome columns. Columns returned: {list(df.columns)[:20]} ..."
    )

# Put t and y at the end and add a deterministic local customer ID.
feature_cols = [c for c in df.columns if c not in (t_col, y_col)]
out = df[feature_cols + [t_col, y_col]].copy()
out.insert(0, "customer_id", [f"C{i:05d}" for i in range(1, len(out) + 1)])
out = out.rename(columns={t_col: "treatment", y_col: "churned"})

# Basic integrity checks.
assert len(out) > 0
assert set(out["treatment"].dropna().unique()).issubset({0, 1})
assert set(out["churned"].dropna().unique()).issubset({0, 1})

out.to_csv(OUT, index=False)

meta = {
    "openml_dataset_id": DATASET_ID,
    "openml_name": getattr(ds, "name", None),
    "rows": int(len(out)),
    "columns": int(len(out.columns)),
    "feature_columns": len(feature_cols),
    "treatment_column": "treatment",
    "outcome_column": "churned",
    "treatment_rate": float(out["treatment"].mean()),
    "churn_rate": float(out["churned"].mean()),
    "source": "OpenML 45580 / Orange Belgium Churn Uplift Dataset",
}
META.write_text(json.dumps(meta, indent=2), encoding="utf-8")

print(f"Saved: {OUT}")
print(json.dumps(meta, indent=2))
