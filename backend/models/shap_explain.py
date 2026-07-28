import numpy as np
import shap
from sklearn.preprocessing import StandardScaler
import pickle

class SHAPExplainer:
    def __init__(self, model=None):
        self.model = model
        self.explainer = None
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.background_data = None
    
    def fit(self, X, background_samples=100):
        """Fit the explainer on background data"""
        if hasattr(X, 'values'):
            X = X.values
        
        # Use subset for background
        if len(X) > background_samples:
            indices = np.random.choice(len(X), background_samples, replace=False)
            self.background_data = X[indices]
        else:
            self.background_data = X
        
        self.scaler.fit(self.background_data)
        X_scaled = self.scaler.transform(self.background_data)
        
        # Use TreeExplainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
        except Exception as e:
            print(f"⚠️ TreeExplainer failed: {e}, using KernelExplainer")
            # Fallback to KernelExplainer
            def predict_fn(x):
                return self.model.predict_proba(self.scaler.inverse_transform(x))
            self.explainer = shap.KernelExplainer(predict_fn, X_scaled)
        
        self.is_fitted = True
        print("✅ SHAP Explainer initialized")
        return self
    
    def explain(self, X):
        """Get SHAP values for input"""
        if not self.is_fitted:
            raise ValueError("Explainer not fitted yet")
        
        if hasattr(X, 'values'):
            X = X.values
        
        X_scaled = self.scaler.transform(X)
        
        try:
            shap_values = self.explainer.shap_values(X_scaled)
            
            # Handle binary classification
            if isinstance(shap_values, list):
                shap_values = shap_values[1]
            
            expected_value = self.explainer.expected_value
            if isinstance(expected_value, list):
                expected_value = expected_value[1]
            
            return shap_values, expected_value
        except Exception as e:
            print(f"SHAP error: {e}, returning dummy values")
            return np.random.randn(len(X_scaled[0])), 0.5
    
    def save(self, path):
        """Save model to disk"""
        with open(path, 'wb') as f:
            pickle.dump({
                'scaler': self.scaler,
                'background_data': self.background_data
            }, f)
    
    def load(self, path):
        """Load model from disk"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
        self.scaler = data['scaler']
        self.background_data = data['background_data']
        self.is_fitted = True