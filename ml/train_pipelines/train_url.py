import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, precision_recall_curve, auc
import joblib
from urllib.parse import urlparse

def calculate_entropy(text: str) -> float:
    if not text:
        return 0.0
    probabilities = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * np.log2(p) for p in probabilities)

def extract_url_features(url: str) -> list:
    parsed = urlparse(url)
    netloc = parsed.netloc
    
    url_len = len(url)
    digit_count = sum(c.isdigit() for c in url)
    special_chars = sum(url.count(c) for c in ['-', '_', '?', '=', '&', '%'])
    entropy = calculate_entropy(url)
    
    domain_len = len(netloc)
    # Subdomain count: count dots in host minus TLD
    parts = netloc.split('.')
    subdomains = max(0, len(parts) - 2)
    
    https_flag = 1 if parsed.scheme.lower() == "https" else 0
    
    keywords = ["lottery", "verify", "paytm", "sbi", "win", "discount", "free", "kyc", "login", "secure"]
    keyword_count = sum(url.lower().count(kw) for kw in keywords)
    
    return [url_len, digit_count, special_chars, entropy, domain_len, subdomains, https_flag, keyword_count]

def train_url_pipeline():
    os.makedirs("ml/models_registry/url", exist_ok=True)
    os.makedirs("experiments/url_benchmarks", exist_ok=True)
    
    csv_path = "datasets/raw/url/synthetic_url_dataset.csv"
    if not os.path.exists(csv_path):
        raise FileNotFoundError("Raw URL dataset is missing.")
        
    df = pd.read_csv(csv_path)
    X = np.array([extract_url_features(u) for u in df['url']])
    y = df['is_phishing'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Init classifiers
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(eval_metric='logloss', random_state=42)
    }
    
    results = {}
    
    for name, clf in models.items():
        clf.fit(X_train, y_train)
        preds = clf.predict(X_test)
        probs = clf.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        roc_auc = roc_auc_score(y_test, probs)
        
        precision_vals, recall_vals, _ = precision_recall_curve(y_test, probs)
        pr_auc = auc(recall_vals, precision_vals)
        
        results[name] = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "roc_auc": float(roc_auc),
            "pr_auc": float(pr_auc)
        }
        
        # Save model objects
        slug = name.lower().replace(" ", "_")
        joblib.dump(clf, f"ml/models_registry/url/{slug}.pkl")
        
    # Write experiment metrics logs
    import json
    with open("experiments/url_benchmarks/metrics.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print("URL classification pipeline trained and benchmark results exported.")

if __name__ == "__main__":
    train_url_pipeline()
