const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Connect Database
db.connect();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const listingRoutes = require('./routes/listingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

app.use('/user', userRoutes);
app.use('/users', userRoutes); // Alias for backwards compatibility
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/rentals', rentalRoutes);
app.use('/listings', listingRoutes);
app.use('/enquiries', enquiryRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LuxeWheels API', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('LuxeWheels API is running');
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});