/**
 * CMR Technical Campus, Kandlakoya, Hyderabad – 501401, Telangana
 * Chart.js Visualizations & Analytics
 * Includes 4-Tier Journey duration indicators:
 * 🟢 Under 60 min – Short Route
 * 🟡 60–90 min – Medium Route
 * 🟠 90–120 min – Long Route
 * 🔴 Over 120 min – Review Route
 */

class TransitChartsManager {
    constructor() {
        this.journeyTimeChart = null;
        this.utilizationChart = null;
        this.ridershipChart = null;
        this.delayChart = null;
        this.popularityChart = null;
    }

    initAdminCharts() {
        this.renderJourneyTimeChart();
        this.renderUtilizationChart();
        this.renderDailyPassengersChart();
        this.renderDelayedTripsChart();
        this.renderRoutePopularityChart();
    }

    // 1. Average Journey Time Comparison with 4-Tier Color Coding
    renderJourneyTimeChart() {
        const ctx = document.getElementById('adminJourneyTimeChart');
        if (!ctx) return;
        if (this.journeyTimeChart) this.journeyTimeChart.destroy();

        const labels = APP_DATA.routes.map(r => `${r.name}\n(${r.code})`);
        const durations = APP_DATA.routes.map(r => r.journeyMinutes);

        this.journeyTimeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Planned Journey Duration (Mins to Kandlakoya)',
                        data: durations,
                        backgroundColor: durations.map(d => {
                            if (d < 60) return '#10B981'; // 🟢 Green (< 60m)
                            if (d <= 90) return '#EAB308'; // 🟡 Yellow (60–90m)
                            if (d <= 120) return '#F97316'; // 🟠 Orange (90–120m)
                            return '#EF4444'; // 🔴 Red (> 120m Review Route)
                        }),
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterBody: (context) => {
                                const val = context[0].raw;
                                if (val < 60) return '🟢 Under 60 min – Short Route';
                                if (val <= 90) return '🟡 60–90 min – Medium Route';
                                if (val <= 120) return '🟠 90–120 min – Long Route';
                                return '🔴 Over 120 min – Review Route / Heavy Traffic';
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 9 } } },
                    y: {
                        beginAtZero: true,
                        max: 135,
                        title: { display: true, text: 'Journey Duration (Minutes to CMRTC)', font: { size: 11 } },
                        grid: { color: '#F1F5F9' }
                    }
                }
            }
        });
    }

    renderUtilizationChart() {
        const ctx = document.getElementById('adminUtilizationChart');
        if (!ctx) return;
        if (this.utilizationChart) this.utilizationChart.destroy();

        this.utilizationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: APP_DATA.buses.map(b => b.id),
                datasets: [{
                    label: 'Bus Occupancy Rate (%)',
                    data: APP_DATA.buses.map(b => b.occupancyRate),
                    backgroundColor: (ctx) => ctx.raw > 88 ? '#F59E0B' : '#3B82F6',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Occupancy (%)', font: { size: 11 } },
                        grid: { color: '#F1F5F9' }
                    }
                }
            }
        });
    }

    renderDailyPassengersChart() {
        const ctx = document.getElementById('adminDailyPassengersChart');
        if (!ctx) return;
        if (this.ridershipChart) this.ridershipChart.destroy();

        this.ridershipChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['06:50 AM', '07:20 AM', '07:55 AM', '08:30 AM', '09:05 AM (Arrival at CMRTC)', '04:00 PM (Return)'],
                datasets: [{
                    label: 'Cumulative Students Boarded Across Hyderabad',
                    data: [95, 230, 385, 465, 478, 478],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#1D4ED8',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Total Students Onboard', font: { size: 11 } },
                        grid: { color: '#F1F5F9' }
                    }
                }
            }
        });
    }

    renderDelayedTripsChart() {
        const ctx = document.getElementById('adminDelayedTripsChart');
        if (!ctx) return;
        if (this.delayChart) this.delayChart.destroy();

        this.delayChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['On Time – Arrival by 9:05 AM (80%)', 'Moderate Delay 5-10m (15%)', 'Review Delay >15m (5%)'],
                datasets: [{
                    data: [8, 1.5, 0.5],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
                }
            }
        });
    }

    renderRoutePopularityChart() {
        const ctx = document.getElementById('adminRoutePopularityChart');
        if (!ctx) return;
        if (this.popularityChart) this.popularityChart.destroy();

        this.popularityChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Kukatpally Zone', 'LB Nagar Zone', 'Suncity Zone', 'Secunderabad', 'Miyapur/BHEL'],
                datasets: [{
                    data: [48, 55, 54, 52, 46],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(217, 119, 6, 0.7)',
                        'rgba(2, 132, 199, 0.7)',
                        'rgba(16, 185, 129, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
                }
            }
        });
    }
}

window.transitCharts = new TransitChartsManager();
