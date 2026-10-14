-- ==============================================================================
-- CMR TECHNICAL CAMPUS, KANDLAKOYA, MEDCHAL ROAD, HYDERABAD - 501401
-- Database Schema: college_bus_tracking
-- Target College Timings:
--   - Morning Start: 9:20 AM | Target Arrival: 9:10 AM
--   - Evening Close: 4:00 PM | Fleet Departure: 4:00 PM
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS college_bus_tracking;
USE college_bus_tracking;

-- 1. Users Table (Role-based access: student, driver, admin)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'driver', 'admin') NOT NULL DEFAULT 'student',
    phone VARCHAR(20) NOT NULL,
    roll_number VARCHAR(30) NULL,
    department VARCHAR(50) NULL,
    license_number VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buses Table
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'CB-101'
    registration_number VARCHAR(30) UNIQUE NOT NULL, -- e.g., 'TS-08-UB-4012'
    total_seats INT NOT NULL DEFAULT 50,
    current_occupancy INT NOT NULL DEFAULT 0,
    status ENUM('active', 'maintenance', 'idle') NOT NULL DEFAULT 'active',
    model VARCHAR(50) DEFAULT 'Tata Starbus Ultra',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Routes Table (Destination is always CMR Technical Campus, Kandlakoya)
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'RT-101'
    route_name VARCHAR(100) NOT NULL,
    start_location VARCHAR(100) NOT NULL,
    end_location VARCHAR(100) NOT NULL DEFAULT 'CMR Technical Campus, Kandlakoya',
    total_distance_km DECIMAL(5,2) NOT NULL,
    estimated_duration_mins INT NOT NULL,
    traffic_buffer_mins INT NOT NULL DEFAULT 10,
    morning_departure_time TIME NOT NULL, -- e.g., 07:55:00
    evening_departure_time TIME NOT NULL DEFAULT '16:00:00',
    color_hex VARCHAR(10) DEFAULT '#2563EB',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bus Stops Table
CREATE TABLE IF NOT EXISTS bus_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    morning_scheduled_time TIME NOT NULL,
    evening_scheduled_time TIME NULL,
    geofence_radius_meters INT DEFAULT 500,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 5. Driver Assignments Table
CREATE TABLE IF NOT EXISTS driver_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    assigned_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 6. Student Pass & Stop Assignments Table
CREATE TABLE IF NOT EXISTS student_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    pass_number VARCHAR(40) UNIQUE NOT NULL,
    seat_preference VARCHAR(10) DEFAULT '3A',
    status ENUM('active', 'expired', 'suspended') DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES bus_stops(id) ON DELETE CASCADE
);

-- 7. Trips Table (Shift: morning / evening)
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    driver_id INT NOT NULL,
    route_id INT NOT NULL,
    shift_type ENUM('morning', 'evening') NOT NULL DEFAULT 'morning',
    trip_status ENUM('scheduled', 'in_transit', 'completed', 'delayed', 'cancelled') NOT NULL DEFAULT 'scheduled',
    start_time DATETIME NULL,
    end_time DATETIME NULL,
    delay_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 8. Live Bus Locations Table (Recorded from Driver GPS or Simulated)
CREATE TABLE IF NOT EXISTS live_bus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    bus_id INT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    speed_kmh DECIMAL(5,2) DEFAULT 0.00,
    heading DECIMAL(5,2) DEFAULT 0.00,
    is_deviated BOOLEAN DEFAULT FALSE,
    is_simulated BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL represents broadcast to all
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('approaching', 'delayed', 'geofence', 'emergency', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Emergency Alerts Table (SOS / Breakdown)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NULL,
    bus_id INT NOT NULL,
    reported_by_user_id INT NOT NULL,
    alert_type ENUM('sos', 'breakdown', 'accident', 'medical', 'traffic_block') NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    description TEXT,
    status ENUM('active', 'acknowledged', 'resolved') DEFAULT 'active',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- SAMPLE DATA INGESTION (CMR TECHNICAL CAMPUS FLEET)
-- Default Password for all demo accounts: Admin@123 / Student@123 / Driver@123
-- (Bcrypt hash: $2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W)
-- ==============================================================================

-- Seed Users
INSERT INTO users (full_name, email, password_hash, role, phone, roll_number, department, license_number) VALUES
('Dr. A. Raji Reddy', 'admin@cmrtc.ac.in', '$2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W', 'admin', '+91 92470 33441', NULL, 'Transport Cell', NULL),
('K. Srinivas Reddy', 'driver.kukatpally@cmrtc.ac.in', '$2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W', 'driver', '+91 98480 22331', NULL, NULL, 'TS-08-2014-9912'),
('M. Narsing Rao', 'driver.suncity@cmrtc.ac.in', '$2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W', 'driver', '+91 98480 44552', NULL, NULL, 'TS-09-2016-1184'),
('Sai Teja Reddy', 'student@cmrtc.ac.in', '$2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W', 'student', '+91 91234 56789', '217R1A05A2', 'Computer Science & Engineering', NULL),
('K. Mohan Reddy (Parent)', 'parent@gmail.com', '$2a$10$wE9K4qJzT5C2aU7gC94Kpe5ZqA3lRk8N2d1iGj7vF1g1nQe/zT26W', 'student', '+91 98765 43210', NULL, NULL, NULL);

-- Seed Buses
INSERT INTO buses (bus_number, registration_number, total_seats, current_occupancy, status, model) VALUES
('CB-101', 'TS-08-UB-4012', 50, 42, 'active', 'Tata Starbus Ultra 50S'),
('CB-102', 'TS-08-UB-4015', 50, 45, 'active', 'Ashok Leyland Lynx Smart'),
('CB-103', 'TS-08-UB-4020', 50, 38, 'active', 'Eicher Skyline Pro');

-- Seed Routes (CMR Technical Campus, Kandlakoya is always final terminal)
INSERT INTO routes (route_code, route_name, start_location, end_location, total_distance_km, estimated_duration_mins, traffic_buffer_mins, morning_departure_time, evening_departure_time, color_hex) VALUES
('RT-101', 'Kukatpally - Kandlakoya Route', 'Kukatpally', 'CMR Technical Campus, Kandlakoya', 17.50, 60, 15, '07:55:00', '16:00:00', '#2563EB'),
('RT-102', 'Suncity - Kandlakoya Route', 'Suncity', 'CMR Technical Campus, Kandlakoya', 38.50, 95, 15, '07:20:00', '16:00:00', '#F59E0B'),
('RT-103', 'Secunderabad - Kandlakoya Route', 'Secunderabad', 'CMR Technical Campus, Kandlakoya', 24.00, 70, 10, '07:50:00', '16:00:00', '#10B981');

-- Seed Stops for Route 1 (RT-101: Kukatpally to CMRTC Kandlakoya)
INSERT INTO bus_stops (route_id, stop_name, stop_order, latitude, longitude, morning_scheduled_time, evening_scheduled_time) VALUES
(1, 'Kukatpally Y-Junction', 1, 17.4842, 78.4072, '07:55:00', '17:05:00'),
(1, 'KPHB Colony Phase 1', 2, 17.4933, 78.3995, '08:05:00', '16:55:00'),
(1, 'JNTU Metro Station (Sai Teja Pickup)', 3, 17.4986, 78.3905, '08:15:00', '16:45:00'),
(1, 'Nizampet X Road', 4, 17.5118, 78.3842, '08:25:00', '16:35:00'),
(1, 'Bachupally Crossroads', 5, 17.5342, 78.3685, '08:38:00', '16:25:00'),
(1, 'Bowrampet Village', 6, 17.5682, 78.4012, '08:52:00', '16:15:00'),
(1, 'Kandlakoya ORR Junction', 7, 17.5985, 78.4795, '09:03:00', '16:05:00'),
(1, 'CMR Technical Campus Terminal', 8, 17.6033, 78.4877, '09:10:00', '16:00:00');

-- Driver Assignments
INSERT INTO driver_assignments (driver_id, bus_id, route_id, assigned_date, is_active) VALUES
(2, 1, 1, CURDATE(), TRUE),
(3, 2, 2, CURDATE(), TRUE);

-- Student Pass Assignments
INSERT INTO student_assignments (student_id, bus_id, route_id, stop_id, pass_number, seat_preference, status) VALUES
(4, 1, 1, 3, 'CMRTC-PASS-2026-9041', '3A', 'active');

-- Active Morning Trip
INSERT INTO trips (id, bus_id, driver_id, route_id, shift_type, trip_status, start_time, delay_minutes) VALUES
(1001, 1, 2, 1, 'morning', 'in_transit', CONCAT(CURDATE(), ' 07:55:00'), 0),
(1002, 2, 3, 2, 'morning', 'in_transit', CONCAT(CURDATE(), ' 07:20:00'), 5);

-- Initial Live Bus Location (Near JNTU on Kukatpally Corridor)
INSERT INTO live_bus_locations (trip_id, bus_id, latitude, longitude, speed_kmh, heading, is_deviated, is_simulated) VALUES
(1001, 1, 17.4986, 78.3905, 42.00, 45.00, FALSE, TRUE),
(1002, 2, 17.4320, 78.4080, 36.00, 30.00, FALSE, TRUE);

-- Notifications
INSERT INTO notifications (user_id, title, message, notification_type) VALUES
(4, 'Bus Approaching JNTU', 'Bus CB-101 is approximately 2.1 km away from JNTU stop. Expected boarding time: 08:15 AM.', 'approaching'),
(NULL, 'CMRTC Safe Terminal Reminder', 'All drivers are notified: Target campus arrival is 9:10 AM before classes begin at 9:20 AM.', 'general');

-- ==============================================================================
-- ESSENTIAL QUERIES FOR PRESENTATION & REPORTING
-- ==============================================================================

-- 1. Get Live Tracking Details for a Specific Bus
-- SELECT b.bus_number, r.route_name, l.latitude, l.longitude, l.speed_kmh, l.timestamp, t.trip_status
-- FROM live_bus_locations l
-- JOIN buses b ON l.bus_id = b.id
-- JOIN trips t ON l.trip_id = t.id
-- JOIN routes r ON t.route_id = r.id
-- WHERE b.bus_number = 'CB-101'
-- ORDER BY l.id DESC LIMIT 1;

-- 2. Student Bus and Route Pass Lookup
-- SELECT u.full_name, u.roll_number, s.pass_number, b.bus_number, r.route_name, bs.stop_name, bs.morning_scheduled_time
-- FROM student_assignments s
-- JOIN users u ON s.student_id = u.id
-- JOIN buses b ON s.bus_id = b.id
-- JOIN routes r ON s.route_id = r.id
-- JOIN bus_stops bs ON s.stop_id = bs.id
-- WHERE u.email = 'student@cmrtc.ac.in';
