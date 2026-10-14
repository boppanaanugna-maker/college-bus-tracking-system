/**
 * CMR Technical Campus, Kandlakoya, Hyderabad – 501401, Telangana
 * Real-Time Simulation Engine & Smart Timing Calculator
 * Handles morning arrival (Target 9:10 AM | Starts 9:20 AM) and evening return (Departs 4:00 PM)
 */

class TransitSimulationEngine {
    constructor() {
        this.isRunning = true;
        this.speedMultiplier = 1;
        this.tickInterval = 1000;
        this.timer = null;
        this.audioCtx = null;
        this.listeners = [];
        this.routeDeviationActive = false;
        this.trafficMultiplier = 1.0;
        this.activeShift = "morning"; // 'morning' or 'evening'
        
        // Progress tracks for all 10 CMRTC buses (0.0 to 1.0)
        this.busProgress = {
            "CB-101": 0.44, // Kukatpally near JNTU
            "CB-102": 0.50, // Miyapur
            "CB-103": 0.65, // Suncity
            "CB-104": 0.58, // Secunderabad / Bowenpally
            "CB-105": 0.62, // Alwal
            "CB-106": 0.60, // LB Nagar
            "CB-107": 0.52, // Uppal
            "CB-108": 0.48, // Mehdipatnam
            "CB-109": 0.54, // Patancheru
            "CB-110": 0.56  // Vanasthalipuram
        };

        this.initAudio();
        this.start();
    }

    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        } catch (e) {
            console.warn("AudioContext not permitted", e);
        }
    }

    ensureAudio() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playChime() {
        try {
            this.ensureAudio();
            if (!this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {}
    }

    playScanBeep() {
        try {
            this.ensureAudio();
            if (!this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(1760, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    playEmergencySiren() {
        try {
            this.ensureAudio();
            if (!this.audioCtx) return;
            const now = this.audioCtx.currentTime;
            for (let i = 0; i < 3; i++) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const startTime = now + (i * 0.25);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, startTime);
                osc.frequency.linearRampToValueAtTime(950, startTime + 0.12);
                osc.frequency.linearRampToValueAtTime(600, startTime + 0.24);
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.linearRampToValueAtTime(0.01, startTime + 0.24);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.25);
            }
        } catch (e) {}
    }

    start() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.tick(), this.tickInterval);
        this.isRunning = true;
        this.emit('stateChange', { isRunning: true });
    }

    pause() {
        if (this.timer) clearInterval(this.timer);
        this.isRunning = false;
        this.emit('stateChange', { isRunning: false });
    }

    togglePlayPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    setShift(shift) {
        this.activeShift = shift; // 'morning' or 'evening'
        APP_DATA.activeShift = shift;
        this.playChime();
        this.emit('shiftChange', shift);
        this.tick();
    }

    setSpeed(mult) {
        this.speedMultiplier = mult;
        this.emit('speedChange', mult);
    }

    on(event, callback) {
        this.listeners.push({ event, callback });
    }

    emit(event, data) {
        this.listeners.filter(l => l.event === event).forEach(l => l.callback(data));
    }

    tick() {
        if (!this.isRunning) return;

        APP_DATA.buses.forEach(bus => {
            const route = APP_DATA.routes.find(r => r.id === bus.routeId);
            if (!route || !route.waypoints || route.waypoints.length < 2) return;

            const stepIncrement = (0.0025 * this.speedMultiplier) / Math.max(0.6, this.trafficMultiplier);
            let p = (this.busProgress[bus.id] || 0) + stepIncrement;
            if (p >= 1.0) p = 0.05;
            this.busProgress[bus.id] = p;

            // Compute interpolated coordinate (reversed direction if evening shift)
            const waypoints = this.activeShift === 'evening' ? [...route.waypoints].reverse() : route.waypoints;
            const interpolated = this.getPointAlongRoute(waypoints, p);

            // Route deviation on CB-101 if active
            if (bus.id === "CB-101" && this.routeDeviationActive) {
                bus.currentLocation = {
                    lat: +(interpolated.lat + 0.0048).toFixed(6),
                    lng: +(interpolated.lng - 0.0042).toFixed(6)
                };
                bus.isDeviated = true;
            } else {
                bus.currentLocation = interpolated;
                bus.isDeviated = false;
            }

            // Speed with slight jitter
            const baseSpeed = 42;
            const trafficFactor = this.trafficMultiplier > 1.2 ? 0.7 : 1.0;
            bus.speedKmH = Math.round((baseSpeed + Math.sin(Date.now() / 2500) * 3) * trafficFactor);
            if (bus.speedKmH < 15) bus.speedKmH = 18;

            // Distance remaining
            const remainingProgress = Math.max(0.01, 1.0 - p);
            const remainingKm = +(route.distanceKm * remainingProgress).toFixed(1);
            bus.distanceRemainingKm = remainingKm;

            // Next stop calculation
            const nextStopObj = this.getNextStop(waypoints, p);
            bus.nextStop = nextStopObj.stop.name;
            bus.currentLocationName = p > 0.85 ? "Kandlakoya (V)" : nextStopObj.prevStop.name;

            // ETA minutes calculation
            if (this.activeShift === 'morning') {
                if (bus.id === 'CB-101') {
                    bus.etaMinutes = 18; // Exact requested prompt value
                    bus.collegeArrivalDisplay = "9:05 AM";
                    bus.collegeStartsDisplay = "9:20 AM";
                } else {
                    const rawMins = Math.round((remainingKm / (bus.speedKmH || 40)) * 60);
                    bus.etaMinutes = Math.max(2, rawMins);
                }
            } else {
                // Evening shift: College departure 4:00 PM
                const delay = route.eveningTrafficDelayMinutes || 10;
                const elapsedFromCollege = Math.round(p * route.journeyMinutes);
                const remainHome = Math.max(2, route.journeyMinutes + delay - elapsedFromCollege);
                bus.etaMinutes = remainHome;
            }

            // Check if duration > 120m for review warning
            if (route.journeyMinutes > 120 || (route.journeyMinutes + (this.trafficMultiplier > 1.2 ? 20 : 0) > 120)) {
                bus.status = "Long Journey / Heavy Traffic – ETA may change.";
            } else if (bus.isEmergency) {
                bus.status = "EMERGENCY SOS";
            } else if (bus.isDeviated) {
                bus.status = "ROUTE DEVIATION";
            } else if (this.activeShift === 'evening') {
                bus.status = "On Route (Return)";
            } else {
                bus.status = "On Time";
            }
        });

        this.emit('busTick', APP_DATA.buses);
    }

    getPointAlongRoute(waypoints, progress) {
        const totalSegments = waypoints.length - 1;
        const targetProgress = Math.min(0.999, Math.max(0, progress));
        const segmentFloat = targetProgress * totalSegments;
        const segmentIndex = Math.min(totalSegments - 1, Math.floor(segmentFloat));
        const segmentRatio = segmentFloat - segmentIndex;

        const p1 = waypoints[segmentIndex];
        const p2 = waypoints[segmentIndex + 1];

        return {
            lat: +(p1.lat + (p2.lat - p1.lat) * segmentRatio).toFixed(6),
            lng: +(p1.lng + (p2.lng - p1.lng) * segmentRatio).toFixed(6)
        };
    }

    getNextStop(waypoints, progress) {
        const totalSegments = waypoints.length - 1;
        const targetProgress = Math.min(0.999, Math.max(0, progress));
        const segmentFloat = targetProgress * totalSegments;
        const nextIndex = Math.min(waypoints.length - 1, Math.floor(segmentFloat) + 1);
        const prevIndex = Math.max(0, nextIndex - 1);

        return {
            stop: waypoints[nextIndex],
            prevStop: waypoints[prevIndex]
        };
    }

    triggerEmergencySOS() {
        const bus = APP_DATA.buses.find(b => b.id === "CB-101");
        if (!bus) return;
        bus.isEmergency = !bus.isEmergency;
        if (bus.isEmergency) {
            this.playEmergencySiren();
            APP_DATA.notifications.unshift({
                id: Date.now(),
                type: "emergency",
                title: "CRITICAL: Emergency SOS on CB-101 (Kukatpally)",
                message: "Driver or student initiated SOS panic alert. Coordinates transmitted to CMRTC Security & Medchal Highway Patrol.",
                time: "Just now",
                read: false,
                icon: "fa-triangle-exclamation",
                color: "red"
            });
        }
        this.emit('emergencyChange', { busId: "CB-101", isEmergency: bus.isEmergency });
        this.tick();
    }

    toggleRouteDeviation() {
        this.routeDeviationActive = !this.routeDeviationActive;
        const bus = APP_DATA.buses.find(b => b.id === "CB-101");
        if (bus) {
            bus.isDeviated = this.routeDeviationActive;
        }

        if (this.routeDeviationActive) {
            this.playEmergencySiren();
            APP_DATA.notifications.unshift({
                id: Date.now(),
                type: "deviation",
                title: "SECURITY ALERT: Route Deviation on CB-101",
                message: "Bus CB-101 deviated > 450m from designated Bachupally-Kandlakoya route. Transport Dean & Parents alerted.",
                time: "Just now",
                read: false,
                icon: "fa-route",
                color: "amber"
            });
        } else {
            this.playChime();
        }

        this.emit('deviationChange', { active: this.routeDeviationActive });
        this.tick();
    }

    toggleHeavyTraffic() {
        this.trafficMultiplier = this.trafficMultiplier > 1.2 ? 1.0 : 1.7;
        const rt = APP_DATA.routes.find(r => r.id === "RT-101");
        if (rt) {
            rt.trafficCondition = this.trafficMultiplier > 1.2 ? "Heavy Congestion / JNTU Jam" : "Moderate";
        }
        this.playChime();
        this.emit('trafficChange', { trafficMultiplier: this.trafficMultiplier });
        this.tick();
    }

    simulateStudentQRScan() {
        this.playScanBeep();
        const bus = APP_DATA.buses.find(b => b.id === "CB-101");
        if (bus && bus.currentOccupancy < bus.totalCapacity) {
            bus.currentOccupancy += 1;
            bus.availableSeats = bus.totalCapacity - bus.currentOccupancy;
            bus.occupancyRate = Math.round((bus.currentOccupancy / bus.totalCapacity) * 100);
        }

        const newRec = {
            id: "ATT-" + Math.floor(100 + Math.random() * 900),
            studentName: APP_DATA.currentUser.name,
            rollNo: APP_DATA.currentUser.rollNo,
            busId: "CB-101",
            stop: "JNTU Pickup Stop",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: "Boarded (Verified)",
            method: "Dynamic CMRTC Pass"
        };
        APP_DATA.attendanceRecords.unshift(newRec);

        APP_DATA.notifications.unshift({
            id: Date.now(),
            type: "attendance",
            title: "Boarding Confirmed: Sai Teja Reddy",
            message: `Student verified on Bus CB-101 at JNTU Stop. Seat 3A allocated. Automated SMS dispatched to parent.`,
            time: "Just now",
            read: false,
            icon: "fa-circle-check",
            color: "emerald"
        });

        this.emit('qrScanComplete', newRec);
    }

    simulateGeofenceArrival() {
        this.playChime();
        this.busProgress["CB-101"] = 0.44;
        APP_DATA.notifications.unshift({
            id: Date.now(),
            type: "geofence",
            title: "Smart Stop Alert: Bus CB-101 at JNTU",
            message: "Bus CB-101 is currently halting at JNTU stop. Target college arrival 9:05 AM is on track.",
            time: "Just now",
            read: false,
            icon: "fa-bell",
            color: "emerald"
        });
        this.tick();
        this.emit('geofenceAlert', { stop: "JNTU" });
    }
}

window.transitSimulator = new TransitSimulationEngine();
