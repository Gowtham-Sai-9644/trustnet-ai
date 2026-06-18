import os
import pandas as pd
import numpy as np

def compile_report():
    os.makedirs("datasets/reports", exist_ok=True)
    report_path = "datasets/reports/final_dataset_quality_report.md"
    
    datasets = {
        "Synthetic URL Dataset": "datasets/raw/url/synthetic_url_dataset.csv",
        "PhiUSIIL URL Dataset": "datasets/raw/url/phiusiil_dataset.csv",
        "PhishTank URL Dataset": "datasets/raw/url/phishtank_dataset.csv",
        "Multilingual Scam Corpus": "datasets/raw/messages/synthetic_scam_corpus.csv",
        "SMS Spam Collection": "datasets/raw/messages/sms_spam_collection.csv"
    }
    
    lines = []
    lines.append("# Final Dataset Quality Report\n\n")
    lines.append("This report presents the final verified statistics for all expanded and deduplicated datasets used in the TrustNet AI threat intelligence validation.\n\n")
    lines.append("| Dataset Name | File Path | Row Count | Column Count | File Size (KB) | Missing Fields | Duplicate % | Class Balance / Label Distribution |\n")
    lines.append("|---|---|---|---|---|---|---|---|\n")
    
    for name, filepath in datasets.items():
        if not os.path.exists(filepath):
            lines.append(f"| {name} | `{filepath}` | N/A (Missing) | N/A | N/A | N/A | N/A | N/A |\n")
            continue
            
        df = pd.read_csv(filepath)
        rows = len(df)
        cols = len(df.columns)
        size_kb = os.path.getsize(filepath) / 1024.0
        missing = df.isnull().sum().sum()
        
        # duplicates
        if 'text' in df.columns:
            dup_rate = df.duplicated(subset=['text']).sum() / rows * 100.0
        elif 'url' in df.columns:
            dup_rate = df.duplicated(subset=['url']).sum() / rows * 100.0
        elif 'URL' in df.columns:
            dup_rate = df.duplicated(subset=['URL']).sum() / rows * 100.0
        else:
            dup_rate = df.duplicated().sum() / rows * 100.0
            
        # Class Balance
        class_dist = "N/A"
        if 'label' in df.columns:
            counts = df['label'].value_counts()
            class_dist = ", ".join([f"{k}: {v} ({v/rows*100.0:.1f}%)" for k, v in counts.items()])
        elif 'is_phishing' in df.columns:
            counts = df['is_phishing'].value_counts()
            class_dist = ", ".join([f"{k}: {v} ({v/rows*100.0:.1f}%)" for k, v in counts.items()])
        elif 'Label' in df.columns:
            counts = df['Label'].value_counts()
            class_dist = ", ".join([f"{k}: {v} ({v/rows*100.0:.1f}%)" for k, v in counts.items()])
        elif 'verified' in df.columns:
            counts = df['verified'].value_counts()
            class_dist = ", ".join([f"{k}: {v} ({v/rows*100.0:.1f}%)" for k, v in counts.items()])
            
        lines.append(f"| {name} | `{filepath}` | {rows} | {cols} | {size_kb:.2f} | {missing} | {dup_rate:.2f}% | {class_dist} |\n")
        
    lines.append("\n## Multilingual Vocabulary & Language Distribution\n\n")
    corpus_path = datasets["Multilingual Scam Corpus"]
    if os.path.exists(corpus_path):
        df_corpus = pd.read_csv(corpus_path)
        lang_counts = df_corpus['language'].value_counts()
        lines.append("| Language | Sample Count | Percentage | Unique Texts |\n")
        lines.append("|---|---|---|---|\n")
        for lang, count in lang_counts.items():
            lang_df = df_corpus[df_corpus['language'] == lang]
            unique_count = len(lang_df['text'].unique())
            lines.append(f"| `{lang}` | {count} | {count/len(df_corpus)*100.0:.1f}% | {unique_count} |\n")
            
        # Vocabulary size
        all_words = " ".join(df_corpus['text'].fillna("")).split()
        unique_words = set(all_words)
        lines.append(f"\n* **Total Words Count**: {len(all_words)}\n")
        lines.append(f"* **Vocabulary Size (Unique Words)**: {len(unique_words)}\n")
        
    with open(report_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Report compiled successfully")

if __name__ == "__main__":
    compile_report()
