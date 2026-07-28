import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle

class ClassifierModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = []
    
    def train(self, X, y):
        if hasattr(X, 'values'):
            X = X.values
        if hasattr(y, 'values'):
            y = y.values
        self.feature_names = [f'feature_{i}' for i in range(X.shape[1])]
        X_scaled = self.scaler.fit_transform(X)
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        print(f"✅ Classifier trained on {len(X)} samples")
        return self
    
    def predict(self, X):
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        if hasattr(X, 'values'):
            X = X.values
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def predict_proba(self, X):
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        if hasattr(X, 'values'):
            X = X.values
        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)
    
    def save(self, path):
        with open(path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names
            }, f)
    
    def load(self, path):
        with open(path, 'rb') as f:
            data = pickle.load(f)
        self.model = data['model']
        self.scaler = data['scaler']
        self.feature_names = data.get('feature_names', [])
        self.is_trained = True