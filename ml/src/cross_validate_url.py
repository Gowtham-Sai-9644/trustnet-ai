import os
import sys
import pandas as pd
import numpy as np

# Resolve path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from ml.train_pipelines.train_url import extract_url_features

def run_cross_validation():
    print("Running cross-validation on URL detection dataset...")
    os.makedirs("experiments/url_benchmarks", exist_ok=True)
    
    url_data_path = "datasets/raw/url/synthetic_url_dataset.csv"
    if not os.path.exists(url_data_path):
        print("Dataset missing, skipping.")
        return
        
    df = pd.read_csv(url_data_path)
    X = np.array([extract_url_features(u) for u in df['url']])
    y = df['is_phishing'].values
    
    # Stratified 5-Fold Cross Validation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(eval_metric='logloss', random_state=42)
    }
    
    fold_metrics_rows = []
    cv_summary_rows = []
    
    for name, model in models.items():
        accuracies = []
        precisions = []
        recalls = []
        f1s = []
        aucs = []
        
        fold_idx = 1
        for train_idx, val_idx in skf.split(X, y):
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            
            model.fit(X_train, y_train)
            preds = model.predict(X_val)
            probs = model.predict_proba(X_val)[:, 1]
            
            acc = accuracy_score(y_val, preds)
            prec = precision_score(y_val, preds, zero_division=0)
            rec = recall_score(y_val, preds, zero_division=0)
            f1 = f1_score(y_val, preds, zero_division=0)
            auc_val = roc_auc_score(y_val, probs)
            
            accuracies.append(acc)
            precisions.append(prec)
            recalls.append(rec)
            f1s.append(f1)
            aucs.append(auc_val)
            
            fold_metrics_rows.append({
                "model": name,
                "fold": fold_idx,
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1_score": f1,
                "roc_auc": auc_val
            })
            fold_idx += 1
            
        cv_summary_rows.append({
            "model": name,
            "accuracy_mean": np.mean(accuracies),
            "accuracy_std": np.std(accuracies),
            "precision_mean": np.mean(precisions),
            "precision_std": np.std(precisions),
            "recall_mean": np.mean(recalls),
            "recall_std": np.std(recalls),
            "f1_mean": np.mean(f1s),
            "f1_std": np.std(f1s),
            "roc_auc_mean": np.mean(aucs),
            "roc_auc_std": np.std(aucs)
        })
        
    df_fold = pd.DataFrame(fold_metrics_rows)
    df_fold.to_csv("experiments/url_benchmarks/fold_metrics.csv", index=False)
    
    df_summary = pd.DataFrame(cv_summary_rows)
    df_summary.to_csv("experiments/url_benchmarks/cv_results.csv", index=False)
    
    print("Cross-validation completed. fold_metrics.csv and cv_results.csv saved.")
    
    for row in cv_summary_rows:
        print(f"\n{row['model']}:")
        print(f"  Accuracy:  {row['accuracy_mean']:.4f} ± {row['accuracy_std']:.4f}")
        print(f"  Precision: {row['precision_mean']:.4f} ± {row['precision_std']:.4f}")
        print(f"  Recall:    {row['recall_mean']:.4f} ± {row['recall_std']:.4f}")
        print(f"  F1-Score:  {row['f1_mean']:.4f} ± {row['f1_std']:.4f}")
        print(f"  ROC-AUC:   {row['roc_auc_mean']:.4f} ± {row['roc_auc_std']:.4f}")

if __name__ == "__main__":
    run_cross_validation()
