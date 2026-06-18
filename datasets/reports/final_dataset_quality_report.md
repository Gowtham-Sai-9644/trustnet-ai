# Final Dataset Quality Report

This report presents the final verified statistics for all expanded and deduplicated datasets used in the TrustNet AI capstone project.

| Dataset Name | File Path | Row Count | Column Count | File Size (KB) | Missing Fields | Duplicate % | Class Balance / Label Distribution |
|---|---|---|---|---|---|---|---|
| Synthetic URL Dataset | `datasets/raw/url/synthetic_url_dataset.csv` | 2000 | 2 | 105.57 | 0 | 6.40% | 1: 1000 (50.0%), 0: 1000 (50.0%) |
| PhiUSIIL URL Dataset | `datasets/raw/url/phiusiil_dataset.csv` | 235795 | 2 | 9065.15 | 0 | 0.18% | 1: 134850 (57.2%), 0: 100945 (42.8%) |
| PhishTank URL Dataset | `datasets/raw/url/phishtank_dataset.csv` | 5000 | 3 | 315.46 | 0 | 0.00% | yes: 5000 (100.0%) |
| Multilingual Scam Corpus | `datasets/raw/messages/synthetic_scam_corpus.csv` | 4000 | 4 | 583.32 | 2000 | 7.95% | 1: 2000 (50.0%), 0: 2000 (50.0%) |
| SMS Spam Collection | `datasets/raw/messages/sms_spam_collection.csv` | 5574 | 2 | 475.26 | 0 | 7.23% | ham: 4827 (86.6%), spam: 747 (13.4%) |

## Multilingual Vocabulary & Language Distribution

| Language | Sample Count | Percentage | Unique Texts |
|---|---|---|---|
| `hinglish` | 1000 | 25.0% | 863 |
| `hindi` | 1000 | 25.0% | 900 |
| `en` | 1000 | 25.0% | 952 |
| `telugu` | 1000 | 25.0% | 967 |

* **Total Words Count**: 48273
* **Vocabulary Size (Unique Words)**: 7836
