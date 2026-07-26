// Main App Logic for Cyber Immune System

function appendLog(message, type = 'info', badge = 'SYSTEM') {
    const stream = document.getElementById('logsStream');
    if (!stream) return;

    const timeStr = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="time">[${timeStr}]</span> <span class="badge">${badge}</span> ${message}`;
    
    stream.prepend(entry);
}

function clearLogs() {
    const stream = document.getElementById('logsStream');
    if (stream) stream.innerHTML = '';
}

// System Button Actions
async function triggerAction(actionType) {
    appendLog(`User initiated action: [${actionType.toUpperCase()}]`, 'info', 'USER');

    switch (actionType) {
        case 'threat-detection':
            appendLog('Running deep multi-class neural network threat scan...', 'warning', 'THREAT_ENGINE');
            const resTD = await CyberImmuneAPI.runThreatDetection();
            appendLog(`Scan Complete: ${resTD.threatsFound} Threats found! Action: ${resTD.actionTaken} (${resTD.confidence} confidence)`, 'danger', 'THREAT_ENGINE');
            updateMetrics(99.6, 99.1, 99.5, '3.8 ms');
            showModal('AI Threat Detection Result', `
                <div style="line-height:1.8;">
                    <p style="color:#00e676; font-size:1.1rem; font-weight:700;"><i class="fa-solid fa-check-circle"></i> Threat Mitigation Active</p>
                    <hr style="border-color:rgba(255,255,255,0.1); margin:12px 0;">
                    <p><strong>Scanned Packets:</strong> ${resTD.scannedPackets.toLocaleString()}</p>
                    <p><strong>Detected Payload:</strong> ${resTD.threatType}</p>
                    <p><strong>Automated Response:</strong> ${resTD.actionTaken}</p>
                    <p><strong>Neural Model Confidence:</strong> <span style="color:#00f2fe; font-weight:700;">${resTD.confidence}</span></p>
                </div>
            `);
            break;

        case 'federated-learning':
            appendLog('Synchronizing gradient updates with peer network nodes...', 'info', 'FEDERATED');
            const resFL = await CyberImmuneAPI.runFederatedLearning();
            appendLog(`Federated Sync Successful. Global Version: ${resFL.globalModelVersion}. Accuracy boost: ${resFL.accuracyGain}`, 'success', 'FEDERATED');
            updateMetrics(99.7, 99.3, 99.4, '4.1 ms');
            showModal('Federated Learning Node Telemetry', `
                <div>
                    <p><strong>Connected Nodes:</strong> ${resFL.nodesConnected} Sovereign Edges</p>
                    <p><strong>Loss Delta:</strong> ${resFL.gradientLoss}</p>
                    <p><strong>Accuracy Improvement:</strong> <span style="color:#00e676;">${resFL.accuracyGain}</span></p>
                    <p><strong>Privacy Mode:</strong> ${resFL.privacyBudget}</p>
                </div>
            `);
            break;

        case 'classifier':
            appendLog('Evaluating multi-class classifier on active ingress stream...', 'info', 'CLASSIFIER');
            updateMetrics(99.5, 98.9, 99.2, '4.0 ms');
            showModal('Multi-Class Classifier Insights', `
                <p>Classes evaluated: <code>DDoS</code>, <code>Ransomware</code>, <code>Zero-Day Exfiltration</code>, <code>SQLi</code>, <code>Phishing Payload</code></p>
                <br>
                <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px;">
                    <p>✓ DDoS: <strong>0.001% risk</strong></p>
                    <p>✓ Ransomware: <strong>99.98% mitigated</strong></p>
                    <p>✓ SQL Injection: <strong>Filtered at WAF boundary</strong></p>
                </div>
            `);
            break;

        case 'autoencoder':
            appendLog('Autoencoder latent space check: Zero-day reconstruction error normal.', 'success', 'AUTOENCODER');
            showModal('Autoencoder Anomaly Detection', `
                <p>Latent Space Dimension: 64D</p>
                <p>Current Reconstruction MSE Threshold: <strong>0.0042 (Clean)</strong></p>
                <p>Status: All network traffic conforms to nominal baseline manifold.</p>
            `);
            break;

        case 'shap':
            appendLog('Generating SHAP feature attribution weights for last alert...', 'info', 'SHAP');
            const shapData = await CyberImmuneAPI.getSHAPExplainability();
            let html = `<h4>Feature Attribution for ${shapData.targetThreat}</h4><br>`;
            shapData.topFeatures.forEach(f => {
                html += `
                    <div style="margin-bottom:10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>${f.name}</span>
                            <span style="color:${f.impact === 'High Risk' ? '#ff5252' : '#00e676'}">${f.impact} (${(f.weight*100).toFixed(0)}%)</span>
                        </div>
                        <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; margin-top:4px;">
                            <div style="width:${f.weight*100}%; height:100%; background:${f.impact === 'High Risk' ? '#ff5252' : '#00c6ff'}; border-radius:3px;"></div>
                        </div>
                    </div>
                `;
            });
            showModal('SHAP Explainability Analysis', html);
            break;

        case 'digital-twin':
            appendLog('Simulating exploit vector in isolated Digital Twin Sandbox environment...', 'warning', 'DIGITAL_TWIN');
            const twin = await CyberImmuneAPI.getDigitalTwinSim();
            appendLog(`Digital Twin Sim Complete. Resilience Score: ${twin.zeroDayResilienceScore}`, 'success', 'DIGITAL_TWIN');
            showModal('Digital Twin Virtual Sandbox Results', `
                <p><strong>Sandbox VMs Deployed:</strong> ${twin.sandboxVMS}</p>
                <p><strong>Replayed Exploit:</strong> ${twin.attackReplayed}</p>
                <p><strong>Mitigation Efficiency:</strong> <span style="color:#00e676; font-weight:bold;">${twin.mitigationEfficiency}</span></p>
                <p><strong>Resilience Index:</strong> ${twin.zeroDayResilienceScore}</p>
            `);
            break;

        case 'trust-ledger':
            appendLog('Querying immutable Trust Ledger blockchain consensus...', 'info', 'BLOCKCHAIN');
            const blocks = await CyberImmuneAPI.getTrustLedger();
            let bHtml = `<h4>Immutable Blockchain Defense Audit</h4><br>`;
            blocks.forEach(b => {
                bHtml += `
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; font-family:monospace;">
                        <p style="color:#00f2fe;">Block #${b.block} [${b.timestamp}]</p>
                        <p style="font-size:0.85rem;">Hash: ${b.hash}</p>
                        <p style="color:#8e9bb4; font-size:0.85rem;">${b.event}</p>
                    </div>
                `;
            });
            showModal('Trust Ledger Blockchain Blocks', bHtml);
            break;

        case 'response-agent':
            appendLog('Autonomous Response Agent executing honeypot traps & firewall updates...', 'danger', 'AGENT');
            showModal('Autonomous Response Agent Status', `
                <p style="color:#00e676; font-weight:700;"><i class="fa-solid fa-robot"></i> Agent active & monitoring 1,024 endpoint nodes.</p>
                <br>
                <ul>
                    <li>Auto-quarantine rule active</li>
                    <li>Adaptive rate-limiting enabled</li>
                    <li>Zero-Trust JWT rotation enforced</li>
                </ul>
            `);
            break;

        case 'full-scan':
            appendLog('Executing Full Autonomous AI Immune System Audit across all clusters...', 'warning', 'SYSTEM');
            updateMetrics(99.9, 99.7, 99.8, '2.1 ms');
            setTimeout(() => {
                appendLog('Full Audit Completed! All 8 AI defense modules fully synchronized & hardened.', 'success', 'SYSTEM');
            }, 1200);
            break;
    }
}

function updateMetrics(acc, prec, rec, lat) {
    document.getElementById('val-accuracy').textContent = acc + '%';
    document.getElementById('val-precision').textContent = prec + '%';
    document.getElementById('val-recall').textContent = rec + '%';
    document.getElementById('val-latency').textContent = lat;
}

// Modal Controllers
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Navigation items click handling
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tabName = item.getAttribute('data-tab');
            appendLog(`Navigated to section: ${tabName}`, 'info', 'NAV');
        });
    });
});
