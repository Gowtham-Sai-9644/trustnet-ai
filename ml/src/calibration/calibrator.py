import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.isotonic import IsotonicRegression
from sklearn.metrics import brier_score_loss
import json

class ProbabilityCalibrator:
    def __init__(self):
        self.platt = None
        self.isotonic = None
        
    def fit(self, y_true: np.ndarray, y_prob: np.ndarray):
        # 1. Fit Platt Scaling (Logistic Regression on raw probabilities)
        self.platt = LogisticRegression(C=1e5)
        # Platt expects 2D features
        self.platt.fit(y_prob.reshape(-1, 1), y_true)
        
        # 2. Fit Isotonic Regression
        self.isotonic = IsotonicRegression(out_of_bounds='clip')
        self.isotonic.fit(y_prob, y_true)
        
    def calibrate_platt(self, y_prob: np.ndarray) -> np.ndarray:
        return self.platt.predict_proba(y_prob.reshape(-1, 1))[:, 1]
        
    def calibrate_isotonic(self, y_prob: np.ndarray) -> np.ndarray:
        return self.isotonic.predict(y_prob)

def calculate_ece(y_true: np.ndarray, y_prob: np.ndarray, n_bins: int = 10) -> float:
    """
    Computes Expected Calibration Error (ECE)
    """
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    n_samples = len(y_prob)
    
    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        
        # Identify indices in bin range
        in_bin = (y_prob >= bin_lower) & (y_prob < bin_upper)
        prop_in_bin = np.mean(in_bin)
        
        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(y_true[in_bin])
            avg_confidence_in_bin = np.mean(y_prob[in_bin])
            ece += prop_in_bin * np.abs(avg_confidence_in_bin - accuracy_in_bin)
            
    return float(ece)

def run_calibration_evaluation():
    os.makedirs("experiments/calibration_tests", exist_ok=True)
    os.makedirs("ml/models_registry/calibration", exist_ok=True)
    
    # Generate mock validation data for ECE/Brier scoring
    np.random.seed(42)
    y_val_true = np.random.choice([0, 1], size=1000, p=[0.5, 0.5])
    # Add noise to make raw probabilities uncalibrated (e.g. overconfident)
    y_val_prob = np.where(y_val_true == 1, 
                          np.random.beta(5, 2, size=1000), 
                          np.random.beta(2, 5, size=1000))
    
    calibrator = ProbabilityCalibrator()
    calibrator.fit(y_val_true, y_val_prob)
    
    # Save the fitted calibrator models
    import joblib
    joblib.dump(calibrator, "ml/models_registry/calibration/calibrator_obj.pkl")
    
    # Compute scores
    prob_platt = calibrator.calibrate_platt(y_val_prob)
    prob_isotonic = calibrator.calibrate_isotonic(y_val_prob)
    
    ece_raw = calculate_ece(y_val_true, y_val_prob)
    ece_platt = calculate_ece(y_val_true, prob_platt)
    ece_isotonic = calculate_ece(y_val_true, prob_isotonic)
    
    brier_raw = brier_score_loss(y_val_true, y_val_prob)
    brier_platt = brier_score_loss(y_val_true, prob_platt)
    brier_isotonic = brier_score_loss(y_val_true, prob_isotonic)
    
    results = {
        "raw": {"ece": float(ece_raw), "brier_score": float(brier_raw)},
        "platt": {"ece": float(ece_platt), "brier_score": float(brier_platt)},
        "isotonic": {"ece": float(ece_isotonic), "brier_score": float(brier_isotonic)}
    }
    
    # Export metrics
    with open("experiments/calibration_tests/metrics.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print("Calibration evaluation completed and calibrator parameters saved.")

if __name__ == "__main__":
    run_calibration_evaluation()
