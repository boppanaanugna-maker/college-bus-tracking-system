/**
 * CMR Technical Campus, Kandlakoya, Hyderabad – 501401, Telangana
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
        address: "Kandlakoya (V), Medchal Road, Hyderabad – 501401, Telangana",
        locationDisplay: "CMR Technical Campus, Kandlakoya (V), Medchal Road, Hyderabad – 501401, Telangana",
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
     * 🟢 Under 60 min – Short Route
     * 🟡 60–90 min – Medium Route
     * 🟠 90–120 min – Long Route
     * 🔴 Over 120 min – Review Route
     */
    routes: [
        {
            id: "RT-101",
            code: "CB-101",
            name: "Kukatpally Route",
            corridor: "Kukatpally → KPHB → JNTU → Nizampet → Bachupally → Bowrampet → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟡 60–90 min – Medium Route",
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
            corridor: "Miyapur → Hafeezpet → Chandanagar → Nizampet → Bachupally → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟢 Under 60 min – Short Route",
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
            corridor: "Suncity → Bandlaguda → Mehdipatnam → Tolichowki → Begumpet → Suchitra → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟠 90–120 min – Long Route",
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
            corridor: "Secunderabad → Paradise → Bowenpally → Suchitra → Kompally → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟢 Under 60 min – Short Route",
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
            corridor: "Alwal → Bolarum → Suchitra → Kompally → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟢 Under 60 min – Short Route",
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
            corridor: "LB Nagar → Dilsukhnagar → Koti → Secunderabad → Suchitra → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟠 90–120 min – Long Route",
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
            corridor: "Uppal → Habsiguda → Tarnaka → Secunderabad → Bowenpally → Suchitra → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟡 60–90 min – Medium Route",
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
            corridor: "Mehdipatnam → Masab Tank → Ameerpet → SR Nagar → Kukatpally → JNTU → Bachupally → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟠 90–120 min – Long Route",
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
            corridor: "Patancheru → BHEL → Chandanagar → Miyapur → Bachupally → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🟡 60–90 min – Medium Route",
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
            corridor: "Vanasthalipuram → LB Nagar → Uppal → Malkajgiri → ECIL → Kandlakoya → CMR Technical Campus",
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
            categoryLabel: "🔴 Over 120 min – Review Route",
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
            corridorDisplay: "Kukatpally → CMR Technical Campus",
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
            corridorDisplay: "Miyapur → CMR Technical Campus",
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
            corridorDisplay: "Suncity → CMR Technical Campus",
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
            corridorDisplay: "Secunderabad → CMR Technical Campus",
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
            corridorDisplay: "Alwal → CMR Technical Campus",
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
            corridorDisplay: "LB Nagar → CMR Technical Campus",
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
            corridorDisplay: "Uppal → CMR Technical Campus",
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
            corridorDisplay: "Mehdipatnam → CMR Technical Campus",
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
            corridorDisplay: "Patancheru → CMR Technical Campus",
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
            corridorDisplay: "Vanasthalipuram → CMR Technical Campus",
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
        { date: "Yesterday, Oct 05", route: "CB-101 Morning (Kukatpally → CMRTC)", boardingStop: "JNTU (08:20 AM)", deboardingStop: "CMRTC Kandlakoya (09:05 AM)", duration: "45 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:05 AM)", co2Saved: "4.1 kg" },
        { date: "Oct 05 (Evening)", route: "CB-101 Evening (CMRTC → Kukatpally)", boardingStop: "CMRTC Kandlakoya (04:00 PM)", deboardingStop: "JNTU (04:48 PM)", duration: "48 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "On Time (Reached 4:48 PM)", co2Saved: "4.1 kg" },
        { date: "Oct 04 (Morning)", route: "CB-101 Morning (Kukatpally → CMRTC)", boardingStop: "JNTU (08:20 AM)", deboardingStop: "CMRTC Kandlakoya (09:06 AM)", duration: "46 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:06 AM)", co2Saved: "4.1 kg" },
        { date: "Oct 03 (Morning)", route: "CB-101 Morning (Kukatpally → CMRTC)", boardingStop: "JNTU (08:19 AM)", deboardingStop: "CMRTC Kandlakoya (09:04 AM)", duration: "45 mins", busNumber: "CB-101", driver: "K. Srinivas Reddy", punctuality: "Punctual (Reached 9:04 AM)", co2Saved: "4.1 kg" }
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
