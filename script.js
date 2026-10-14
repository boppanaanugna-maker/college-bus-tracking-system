/**
 * CMR Technical Campus, Kandlakoya, Hyderabad - 501401, Telangana
 * Complete Frontend Master Script
 * Combines Data, Simulation Physics, Leaflet Mapping, Chart.js & App Router
 */

// ==============================================================================
// 1. CORE DATASET & TIMINGS (data.js)
// ==============================================================================
/**
 * CMR Technical Campus, Kandlakoya, Hyderabad â€“ 501401, Telangana
 * SmartTransit AI - Core Dataset & Timing Engine
 * 
 * College Timings:
 * - College Starts at: 9:20 AM
 * - Target Arrival at College: 9:10 AM (At least 10 minutes before college starts)
 * - College Closes at: 4:00 PM
 * - All Return Buses Depart College at: 4:00 PM
 */

const APP_DATA = {
    collegeInfo: {
        name: "CMR Technical Campus",
        address: "Kandlakoya (V), Medchal Road, Hyderabad â€“ 501401, Telangana",
        locationDisplay: "CMR Technical Campus, Kandlakoya (V), Medchal Road, Hyderabad â€“ 501401, Telangana",
        landmark: "Near Outer Ring Road (ORR) Exit 6 / NH-44 Medchal Highway",
        campusLocation: { lat: 17.6033, lng: 78.4877, name: "CMR Technical Campus (Kandlakoya)" },
        collegeStartTime: "9:20 AM",
        targetArrivalMorning: "9:10 AM",
        collegeDepartureEvening: "4:00 PM",
        contact: "+91 8418 200037",
        transportDesk: "+91 92470 33441",
        emergencyHotline: "+91 99888 77661"
    },

    // Global Active Shift Mode: 'morning' (To College) or 'evening' (Return from College @ 4:00 PM)
    activeShift: "morning",

    currentUser: {
        role: "student",
        id: "CMRTC-2026-05A2",
        name: "Sai Teja Reddy",
        rollNo: "217R1A05A2",
        department: "Computer Science & Engineering",
        yearSemester: "B.Tech III Year - Sem II",
        assignedBusId: "CB-101",
        assignedRouteId: "RT-101",
        boardingStop: "JNTU",
        destinationStop: "CMR Technical Campus, Kandlakoya",
        returnDestination: "Kukatpally",
        passId: "CMRTC-PASS-2026-9041",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },

    personas: {
        student: {
            name: "Sai Teja Reddy",
            title: "B.Tech CSE III Year (217R1A05A2)",
            roleBadge: "Student",
            busAssigned: "CB-101 (Kukatpally)",
            stop: "JNTU",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
        },
        parent: {
            name: "K. Mohan Reddy",
            title: "Parent of Sai Teja (217R1A05A2)",
            roleBadge: "Parent",
            busAssigned: "CB-101",
            stop: "JNTU Pickup Point",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
        },
        driver: {
            name: "K. Srinivas Reddy",
            title: "Senior Fleet Captain (TS-08-2014-9912)",
            roleBadge: "Fleet Captain",
            busAssigned: "CB-101 (TS-08-UB-4012)",
            stop: "Kukatpally Route",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        },
        admin: {
            name: "Dr. A. Raji Reddy",
            title: "Director & Transport Controller",
            roleBadge: "Transport Dean",
            busAssigned: "CMRTC Fleet HQ (35 Buses)",
            stop: "Kandlakoya Command Desk",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
        }
    },

    /**
     * 10 Realistic Hyderabad Routes as Requested by User
     * With 4-tier Journey duration categories:
     * ðŸŸ¢ Under 60 min â€“ Short Route
     * ðŸŸ¡ 60â€“90 min â€“ Medium Route
     * ðŸŸ  90â€“120 min â€“ Long Route
     * ðŸ”´ Over 120 min â€“ Review Route
     */
    routes: [
        {
            id: "RT-101",
            code: "CB-101",
            name: "Kukatpally Route",
            corridor: "Kukatpally â†’ KPHB â†’ JNTU â†’ Nizampet â†’ Bachupally â†’ Bowrampet â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-101",
            color: "#2563EB", // Blue
            distanceKm: 17.5,
            journeyMinutes: 60,
            trafficBufferMinutes: 15,
            morningDepartureTime: "7:55 AM", // 9:10 AM - 60m - 15m buffer = 7:55 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 10,
            eveningEstimatedHomeArrival: "5:10 PM", // 4:00 PM + 60m + 10m = 5:10 PM
            durationCategory: "medium", // 60 min (Border of short/medium)
            categoryLabel: "ðŸŸ¡ 60â€“90 min â€“ Medium Route",
            studentsEnrolled: 48,
            waypoints: [
                { name: "Kukatpally Y-Junction (Start)", lat: 17.4849, lng: 78.4138, scheduledTime: "07:55 AM", returnTime: "05:10 PM", passed: true, studentBoardCount: 8 },
                { name: "KPHB Colony Phase 1", lat: 17.4932, lng: 78.4017, scheduledTime: "08:08 AM", returnTime: "04:58 PM", passed: true, studentBoardCount: 10 },
                { name: "JNTU (Sai Teja's Stop)", lat: 17.4986, lng: 78.3905, scheduledTime: "08:20 AM", returnTime: "04:46 PM", passed: false, isUserStop: true, studentBoardCount: 12 },
                { name: "Nizampet X Roads", lat: 17.5146, lng: 78.3846, scheduledTime: "08:35 AM", returnTime: "04:32 PM", passed: false, studentBoardCount: 8 },
                { name: "Bachupally Junction", lat: 17.5369, lng: 78.3686, scheduledTime: "08:48 AM", returnTime: "04:22 PM", passed: false, studentBoardCount: 6 },
                { name: "Bowrampet ORR Stretch", lat: 17.5540, lng: 78.3980, scheduledTime: "08:58 AM", returnTime: "04:12 PM", passed: false, studentBoardCount: 4 },
                { name: "Kandlakoya (V) Gateway", lat: 17.5920, lng: 78.4750, scheduledTime: "09:05 AM", returnTime: "04:05 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya (Near ORR Exit 6)", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-102",
            code: "CB-102",
            name: "Miyapur Route",
            corridor: "Miyapur â†’ Hafeezpet â†’ Chandanagar â†’ Nizampet â†’ Bachupally â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-102",
            color: "#059669", // Emerald
            distanceKm: 22.4,
            journeyMinutes: 50,
            trafficBufferMinutes: 10,
            morningDepartureTime: "8:10 AM", // 9:10 - 50m - 10m = 8:10 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 8,
            eveningEstimatedHomeArrival: "4:58 PM", // 4:00 + 50m + 8m = 4:58 PM
            durationCategory: "short",
            categoryLabel: "ðŸŸ¢ Under 60 min â€“ Short Route",
            studentsEnrolled: 46,
            waypoints: [
                { name: "Miyapur Metro Terminal", lat: 17.4968, lng: 78.3547, scheduledTime: "08:10 AM", returnTime: "04:58 PM", passed: true, studentBoardCount: 12 },
                { name: "Hafeezpet MMTS Hub", lat: 17.4890, lng: 78.3456, scheduledTime: "08:22 AM", returnTime: "04:46 PM", passed: true, studentBoardCount: 8 },
                { name: "Chandanagar Rythu Bazar", lat: 17.4922, lng: 78.3284, scheduledTime: "08:32 AM", returnTime: "04:36 PM", passed: true, studentBoardCount: 10 },
                { name: "Nizampet Village Road", lat: 17.5146, lng: 78.3846, scheduledTime: "08:44 AM", returnTime: "04:24 PM", passed: false, studentBoardCount: 8 },
                { name: "Bachupally X Roads", lat: 17.5369, lng: 78.3686, scheduledTime: "08:54 AM", returnTime: "04:14 PM", passed: false, studentBoardCount: 8 },
                { name: "Kandlakoya Bypass", lat: 17.5920, lng: 78.4750, scheduledTime: "09:04 AM", returnTime: "04:04 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-103",
            code: "CB-103",
            name: "Suncity Route",
            corridor: "Suncity â†’ Bandlaguda â†’ Mehdipatnam â†’ Tolichowki â†’ Begumpet â†’ Suchitra â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-103",
            color: "#D97706", // Amber
            distanceKm: 39.5,
            journeyMinutes: 105, // 1 hr 45 min
            trafficBufferMinutes: 15,
            morningDepartureTime: "7:10 AM", // 9:10 - 105m - 15m = 7:10 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 15,
            eveningEstimatedHomeArrival: "6:00 PM", // 4:00 + 105m + 15m = 6:00 PM
            durationCategory: "long",
            categoryLabel: "ðŸŸ  90â€“120 min â€“ Long Route",
            studentsEnrolled: 54,
            waypoints: [
                { name: "Suncity Bandlaguda (Start)", lat: 17.3564, lng: 78.3982, scheduledTime: "07:10 AM", returnTime: "06:00 PM", passed: true, studentBoardCount: 12 },
                { name: "Bandlaguda Jagir", lat: 17.3680, lng: 78.4050, scheduledTime: "07:22 AM", returnTime: "05:48 PM", passed: true, studentBoardCount: 8 },
                { name: "Tolichowki Flyover", lat: 17.4018, lng: 78.4124, scheduledTime: "07:38 AM", returnTime: "05:32 PM", passed: true, studentBoardCount: 10 },
                { name: "Mehdipatnam Depot", lat: 17.3916, lng: 78.4398, scheduledTime: "07:54 AM", returnTime: "05:16 PM", passed: true, studentBoardCount: 12 },
                { name: "Begumpet Airport Road", lat: 17.4440, lng: 78.4680, scheduledTime: "08:18 AM", returnTime: "04:52 PM", passed: false, studentBoardCount: 6 },
                { name: "Suchitra Junction", lat: 17.5186, lng: 78.4735, scheduledTime: "08:44 AM", returnTime: "04:26 PM", passed: false, studentBoardCount: 6 },
                { name: "Kandlakoya (V)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:02 AM", returnTime: "04:08 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-104",
            code: "CB-104",
            name: "Secunderabad Route",
            corridor: "Secunderabad â†’ Paradise â†’ Bowenpally â†’ Suchitra â†’ Kompally â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-104",
            color: "#0284C7", // Sky Blue
            distanceKm: 21.8,
            journeyMinutes: 45,
            trafficBufferMinutes: 10,
            morningDepartureTime: "8:15 AM", // 9:10 - 45m - 10m = 8:15 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 5,
            eveningEstimatedHomeArrival: "4:50 PM", // 4:00 + 45m + 5m = 4:50 PM
            durationCategory: "short",
            categoryLabel: "ðŸŸ¢ Under 60 min â€“ Short Route",
            studentsEnrolled: 52,
            waypoints: [
                { name: "Secunderabad Railway Station", lat: 17.4344, lng: 78.5011, scheduledTime: "08:15 AM", returnTime: "04:50 PM", passed: true, studentBoardCount: 16 },
                { name: "Paradise Circle", lat: 17.4430, lng: 78.4870, scheduledTime: "08:26 AM", returnTime: "04:39 PM", passed: true, studentBoardCount: 11 },
                { name: "Bowenpally Checkpost", lat: 17.4735, lng: 78.4795, scheduledTime: "08:38 AM", returnTime: "04:27 PM", passed: false, studentBoardCount: 9 },
                { name: "Suchitra Junction", lat: 17.5186, lng: 78.4735, scheduledTime: "08:48 AM", returnTime: "04:17 PM", passed: false, studentBoardCount: 8 },
                { name: "Kompally Cineplanet", lat: 17.5448, lng: 78.4798, scheduledTime: "08:56 AM", returnTime: "04:09 PM", passed: false, studentBoardCount: 8 },
                { name: "Kandlakoya Toll Stretch", lat: 17.5920, lng: 78.4750, scheduledTime: "09:03 AM", returnTime: "04:02 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-105",
            code: "CB-105",
            name: "Alwal Route",
            corridor: "Alwal â†’ Bolarum â†’ Suchitra â†’ Kompally â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-105",
            color: "#8B5CF6", // Purple
            distanceKm: 18.5,
            journeyMinutes: 38,
            trafficBufferMinutes: 10,
            morningDepartureTime: "8:22 AM", // 9:10 - 38m - 10m = 8:22 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 5,
            eveningEstimatedHomeArrival: "4:43 PM", // 4:00 + 38m + 5m = 4:43 PM
            durationCategory: "short",
            categoryLabel: "ðŸŸ¢ Under 60 min â€“ Short Route",
            studentsEnrolled: 44,
            waypoints: [
                { name: "Alwal Rythu Bazar", lat: 17.5020, lng: 78.5130, scheduledTime: "08:22 AM", returnTime: "04:43 PM", passed: true, studentBoardCount: 14 },
                { name: "Bolarum Cantonment", lat: 17.5250, lng: 78.5120, scheduledTime: "08:34 AM", returnTime: "04:31 PM", passed: true, studentBoardCount: 11 },
                { name: "Suchitra Junction", lat: 17.5186, lng: 78.4735, scheduledTime: "08:46 AM", returnTime: "04:19 PM", passed: false, studentBoardCount: 10 },
                { name: "Kompally Junction", lat: 17.5448, lng: 78.4798, scheduledTime: "08:55 AM", returnTime: "04:10 PM", passed: false, studentBoardCount: 9 },
                { name: "Kandlakoya (V)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:03 AM", returnTime: "04:02 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-106",
            code: "CB-106",
            name: "LB Nagar Route",
            corridor: "LB Nagar â†’ Dilsukhnagar â†’ Koti â†’ Secunderabad â†’ Suchitra â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-106",
            color: "#DC2626", // Red
            distanceKm: 43.5,
            journeyMinutes: 115, // 1 hr 55 min
            trafficBufferMinutes: 15,
            morningDepartureTime: "7:00 AM", // 9:10 - 115m - 15m = 7:00 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 20,
            eveningEstimatedHomeArrival: "6:15 PM", // 4:00 + 115m + 20m = 6:15 PM
            durationCategory: "long",
            categoryLabel: "ðŸŸ  90â€“120 min â€“ Long Route",
            studentsEnrolled: 55,
            waypoints: [
                { name: "LB Nagar Ring Road", lat: 17.3457, lng: 78.5522, scheduledTime: "07:00 AM", returnTime: "06:15 PM", passed: true, studentBoardCount: 15 },
                { name: "Dilsukhnagar Bus Depot", lat: 17.3688, lng: 78.5247, scheduledTime: "07:18 AM", returnTime: "05:57 PM", passed: true, studentBoardCount: 11 },
                { name: "Koti Women's College", lat: 17.3850, lng: 78.4867, scheduledTime: "07:38 AM", returnTime: "05:37 PM", passed: true, studentBoardCount: 9 },
                { name: "Secunderabad Clock Tower", lat: 17.4344, lng: 78.5011, scheduledTime: "08:08 AM", returnTime: "05:07 PM", passed: false, studentBoardCount: 10 },
                { name: "Suchitra Junction", lat: 17.5186, lng: 78.4735, scheduledTime: "08:38 AM", returnTime: "04:37 PM", passed: false, studentBoardCount: 10 },
                { name: "Kandlakoya ORR Link", lat: 17.5920, lng: 78.4750, scheduledTime: "09:01 AM", returnTime: "04:09 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-107",
            code: "CB-107",
            name: "Uppal Route",
            corridor: "Uppal â†’ Habsiguda â†’ Tarnaka â†’ Secunderabad â†’ Bowenpally â†’ Suchitra â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-107",
            color: "#4F46E5", // Indigo
            distanceKm: 31.2,
            journeyMinutes: 75, // 1 hr 15 min
            trafficBufferMinutes: 10,
            morningDepartureTime: "7:45 AM", // 9:10 - 75m - 10m = 7:45 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 12,
            eveningEstimatedHomeArrival: "5:27 PM", // 4:00 + 75m + 12m = 5:27 PM
            durationCategory: "medium",
            categoryLabel: "ðŸŸ¡ 60â€“90 min â€“ Medium Route",
            studentsEnrolled: 49,
            waypoints: [
                { name: "Uppal Metro Station", lat: 17.4022, lng: 78.5599, scheduledTime: "07:45 AM", returnTime: "05:27 PM", passed: true, studentBoardCount: 12 },
                { name: "Habsiguda X Roads", lat: 17.4172, lng: 78.5445, scheduledTime: "07:58 AM", returnTime: "05:14 PM", passed: true, studentBoardCount: 10 },
                { name: "Tarnaka Flyover", lat: 17.4278, lng: 78.5312, scheduledTime: "08:12 AM", returnTime: "05:00 PM", passed: true, studentBoardCount: 9 },
                { name: "Secunderabad Sangeet", lat: 17.4344, lng: 78.5011, scheduledTime: "08:26 AM", returnTime: "04:46 PM", passed: false, studentBoardCount: 8 },
                { name: "Bowenpally Checkpost", lat: 17.4735, lng: 78.4795, scheduledTime: "08:42 AM", returnTime: "04:30 PM", passed: false, studentBoardCount: 6 },
                { name: "Suchitra Junction", lat: 17.5186, lng: 78.4735, scheduledTime: "08:53 AM", returnTime: "04:19 PM", passed: false, studentBoardCount: 4 },
                { name: "Kandlakoya (V)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:03 AM", returnTime: "04:04 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-108",
            code: "CB-108",
            name: "Mehdipatnam Route",
            corridor: "Mehdipatnam â†’ Masab Tank â†’ Ameerpet â†’ SR Nagar â†’ Kukatpally â†’ JNTU â†’ Bachupally â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-108",
            color: "#EA580C", // Orange
            distanceKm: 36.8,
            journeyMinutes: 100, // 1 hr 40 min
            trafficBufferMinutes: 15,
            morningDepartureTime: "7:15 AM", // 9:10 - 100m - 15m = 7:15 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 15,
            eveningEstimatedHomeArrival: "5:55 PM", // 4:00 + 100m + 15m = 5:55 PM
            durationCategory: "long",
            categoryLabel: "ðŸŸ  90â€“120 min â€“ Long Route",
            studentsEnrolled: 53,
            waypoints: [
                { name: "Mehdipatnam Rythu Bazar", lat: 17.3916, lng: 78.4398, scheduledTime: "07:15 AM", returnTime: "05:55 PM", passed: true, studentBoardCount: 14 },
                { name: "Masab Tank Flyover", lat: 17.4042, lng: 78.4526, scheduledTime: "07:28 AM", returnTime: "05:42 PM", passed: true, studentBoardCount: 8 },
                { name: "Ameerpet Metro", lat: 17.4375, lng: 78.4482, scheduledTime: "07:44 AM", returnTime: "05:26 PM", passed: true, studentBoardCount: 9 },
                { name: "SR Nagar ESI", lat: 17.4435, lng: 78.4429, scheduledTime: "07:56 AM", returnTime: "05:14 PM", passed: true, studentBoardCount: 6 },
                { name: "Kukatpally Y-Junction", lat: 17.4849, lng: 78.4138, scheduledTime: "08:18 AM", returnTime: "04:52 PM", passed: false, studentBoardCount: 8 },
                { name: "JNTU", lat: 17.4986, lng: 78.3905, scheduledTime: "08:30 AM", returnTime: "04:40 PM", passed: false, studentBoardCount: 8 },
                { name: "Bachupally X Roads", lat: 17.5369, lng: 78.3686, scheduledTime: "08:48 AM", returnTime: "04:22 PM", passed: false, studentBoardCount: 0 },
                { name: "Kandlakoya (V)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:02 AM", returnTime: "04:08 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-109",
            code: "CB-109",
            name: "Patancheru / BHEL Route",
            corridor: "Patancheru â†’ BHEL â†’ Chandanagar â†’ Miyapur â†’ Bachupally â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-109",
            color: "#0D9488", // Teal
            distanceKm: 30.4,
            journeyMinutes: 72,
            trafficBufferMinutes: 10,
            morningDepartureTime: "7:48 AM", // 9:10 - 72m - 10m = 7:48 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 10,
            eveningEstimatedHomeArrival: "5:22 PM", // 4:00 + 72m + 10m = 5:22 PM
            durationCategory: "medium",
            categoryLabel: "ðŸŸ¡ 60â€“90 min â€“ Medium Route",
            studentsEnrolled: 47,
            waypoints: [
                { name: "Patancheru Bus Station", lat: 17.5310, lng: 78.2612, scheduledTime: "07:48 AM", returnTime: "05:22 PM", passed: true, studentBoardCount: 14 },
                { name: "BHEL Township Gate", lat: 17.4988, lng: 78.3032, scheduledTime: "08:04 AM", returnTime: "05:06 PM", passed: true, studentBoardCount: 11 },
                { name: "Chandanagar Rythu Bazar", lat: 17.4922, lng: 78.3284, scheduledTime: "08:18 AM", returnTime: "04:52 PM", passed: true, studentBoardCount: 8 },
                { name: "Miyapur Allwyn", lat: 17.4968, lng: 78.3547, scheduledTime: "08:32 AM", returnTime: "04:38 PM", passed: false, studentBoardCount: 8 },
                { name: "Bachupally Junction", lat: 17.5369, lng: 78.3686, scheduledTime: "08:48 AM", returnTime: "04:22 PM", passed: false, studentBoardCount: 6 },
                { name: "Kandlakoya (V)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:03 AM", returnTime: "04:05 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        },
        {
            id: "RT-110",
            code: "CB-110",
            name: "Vanasthalipuram / ECIL Route",
            corridor: "Vanasthalipuram â†’ LB Nagar â†’ Uppal â†’ Malkajgiri â†’ ECIL â†’ Kandlakoya â†’ CMR Technical Campus",
            busId: "CB-110",
            color: "#B45309", // Deep Amber
            distanceKm: 47.2,
            journeyMinutes: 122, // 2 hr 02 min (Approaching 2 Hours / Peak Traffic Review)
            trafficBufferMinutes: 15,
            morningDepartureTime: "6:53 AM", // 9:10 - 122m - 15m = 6:53 AM
            morningCollegeArrival: "9:05 AM",
            eveningDepartureTime: "4:00 PM",
            eveningTrafficDelayMinutes: 22,
            eveningEstimatedHomeArrival: "6:24 PM", // 4:00 + 122m + 22m = 6:24 PM
            durationCategory: "review", // Exceeds 2 hours in peak
            categoryLabel: "ðŸ”´ Over 120 min â€“ Review Route",
            studentsEnrolled: 56,
            waypoints: [
                { name: "Vanasthalipuram Rythu Bazar", lat: 17.3298, lng: 78.5721, scheduledTime: "06:53 AM", returnTime: "06:24 PM", passed: true, studentBoardCount: 16 },
                { name: "LB Nagar Kamineni", lat: 17.3457, lng: 78.5522, scheduledTime: "07:12 AM", returnTime: "06:05 PM", passed: true, studentBoardCount: 11 },
                { name: "Uppal Stadium", lat: 17.4022, lng: 78.5599, scheduledTime: "07:38 AM", returnTime: "05:39 PM", passed: true, studentBoardCount: 10 },
                { name: "Malkajgiri Geetha", lat: 17.4502, lng: 78.5338, scheduledTime: "08:04 AM", returnTime: "05:13 PM", passed: false, studentBoardCount: 9 },
                { name: "ECIL Radhika Theater", lat: 17.4740, lng: 78.5710, scheduledTime: "08:24 AM", returnTime: "04:53 PM", passed: false, studentBoardCount: 10 },
                { name: "Kandlakoya (Near ORR Exit 6)", lat: 17.5920, lng: 78.4750, scheduledTime: "09:02 AM", returnTime: "04:06 PM", passed: false, studentBoardCount: 0 },
                { name: "CMR Technical Campus, Kandlakoya", lat: 17.6033, lng: 78.4877, scheduledTime: "09:05 AM", returnTime: "04:00 PM", passed: false, isCampus: true, studentBoardCount: 0 }
            ]
        }
    ],

    // Fleet of Buses
    buses: [
        {
            id: "CB-101",
            plateNumber: "TS-08-UB-4012",
            model: "Tata Starbus Ultra AC (50-Seater)",
            routeId: "RT-101",
            routeName: "Kukatpally Route",
            corridorDisplay: "Kukatpally â†’ CMR Technical Campus",
            driver: {
                name: "K. Srinivas Reddy",
                phone: "+91 94401 23451",
                experience: "11 Years",
                rating: 4.9,
                licenseNo: "TS-08-2014-9912",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 50,
            currentOccupancy: 42,
            availableSeats: 8,
            occupancyRate: 84,
            speedKmH: 42,
            fuelPercent: 82,
            temperatureC: 22,
            status: "On Time",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "JNTU",
            currentLocation: { lat: 17.4986, lng: 78.3905 },
            nextStop: "Nizampet X Roads",
            distanceRemainingKm: 11.5,
            etaMinutes: 18, // Prompt specific: ETA: 18 minutes, College Arrival: 9:05 AM
            collegeArrivalDisplay: "9:05 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Moderate"
        },
        {
            id: "CB-102",
            plateNumber: "TS-08-UB-4018",
            model: "Tata Marcopolo BS-VI (50-Seater)",
            routeId: "RT-102",
            routeName: "Miyapur Route",
            corridorDisplay: "Miyapur â†’ CMR Technical Campus",
            driver: {
                name: "V. Venkat Ramana",
                phone: "+91 94403 45673",
                experience: "8 Years",
                rating: 4.8,
                licenseNo: "TS-08-2016-5521",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 50,
            currentOccupancy: 43,
            availableSeats: 7,
            occupancyRate: 86,
            speedKmH: 44,
            fuelPercent: 75,
            temperatureC: 22,
            status: "On Time",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Hafeezpet MMTS Hub",
            currentLocation: { lat: 17.4890, lng: 78.3456 },
            nextStop: "Chandanagar Rythu Bazar",
            distanceRemainingKm: 16.2,
            etaMinutes: 24,
            collegeArrivalDisplay: "9:05 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Low"
        },
        {
            id: "CB-103",
            plateNumber: "TS-08-UB-4024",
            model: "Ashok Leyland Oyster (55-Seater)",
            routeId: "RT-103",
            routeName: "Suncity Route",
            corridorDisplay: "Suncity â†’ CMR Technical Campus",
            driver: {
                name: "Md. Rafiq Ahmed",
                phone: "+91 94402 34562",
                experience: "14 Years",
                rating: 4.8,
                licenseNo: "TS-08-2012-3401",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 55,
            currentOccupancy: 50,
            availableSeats: 5,
            occupancyRate: 91,
            speedKmH: 38,
            fuelPercent: 68,
            temperatureC: 23,
            status: "Moderate Delay (+10m)",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Suchitra Junction",
            currentLocation: { lat: 17.5186, lng: 78.4735 },
            nextStop: "Kandlakoya (V)",
            distanceRemainingKm: 9.8,
            etaMinutes: 18,
            collegeArrivalDisplay: "9:08 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Moderate"
        },
        {
            id: "CB-104",
            plateNumber: "TS-08-UB-4030",
            model: "Tata Starbus Ultra AC (55-Seater)",
            routeId: "RT-104",
            routeName: "Secunderabad Route",
            corridorDisplay: "Secunderabad â†’ CMR Technical Campus",
            driver: {
                name: "P. Satyanarayana",
                phone: "+91 94405 67895",
                experience: "15 Years",
                rating: 5.0,
                licenseNo: "TS-08-2010-1123",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 55,
            currentOccupancy: 48,
            availableSeats: 7,
            occupancyRate: 87,
            speedKmH: 48,
            fuelPercent: 88,
            temperatureC: 21,
            status: "On Time (Express)",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Bowenpally Checkpost",
            currentLocation: { lat: 17.4735, lng: 78.4795 },
            nextStop: "Suchitra Junction",
            distanceRemainingKm: 14.5,
            etaMinutes: 20,
            collegeArrivalDisplay: "9:04 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Low"
        },
        {
            id: "CB-105",
            plateNumber: "TS-08-UB-4035",
            model: "Eicher Skyline Pro (50-Seater)",
            routeId: "RT-105",
            routeName: "Alwal Route",
            corridorDisplay: "Alwal â†’ CMR Technical Campus",
            driver: {
                name: "B. Ramesh Goud",
                phone: "+91 94404 56784",
                experience: "10 Years",
                rating: 4.7,
                licenseNo: "TS-08-2015-8812",
                avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 50,
            currentOccupancy: 44,
            availableSeats: 6,
            occupancyRate: 88,
            speedKmH: 42,
            fuelPercent: 78,
            temperatureC: 22,
            status: "On Time",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Bolarum Cantonment",
            currentLocation: { lat: 17.5250, lng: 78.5120 },
            nextStop: "Suchitra Junction",
            distanceRemainingKm: 11.2,
            etaMinutes: 16,
            collegeArrivalDisplay: "9:05 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Low"
        },
        {
            id: "CB-106",
            plateNumber: "TS-08-UB-4042",
            model: "Ashok Leyland 55-Seater BS-VI",
            routeId: "RT-106",
            routeName: "LB Nagar Route",
            corridorDisplay: "LB Nagar â†’ CMR Technical Campus",
            driver: {
                name: "M. Chandra Shekar",
                phone: "+91 94406 78906",
                experience: "12 Years",
                rating: 4.8,
                licenseNo: "TS-08-2013-4491",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 55,
            currentOccupancy: 51,
            availableSeats: 4,
            occupancyRate: 93,
            speedKmH: 35,
            fuelPercent: 62,
            temperatureC: 23,
            status: "Delayed (+12m)",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Secunderabad Clock Tower",
            currentLocation: { lat: 17.4344, lng: 78.5011 },
            nextStop: "Suchitra Junction",
            distanceRemainingKm: 20.5,
            etaMinutes: 32,
            collegeArrivalDisplay: "9:08 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Heavy"
        },
        {
            id: "CB-107",
            plateNumber: "TS-08-UB-4048",
            model: "Tata Starbus Ultra AC",
            routeId: "RT-107",
            routeName: "Uppal Route",
            corridorDisplay: "Uppal â†’ CMR Technical Campus",
            driver: {
                name: "K. Narayana Rao",
                phone: "+91 94407 89017",
                experience: "9 Years",
                rating: 4.8,
                licenseNo: "TS-08-2016-9023",
                avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 50,
            currentOccupancy: 44,
            availableSeats: 6,
            occupancyRate: 88,
            speedKmH: 40,
            fuelPercent: 74,
            temperatureC: 22,
            status: "On Time",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Tarnaka Flyover",
            currentLocation: { lat: 17.4278, lng: 78.5312 },
            nextStop: "Secunderabad Sangeet",
            distanceRemainingKm: 19.8,
            etaMinutes: 28,
            collegeArrivalDisplay: "9:06 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Moderate"
        },
        {
            id: "CB-108",
            plateNumber: "TS-08-UB-4054",
            model: "Ashok Leyland Oyster (52-Seater)",
            routeId: "RT-108",
            routeName: "Mehdipatnam Route",
            corridorDisplay: "Mehdipatnam â†’ CMR Technical Campus",
            driver: {
                name: "D. Anjaneyulu",
                phone: "+91 94408 90128",
                experience: "13 Years",
                rating: 4.9,
                licenseNo: "TS-08-2013-7782",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 52,
            currentOccupancy: 46,
            availableSeats: 6,
            occupancyRate: 88,
            speedKmH: 38,
            fuelPercent: 71,
            temperatureC: 23,
            status: "Moderate Delay (+8m)",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "SR Nagar ESI",
            currentLocation: { lat: 17.4435, lng: 78.4429 },
            nextStop: "Kukatpally Y-Junction",
            distanceRemainingKm: 21.4,
            etaMinutes: 30,
            collegeArrivalDisplay: "9:07 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Moderate"
        },
        {
            id: "CB-109",
            plateNumber: "TS-08-UB-4060",
            model: "Tata Starbus Ultra AC",
            routeId: "RT-109",
            routeName: "Patancheru / BHEL Route",
            corridorDisplay: "Patancheru â†’ CMR Technical Campus",
            driver: {
                name: "T. Govardhan Reddy",
                phone: "+91 94410 12340",
                experience: "7 Years",
                rating: 5.0,
                licenseNo: "TS-08-2017-8819",
                avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 50,
            currentOccupancy: 42,
            availableSeats: 8,
            occupancyRate: 84,
            speedKmH: 44,
            fuelPercent: 80,
            temperatureC: 22,
            status: "On Time",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Chandanagar Rythu Bazar",
            currentLocation: { lat: 17.4922, lng: 78.3284 },
            nextStop: "Miyapur Allwyn",
            distanceRemainingKm: 18.4,
            etaMinutes: 26,
            collegeArrivalDisplay: "9:05 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Low"
        },
        {
            id: "CB-110",
            plateNumber: "TS-08-UB-4066",
            model: "Tata Starbus 55-Seater BS-VI",
            routeId: "RT-110",
            routeName: "Vanasthalipuram / ECIL Route",
            corridorDisplay: "Vanasthalipuram â†’ CMR Technical Campus",
            driver: {
                name: "S. Mallikarjun",
                phone: "+91 94409 01239",
                experience: "16 Years",
                rating: 4.9,
                licenseNo: "TS-08-2009-3321",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            },
            totalCapacity: 55,
            currentOccupancy: 53,
            availableSeats: 2,
            occupancyRate: 96,
            speedKmH: 34,
            fuelPercent: 64,
            temperatureC: 22,
            status: "Heavy Traffic (+14m)",
            isDeviated: false,
            isEmergency: false,
            currentLocationName: "Malkajgiri Geetha",
            currentLocation: { lat: 17.4502, lng: 78.5338 },
            nextStop: "ECIL Radhika Theater",
            distanceRemainingKm: 22.8,
            etaMinutes: 36,
            collegeArrivalDisplay: "9:09 AM",
            collegeStartsDisplay: "9:20 AM",
            trafficCondition: "Heavy"
        }
    ],

    // Attendance Log
    attendanceRecords: [
        { id: "ATT-101", studentName: "Sai Teja Reddy", rollNo: "217R1A05A2", busId: "CB-101", stop: "JNTU (Waiting for Boarding)", time: "08:20 AM (Scheduled)", status: "Pending Boarding", method: "Dynamic QR Pass" },
        { id: "ATT-102", studentName: "M. Niharika", rollNo: "217R1A0548", busId: "CB-101", stop: "Kukatpally Y-Junction", time: "07:56 AM", status: "Boarded", method: "RFID Card" },
        { id: "ATT-103", studentName: "V. Akhil Varma", rollNo: "217R1A0412", busId: "CB-101", stop: "KPHB Colony Phase 1", time: "08:09 AM", status: "Boarded", method: "Pass QR" },
        { id: "ATT-104", studentName: "K. Rohit", rollNo: "227R5A0503", busId: "CB-101", stop: "KPHB Colony Phase 1", time: "08:10 AM", status: "Boarded", method: "Pass QR" },
        { id: "ATT-105", studentName: "B. Sravani", rollNo: "217R1A1209", busId: "CB-101", stop: "Kukatpally", time: "07:58 AM", status: "Boarded", method: "Manual Override" }
    ],

    // Trip History
    tripHistory: [
        { date: "Yesterday, Oct 05", route: "CB-101 Morning (Kukatpally â†’ CMRTC)", boardingStop: "JNTU (08:20 AM)", deboardingStop: "CMRTC Kandlakoya (09:05 AM)", duration: "45 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:05 AM)", co2Saved: "4.1 kg" },
        { date: "Oct 05 (Evening)", route: "CB-101 Evening (CMRTC â†’ Kukatpally)", boardingStop: "CMRTC Kandlakoya (04:00 PM)", deboardingStop: "JNTU (04:48 PM)", duration: "48 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "On Time (Reached 4:48 PM)", co2Saved: "4.1 kg" },
        { date: "Oct 04 (Morning)", route: "CB-101 Morning (Kukatpally â†’ CMRTC)", boardingStop: "JNTU (08:20 AM)", deboardingStop: "CMRTC Kandlakoya (09:06 AM)", duration: "46 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:06 AM)", co2Saved: "4.1 kg" },
        { date: "Oct 03 (Morning)", route: "CB-101 Morning (Kukatpally â†’ CMRTC)", boardingStop: "JNTU (08:19 AM)", deboardingStop: "CMRTC Kandlakoya (09:04 AM)", duration: "45 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:04 AM)", co2Saved: "4.1 kg" }
    ],

    // Notifications
    notifications: [
        { id: 1, type: "approaching", title: "Bus CB-101 Approaching JNTU Stop", message: "Your assigned bus CB-101 is 1.8 km away from JNTU. Estimated pickup in 12 minutes (traffic calibrated).", time: "Just now", read: false, icon: "fa-bus", color: "blue" },
        { id: 2, type: "timing", title: "Smart Departure Calculation Confirmed", message: "Required arrival: 9:10 AM. Target arrival met: 9:05 AM (15m before college starts at 9:20 AM).", time: "5 mins ago", read: false, icon: "fa-clock", color: "emerald" },
        { id: 3, type: "evening", title: "Evening Return Bus Scheduled at 4:00 PM", message: "All return fleet will depart CMR Technical Campus at 4:00 PM. Estimated arrival at Kukatpally: 5:10 PM.", time: "15 mins ago", read: true, icon: "fa-bus-simple", color: "indigo" },
        { id: 4, type: "traffic", title: "AI Traffic Alert: Nizampet Signal Cycle", message: "Minor signal waiting time of +4m detected near Nizampet X Roads. Bus is maintaining safe speed.", time: "25 mins ago", read: true, icon: "fa-brain", color: "amber" }
    ],

    // Lost and Found
    lostAndFound: [
        { id: "LF-401", item: "Dell Laptop Charger (65W)", bus: "CB-101", seat: "Seat 14-A", foundBy: "Captain Srinivas Reddy", date: "Oct 05, 2026", status: "Claimed at Transport Desk", statusColor: "emerald" },
        { id: "LF-402", item: "Scientific Calculator (Casio fx-991CW)", bus: "CB-104", seat: "Seat 08-B", foundBy: "Student Co-passenger", date: "Oct 04, 2026", status: "In Custody (Kandlakoya Office)", statusColor: "amber" },
        { id: "LF-403", item: "CMRTC Identity Card - K. Harish (ECE)", bus: "CB-101", seat: "Seat 20-A", foundBy: "Captain Srinivas Reddy", date: "Today, 07:40 AM", status: "Available for Claim", statusColor: "blue" }
    ],

    // Feedback
    feedback: [
        { id: "FB-01", author: "Sai Teja Reddy", role: "Student (CSE - 217R1A05A2)", rating: 5, bus: "CB-101", date: "Oct 04, 2026", comment: "Bus always arrives at Kandlakoya by 9:05 AM, giving us plenty of time before the 9:20 AM class starts! Driver Srinivas drives very smoothly.", tags: ["Punctual", "Target 9:10 AM Met", "Clean Bus"] },
        { id: "FB-02", author: "K. Mohan Reddy", role: "Parent (Father)", rating: 5, bus: "CB-101", date: "Oct 02, 2026", comment: "The 4:00 PM return timing notification is extremely punctual. Knowing my son's estimated arrival time at JNTU is a huge relief.", tags: ["Evening 4:00 PM Departure", "Peace of Mind"] }
    ],

    // 50 Seats Layout for CB-101
    seatsBus01: [
        { number: "1A", status: "occupied", student: "M. Niharika" },
        { number: "1B", status: "occupied", student: "V. Akhil" },
        { number: "1C", status: "occupied", student: "K. Rohit" },
        { number: "1D", status: "occupied", student: "B. Sravani" },
        { number: "2A", status: "occupied", student: "T. Varun" },
        { number: "2B", status: "occupied", student: "P. Anusha" },
        { number: "2C", status: "occupied", student: "D. Karthik" },
        { number: "2D", status: "occupied", student: "G. Swetha" },
        { number: "3A", status: "reserved", student: "Sai Teja Reddy (You)" },
        { number: "3B", status: "occupied", student: "R. Manoj" },
        { number: "3C", status: "available", student: null },
        { number: "3D", status: "occupied", student: "N. Sandhya" },
        { number: "4A", status: "occupied", student: "C. Dinesh" },
        { number: "4B", status: "occupied", student: "M. Bhavana" },
        { number: "4C", status: "available", student: null },
        { number: "4D", status: "available", student: null },
        { number: "5A", status: "occupied", student: "K. Vikas" },
        { number: "5B", status: "occupied", student: "A. Meghana" },
        { number: "5C", status: "available", student: null },
        { number: "5D", status: "available", student: null },
        { number: "6A", status: "occupied", student: "J. Pranay" },
        { number: "6B", status: "occupied", student: "S. Tejaswini" },
        { number: "6C", status: "available", student: null },
        { number: "6D", status: "available", student: null },
        { number: "7A", status: "occupied", student: "B. Rahul" },
        { number: "7B", status: "occupied", student: "V. Deepthi" },
        { number: "7C", status: "occupied", student: "M. Suresh" },
        { number: "7D", status: "available", student: null }
    ],

    emergencyContacts: [
        { role: "CMRTC Transport Office (Kandlakoya)", number: "+91 8418 200037", type: "Campus Control Desk" },
        { role: "Transport Incharge (Mr. V. Krishna)", number: "+91 92470 33441", type: "Fleet Operations Manager" },
        { role: "CMR Health Care & First-Aid Center", number: "+91 8418 200045", type: "Campus Medical Unit" },
        { role: "Medchal Police Station / Dial 100", number: "100 / 08418-220033", type: "Cyberabad Law Enforcement" },
        { role: "Highway Patrol (ORR Exit 6)", number: "1033 / 112", type: "TSIIC / HMDA Highway Rescue" }
    ]
};


// ==============================================================================
// 2. REAL-TIME SIMULATION ENGINE & AUDIO (simulation.js)
// ==============================================================================
/**
 * CMR Technical Campus, Kandlakoya, Hyderabad â€“ 501401, Telangana
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
                bus.status = "Long Journey / Heavy Traffic â€“ ETA may change.";
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


// ==============================================================================
// 3. LEAFLET GIS MAPPING & FLEET VISUALIZER (map.js)
// ==============================================================================
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
                <div class="text-xs text-slate-600 mt-1">Kandlakoya (V), Medchal Road, Hyderabad â€“ 501401</div>
                <div class="text-[11px] text-slate-500 font-semibold mt-1">
                    <i class="fa-solid fa-diamond-turn-right text-blue-600"></i> Near ORR Exit 6 â€¢ Main Terminal for all 10 Routes
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
                        <div class="text-slate-500">${route.code} â€¢ Scheduled: ${wp.scheduledTime}</div>
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
                    ${bus.id} â€¢ ${bus.speedKmH} km/h
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
                        ðŸŸ  Long Journey Monitor: ${bus.remainingJourneyDisplay} remaining
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


// ==============================================================================
// 4. CHART.JS ANALYTICS & 4-TIER JOURNEY CHARTS (charts.js)
// ==============================================================================
/**
 * CMR Technical Campus, Kandlakoya, Hyderabad â€“ 501401, Telangana
 * Chart.js Visualizations & Analytics
 * Includes 4-Tier Journey duration indicators:
 * ðŸŸ¢ Under 60 min â€“ Short Route
 * ðŸŸ¡ 60â€“90 min â€“ Medium Route
 * ðŸŸ  90â€“120 min â€“ Long Route
 * ðŸ”´ Over 120 min â€“ Review Route
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
                            if (d < 60) return '#10B981'; // ðŸŸ¢ Green (< 60m)
                            if (d <= 90) return '#EAB308'; // ðŸŸ¡ Yellow (60â€“90m)
                            if (d <= 120) return '#F97316'; // ðŸŸ  Orange (90â€“120m)
                            return '#EF4444'; // ðŸ”´ Red (> 120m Review Route)
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
                                if (val < 60) return 'ðŸŸ¢ Under 60 min â€“ Short Route';
                                if (val <= 90) return 'ðŸŸ¡ 60â€“90 min â€“ Medium Route';
                                if (val <= 120) return 'ðŸŸ  90â€“120 min â€“ Long Route';
                                return 'ðŸ”´ Over 120 min â€“ Review Route / Heavy Traffic';
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
                labels: ['On Time â€“ Arrival by 9:05 AM (80%)', 'Moderate Delay 5-10m (15%)', 'Review Delay >15m (5%)'],
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


// ==============================================================================
// 5. APPLICATION CONTROLLER, MODALS & EVENT HANDLERS (app.js)
// ==============================================================================
/**
 * CMR Technical Campus, Kandlakoya, Hyderabad â€“ 501401, Telangana
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
        this.showToast("Shift Toggled", `Active mode switched to: ${shift === 'morning' ? 'â˜€ï¸ Morning Commute (Arrival 9:10 AM | Class 9:20 AM)' : 'ðŸŒ™ Evening Return (College Departure 4:00 PM)'}`, "info");
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
                                <p class="text-xs text-slate-500">${bus.plateNumber} â€¢ ${bus.routeName}</p>
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
                                ${isMorning ? `Dep: ${route.morningDepartureTime} â†’ Target Arr: 9:10 AM` : `College Dep: 4:00 PM â†’ Est Home: ${route.eveningEstimatedHomeArrival}`}
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
            if (yourRouteEl) yourRouteEl.textContent = "Kukatpally â†’ CMR Technical Campus";
            if (busStatusEl) busStatusEl.innerHTML = '<span class="text-emerald-600 font-bold">ðŸŸ¢ On Time</span>';
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
            if (eveStatusEl) eveStatusEl.innerHTML = '<span class="text-emerald-600 font-bold">ðŸŸ¢ On Route</span>';
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
                <option value="${r.busId}" ${r.busId === this.selectedBusId ? 'selected' : ''}>${r.code} - ${r.name} (${r.categoryLabel.split('â€“')[1] || ''})</option>
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
                        <span>ðŸ”´ Long Journey / Heavy Traffic â€“ ETA may change.</span>
                        <span class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">Review Route</span>
                    </div>
                `;
            } else if (route.durationCategory === 'long') {
                reviewBox.classList.remove('hidden');
                reviewBox.innerHTML = `
                    <div class="px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold mb-2 flex items-center justify-between">
                        <span>ðŸŸ  Long Journey (${route.journeyMinutes} min Planned)</span>
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
                        <p class="text-sm text-slate-500 mt-1">Registration: <span class="font-mono font-semibold text-slate-800">${bus.plateNumber}</span> â€¢ Corridor: <span class="font-semibold text-blue-600">${bus.corridorDisplay}</span></p>
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
                                <p class="text-xs text-slate-500">${bus.driver.experience} â€¢ Rating: <b class="text-amber-500">â˜… ${bus.driver.rating}</b></p>
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
                        <span class="text-slate-600">Morning Departure: ${route.morningDepartureTime} â€¢ Evening Return Departure: 4:00 PM</span>
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
                        <div class="text-slate-500 mt-0.5">${th.boardingStop} â†’ ${th.deboardingStop}</div>
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

        if (busBadgeEl) busBadgeEl.textContent = `${bus.id} â€¢ ${bus.plateNumber}`;
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
                            <div class="text-[11px] text-slate-400">${rec.rollNo} â€¢ ${rec.stop}</div>
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
            statusEl.textContent = bus.isEmergency ? "CRITICAL EMERGENCY BROADCAST ON CB-101" : "ALL SYSTEMS GREEN â€¢ CMRTC KANDLAKOYA GEOFENCE SECURE";
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
                                        <div class="text-[9px] text-blue-300">KANDLAKOYA (V), HYDERABAD â€“ 501401</div>
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
                                <span class="text-[9px] text-emerald-600 block mt-0.5">â— Dynamic RFID Synced</span>
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
                            Tap to flip for college timings & return policy â†º
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
                            Tap to flip back to QR Code â†º
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
                        <div class="text-[11px] text-slate-400 mt-0.5">${r.stop} â€¢ ${r.method}</div>
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
                        <span class="font-semibold text-slate-700">${th.busNumber} â€¢ ${th.driver}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 text-[10px] uppercase font-semibold block">Eco Saved</span>
                        <span class="font-semibold text-emerald-600">${th.co2Saved} COâ‚‚</span>
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
                            <p class="text-xs text-slate-400">${fb.role} â€¢ ${fb.bus} â€¢ ${fb.date}</p>
                        </div>
                        <div class="text-amber-400 text-sm">
                            ${'â˜…'.repeat(fb.rating)}${'â˜†'.repeat(5 - fb.rating)}
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
                        <div class="text-[11px] text-slate-500">${lf.bus} (${lf.seat}) â€¢ Reported: ${lf.date}</div>
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
            this.showToast("ðŸš¨ EMERGENCY SOS BROADCAST", "Bus CB-101 has triggered an emergency alarm. Coordinates transmitted to Medchal Highway Patrol.", "emergency");
        } else {
            this.showToast("Emergency Cleared", "Bus CB-101 safety status returned to normal.", "success");
        }
        if (this.currentView === 'emergency-safety') this.renderEmergencySafetyView();
    }

    onDeviationChange(data) {
        if (data.active) {
            this.showToast("âš ï¸ ROUTE DEVIATION DETECTED", "Bus CB-101 has deviated > 450m from designated Bachupally-Kandlakoya corridor!", "deviation");
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

