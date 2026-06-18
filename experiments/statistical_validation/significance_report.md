# Statistical Validation Report

This report presents the p-values, confidence intervals, and significance conclusions of the comparisons across all subsystems.

## Comparison Table

| Comparison Pair | Wilcoxon p-value | McNemar p-value | Bootstrap 95% CI (Accuracy Diff) | Significant? | Conclusion |
|---|---|---|---|---|---|
| TFIDF_SVM vs MURIL | 0.000000 | 0.000000 | [0.8463, 0.8962] | **YES** | MuRIL shows distinct probability profile variations over standard TF-IDF representations. |
| URL_XGB vs RF | 0.000000 | 1.000000 | [0.0000, 0.0000] | **YES** | XGBoost URL classifier achieves a statistically significant decision improvement over Random Forest. |
| FUSION vs NLP | 0.000000 | 0.000000 | [-0.3862, -0.3213] | **YES** | XGBoost Fusion Meta-learner outperforms the NLP-only classifier by integrating URL and Graph features. |
| FUSION vs URL | 0.000000 | 0.000111 | [0.0600, 0.1887] | **YES** | XGBoost Fusion Meta-learner outperforms the URL-only classifier by incorporating linguistic threat indicators. |
