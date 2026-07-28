import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pickle

class AutoencoderModel:
    def __init__(self, n_components=4):
        self.n_components = n_components
        self.pca = PCA(n_components=n_components)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.input_dim = None
    
    def train(self, X, epochs=30, batch_size=32):
        """Train the autoencoder using PCA approximation"""
        if hasattr(X, 'values'):
            X = X.values
        
        self.input_dim = X.shape[1]
        X_scaled = self.scaler.fit_transform(X)
        
        # Use PCA as autoencoder approximation
        self.pca.fit(X_scaled)
        self.is_trained = True
        print(f"✅ Autoencoder trained with {self.n_components} latent dimensions")
        return self
    
    def reconstruct(self, X):
        """Reconstruct input data"""
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        if hasattr(X, 'values'):
            X = X.values
        
        X_scaled = self.scaler.transform(X)
        # Encode
        encoded = self.pca.transform(X_scaled)
        # Decode
        reconstructed = self.pca.inverse_transform(encoded)
        return self.scaler.inverse_transform(reconstructed)
    
    def anomaly_score(self, X):
        """Calculate reconstruction error as anomaly score"""
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        if hasattr(X, 'values'):
            X = X.values
        
        X_scaled = self.scaler.transform(X)
        encoded = self.pca.transform(X_scaled)
        reconstructed = self.pca.inverse_transform(encoded)
        mse = np.mean((X_scaled - reconstructed) ** 2, axis=1)
        return mse[0] if len(mse) == 1 else mse
    
    def save(self, path):
        """Save model to disk"""
        with open(path, 'wb') as f:
            pickle.dump({
                'pca': self.pca,
                'scaler': self.scaler,
                'n_components': self.n_components
            }, f)
    
    def load(self, path):
        """Load model from disk"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
        self.pca = data['pca']
        self.scaler = data['scaler']
        self.n_components = data['n_components']
        self.is_trained = True