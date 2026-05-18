const path = require('path');
const dotenv = require('dotenv');

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const setupDatabase = require('./models/setup');

// Routes
const testRoutes = require('./routes/testRoutes');
const labRoutes = require('./routes/labRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Setup Database
setupDatabase();


// API Routes
app.use('/api', testRoutes);
app.use('/api', labRoutes);
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', packageRoutes);
app.use('/api/auth', authRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const { execSync } = require('child_process');
  let currentBranch = 'unknown';
  try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    // Fallback if git command is not present
  }

  console.log(`\n=========================================`);
  console.log(`🚀 PATHLAB BACKEND SERVER IS RUNNING`);
  console.log(`=========================================`);
  console.log(`🌿 Active Env    : ${nodeEnv.toUpperCase()}`);
  console.log(`🌿 Git Branch    : ${currentBranch}`);
  console.log(`🔌 Port          : ${PORT}`);
  
  if (process.env.DATABASE_URL) {
    try {
      // Safely parse URL to show host & db name without credentials
      const dbUrl = new URL(process.env.DATABASE_URL);
      console.log(`🗄️  Database Host : ${dbUrl.hostname}`);
      console.log(`🗄️  Database Name : ${dbUrl.pathname.replace('/', '')}`);
    } catch (err) {
      console.log(`🗄️  Database Host : Cloud Database`);
    }
  } else {
    console.log(`🗄️  Database      : No DATABASE_URL configured`);
  }
  console.log(`=========================================\n`);
});
