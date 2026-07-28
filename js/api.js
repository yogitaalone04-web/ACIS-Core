const BASE_URL = "http://127.0.0.1:5000/api";

async function runThreatDetection() {
    const res = await fetch(`${BASE_URL}/threat-detection`);
    return await res.json();
}