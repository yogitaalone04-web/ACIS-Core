// Chart Initialization & Live Updates
let telemetryChartInstance = null;

function initTelemetryChart() {
    const ctx = document.getElementById('telemetryChart').getContext('2d');
    
    const labels = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
        const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString();
        labels.push(timeStr);
    }

    const baselineData = [12, 14, 11, 15, 13, 16, 14, 12, 15, 14, 13];
    const anomalyData =  [2,  3,  1,  2,  85, 94, 45, 12, 4,  2,  1];

    telemetryChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Normal System Entropy',
                    data: baselineData,
                    borderColor: '#00c6ff',
                    backgroundColor: 'rgba(0, 198, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'AI Anomaly Score (%)',
                    data: anomalyData,
                    borderColor: '#ff5252',
                    backgroundColor: 'rgba(255, 82, 82, 0.15)',
                    borderWidth: 2,
                    borderDash: [4, 4],
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#8e9bb4', font: { family: 'Inter', size: 12 } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8e9bb4', font: { family: 'JetBrains Mono', size: 10 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    min: 0,
                    max: 100,
                    ticks: { color: '#8e9bb4', font: { family: 'JetBrains Mono', size: 10 } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });
}

function addChartDataPoint(baselineValue, anomalyValue) {
    if (!telemetryChartInstance) return;

    const timeStr = new Date().toLocaleTimeString();
    telemetryChartInstance.data.labels.push(timeStr);
    telemetryChartInstance.data.labels.shift();

    telemetryChartInstance.data.datasets[0].data.push(baselineValue);
    telemetryChartInstance.data.datasets[0].data.shift();

    telemetryChartInstance.data.datasets[1].data.push(anomalyValue);
    telemetryChartInstance.data.datasets[1].data.shift();

    telemetryChartInstance.update('none');
}

document.addEventListener('DOMContentLoaded', () => {
    initTelemetryChart();
    
    // Simulate real-time streaming data
    setInterval(() => {
        const base = Math.floor(Math.random() * 8) + 10;
        const anomaly = Math.random() > 0.85 ? Math.floor(Math.random() * 60) + 30 : Math.floor(Math.random() * 5);
        addChartDataPoint(base, anomaly);
    }, 3000);
});
