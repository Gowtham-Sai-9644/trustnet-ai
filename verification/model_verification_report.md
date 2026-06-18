# Model Verification Audit Report

| Model Name | File Path | Exists | Loads Successfully | Inference Executes | Details / Error |
|---|---|---|---|---|---|
| Logistic Regression (URL) | `ml/models_registry/url/logistic_regression.pkl` | YES | YES | YES (output: 0) | None |
| Random Forest (URL) | `ml/models_registry/url/random_forest.pkl` | YES | YES | YES (output: 0) | None |
| XGBoost (URL) | `ml/models_registry/url/xgboost.pkl` | YES | YES | YES (output: 0) | None |
| TF-IDF Vectorizer (NLP) | `ml/models_registry/nlp/tfidf_vectorizer.pkl` | YES | YES | YES (loaded wrapper) | None |
| SVM Classifier (NLP) | `ml/models_registry/nlp/svm_classifier.pkl` | YES | YES | YES (output: Fake Job Scam) | None |
| Meta Fusion XGBoost | `ml/models_registry/fusion/meta_fusion_xgb.pkl` | YES | YES | YES (output: 1) | None |
| Probability Calibrator | `ml/models_registry/calibration/calibrator_obj.pkl` | YES | YES | YES (calibrated: 0.9714285714285714) | None |
| MuRIL Checkpoint (safetensors) | `ml/models_registry/nlp/muril/model.safetensors` | YES | YES | YES (safetensors loaded) | None |
| IndicBERT Checkpoint (safetensors) | `ml/models_registry/nlp/indicbert/model.safetensors` | YES | YES | YES (safetensors loaded) | None |
