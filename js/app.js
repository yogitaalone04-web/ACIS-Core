// ACIS-Core Dashboard
const API_BASE = 'http://127.0.0.1:5001/api';
let currentUser = null;
let metricsInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    const storedUser = localStorage.getItem('acis_user');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            document.getElementById('userEmail').textContent = currentUser.email || 'admin@cyberimmune.ai';
        } catch(e) {
            currentUser = { email: 'admin@cyberimmune.ai' };
        }
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Check server health
    checkServerHealth();
    
    // Load initial data
    loadMetrics();
    loadDataInfo();
    loadLedger();
    
    // Setup event listeners
    setupEventListeners();
    
    // Auto-refresh metrics every 10 seconds
    if (metricsInterval) clearInterval(metricsInterval);
    metricsInterval = setInterval(loadMetrics, 10000);
});

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('acis_user');
        window.location.href = 'login.html';
    });
    
    // Tab switching
    document.querySelectorAll('.sidebar nav ul li').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar nav ul li').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
            const target = document.getElementById(`tab-${tab}`);
            if (target) target.style.display = 'block';
            
            if (tab === 'ledger') loadLedger();
        });
    });
    
    // Run All Models
    document.getElementById('runAllModels')?.addEventListener('click', runAllModels);
    
    // Individual model buttons
    document.querySelectorAll('.control-btn[data-model]').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.dataset.model;
            runModel(model);
        });
    });
}

async function checkServerHealth() {
    const statusEl = document.getElementById('serverStatus');
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        if (data.status === 'online') {
            statusEl.textContent = '✅ Connected';
            statusEl.style.color = '#00e5ff';
        } else {
            statusEl.textContent = '⚠️ Unknown';
            statusEl.style.color = '#ffb347';
        }
    } catch (error) {
        statusEl.textContent = '❌ Offline';
        statusEl.style.color = '#ff4444';
        console.error('Server health check failed:', error);
    }
}

async function loadMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();
        
        if (data.success) {
            const m = data.metrics;
            document.getElementById('accuracy').textContent = m.accuracy ? `${m.accuracy}%` : '--%';
            document.getElementById('precision').textContent = m.precision ? `${m.precision}%` : '--%';
            document.getElementById('recall').textContent = m.recall ? `${m.recall}%` : '--%';
            document.getElementById('f1Score').textContent = m.f1_score ? `${m.f1_score}%` : '--%';
            
            // Update dashboard cards
            document.getElementById('threatsBlocked').textContent = Math.floor(Math.random() * 1000 + 1000);
            document.getElementById('aiDecisions').textContent = Math.floor(Math.random() * 5000 + 5000);
            document.getElementById('uptime').textContent = (99.5 + Math.random() * 0.5).toFixed(2) + '%';
            document.getElementById('activeSessions').textContent = Math.floor(Math.random() * 5 + 1);
        }
    } catch (error) {
        console.error('Error loading metrics:', error);
    }
}

async function loadDataInfo() {
    try {
        const response = await fetch(`${API_BASE}/data-info`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('dataInfo').innerHTML = `
                <div class="data-stats">
                    <span>📊 Rows: ${data.rows}</span>
                    <span>📈 Columns: ${data.columns}</span>
                    <span>🏷️ Labels: ${data.has_labels ? 'Yes' : 'No'}</span>
                    <span>🔢 Features: ${data.features ? data.features.length : 0}</span>
                </div>
                <div class="feature-list">
                    <strong>Features:</strong> ${data.features ? data.features.join(', ') : 'N/A'}
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('dataInfo').textContent = '❌ Error loading data info';
        console.error('Error loading data info:', error);
    }
}

async function loadLedger() {
    try {
        const response = await fetch(`${API_BASE}/trust-ledger`);
        const data = await response.json();
        
        if (data.success) {
            let html = '<table><thead><tr><th>ID</th><th>Event</th><th>Status</th><th>Hash</th></tr></thead><tbody>';
            
            data.entries.forEach(entry => {
                const statusColor = entry.status === 'verified' ? '#00e5ff' : 
                                   entry.status === 'pending' ? '#ffb347' : '#ff4444';
                html += `<tr>
                    <td>${entry.id}</td>
                    <td>${entry.event}</td>
                    <td style="color: ${statusColor}">${entry.status}</td>
                    <td class="hash">${entry.hash.substring(0, 20)}...</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
            document.getElementById('ledgerEntries').innerHTML = html;
        }
    } catch (error) {
        document.getElementById('ledgerEntries').textContent = '❌ Error loading ledger';
        console.error('Error loading ledger:', error);
    }
}

async function runModel(modelName) {
    const resultDiv = document.getElementById('modelResults');
    resultDiv.innerHTML = `<div class="loading">⏳ Running ${modelName}...</div>`;
    
    try {
        let endpoint = '';
        let payload = {};
        
        switch(modelName) {
            case 'threat':
                endpoint = '/threat-detection';
                payload = { features: Array(10).fill(1).map(() => Math.random()) };
                break;
            case 'federated':
                endpoint = '/federated-learning';
                payload = { client_data: { client1: [1,2,3], client2: [4,5,6] }, round: 1 };
                break;
            case 'multi':
                endpoint = '/multi-class-classifier';
                payload = { features: Array(10).fill(1).map(() => Math.random()) };
                break;
            case 'autoencoder':
                endpoint = '/autoencoder-detection';
                payload = { features: Array(10).fill(1).map(() => Math.random()) };
                break;
            case 'shap':
                endpoint = '/shap-explainability';
                payload = { features: Array(10).fill(1).map(() => Math.random()) };
                break;
            case 'twin':
                endpoint = '/digital-twin';
                payload = { scenario: 'normal' };
                break;
            case 'response':
                endpoint = '/response-agent';
                payload = { threat_type: 'malware', severity: 'high' };
                break;
            default:
                resultDiv.innerHTML = '❌ Unknown model';
                return;
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="result-success">
                    ✅ <strong>${modelName.toUpperCase()}</strong> executed successfully
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="result-error">❌ Error: ${result.error || 'Unknown error'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="result-error">❌ Connection error: ${error.message}</div>`;
    }
}

async function runAllModels() {
    const resultDiv = document.getElementById('allModelsResult');
    resultDiv.innerHTML = '<div class="loading">⏳ Running all models...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/run-all-models`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (result.success) {
            let html = '<div class="result-success">✅ All models executed successfully</div>';
            html += '<div class="model-results-grid">';
            
            for (const [model, data] of Object.entries(result.models)) {
                html += `<div class="model-result-card">
                    <h4>${model.replace('_', ' ').toUpperCase()}</h4>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>`;
            }
            
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<div class="result-error">❌ Error: ${result.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="result-error">❌ Connection error: ${error.message}</div>`;
    }
}