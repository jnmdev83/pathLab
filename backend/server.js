const express = require('express');
const cors = require('cors');
const setupDatabase = require('./models/setup');

const testRoutes = require('./routes/testRoutes');
const labRoutes = require('./routes/labRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Database
setupDatabase();

// Routes
app.use('/api', testRoutes);
app.use('/api', labRoutes);
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', packageRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
