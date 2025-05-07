require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/userAuthRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
