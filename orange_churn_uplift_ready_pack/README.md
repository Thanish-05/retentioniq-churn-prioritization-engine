# Orange Belgium Churn Uplift — Ready-to-Use Hackathon Data Pack

## What this pack is

This pack prepares the official **Orange Belgium Churn Uplift Dataset** for a churn + uplift + retention-budget hackathon pipeline.

The official benchmark is OpenML dataset **45580**. It contains **11,896 customers**, **160 anonymized numerical PCA components**, **18 anonymized categorical factors**, a randomized treatment indicator (`t`), and a churn outcome (`y`) measured within two months. The data comes from Orange Belgium retention campaigns conducted in September–December 2020.

## Why the treatment column matters

`treatment = 0` means control and `treatment = 1` means treated/intervened.

`churned = 0` means the customer did not churn in the follow-up period; `churned = 1` means churned.

This enables treatment-aware / uplift modeling instead of only ordinary churn prediction.

## Generate the actual ready CSV

Create a Python environment and run:

```bash
pip install -r requirements.txt
python download_and_prepare.py
```

The script downloads the official OpenML dataset and creates:

```text
processed/orange_churn_uplift_ready.csv
```

The processed CSV adds a simple `customer_id` and renames:

```text
t -> treatment
y -> churned
```

It does NOT invent treatment assignments, churn labels, or causal effects.

## Business layer for the hackathon

The original research data is anonymized, so business concepts such as monthly revenue, offer price, and customer lifetime value are not directly present. Keep those as explicit **business assumptions** rather than pretending they were observed in the source data.

Use `offers.csv` as a starting point for illustrative retention actions. Replace the costs/effectiveness assumptions during the hackathon if the team has a more defensible scheme.

## Recommended model flow

```text
Customer features
  -> churn risk model
  -> treatment-aware uplift model
  -> customer segment
  -> action/offer policy
  -> expected incremental value
  -> budget-constrained optimizer
```

## Source and citation

Official repository:
https://github.com/TheoVerhelst/Churn-Uplift-Dataset-Paper

OpenML dataset:
https://www.openml.org/d/45580

Paper:
Théo Verhelst, Denis Mercier, Jeevan Shrestha, Gianluca Bontempi,
“A Churn Prediction Dataset from the Telecom Sector: A New Benchmark for Uplift Modeling,” ECML PKDD 2025.
DOI: https://doi.org/10.1007/978-3-031-74640-6_21

Important limitation: all predictive features are anonymized. Do not describe PCA components as human-readable churn causes. For explanations in the app, use model-level feature labels such as `PC_17` unless you add a separate, clearly labeled synthetic/demo business interpretation layer.
