import os
import json
import csv
import pandas as pd

def run_master_benchmark():
    print("Starting master benchmarking run...")
    
    url_path = "experiments/url_benchmarks/metrics.json"
    nlp_path = "experiments/nlp_benchmarks/metrics.json"
    fusion_path = "experiments/fusion_tests/metrics.json"
    calib_path = "experiments/calibration_tests/metrics.json"
    
    # Load separate experiment reports
    url_metrics = {}
    nlp_metrics = {}
    fusion_metrics = {}
    calib_metrics = {}
    
    if os.path.exists(url_path):
        with open(url_path, "r") as f:
            url_metrics = json.load(f)
            
    if os.path.exists(nlp_path):
        with open(nlp_path, "r") as f:
            nlp_metrics = json.load(f)
            
    if os.path.exists(fusion_path):
        with open(fusion_path, "r") as f:
            fusion_metrics = json.load(f)
            
    if os.path.exists(calib_path):
        with open(calib_path, "r") as f:
            calib_metrics = json.load(f)
            
    master_report = {
        "url_models": url_metrics,
        "nlp_models": nlp_metrics,
        "fusion_ablation": fusion_metrics,
        "calibration": calib_metrics
    }
    
    # Export as master JSON
    os.makedirs("experiments", exist_ok=True)
    with open("experiments/master_benchmarks.json", "w") as f:
        json.dump(master_report, f, indent=2)
        
    # Export as tabular CSV summaries for research sheets
    csv_rows = []
    
    # Add URL model rows
    for model_name, metrics in url_metrics.items():
        row = {"pipeline": "URL Detection", "model_identifier": model_name}
        row.update(metrics)
        csv_rows.append(row)
        
    # Add NLP model rows
    for model_name, metrics in nlp_metrics.items():
        row = {"pipeline": "NLP Lure Detection", "model_identifier": model_name}
        row.update(metrics)
        csv_rows.append(row)
        
    # Add Fusion ablation rows
    for configuration, metrics in fusion_metrics.items():
        row = {"pipeline": "Signal Fusion Ablation", "model_identifier": configuration}
        row.update(metrics)
        csv_rows.append(row)
        
    # Save CSV
    df = pd.DataFrame(csv_rows)
    df.to_csv("experiments/master_benchmarks.csv", index=False)
    
    print("Master benchmark aggregates compiled and saved.")

if __name__ == "__main__":
    run_master_benchmark()
