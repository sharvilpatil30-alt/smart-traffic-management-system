const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Main Routes
app.use('/api/traffic', require('./routes/trafficRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Smart AI-Based Traffic Safety & Management System API Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
