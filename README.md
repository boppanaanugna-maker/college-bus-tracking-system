# 🚌 Smart College Bus Tracking System (CMRTC SmartTransit AI)

**Official Destination Terminal:**  
**CMR Technical Campus**  
Kandlakoya (V), Medchal Road, Hyderabad – 501401, Telangana  
*(Near Outer Ring Road ORR Exit 6 / NH-44 Medchal Highway)*

---

## 📋 Project Overview
The **Smart College Bus Tracking System** is an advanced web-based fleet monitoring and student transit safety platform developed specifically for **CMR Technical Campus, Kandlakoya, Hyderabad**.

The system is calibrated according to official campus timings:
- **Morning Target Arrival at Campus:** **9:10 AM** (College classes start at **9:20 AM**). Morning departure times for every Hyderabad corridor are dynamically computed with safety buffers to guarantee timely arrival.
- **Evening Return Fleet Departure:** **4:00 PM** (College closing time). Expected arrival times back in Hyderabad neighborhoods are calculated dynamically based on traffic.

---

## 🗂️ Project File Structure
```text
CMRTC_College_Bus_Tracking_System/
├── index.html          # Complete rich frontend UI (15 pages/sections, dashboard, tabs)
├── style.css           # Glassmorphism, 3D flip card, custom map markers, animations
├── script.js           # Complete frontend logic (Dataset, physics simulation, Leaflet map, charts)
├── server.js           # Node.js Express backend server & REST API
├── schema.sql          # Complete MySQL database creation script with sample seed data
├── package.json        # Dependencies and start scripts
├── .env.example        # Environment variables template
├── README.md           # Setup instructions & presentation evaluation guide
├── css/                # Original modular CSS directory
│   └── style.css
└── js/                 # Original modular JavaScript directory
    ├── data.js         # 10 Hyderabad routes & timing models
    ├── simulation.js   # Dual-direction interpolation & Web Audio synthesizer
    ├── map.js          # Leaflet GIS mapping & geofence rings
    ├── charts.js       # Chart.js analytics & 4-tier journey duration charts
    └── app.js          # App router, role switcher & modal handlers
```

---

## 🚀 How to Run the Project (VS Code on Windows)

### Option 1: Instant Browser Run (No installation required)
Double-click `index.html` in your file explorer, or right-click `index.html` in VS Code and choose **Open with Live Server**. The full interactive application will run immediately with all 10 Hyderabad routes, live moving bus markers, 3D digital pass, and audio sirens!

### Option 2: Full Node.js + Express Backend Server
1. Open this folder in **VS Code**.
2. Open terminal (`Ctrl + ~`) and install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Setup MySQL:
   - Import `schema.sql` into MySQL (`mysql -u root -p < schema.sql`).
   - Copy `.env.example` to `.env` and fill in your MySQL password.
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:5000
   ```

---

## 🎓 Viva Presentation & PPT Slide Mapping

| PPT Slide Topic | Implementation Details |
|---|---|
| **College Timings Engine** | Enforces morning target **9:10 AM** arrival (classes start **9:20 AM**) and evening fleet departure at **4:00 PM** with traffic buffer compensation. |
| **Hyderabad Bus Corridors** | 10 realistic routes starting from Kukatpally, Suncity, Miyapur, Secunderabad, LB Nagar, Uppal, etc., all terminating at CMRTC Kandlakoya. |
| **Interactive Leaflet GIS Map** | Live moving bus markers, route polylines, Kandlakoya campus destination pin, and 1,000m safe geofence circle. |
| **AI ETA & 4-Tier Duration** | Categorizes journey times: 🟢 <60m (Short), 🟡 60-90m (Medium), 🟠 90-120m (Long), 🔴 >120m (Review Route / Traffic Warning). |
| **Student Safety & SOS Siren** | Emergency SOS alert with Web Audio synthesizer siren, and instant notification broadcast. |
| **Digital Pass & QR Attendance** | 3D holographic flip card bus pass with dynamic QR code for attendance logging. |
