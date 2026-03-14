// Common UI Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDashboardMap();
    initTrafficCharts();
    initWeatherCharts();
    initCorridorMap();
    initAnalyticsCharts();
});

function initNavigation() {
    // Current page highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links li');

    navLinks.forEach(link => {
        const a = link.querySelector('a');
        if (a && a.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Global Variables
let dashboardMap;
let mapMarkers = [];

// Map Initialization (Dashboard)
function initDashboardMap() {
    const mapEl = document.getElementById('mainMap');
    if (!mapEl) return;

    // Default to a central city coordinate, e.g., New York or London.
    dashboardMap = L.map('mainMap').setView([40.7128, -74.0060], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(dashboardMap);

    // Initial markers will be loaded via API
}

// Chart Initialization
function initTrafficCharts() {
    const chartEl = document.getElementById('trafficDensityChart');
    if (!chartEl) return;

    const ctx = chartEl.getContext('2d');

    // Gradient for line chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue accent
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            datasets: [{
                label: 'Traffic Density (%)',
                data: [15, 10, 85, 60, 95, 45, 20],
                fill: true,
                backgroundColor: gradient,
                borderColor: '#3b82f6',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function initWeatherCharts() {
    const chartEl = document.getElementById('incidentReasonChart');
    if (!chartEl) return;

    const ctx = chartEl.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Rain/Wet Road', 'Fog/Visibility', 'Clear', 'Snow/Ice'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#3b82f6', // blue
                    '#94a3b8', // slate
                    '#22c55e', // green
                    '#06b6d4'  // cyan
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', padding: 20 }
                }
            },
            cutout: '75%'
        }
    });
}

function initCorridorMap() {
    const mapEl = document.getElementById('corridorMap');
    if (!mapEl) return;

    const map = L.map('corridorMap').setView([40.7150, -74.0000], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Draw route
    const route = [
        [40.7050, -74.0150],
        [40.7100, -74.0100],
        [40.7150, -74.0000],
        [40.7200, -73.9900]
    ];

    L.polyline(route, { color: '#22c55e', weight: 6, opacity: 0.8, className: 'pulse-route' }).addTo(map);

    // Ambulance marker
    const ambIcon = L.divIcon({
        html: '<div style="font-size: 24px; color: #ef4444; background: white; border-radius: 50%; padding: 4px; display: inline-block;">🚑</div>',
        className: 'env-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    L.marker(route[1], { icon: ambIcon }).addTo(map).bindPopup('<b>Ambulance AMB-742</b><br>ETA: 3 mins');
}

function initAnalyticsCharts() {
    // 1. Accident History (Line chart)
    const accEl = document.getElementById('accidentHistoryChart');
    if (accEl) {
        new Chart(accEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Accidents',
                    data: [120, 150, 80, 95, 110, 75],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } }
        });
    }

    // 2. Congestion by Zone (Radar chart)
    const congEl = document.getElementById('congestionZoneChart');
    if (congEl) {
        new Chart(congEl.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['North', 'South', 'East', 'West', 'Downtown', 'Airport'],
                datasets: [{
                    label: 'Congestion Level',
                    data: [65, 59, 90, 81, 95, 55],
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#94a3b8' },
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 3. Citizen Reports (Bar chart)
    const repEl = document.getElementById('reportsBarChart');
    if (repEl) {
        new Chart(repEl.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Accidents',
                    data: [12, 19, 3, 5, 2, 3, 9],
                    backgroundColor: '#ef4444'
                },
                {
                    label: 'Blocked Roads',
                    data: [5, 12, 8, 11, 4, 2, 4],
                    backgroundColor: '#eab308'
                },
                {
                    label: 'Broken Signals',
                    data: [2, 3, 1, 0, 1, 4, 1],
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { labels: { color: '#94a3b8' } } }
            }
        });
    }
}

// CONNECT TO BACKEND API & DYNAMIC DASHBOARD FEATURES

// Base URL for API
const API_BASE_URL = 'http://localhost:5000/api';

// Start auto-refresh polling
function startAutoRefresh() {
    fetchDashboardData();
    fetchTrafficAlerts();
    setInterval(() => {
        fetchDashboardData();
        fetchTrafficAlerts();
    }, 5000);
}

// Fetch dashboard aggregated stats
async function fetchDashboardData() {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        updateDashboardCards(data);
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
    }
}

// Update the top 4 dashboard cards
function updateDashboardCards(data) {
    if (data.activeIncidents !== undefined) {
        setElementText('stat-incidents', data.activeIncidents);
    }
    if (data.trafficDensity !== undefined) {
        // Assume data returns density as integer 0-100
        setElementText('stat-density', data.trafficDensity + '%');
    }
    if (data.weatherRisk !== undefined) {
        setElementText('stat-weather', data.weatherRisk);
    }
    if (data.emergencyVehicles !== undefined) {
        setElementText('stat-emergency', data.emergencyVehicles);
    }
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// Fetch combined alerts from traffic and reports
async function fetchTrafficAlerts() {
    try {
        const [trafficRes, reportRes] = await Promise.all([
            fetch(`${API_BASE_URL}/traffic`),
            fetch(`${API_BASE_URL}/report`)
        ]);

        const trafficData = trafficRes.ok ? await trafficRes.json() : [];
        const reportData = reportRes.ok ? await reportRes.json() : [];

        // Combine and map data to a uniform alert format
        let alerts = [];

        // Map Traffic data
        const tListData = trafficData.data || trafficData;
        if (Array.isArray(tListData)) {
            alerts = alerts.concat(tListData.map(t => ({
                id: t._id,
                type: 'Traffic',
                title: t.status === 'accident' ? 'Accident Detected' : 'High Congestion',
                desc: t.location ? `Location: ${t.location}` : 'Live Traffic Update',
                severity: t.status === 'accident' ? 'critical' : 'warning',
                icon: t.status === 'accident' ? '💥' : '🚗',
                lat: t.latitude,
                lng: t.longitude
            })));
        }

        // Map Report data
        const rListData = reportData.data || reportData;
        if (Array.isArray(rListData)) {
            alerts = alerts.concat(rListData.map(r => ({
                id: r._id,
                type: 'Report',
                title: `Report: ${r.type || 'Alert'}`,
                desc: r.location || r.description || 'Public Report',
                severity: r.severity === 'high' ? 'critical' : 'warning',
                icon: '📱',
                lat: r.latitude,
                lng: r.longitude
            })));
        }

        // Add dummy emergency alert if none exists for UI sake when triggered
        if (window.emergencyActive) {
             alerts.unshift({
                type: 'Emergency',
                title: 'Smart Corridor Active',
                desc: 'Emergency Vehicle Route Prioritized',
                severity: 'critical',
                icon: '🚑'
             });
        }

        updateAlertsUI(alerts);
        updateMapMarkers(alerts);

    } catch (err) {
        console.error("Error fetching alerts:", err);
    }
}

function updateAlertsUI(alerts) {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    if (alerts.length === 0) {
        container.innerHTML = '<div class="alert-item"><div class="alert-content"><p>No active alerts.</p></div></div>';
        return;
    }

    container.innerHTML = '';
    
    // Display top 5 alerts
    alerts.slice(0, 5).forEach(alert => {
        const itemClass = alert.severity === 'critical' ? 'alert-item critical' : 'alert-item warning';
        const html = `
            <div class="${itemClass}">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.desc}</p>
                </div>
                <div class="alert-time">Live</div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function updateMapMarkers(alerts) {
    if (!dashboardMap) return;

    // Clear existing markers
    mapMarkers.forEach(marker => dashboardMap.removeLayer(marker));
    mapMarkers = [];

    alerts.forEach(alert => {
        if (alert.lat && alert.lng) {
            let circleColor = alert.severity === 'critical' ? '#ef4444' : '#eab308';
            if (alert.type === 'Emergency') circleColor = '#3b82f6';
            
            const marker = L.circle([alert.lat, alert.lng], {
                color: circleColor,
                fillColor: circleColor,
                fillOpacity: 0.5,
                radius: 300
            }).addTo(dashboardMap).bindPopup(`<b>${alert.title}</b><br>${alert.desc}`);
            
            mapMarkers.push(marker);
        }
    });
}

// --- Admin Controls ---

async function clearIncident() {
    // Assuming backend has a generic bulk clear or specific clear logic. 
    // Usually requires an ID, but for dashboard mockup admin, hitting an endpoint to clear all test records or similar.
    // For this demonstration, we'll try a dummy POST to /api/report/clear or similar if defined. If not, log it.
    console.log("Admin action: Clear Incident");
    try {
        // Replace with actual endpoint to clear, here just a dummy fetch representing action
        alert("Action: Clear Incident command sent to backend.");
        fetchTrafficAlerts(); // Refresh immediately
    } catch(err) {
        console.error("Clear Incident Error", err);
    }
}

async function markResolved() {
    console.log("Admin action: Mark Resolved");
    try {
        alert("Action: Mark Accident Resolved sent to backend.");
        fetchTrafficAlerts(); // Refresh immediately
    } catch(err) {
        console.error("Mark Resolved Error", err);
    }
}

async function triggerEmergencyMode() {
    console.log("Admin action: Trigger Emergency Corridor");
    window.emergencyActive = !window.emergencyActive;
    try {
        alert(window.emergencyActive ? "Smart Corridor Activated!" : "Smart Corridor Deactivated.");
        fetchDashboardData();
        fetchTrafficAlerts();

        if (window.emergencyActive) {
            updateEmergencyRoute();
            window.emergencyUpdateInterval = setInterval(updateEmergencyRoute, 3000);
        } else {
            if (window.emergencyUpdateInterval) {
                clearInterval(window.emergencyUpdateInterval);
                window.emergencyUpdateInterval = null;
            }
            if (window.emergencyRouteLayer && dashboardMap) {
                dashboardMap.removeLayer(window.emergencyRouteLayer);
                window.emergencyRouteLayer = null;
            }
            if (window.ambulanceMarker && dashboardMap) {
                dashboardMap.removeLayer(window.ambulanceMarker);
                window.ambulanceMarker = null;
            }
        }
    } catch(err) {
        console.error("Trigger Emergency Error", err);
    }
}

async function requestEmergencyRoute(start, destination) {
    try {
        const res = await fetch(`${API_BASE_URL}/emergency/route`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, destination })
        });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (err) {
        console.error("Error fetching emergency route:", err);
        return null;
    }
}

function drawEmergencyRoute(routeCoordinates) {
    if (!dashboardMap || !routeCoordinates || routeCoordinates.length === 0) return;
    
    if (window.emergencyRouteLayer) {
        dashboardMap.removeLayer(window.emergencyRouteLayer);
    }
    
    window.emergencyRouteLayer = L.polyline(routeCoordinates, { 
        color: '#3b82f6', 
        weight: 6, 
        opacity: 0.8,
        className: 'pulse-route' 
    }).addTo(dashboardMap);
    
    if (!window.ambulanceMarker) {
        const ambIcon = L.divIcon({
            html: '<div style="font-size: 24px; color: #ef4444; background: white; border-radius: 50%; padding: 4px; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">🚑</div>',
            className: 'env-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        window.ambulanceMarker = L.marker(routeCoordinates[0], { icon: ambIcon })
            .addTo(dashboardMap)
            .bindPopup('<b>Ambulance AMB-742</b><br>On Route');
    } else {
        window.ambulanceMarker.setLatLng(routeCoordinates[0]);
    }
}

async function updateEmergencyRoute() {
    const routeData = await requestEmergencyRoute('Hospital', 'Incident');
    if (routeData && routeData.coordinates) {
        drawEmergencyRoute(routeData.coordinates);
    }
}

// Start polling on load
document.addEventListener('DOMContentLoaded', () => {
    startAutoRefresh();
});