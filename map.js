/**
 * CMR Technical Campus, Kandlakoya, Hyderabad - SmartTransit AI
 * Leaflet GIS Mapping & Hyderabad Fleet Visualizer
 * Renders live moving buses along Hyderabad corridors, geofence zones, and CMRTC terminal
 */

class TransitMapManager {
    constructor() {
        this.map = null;
        this.busMarkers = {};
        this.routeLayers = {};
        this.stopMarkers = [];
        this.geofenceCircles = [];
        this.activeFilterBusId = null;
        this.isMapInitialized = false;
    }

    init(containerId = 'liveTransitMap') {
        const el = document.getElementById(containerId);
        if (!el) return;

        if (this.map) {
            setTimeout(() => this.map.invalidateSize(), 300);
            return;
        }

        // Initialize map centered between Hyderabad city and CMRTC Kandlakoya
        this.map = L.map(containerId, {
            center: [17.5250, 78.4450],
            zoom: 11,
            zoomControl: false,
            attributionControl: false
        });

        L.control.zoom({ position: 'topright' }).addTo(this.map);

        // CartoDB Voyager modern vector raster tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.map);

        // Render CMRTC destination, routes, stops & geofences
        this.renderCampusDestination();
        this.renderRoutes();
        this.renderStops();
        this.renderGeofences();
        this.initBusMarkers();

        // Connect to Simulation ticks
        if (window.transitSimulator) {
            window.transitSimulator.on('busTick', (buses) => this.updateBusPositions(buses));
        }

        this.isMapInitialized = true;
    }

    renderCampusDestination() {
        // Prominent CMR Technical Campus Destination Pin
        const cmrtcIcon = L.divIcon({
            html: `
                <div class="campus-terminal-marker shadow-2xl animate-pulse ring-4 ring-emerald-300">
                    <i class="fa-solid fa-graduation-cap text-white text-sm"></i>
                </div>
            `,
            className: 'custom-cmrtc-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const campusMarker = L.marker([17.6033, 78.4877], { icon: cmrtcIcon }).addTo(this.map);
        campusMarker.bindPopup(`
            <div class="p-2 font-sans min-w-[220px]">
                <div class="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 text-emerald-700">
                    <i class="fa-solid fa-building-columns"></i> CMR Technical Campus
                </div>
                <div class="text-xs text-slate-600 mt-1">Kandlakoya (V), Medchal Road, Hyderabad – 501401</div>
                <div class="text-[11px] text-slate-500 font-semibold mt-1">
                    <i class="fa-solid fa-diamond-turn-right text-blue-600"></i> Near ORR Exit 6 • Main Terminal for all 10 Routes
                </div>
            </div>
        `);
    }

    renderRoutes() {
        APP_DATA.routes.forEach(route => {
            const latlngs = route.waypoints.map(w => [w.lat, w.lng]);
            const isSelected = route.id === "RT-101";
            const polyline = L.polyline(latlngs, {
                color: route.color,
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 0.95 : 0.65,
                smoothFactor: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: isSelected ? null : '6, 6'
            }).addTo(this.map);

            polyline.bindTooltip(`<b>${route.code}</b>: ${route.name}<br>${route.corridor}`, { sticky: true });
            this.routeLayers[route.id] = polyline;
        });
    }

    renderStops() {
        APP_DATA.routes.forEach(route => {
            route.waypoints.forEach((wp, index) => {
                if (wp.isCampus) return; // Handled by renderCampusDestination

                let stopIconHtml = '';
                if (wp.isUserStop) {
                    // JNTU stop for Sai Teja
                    stopIconHtml = `
                        <div class="user-stop-marker shadow-lg ring-4 ring-blue-400/50">
                            <i class="fa-solid fa-user-check text-blue-600 text-xs"></i>
                        </div>
                    `;
                } else {
                    stopIconHtml = `
                        <div class="regular-stop-marker">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-700 block"></span>
                        </div>
                    `;
                }

                const customIcon = L.divIcon({
                    html: stopIconHtml,
                    className: 'custom-stop-div',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(this.map);
                
                const tooltipHtml = `
                    <div class="p-1 font-sans text-xs">
                        <div class="font-bold text-slate-900">${wp.name}</div>
                        <div class="text-slate-500">${route.code} • Scheduled: ${wp.scheduledTime}</div>
                        ${wp.isUserStop ? '<div class="mt-1 text-blue-600 font-semibold"><i class="fa-solid fa-star"></i> Sai Teja\'s Pickup Stop (JNTU)</div>' : ''}
                    </div>
                `;
                marker.bindPopup(tooltipHtml);
                this.stopMarkers.push(marker);
            });
        });
    }

    renderGeofences() {
        // Geofence 1: CMR Technical Campus Safe Zone (1,000m radius at Kandlakoya Near ORR Exit 6)
        const campusCircle = L.circle([17.6033, 78.4877], {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '5, 5',
            radius: 1000
        }).addTo(this.map);
        campusCircle.bindTooltip("<b>CMR Technical Campus Safe Geofence</b><br>Kandlakoya (Near ORR Exit 6)<br>Entry sends arrival confirmation to parents", { sticky: true });
        this.geofenceCircles.push(campusCircle);

        // Geofence 2: JNTU Student Pickup Geofence (600m radius)
        const stopCircle = L.circle([17.4986, 78.3905], {
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.10,
            weight: 2,
            dashArray: '4, 4',
            radius: 600
        }).addTo(this.map);
        stopCircle.bindTooltip("<b>Student Pickup Geofence (JNTU)</b><br>Proximity triggers 'Bus Approaching' alert", { sticky: true });
        this.geofenceCircles.push(stopCircle);
    }

    createBusIcon(bus) {
        let statusBadgeClass = "bg-blue-600";
        let pulseClass = "";

        if (bus.isEmergency) {
            statusBadgeClass = "bg-red-600 animate-ping";
            pulseClass = "emergency-pulse";
        } else if (bus.isDeviated) {
            statusBadgeClass = "bg-amber-500 animate-pulse";
            pulseClass = "deviation-pulse";
        } else if (bus.isLongJourney) {
            statusBadgeClass = "bg-amber-600";
        } else if (bus.status.includes("Delayed")) {
            statusBadgeClass = "bg-amber-500";
        } else {
            statusBadgeClass = "bg-blue-600";
        }

        const html = `
            <div class="bus-marker-container ${pulseClass}" id="bus-marker-${bus.id}">
                <div class="bus-badge ${statusBadgeClass} text-white shadow-xl flex items-center justify-center">
                    <i class="fa-solid fa-bus text-xs"></i>
                </div>
                <div class="bus-label-tag font-semibold text-[10px] tracking-tight text-slate-800 bg-white/95 px-1.5 py-0.5 rounded shadow border border-slate-200 whitespace-nowrap">
                    ${bus.id} • ${bus.speedKmH} km/h
                </div>
            </div>
        `;

        return L.divIcon({
            html: html,
            className: 'custom-bus-div-icon',
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });
    }

    initBusMarkers() {
        APP_DATA.buses.forEach(bus => {
            const icon = this.createBusIcon(bus);
            const marker = L.marker([bus.currentLocation.lat, bus.currentLocation.lng], { icon: icon }).addTo(this.map);

            marker.on('click', () => {
                this.showBusPopup(bus, marker);
            });

            this.busMarkers[bus.id] = marker;
        });
    }

    showBusPopup(bus, marker) {
        const popupContent = `
            <div class="p-2 font-sans min-w-[250px]">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <i class="fa-solid fa-bus text-blue-600"></i> ${bus.id} (${bus.plateNumber})
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bus.isEmergency ? 'bg-red-100 text-red-700' :
                        bus.isDeviated ? 'bg-amber-100 text-amber-700' :
                        bus.isLongJourney ? 'bg-amber-100 text-amber-800' :
                        bus.status.includes('Delayed') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }">${bus.status}</span>
                </div>
                <div class="py-2 space-y-1.5 text-xs text-slate-600">
                    <div class="flex justify-between">
                        <span>Route:</span>
                        <span class="font-medium text-slate-800">${bus.corridorDisplay}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Driver:</span>
                        <span class="font-medium text-slate-800">${bus.driver.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Current Location:</span>
                        <span class="font-semibold text-slate-800">${bus.currentLocationName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Speed:</span>
                        <span class="font-semibold text-blue-600">${bus.speedKmH} km/h</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Next Stop:</span>
                        <span class="font-semibold text-slate-800">${bus.nextStop}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Distance to CMRTC:</span>
                        <span class="font-semibold text-slate-800">${bus.distanceRemainingKm} km</span>
                    </div>
                    <div class="flex justify-between">
                        <span>AI Predicted ETA:</span>
                        <span class="font-bold text-emerald-600">${bus.aiPredictedEtaMins} mins</span>
                    </div>
                    ${bus.isLongJourney ? `
                    <div class="p-1.5 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-800 font-semibold">
                        🟠 Long Journey Monitor: ${bus.remainingJourneyDisplay} remaining
                    </div>` : ''}
                    <div class="mt-2 pt-2 border-t border-slate-100">
                        <div class="flex justify-between text-[11px] mb-1">
                            <span>Passengers (${bus.currentOccupancy}/${bus.totalCapacity})</span>
                            <span class="font-bold ${bus.occupancyRate > 88 ? 'text-amber-600' : 'text-slate-700'}">${bus.availableSeats} Available</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="h-full ${bus.occupancyRate > 88 ? 'bg-amber-500' : 'bg-blue-600'}" style="width: ${bus.occupancyRate}%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-2 pt-2 flex gap-1">
                    <button onclick="window.app.navigateTo('bus-details', '${bus.id}')" class="w-full text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition">
                        View Full Telemetry
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent).openPopup();
    }

    updateBusPositions(buses) {
        if (!this.map) return;

        buses.forEach(bus => {
            const marker = this.busMarkers[bus.id];
            if (marker) {
                marker.setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
                const newIcon = this.createBusIcon(bus);
                marker.setIcon(newIcon);
            }
        });
    }

    focusBus(busId) {
        const bus = APP_DATA.buses.find(b => b.id === busId);
        if (bus && this.map) {
            this.map.flyTo([bus.currentLocation.lat, bus.currentLocation.lng], 13, {
                animate: true,
                duration: 1.2
            });
            const marker = this.busMarkers[busId];
            if (marker) {
                setTimeout(() => this.showBusPopup(bus, marker), 1300);
            }
        }
    }

    fitAllFleet() {
        if (!this.map) return;
        const group = L.featureGroup(Object.values(this.busMarkers));
        this.map.fitBounds(group.getBounds().pad(0.15));
    }
}

// Global instance
window.transitMap = new TransitMapManager();
