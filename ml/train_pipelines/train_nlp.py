import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import json
import re

def clean_text(text: str) -> str:
    # Lowercase, clean emojis, remove punctuation and extra spaces
    text = text.lower()
    text = re.sub(r'[^\w\s\d]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_hinglish(text: str) -> str:
    # Simple lexical replacements for common Hinglish words to standardize vectors
    replacements = {
        "kamayein": "kamaye",
        "rozana": "daily",
        "paisey": "paisa",
        "jeeta": "won",
        "mubarak": "congratulations",
        "turant": "urgent"
    }
    words = text.split()
    normalized = [replacements.get(w, w) for w in words]
    return " ".join(normalized)

def train_nlp_pipeline():
    os.makedirs("ml/models_registry/nlp", exist_ok=True)
    os.makedirs("experiments/nlp_benchmarks", exist_ok=True)
    
    csv_path = "datasets/raw/messages/synthetic_scam_corpus.csv"
    if not os.path.exists(csv_path):
        raise FileNotFoundError("Raw messages dataset is missing.")
        
    df = pd.read_csv(csv_path)
    df['category'] = df['category'].fillna('None')
    df['cleaned_text'] = df['text'].apply(clean_text).apply(normalize_hinglish)
    
    X = df['cleaned_text'].values
    y = df['category'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 1. TF-IDF + SVM Pipeline
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    svm_clf = SVC(probability=True, kernel='linear', random_state=42)
    svm_clf.fit(X_train_tfidf, y_train)
    
    preds_svm = svm_clf.predict(X_test_tfidf)
    
    metrics_svm = {
        "accuracy": float(accuracy_score(y_test, preds_svm)),
        "precision": float(precision_score(y_test, preds_svm, average='macro', zero_division=0)),
        "recall": float(recall_score(y_test, preds_svm, average='macro', zero_division=0)),
        "f1_score": float(f1_score(y_test, preds_svm, average='macro', zero_division=0))
    }
    
    # Save SVM classifier and Vectorizer
    joblib.dump(svm_clf, "ml/models_registry/nlp/svm_classifier.pkl")
    joblib.dump(vectorizer, "ml/models_registry/nlp/tfidf_vectorizer.pkl")
    
    benchmarks = {
        "TF-IDF + SVM": metrics_svm
    }
    
    # Export report
    with open("experiments/nlp_benchmarks/metrics.json", "w") as f:
        json.dump(benchmarks, f, indent=2)
        
    print("NLP classification pipeline trained and real benchmarks exported.")

if __name__ == "__main__":
    train_nlp_pipeline()
