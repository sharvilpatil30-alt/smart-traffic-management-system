# Smart AI-Based Traffic Safety Backend

This is the Node.js + Express + MongoDB backend for the Smart AI-Based Traffic Safety & Management System.

## Project Structure

```
backend/
│
├── config/
│   └── db.js               # MongoDB connection setup
├── controllers/
│   ├── dashboardController.js
│   ├── reportController.js
│   ├── trafficController.js
│   └── weatherController.js
├── models/
│   ├── Report.js           # Mongoose model for Incident Reports
│   ├── Traffic.js          # Mongoose model for Traffic Data
│   └── Weather.js          # Mongoose model for Weather Data
├── routes/
│   ├── dashboardRoutes.js
│   ├── reportRoutes.js
│   ├── trafficRoutes.js
│   └── weatherRoutes.js
├── package.json
└── server.js               # Express application entry point
```

## Prerequisites

- Node.js installed on your machine
- MongoDB installed locally or a MongoDB Atlas URI

## Installation & Running

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd d:\SY\hackathon\backend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the server (runs on `http://localhost:5000` by default):
   ```bash
   npm start
   ```
   *For development with auto-restart, you can run `npm run dev`.*

4. Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017` or add a `.env` file in the `backend` directory with your custom `MONGO_URI`.

## API Endpoints & Example Responses

### 1. Traffic Data API
**POST** `/api/traffic`

Receives traffic density data from IoT sensors.

**Request Body:**
```json
{
  "location": "Main St Junction",
  "vehicle_count": 120,
  "timestamp": "2026-03-11T10:00:00Z"
}
```

**Response:**
```json
{
  "_id": "64b1f4c9e8d3b500129f1234",
  "location": "Main St Junction",
  "vehicle_count": 120,
  "timestamp": "2026-03-11T10:00:00.000Z",
  "__v": 0
}
```

---

### 2. Weather Risk Detection API
**POST** `/api/weather`

Receives weather data and calculates a risk level (Low, Medium, High).

**Request Body:**
```json
{
  "rainfall": 25,
  "fog": 60,
  "temperature": 15
}
```

**Response:**
```json
{
  "_id": "64b1f4dbe8d3b500129f1236",
  "rainfall": 25,
  "fog": 60,
  "temperature": 15,
  "risk_level": "Medium",
  "timestamp": "2026-03-11T10:05:00.000Z",
  "__v": 0
}
```

---

### 3. Dashboard Data API
**GET** `/api/dashboard`

Sends combined data (latest traffic, weather, and risk level) to the frontend dashboard.

**Response:**
```json
{
  "traffic_density": 120,
  "weather_condition": {
    "temperature": 15,
    "rainfall": 25,
    "fog": 60
  },
  "risk_level": "Medium",
  "timestamp": "2026-03-11T10:06:00.000Z"
}
```

---

### 4. Incident Reporting API
**POST** `/api/report`

Allows citizens to report accidents or road hazards.

**Request Body:**
```json
{
  "location": "Highway 42, Mile 18",
  "description": "Large pothole on the right lane",
  "image_url": "https://example.com/images/pothole.jpg"
}
```

**Response:**
```json
{
  "_id": "64b1f4efe8d3b500129f1238",
  "location": "Highway 42, Mile 18",
  "description": "Large pothole on the right lane",
  "image_url": "https://example.com/images/pothole.jpg",
  "timestamp": "2026-03-11T10:10:00.000Z",
  "__v": 0
}
```

## API Integration with Frontend
To consume these APIs in your frontend, simply use `fetch()`. Example:

```javascript
fetch("http://localhost:5000/api/dashboard")
  .then(response => response.json())
  .then(data => {
      console.log("Dashboard Data:", data);
      // Update your UI here
  })
  .catch(error => console.error("Error fetching data:", error));
```
