/**
 * CMR Technical Campus, Kandlakoya, Hyderabad – 501401, Telangana
 * Main Application Controller & View Router
 */

class CampusTransitApp {
    constructor() {
        this.currentView = 'home';
        this.selectedBusId = 'CB-101';
        this.selectedRouteId = 'RT-101';
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.renderUserBadge();
        this.renderNotificationsBadge();
        this.renderShiftModeControls();

        if (window.transitSimulator) {
            window.transitSimulator.on('busTick', (buses) => this.onSimulationTick(buses));
            window.transitSimulator.on('shiftChange', (shift) => this.onShiftChange(shift));
            window.transitSimulator.on('emergencyChange', (data) => this.onEmergencyChange(data));
            window.transitSimulator.on('deviationChange', (data) => this.onDeviationChange(data));
            window.transitSimulator.on('qrScanComplete', (rec) => this.onQRScanComplete(rec));
        }

        this.navigateTo('home');
    }

    bindGlobalEvents() {
        document.querySelectorAll('[data-nav]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const view = el.getAttribute('data-nav');
                const busId = el.getAttribute('data-bus-id');
                this.navigateTo(view, busId);
            });
        });

        const mobileBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('appSidebar');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
            });
        }
    }

    switchShift(shift) {
        if (window.transitSimulator) {
            window.transitSimulator.setShift(shift);
        }
    }

    onShiftChange(shift) {
        this.renderShiftModeControls();
        this.showToast("Shift Toggled", `Active mode switched to: ${shift === 'morning' ? '☀️ Morning Commute (Arrival 9:10 AM | Class 9:20 AM)' : '🌙 Evening Return (College Departure 4:00 PM)'}`, "info");
        if (this.currentView === 'student-dashboard') this.renderStudentDashboard();
        if (this.currentView === 'home') this.renderHomeView();
        if (this.currentView === 'routes-stops') this.renderRoutesStops();
    }

    renderShiftModeControls() {
        const shift = APP_DATA.activeShift || 'morning';
        const morningBtn = document.getElementById('shiftBtnMorning');
        const eveningBtn = document.getElementById('shiftBtnEvening');

        if (morningBtn && eveningBtn) {
            if (shift === 'morning') {
                morningBtn.className = "px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm transition";
                eveningBtn.className = "px-3 py-1 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition";
            } else {
                morningBtn.className = "px-3 py-1 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition";
                eveningBtn.className = "px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm transition";
            }
        }
    }

    switchRole(role) {
        if (!APP_DATA.personas[role]) return;
        APP_DATA.currentUser.role = role;
        const persona = APP_DATA.personas[role];
        
        this.renderUserBadge();
        this.showToast("Persona Switched", `Active view changed to: ${persona.name} (${persona.roleBadge})`, "info");
        
        if (role === 'student') this.navigateTo('student-dashboard');
        else if (role === 'parent') this.navigateTo('parent-dashboard');
        else if (role === 'driver') this.navigateTo('driver-dashboard');
        else if (role === 'admin') this.navigateTo('admin-dashboard');
    }

    renderUserBadge() {
        const persona = APP_DATA.personas[APP_DATA.currentUser.role];
        const nameEl = document.getElementById('currentUserName');
        const roleEl = document.getElementById('currentUserRole');
        const avatarEl = document.getElementById('currentUserAvatar');
        const roleBadgeEl = document.getElementById('topRoleBadge');

        if (nameEl) nameEl.textContent = persona.name;
        if (roleEl) roleEl.textContent = persona.title;
        if (avatarEl) avatarEl.src = persona.avatar;
        if (roleBadgeEl) {
            roleBadgeEl.textContent = persona.roleBadge;
            roleBadgeEl.className = `px-2 py-0.5 rounded-full text-xs font-semibold ${
                APP_DATA.currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                APP_DATA.currentUser.role === 'driver' ? 'bg-amber-100 text-amber-700' :
                APP_DATA.currentUser.role === 'parent' ? 'bg-cyan-100 text-cyan-700' :
                'bg-blue-100 text-blue-700'
            }`;
        }

        const roleSelect = document.getElementById('personaRoleSelect');
        if (roleSelect) roleSelect.value = APP_DATA.currentUser.role;
    }

    renderNotificationsBadge() {
        const unreadCount = APP_DATA.notifications.filter(n => !n.read).length;
        const badgeEl = document.getElementById('unreadNotifBadge');
        if (badgeEl) {
            badgeEl.textContent = unreadCount;
            badgeEl.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
        }
    }

    navigateTo(viewName, param = null) {
        this.currentView = viewName;
        if (param) this.selectedBusId = param;

        document.querySelectorAll('#sidebarNav a').forEach(a => {
            const nav = a.getAttribute('data-nav');
            if (nav === viewName) {
                a.classList.add('bg-blue-50', 'text-blue-600', 'font-semibold');
                a.classList.remove('text-slate-600');
            } else {
                a.classList.remove('bg-blue-50', 'text-blue-600', 'font-semibold');
                a.classList.add('text-slate-600');
            }
        });

        const views = document.querySelectorAll('.app-view');
        views.forEach(v => v.classList.add('hidden'));

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        switch (viewName) {
            case 'home':
                this.renderHomeView();
                break;
            case 'student-dashboard':
                this.renderStudentDashboard();
                break;
            case 'live-tracking':
                this.renderLiveTracking();
                break;
            case 'routes-stops':
                this.renderRoutesStops();
                break;
            case 'bus-details':
                this.renderBusDetails(this.selectedBusId);
                break;
            case 'parent-dashboard':
                this.renderParentDashboard();
                break;
            case 'driver-dashboard':
                this.renderDriverDashboard();
                break;
            case 'notifications':
                this.renderNotificationsView();
                break;
            case 'emergency-safety':
                this.renderEmergencySafetyView();
                break;
            case 'digital-pass':
                this.renderDigitalPassView();
                break;
            case 'qr-attendance':
                this.renderQRAttendanceView();
                break;
            case 'trip-history':
                this.renderTripHistoryView();
                break;
            case 'feedback':
                this.renderFeedbackView();
                break;
            case 'admin-dashboard':
                this.renderAdminDashboard();
                break;
            case 'auth':
                this.renderAuthView();
                break;
        }

        const sidebar = document.getElementById('appSidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.add('hidden');
        }
    }

    /* =========================================================================
       VIEW 1: HOME PORTAL
       ========================================================================= */
    renderHomeView() {
        const container = document.getElementById('homeFleetList');
        if (!container) return;

        const isMorning = APP_DATA.activeShift === 'morning';

        container.innerHTML = APP_DATA.buses.map(bus => {
            const route = APP_DATA.routes.find(r => r.id === bus.routeId) || APP_DATA.routes[0];
            return `
                <div class="glass-panel p-5 rounded-2xl card-hover border border-slate-200">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                <i class="fa-solid fa-bus text-base"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <h4 class="font-bold text-slate-900">${bus.id}</h4>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        route.durationCategory === 'short' ? 'bg-emerald-100 text-emerald-800' :
                                        route.durationCategory === 'medium' ? 'bg-amber-100 text-amber-800' :
                                        route.durationCategory === 'long' ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800 font-bold'
                                    }">${route.categoryLabel}</span>
                                </div>
                                <p class="text-xs text-slate-500">${bus.plateNumber} • ${bus.routeName}</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${
                            bus.isEmergency ? 'bg-red-100 text-red-700 animate-pulse' :
                            bus.isDeviated ? 'bg-amber-100 text-amber-700 animate-pulse' :
                            bus.status.includes('Delayed') || bus.status.includes('Heavy') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }">${bus.status}</span>
                    </div>

                    <div class="space-y-2 text-xs text-slate-600 mb-4">
                        <div class="flex justify-between">
                            <span>Corridor:</span>
                            <span class="font-medium text-slate-800 truncate max-w-[210px]">${bus.corridorDisplay}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Timing Schedule:</span>
                            <span class="font-semibold text-slate-800">
                                ${isMorning ? `Dep: ${route.morningDepartureTime} → Target Arr: 9:10 AM` : `College Dep: 4:00 PM → Est Home: ${route.eveningEstimatedHomeArrival}`}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span>Next Stop:</span>
                            <span class="font-medium text-slate-800">${bus.nextStop}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Live ETA:</span>
                            <span class="font-bold text-blue-600">${bus.etaMinutes} mins</span>
                        </div>
                        <div class="pt-2">
                            <div class="flex justify-between text-[11px] mb-1">
                                <span>Occupancy (${bus.currentOccupancy}/${bus.totalCapacity})</span>
                                <span class="font-semibold ${bus.occupancyRate > 88 ? 'text-amber-600' : 'text-slate-700'}">${bus.availableSeats} Available</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div class="h-full ${bus.occupancyRate > 88 ? 'bg-amber-500' : 'bg-blue-600'} transition-all duration-500" style="width: ${bus.occupancyRate}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="window.app.navigateTo('live-tracking', '${bus.id}')" class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-location-dot"></i> Live Track
                        </button>
                        <button onclick="window.app.navigateTo('bus-details', '${bus.id}')" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* =========================================================================
       VIEW 2: STUDENT DASHBOARD (MORNING & EVENING MODES)
       ========================================================================= */
    renderStudentDashboard() {
        const student = APP_DATA.currentUser;
        const bus = APP_DATA.buses.find(b => b.id === student.assignedBusId) || APP_DATA.buses[0];
        const route = APP_DATA.routes.find(r => r.id === bus.routeId) || APP_DATA.routes[0];
        const isMorning = APP_DATA.activeShift === 'morning';

        const morningCard = document.getElementById('studentMorningCard');
        const eveningCard = document.getElementById('studentEveningCard');

        if (isMorning) {
            if (morningCard) morningCard.classList.remove('hidden');
            if (eveningCard) eveningCard.classList.add('hidden');

            // Exact requested morning values
            const yourBusEl = document.getElementById('studentMorningYourBus');
            const yourRouteEl = document.getElementById('studentMorningYourRoute');
            const busStatusEl = document.getElementById('studentMorningBusStatus');
            const nextStopEl = document.getElementById('studentMorningNextStop');
            const etaEl = document.getElementById('studentMorningETA');
            const collegeArrivalEl = document.getElementById('studentMorningCollegeArrival');
            const collegeStartsEl = document.getElementById('studentMorningCollegeStarts');

            if (yourBusEl) yourBusEl.textContent = bus.id;
            if (yourRouteEl) yourRouteEl.textContent = "Kukatpally → CMR Technical Campus";
            if (busStatusEl) busStatusEl.innerHTML = '<span class="text-emerald-600 font-bold">🟢 On Time</span>';
            if (nextStopEl) nextStopEl.textContent = "JNTU";
            if (etaEl) etaEl.textContent = "18 minutes";
            if (collegeArrivalEl) collegeArrivalEl.textContent = "9:05 AM";
            if (collegeStartsEl) collegeStartsEl.textContent = "9:20 AM";

        } else {
            // Evening return dashboard
            if (morningCard) morningCard.classList.add('hidden');
            if (eveningCard) eveningCard.classList.remove('hidden');

            const eveBusEl = document.getElementById('studentEveBus');
            const eveDepartureEl = document.getElementById('studentEveDeparture');
            const eveLocationEl = document.getElementById('studentEveLocation');
            const eveDestEl = document.getElementById('studentEveDestination');
            const eveArrivalEl = document.getElementById('studentEveEstimatedArrival');
            const eveStatusEl = document.getElementById('studentEveStatus');

            if (eveBusEl) eveBusEl.textContent = bus.id;
            if (eveDepartureEl) eveDepartureEl.textContent = "4:00 PM";
            if (eveLocationEl) eveLocationEl.textContent = "CMR Technical Campus";
            if (eveDestEl) eveDestEl.textContent = "Kukatpally";
            if (eveArrivalEl) eveArrivalEl.textContent = "5:05 PM";
            if (eveStatusEl) eveStatusEl.innerHTML = '<span class="text-emerald-600 font-bold">🟢 On Route</span>';
        }

        // Capacity
        const occPercentEl = document.getElementById('studentOccupancyPercent');
        const occBarEl = document.getElementById('studentOccupancyBar');
        const occLabelEl = document.getElementById('studentOccupancyLabel');
        if (occPercentEl) occPercentEl.textContent = `${bus.occupancyRate}%`;
        if (occBarEl) occBarEl.style.width = `${bus.occupancyRate}%`;
        if (occLabelEl) occLabelEl.textContent = `${bus.currentOccupancy} of ${bus.totalCapacity} seats filled (${bus.availableSeats} available)`;

        // Timeline of Kukatpally Stops
        const timelineEl = document.getElementById('studentStopTimeline');
        if (timelineEl) {
            const waypoints = isMorning ? route.waypoints : [...route.waypoints].reverse();
            timelineEl.innerHTML = waypoints.map((wp, idx) => `
                <div class="relative flex items-center gap-4 ${wp.passed ? 'opacity-50' : 'opacity-100'}">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        wp.isUserStop ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                        wp.isCampus ? 'bg-emerald-600 text-white' :
                        wp.passed ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }">
                        ${wp.isUserStop ? '<i class="fa-solid fa-user text-xs"></i>' :
                          wp.isCampus ? '<i class="fa-solid fa-graduation-cap text-xs"></i>' : (idx + 1)}
                    </div>
                    <div class="flex-1 py-3 border-b border-slate-100">
                        <div class="flex items-center justify-between">
                            <span class="font-semibold text-sm ${wp.isUserStop ? 'text-blue-600 font-bold' : 'text-slate-800'}">
                                ${wp.name} ${wp.isUserStop ? '<span class="ml-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-normal">Your Stop</span>' : ''}
                            </span>
                            <span class="text-xs font-mono text-slate-500">${isMorning ? wp.scheduledTime : wp.returnTime}</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5">${wp.studentBoardCount > 0 ? `${wp.studentBoardCount} students boarding` : 'Kandlakoya Campus Gateway'}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 3: LIVE BUS TRACKING SCREEN
       ========================================================================= */
    renderLiveTracking() {
        setTimeout(() => {
            window.transitMap.init('liveTransitMap');
            window.transitMap.focusBus(this.selectedBusId);
        }, 100);

        const routeSelect = document.getElementById('trackingRouteSelector');
        if (routeSelect) {
            routeSelect.innerHTML = APP_DATA.routes.map(r => `
                <option value="${r.busId}" ${r.busId === this.selectedBusId ? 'selected' : ''}>${r.code} - ${r.name} (${r.categoryLabel.split('–')[1] || ''})</option>
            `).join('');
            routeSelect.onchange = (e) => {
                this.selectedBusId = e.target.value;
                window.transitMap.focusBus(this.selectedBusId);
                this.updateTrackingTelemetry(this.selectedBusId);
            };
        }

        this.updateTrackingTelemetry(this.selectedBusId);
    }

    updateTrackingTelemetry(busId) {
        const bus = APP_DATA.buses.find(b => b.id === busId) || APP_DATA.buses[0];
        const route = APP_DATA.routes.find(r => r.id === bus.routeId);
        const isMorning = APP_DATA.activeShift === 'morning';

        const busNoEl = document.getElementById('trackingBusNumber');
        const driverNameEl = document.getElementById('trackingDriverName');
        const currentLocEl = document.getElementById('trackingCurrentLocation');
        const currentSpeedEl = document.getElementById('trackingCurrentSpeed');
        const distRemainingEl = document.getElementById('trackingDistanceRemaining');
        const etaEl = document.getElementById('trackingETA');
        const passengersEl = document.getElementById('trackingPassengers');
        const availableSeatsEl = document.getElementById('trackingAvailableSeats');
        const occupancyPercentEl = document.getElementById('trackingOccupancyPercent');
        const trafficConditionEl = document.getElementById('trackingTrafficCondition');
        const routeNumberEl = document.getElementById('trackingRouteNumber');
        const nextStopEl = document.getElementById('trackingNextStop');
        const statusBadgeEl = document.getElementById('trackingStatusBadge');

        if (busNoEl) busNoEl.textContent = bus.id;
        if (driverNameEl) driverNameEl.textContent = bus.driver.name;
        if (currentLocEl) currentLocEl.textContent = bus.currentLocationName;
        if (currentSpeedEl) currentSpeedEl.textContent = `${bus.speedKmH} km/h`;
        if (distRemainingEl) distRemainingEl.textContent = `${bus.distanceRemainingKm} km`;
        if (etaEl) etaEl.textContent = `${bus.etaMinutes} minutes`;
        if (passengersEl) passengersEl.textContent = `${bus.currentOccupancy} Students`;
        if (availableSeatsEl) availableSeatsEl.textContent = `${bus.availableSeats} Seats`;
        if (occupancyPercentEl) occupancyPercentEl.textContent = `${bus.occupancyRate}%`;
        if (trafficConditionEl) trafficConditionEl.textContent = bus.trafficCondition;
        if (routeNumberEl) routeNumberEl.textContent = `${route.code} (${route.name})`;
        if (nextStopEl) nextStopEl.textContent = bus.nextStop;

        if (statusBadgeEl) {
            statusBadgeEl.textContent = bus.status;
            statusBadgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-bold ${
                bus.isEmergency ? 'bg-red-600 text-white animate-pulse' :
                bus.isDeviated ? 'bg-amber-600 text-white animate-pulse' :
                bus.status.includes('Heavy') || bus.status.includes('Delayed') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`;
        }

        // Two-hour warning indicator
        const reviewBox = document.getElementById('trackingReviewWarning');
        if (reviewBox) {
            if (route.durationCategory === 'review' || route.journeyMinutes > 120) {
                reviewBox.classList.remove('hidden');
                reviewBox.innerHTML = `
                    <div class="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs font-bold mb-2 flex items-center justify-between">
                        <span>🔴 Long Journey / Heavy Traffic – ETA may change.</span>
                        <span class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">Review Route</span>
                    </div>
                `;
            } else if (route.durationCategory === 'long') {
                reviewBox.classList.remove('hidden');
                reviewBox.innerHTML = `
                    <div class="px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold mb-2 flex items-center justify-between">
                        <span>🟠 Long Journey (${route.journeyMinutes} min Planned)</span>
                        <span class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded">Safety Monitored</span>
                    </div>
                `;
            } else {
                reviewBox.classList.add('hidden');
            }
        }
    }

    /* =========================================================================
       VIEW 4: ALL 10 ROUTES & STOPS
       ========================================================================= */
    renderRoutesStops() {
        const container = document.getElementById('routesGridContainer');
        if (!container) return;

        const isMorning = APP_DATA.activeShift === 'morning';

        container.innerHTML = APP_DATA.routes.map(route => {
            return `
                <div class="glass-panel rounded-2xl p-6 border border-slate-200 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <span class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style="background-color: ${route.color}">
                                ${route.code}
                            </span>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="font-bold text-slate-900">${route.name}</h3>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        route.durationCategory === 'short' ? 'bg-emerald-100 text-emerald-800' :
                                        route.durationCategory === 'medium' ? 'bg-amber-100 text-amber-800' :
                                        route.durationCategory === 'long' ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800 font-bold'
                                    }">${route.categoryLabel}</span>
                                </div>
                                <p class="text-xs text-slate-500">${route.corridor}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Smart Timing Computation Box -->
                    <div class="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 mb-4 text-xs">
                        <div class="font-bold text-blue-900 mb-1 flex items-center justify-between">
                            <span><i class="fa-solid fa-clock"></i> ${isMorning ? 'Morning Smart Departure Calculation' : 'Evening Smart Return Calculation'}</span>
                            <span class="text-[10px] text-blue-600 font-normal">${isMorning ? 'Target Arrival: 9:10 AM' : 'College Dep: 4:00 PM'}</span>
                        </div>
                        ${isMorning ? `
                        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mt-2">
                            <div>Journey: <b>${route.journeyMinutes} mins</b></div>
                            <div>Traffic Buffer: <b>${route.trafficBufferMinutes} mins</b></div>
                            <div>Required Arrival: <b>9:10 AM</b></div>
                            <div class="text-blue-700 font-bold">Recommended Departure: <b>${route.morningDepartureTime}</b></div>
                        </div>
                        ` : `
                        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mt-2">
                            <div>College Departure: <b>4:00 PM</b></div>
                            <div>Journey Duration: <b>${route.journeyMinutes} mins</b></div>
                            <div>Traffic Delay: <b>${route.eveningTrafficDelayMinutes} mins</b></div>
                            <div class="text-indigo-700 font-bold">Estimated Arrival: <b>${route.eveningEstimatedHomeArrival}</b></div>
                        </div>
                        `}
                    </div>

                    <div class="mb-4">
                        <h5 class="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                            <span>Stops Sequence (Terminating at CMRTC, Kandlakoya)</span>
                            <span class="text-[11px] text-slate-400">${route.waypoints.length} Total Halts</span>
                        </h5>
                        <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                            ${route.waypoints.map((w, idx) => `
                                <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                                    <span class="text-slate-600 flex items-center gap-2">
                                        <span class="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold">${idx + 1}</span>
                                        ${w.name}
                                    </span>
                                    <span class="font-mono text-slate-400 text-[11px]">${isMorning ? w.scheduledTime : w.returnTime}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="window.app.navigateTo('live-tracking', '${route.busId}')" class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-map-location-dot"></i> Live Map
                        </button>
                        <button onclick="window.app.navigateTo('bus-details', '${route.busId}')" class="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition">
                            Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* =========================================================================
       VIEW 5: FLEET DETAILS & TELEMETRY
       ========================================================================= */
    renderBusDetails(busId) {
        const bus = APP_DATA.buses.find(b => b.id === busId) || APP_DATA.buses[0];
        const route = APP_DATA.routes.find(r => r.id === bus.routeId) || APP_DATA.routes[0];
        this.selectedBusId = bus.id;

        const fleetContainer = document.getElementById('busFleetGrid');
        if (fleetContainer) {
            fleetContainer.innerHTML = APP_DATA.buses.map(b => `
                <div onclick="window.app.renderBusDetails('${b.id}')" class="p-3.5 rounded-xl cursor-pointer transition border ${
                    b.id === bus.id ? 'bg-blue-50/80 border-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                }">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-slate-900 text-xs">${b.id}</span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            b.status.includes('Heavy') || b.status.includes('Delayed') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }">${b.status}</span>
                    </div>
                    <div class="text-[11px] text-slate-500 mb-1 font-mono">${b.plateNumber}</div>
                    <div class="text-[11px] font-semibold text-slate-700 truncate">${b.routeName}</div>
                    <div class="mt-1 text-[10px] text-slate-600 flex justify-between">
                        <span>Seats</span>
                        <span class="font-bold">${b.currentOccupancy}/${b.totalCapacity}</span>
                    </div>
                </div>
            `).join('');
        }

        const targetContainer = document.getElementById('activeBusTelemetryCard');
        if (!targetContainer) return;

        targetContainer.innerHTML = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div class="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200 gap-4">
                    <div>
                        <div class="flex items-center gap-3">
                            <h2 class="text-2xl font-bold text-slate-900">${bus.id} - ${bus.model}</h2>
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${
                                bus.isEmergency ? 'bg-red-600 text-white animate-pulse' :
                                bus.isDeviated ? 'bg-amber-600 text-white animate-pulse' :
                                bus.status.includes('Delayed') || bus.status.includes('Heavy') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }">${bus.status}</span>
                        </div>
                        <p class="text-sm text-slate-500 mt-1">Registration: <span class="font-mono font-semibold text-slate-800">${bus.plateNumber}</span> • Corridor: <span class="font-semibold text-blue-600">${bus.corridorDisplay}</span></p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.app.openSeatModal('${bus.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition">
                            <i class="fa-solid fa-chair"></i> View Interactive Seat Grid
                        </button>
                        <button onclick="window.app.navigateTo('live-tracking', '${bus.id}')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition">
                            <i class="fa-solid fa-location-dot"></i> Track on Map
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span class="text-xs text-slate-400 font-semibold uppercase">Driver in Command</span>
                        <div class="flex items-center gap-3 mt-2">
                            <img src="${bus.driver.avatar}" alt="${bus.driver.name}" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow">
                            <div>
                                <h4 class="font-bold text-sm text-slate-800">${bus.driver.name}</h4>
                                <p class="text-xs text-slate-500">${bus.driver.experience} • Rating: <b class="text-amber-500">★ ${bus.driver.rating}</b></p>
                            </div>
                        </div>
                        <div class="mt-2 text-[11px] text-slate-500 font-mono">Lic: ${bus.driver.licenseNo}</div>
                    </div>

                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span class="text-xs text-slate-400 font-semibold uppercase">Speed & Location</span>
                        <div class="text-2xl font-bold text-blue-600 mt-2">${bus.speedKmH} <span class="text-sm font-normal text-slate-500">km/h</span></div>
                        <p class="text-xs text-slate-700 font-semibold mt-1">Halt: ${bus.currentLocationName}</p>
                    </div>

                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span class="text-xs text-slate-400 font-semibold uppercase">Passenger Capacity</span>
                        <div class="flex justify-between items-baseline mt-2">
                            <span class="text-2xl font-bold text-slate-800">${bus.currentOccupancy} <span class="text-sm text-slate-400 font-normal">/ ${bus.totalCapacity}</span></span>
                            <span class="text-xs font-bold ${bus.occupancyRate > 88 ? 'text-amber-600' : 'text-emerald-600'}">${bus.availableSeats} Available</span>
                        </div>
                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                            <div class="h-full ${bus.occupancyRate > 88 ? 'bg-amber-500' : 'bg-blue-600'}" style="width: ${bus.occupancyRate}%"></div>
                        </div>
                    </div>

                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span class="text-xs text-slate-400 font-semibold uppercase">Kandlakoya Target Arrival</span>
                        <div class="text-2xl font-bold text-emerald-600 mt-2">9:05 AM</div>
                        <p class="text-xs text-slate-600 mt-1">Class starts: 9:20 AM (15m buffer met)</p>
                    </div>
                </div>

                <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200 mb-4 flex items-center justify-between text-xs">
                    <div>
                        <span class="font-bold text-blue-900 block">Planned Journey Duration: ${route.journeyMinutes} mins (${route.categoryLabel})</span>
                        <span class="text-slate-600">Morning Departure: ${route.morningDepartureTime} • Evening Return Departure: 4:00 PM</span>
                    </div>
                    <span class="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs">Campus Destination</span>
                </div>
            </div>
        `;
    }

    /* =========================================================================
       VIEW 6: PARENT DASHBOARD
       ========================================================================= */
    renderParentDashboard() {
        const student = APP_DATA.currentUser;
        const bus = APP_DATA.buses.find(b => b.id === student.assignedBusId) || APP_DATA.buses[0];

        const busIdEl = document.getElementById('parentBusId');
        const driverNameEl = document.getElementById('parentDriverName');
        const driverPhoneEl = document.getElementById('parentDriverPhone');
        const statusEl = document.getElementById('parentJourneyStatus');
        const arrivalEtaEl = document.getElementById('parentArrivalEta');
        const nextStopEl = document.getElementById('parentNextStop');

        if (busIdEl) busIdEl.textContent = bus.id;
        if (driverNameEl) driverNameEl.textContent = bus.driver.name;
        if (driverPhoneEl) driverPhoneEl.href = `tel:${bus.driver.phone}`;
        if (statusEl) {
            statusEl.textContent = bus.status;
            statusEl.className = `px-3 py-1 rounded-full text-xs font-bold ${
                bus.isEmergency ? 'bg-red-500 text-white animate-pulse' :
                bus.isDeviated ? 'bg-amber-500 text-white animate-pulse' :
                bus.status.includes('Delayed') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`;
        }
        if (arrivalEtaEl) arrivalEtaEl.textContent = `${bus.etaMinutes} mins (Arrival: 9:05 AM)`;
        if (nextStopEl) nextStopEl.textContent = bus.nextStop;

        const logContainer = document.getElementById('parentTravelLogs');
        if (logContainer) {
            logContainer.innerHTML = APP_DATA.tripHistory.map(th => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                        <div class="font-bold text-slate-800">${th.date}</div>
                        <div class="text-slate-500 mt-0.5">${th.boardingStop} → ${th.deboardingStop}</div>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${th.punctuality.includes('Punctual') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}">${th.punctuality}</span>
                        <div class="text-slate-400 mt-1 font-mono">${th.duration}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 7: DRIVER DASHBOARD
       ========================================================================= */
    renderDriverDashboard() {
        const bus = APP_DATA.buses.find(b => b.id === "CB-101") || APP_DATA.buses[0];

        const busBadgeEl = document.getElementById('driverBusBadge');
        const speedHudEl = document.getElementById('driverSpeedHud');
        const passengerHudEl = document.getElementById('driverPassengerHud');
        const nextWaypointEl = document.getElementById('driverNextWaypoint');
        const tripStatusEl = document.getElementById('driverTripStatus');

        if (busBadgeEl) busBadgeEl.textContent = `${bus.id} • ${bus.plateNumber}`;
        if (speedHudEl) speedHudEl.textContent = bus.speedKmH;
        if (passengerHudEl) passengerHudEl.textContent = `${bus.currentOccupancy} / ${bus.totalCapacity}`;
        if (nextWaypointEl) nextWaypointEl.textContent = bus.nextStop;
        if (tripStatusEl) tripStatusEl.textContent = bus.status;

        const attContainer = document.getElementById('driverAttendanceList');
        if (attContainer) {
            attContainer.innerHTML = APP_DATA.attendanceRecords.map(rec => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                            ${rec.studentName.charAt(0)}
                        </div>
                        <div>
                            <div class="font-bold text-slate-800">${rec.studentName}</div>
                            <div class="text-[11px] text-slate-400">${rec.rollNo} • ${rec.stop}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${rec.status.includes('Boarded') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${rec.status}</span>
                        <div class="text-slate-400 text-[10px] mt-0.5 font-mono">${rec.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 8: NOTIFICATIONS CENTER
       ========================================================================= */
    renderNotificationsView() {
        const container = document.getElementById('notificationsListContainer');
        if (!container) return;

        container.innerHTML = APP_DATA.notifications.map(n => `
            <div class="p-4 rounded-2xl border transition ${
                n.read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-sm'
            }">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        n.color === 'red' ? 'bg-red-100 text-red-600' :
                        n.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                        n.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }">
                        <i class="fa-solid ${n.icon} text-base"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-sm text-slate-900">${n.title}</h4>
                            <span class="text-xs text-slate-400 font-mono">${n.time}</span>
                        </div>
                        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${n.message}</p>
                    </div>
                </div>
            </div>
        `).join('');

        this.renderNotificationsBadge();
    }

    /* =========================================================================
       VIEW 9: EMERGENCY & SAFETY CENTER
       ========================================================================= */
    renderEmergencySafetyView() {
        const bus = APP_DATA.buses.find(b => b.id === "CB-101");
        const statusEl = document.getElementById('safetyStatusBadge');
        if (statusEl && bus) {
            statusEl.textContent = bus.isEmergency ? "CRITICAL EMERGENCY BROADCAST ON CB-101" : "ALL SYSTEMS GREEN • CMRTC KANDLAKOYA GEOFENCE SECURE";
            statusEl.className = `p-4 rounded-2xl font-bold text-center text-sm flex items-center justify-center gap-2 ${
                bus.isEmergency ? "bg-red-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`;
        }

        const contactsContainer = document.getElementById('emergencyContactsList');
        if (contactsContainer) {
            contactsContainer.innerHTML = APP_DATA.emergencyContacts.map(c => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                        <div class="font-bold text-xs text-slate-800">${c.role}</div>
                        <div class="text-[11px] text-slate-500">${c.type}</div>
                    </div>
                    <a href="tel:${c.number}" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-phone"></i> Call
                    </a>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 10: DIGITAL BUS PASS
       ========================================================================= */
    renderDigitalPassView() {
        const student = APP_DATA.currentUser;
        const cardContainer = document.getElementById('digitalPassCardContainer');
        if (!cardContainer) return;

        cardContainer.innerHTML = `
            <div class="max-w-md mx-auto pass-flip-card h-[450px] cursor-pointer" onclick="this.classList.toggle('flipped')">
                <div class="pass-flip-inner">
                    <div class="pass-card-front dark-glass-panel text-white p-6 flex flex-col justify-between border-2 border-blue-500/40 shadow-2xl relative overflow-hidden">
                        <div class="absolute inset-0 hologram-shimmer pointer-events-none"></div>
                        <div>
                            <div class="flex items-center justify-between pb-3 border-b border-white/10">
                                <div class="flex items-center gap-2">
                                    <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                        <i class="fa-solid fa-bus"></i>
                                    </div>
                                    <div>
                                        <div class="font-bold text-xs tracking-wide">CMR TECHNICAL CAMPUS</div>
                                        <div class="text-[9px] text-blue-300">KANDLAKOYA (V), HYDERABAD – 501401</div>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">VALID</span>
                            </div>

                            <div class="flex items-center gap-4 mt-4">
                                <img src="${student.avatar}" alt="${student.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-lg">
                                <div>
                                    <h3 class="text-lg font-bold text-white">${student.name}</h3>
                                    <p class="text-xs text-blue-300 font-mono">HT No: ${student.rollNo}</p>
                                    <p class="text-[11px] text-slate-300">${student.department}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2 mt-4 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                                <div>
                                    <span class="text-[10px] text-slate-400 block">Assigned Bus</span>
                                    <span class="font-bold text-white">${student.assignedBusId} (Kukatpally)</span>
                                </div>
                                <div>
                                    <span class="text-[10px] text-slate-400 block">Boarding Halt</span>
                                    <span class="font-bold text-white">${student.boardingStop}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-3 rounded-xl text-center flex items-center justify-between">
                            <div class="text-left">
                                <span class="text-[9px] text-slate-500 font-mono block">PASS SERIAL NO.</span>
                                <span class="text-xs font-mono font-bold text-slate-900">${student.passId}</span>
                                <span class="text-[9px] text-emerald-600 block mt-0.5">● Dynamic RFID Synced</span>
                            </div>
                            <div class="w-16 h-16 bg-slate-100 rounded-lg p-1 flex items-center justify-center">
                                <svg class="w-full h-full text-slate-900" viewBox="0 0 100 100">
                                    <rect width="100" height="100" fill="white"/>
                                    <rect x="10" y="10" width="25" height="25" fill="black"/>
                                    <rect x="65" y="10" width="25" height="25" fill="black"/>
                                    <rect x="10" y="65" width="25" height="25" fill="black"/>
                                    <rect x="15" y="15" width="15" height="15" fill="white"/>
                                    <rect x="70" y="15" width="15" height="15" fill="white"/>
                                    <rect x="15" y="70" width="15" height="15" fill="white"/>
                                    <rect x="18" y="18" width="9" height="9" fill="black"/>
                                    <rect x="73" y="18" width="9" height="9" fill="black"/>
                                    <rect x="18" y="73" width="9" height="9" fill="black"/>
                                    <rect x="45" y="15" width="10" height="30" fill="black"/>
                                    <rect x="40" y="55" width="20" height="10" fill="black"/>
                                    <rect x="65" y="45" width="25" height="20" fill="black"/>
                                    <rect x="45" y="75" width="15" height="15" fill="black"/>
                                </svg>
                            </div>
                        </div>

                        <div class="text-center text-[10px] text-slate-400">
                            Tap to flip for college timings & return policy ↺
                        </div>
                    </div>

                    <div class="pass-card-back bg-slate-900 text-white p-6 flex flex-col justify-between border-2 border-slate-700 shadow-2xl">
                        <div>
                            <div class="pb-3 border-b border-white/10 flex justify-between items-center">
                                <h4 class="font-bold text-sm">CMRTC Transit Guidelines</h4>
                                <span class="text-xs text-blue-400 font-mono">AUTONOMOUS</span>
                            </div>
                            <ul class="text-xs text-slate-300 space-y-2 mt-4 list-disc pl-4">
                                <li>College Starts: 9:20 AM. Bus targets campus arrival by 9:10 AM.</li>
                                <li>All return buses depart Kandlakoya campus at 4:00 PM sharp.</li>
                                <li>Emergency Contact: K. Mohan Reddy (+91 98490 23115).</li>
                                <li>Loss of pass must be reported to Kandlakoya Transport Desk.</li>
                            </ul>
                        </div>
                        <div class="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                            <div class="font-bold text-blue-400">CMRTC Transport Helpline</div>
                            <div class="text-slate-300 font-mono mt-0.5">+91 8418 200037 / +91 92470 33441</div>
                        </div>
                        <div class="text-center text-[10px] text-slate-400">
                            Tap to flip back to QR Code ↺
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /* =========================================================================
       VIEW 11: QR ATTENDANCE SCANNER
       ========================================================================= */
    renderQRAttendanceView() {
        const targetEl = document.getElementById('qrRecentBoardings');
        if (targetEl) {
            targetEl.innerHTML = APP_DATA.attendanceRecords.map(r => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                        <span class="font-bold text-slate-800">${r.studentName}</span>
                        <span class="text-slate-500 font-mono ml-2">(${r.rollNo})</span>
                        <div class="text-[11px] text-slate-400 mt-0.5">${r.stop} • ${r.method}</div>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status.includes('Boarded') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${r.status}</span>
                        <div class="text-[10px] text-slate-400 font-mono mt-1">${r.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 12: TRIP HISTORY
       ========================================================================= */
    renderTripHistoryView() {
        const container = document.getElementById('tripHistoryList');
        if (!container) return;

        container.innerHTML = APP_DATA.tripHistory.map(th => `
            <div class="glass-panel p-5 rounded-2xl border border-slate-200 card-hover">
                <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            <i class="fa-solid fa-route"></i>
                        </span>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900">${th.route}</h4>
                            <span class="text-xs text-slate-400">${th.date}</span>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${
                        th.punctuality.includes('Punctual') || th.punctuality.includes('On Time') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }">${th.punctuality}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 py-3 text-xs">
                    <div>
                        <span class="text-slate-400 text-[10px] uppercase font-semibold block">Boarding</span>
                        <span class="font-semibold text-slate-700">${th.boardingStop}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 text-[10px] uppercase font-semibold block">Destination</span>
                        <span class="font-semibold text-slate-700">${th.deboardingStop}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 text-[10px] uppercase font-semibold block">Bus & Driver</span>
                        <span class="font-semibold text-slate-700">${th.busNumber} • ${th.driver}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 text-[10px] uppercase font-semibold block">Eco Saved</span>
                        <span class="font-semibold text-emerald-600">${th.co2Saved} CO₂</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /* =========================================================================
       VIEW 13: FEEDBACK & LOST AND FOUND
       ========================================================================= */
    renderFeedbackView() {
        const container = document.getElementById('feedbackListContainer');
        if (container) {
            container.innerHTML = APP_DATA.feedback.map(fb => `
                <div class="p-4 rounded-2xl bg-white border border-slate-200 card-hover">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="font-bold text-sm text-slate-900">${fb.author}</h4>
                            <p class="text-xs text-slate-400">${fb.role} • ${fb.bus} • ${fb.date}</p>
                        </div>
                        <div class="text-amber-400 text-sm">
                            ${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}
                        </div>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed mb-3">"${fb.comment}"</p>
                    <div class="flex flex-wrap gap-1.5">
                        ${fb.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">#${t}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        const lfContainer = document.getElementById('lostFoundListContainer');
        if (lfContainer) {
            lfContainer.innerHTML = APP_DATA.lostAndFound.map(lf => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                        <div class="font-bold text-slate-800">${lf.item}</div>
                        <div class="text-[11px] text-slate-500">${lf.bus} (${lf.seat}) • Reported: ${lf.date}</div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        lf.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        lf.statusColor === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }">${lf.status}</span>
                </div>
            `).join('');
        }
    }

    /* =========================================================================
       VIEW 14: ADVANCED ADMIN DASHBOARD
       ========================================================================= */
    renderAdminDashboard() {
        setTimeout(() => {
            if (window.transitCharts) {
                window.transitCharts.initAdminCharts();
            }
        }, 150);

        const tableBody = document.getElementById('adminFleetTableBody');
        if (tableBody) {
            tableBody.innerHTML = APP_DATA.buses.map(bus => {
                const route = APP_DATA.routes.find(r => r.id === bus.routeId) || APP_DATA.routes[0];
                return `
                    <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
                        <td class="py-3 px-4 font-bold text-slate-900">${bus.id}</td>
                        <td class="py-3 px-4 font-mono text-slate-600">${bus.plateNumber}</td>
                        <td class="py-3 px-4 text-slate-700">
                            <div class="font-semibold">${bus.routeName}</div>
                            <div class="text-[10px] text-slate-400">${bus.corridorDisplay}</div>
                        </td>
                        <td class="py-3 px-4 font-medium text-slate-800">${bus.driver.name}</td>
                        <td class="py-3 px-4">
                            <span class="font-semibold text-slate-700">${bus.currentOccupancy}/${bus.totalCapacity}</span>
                            <span class="text-slate-400 ml-1">(${bus.occupancyRate}%)</span>
                        </td>
                        <td class="py-3 px-4 font-semibold text-blue-600">${bus.speedKmH} km/h</td>
                        <td class="py-3 px-4">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                bus.isEmergency ? 'bg-red-100 text-red-700 animate-pulse' :
                                bus.isDeviated ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                bus.status.includes('Heavy') || bus.status.includes('Delayed') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }">${bus.status}</span>
                        </td>
                        <td class="py-3 px-4">
                            <button onclick="window.app.navigateTo('bus-details', '${bus.id}')" class="text-blue-600 hover:text-blue-800 font-semibold">
                                Manage
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    renderAuthView() {}

    /* =========================================================================
       MODALS & USER ACTIONS
       ========================================================================= */
    openSeatModal(busId) {
        const modal = document.getElementById('seatMapModal');
        const grid = document.getElementById('seatGridContainer');
        if (!modal || !grid) return;

        grid.innerHTML = APP_DATA.seatsBus01.map(s => `
            <div class="seat-item p-2.5 rounded-xl text-center text-xs font-bold ${
                s.status === 'reserved' ? 'seat-reserved' :
                s.status === 'occupied' ? 'seat-occupied' : 'seat-available'
            }" title="${s.student ? s.student : 'Available Seat'}">
                <i class="fa-solid fa-chair text-sm block mb-1"></i>
                <span>${s.number}</span>
            </div>
        `).join('');

        modal.classList.remove('hidden');
    }

    closeSeatModal() {
        const modal = document.getElementById('seatMapModal');
        if (modal) modal.classList.add('hidden');
    }

    openIncidentModal() {
        const modal = document.getElementById('incidentModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeIncidentModal() {
        const modal = document.getElementById('incidentModal');
        if (modal) modal.classList.add('hidden');
    }

    submitIncidentReport(e) {
        if (e) e.preventDefault();
        this.closeIncidentModal();
        this.showToast("Incident Report Dispatched", "CMRTC Transport Office & Security Desk have received your dispatch.", "success");
    }

    openLostFoundModal() {
        const modal = document.getElementById('lostFoundModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeLostFoundModal() {
        const modal = document.getElementById('lostFoundModal');
        if (modal) modal.classList.add('hidden');
    }

    submitLostFound(e) {
        if (e) e.preventDefault();
        const itemInput = document.getElementById('lfItemName');
        const itemName = itemInput ? itemInput.value : "Reported Item";

        APP_DATA.lostAndFound.unshift({
            id: "LF-" + Math.floor(405 + Math.random() * 50),
            item: itemName || "Found Item",
            bus: "CB-101",
            seat: "Seat 12",
            foundBy: APP_DATA.currentUser.name,
            date: "Today",
            status: "Verification Pending",
            statusColor: "amber"
        });

        this.closeLostFoundModal();
        this.renderFeedbackView();
        this.showToast("Item Logged", "Item report dispatched to Kandlakoya Transport Desk.", "info");
    }

    submitFeedback(e) {
        if (e) e.preventDefault();
        const text = document.getElementById('feedbackCommentText');
        if (text && text.value) {
            APP_DATA.feedback.unshift({
                id: "FB-" + Date.now(),
                author: APP_DATA.currentUser.name,
                role: "Student (CSE - 217R1A05A2)",
                rating: 5,
                bus: "CB-101",
                date: "Just now",
                comment: text.value,
                tags: ["Target 9:10 AM Met", "CMRTC Student"]
            });
            text.value = "";
            this.renderFeedbackView();
            this.showToast("Feedback Logged", "Thank you for rating CMRTC SmartTransit!", "success");
        }
    }

    showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-item p-4 rounded-2xl glass-panel border flex items-start gap-3 shadow-xl ${
            type === 'emergency' ? 'border-red-500 bg-red-50/95 text-red-900' :
            type === 'deviation' ? 'border-amber-500 bg-amber-50/95 text-amber-900' :
            type === 'success' ? 'border-emerald-500 bg-emerald-50/95 text-emerald-900' :
            'border-blue-500 bg-blue-50/95 text-blue-900'
        }`;

        toast.innerHTML = `
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                type === 'emergency' ? 'bg-red-600 text-white' :
                type === 'deviation' ? 'bg-amber-600 text-white' :
                type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }">
                <i class="fa-solid ${
                    type === 'emergency' ? 'fa-triangle-exclamation' :
                    type === 'deviation' ? 'fa-route' :
                    type === 'success' ? 'fa-check' : 'fa-bell'
                } text-xs"></i>
            </div>
            <div class="flex-1">
                <h5 class="font-bold text-xs">${title}</h5>
                <p class="text-[11px] opacity-90 mt-0.5 leading-snug">${message}</p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 text-xs">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 5000);
    }

    onSimulationTick(buses) {
        if (this.currentView === 'student-dashboard') {
            this.renderStudentDashboard();
        } else if (this.currentView === 'live-tracking') {
            this.updateTrackingTelemetry(this.selectedBusId);
        } else if (this.currentView === 'parent-dashboard') {
            this.renderParentDashboard();
        } else if (this.currentView === 'driver-dashboard') {
            this.renderDriverDashboard();
        }
    }

    onEmergencyChange(data) {
        if (data.isEmergency) {
            this.showToast("🚨 EMERGENCY SOS BROADCAST", "Bus CB-101 has triggered an emergency alarm. Coordinates transmitted to Medchal Highway Patrol.", "emergency");
        } else {
            this.showToast("Emergency Cleared", "Bus CB-101 safety status returned to normal.", "success");
        }
        if (this.currentView === 'emergency-safety') this.renderEmergencySafetyView();
    }

    onDeviationChange(data) {
        if (data.active) {
            this.showToast("⚠️ ROUTE DEVIATION DETECTED", "Bus CB-101 has deviated > 450m from designated Bachupally-Kandlakoya corridor!", "deviation");
        } else {
            this.showToast("Safe Corridor Restored", "Bus CB-101 has rejoined designated route.", "success");
        }
    }

    onQRScanComplete(rec) {
        this.showToast("Dynamic Pass Verified", `Passenger ${rec.studentName} boarded Bus CB-101 at ${rec.stop}`, "success");
        if (this.currentView === 'qr-attendance') this.renderQRAttendanceView();
        if (this.currentView === 'driver-dashboard') this.renderDriverDashboard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new CampusTransitApp();
});
