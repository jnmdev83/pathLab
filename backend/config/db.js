const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Dynamically detect environment from Git branch if NODE_ENV is not set
let nodeEnv = process.env.NODE_ENV;
if (!nodeEnv) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (branch === 'main') {
      nodeEnv = 'production';
    } else if (branch === 'dev') {
      nodeEnv = 'staging';
    } else {
      nodeEnv = 'development';
      nodeEnv = 'staging';
    }
  } catch (e) {
    nodeEnv = 'development';
  }
}

dotenv.config({ path: path.resolve(__dirname, `../.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Enforce SSL only for production/staging (Neon cloud), disable for local development
const isProductionOrStaging = ['production', 'staging'].includes(nodeEnv);

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProductionOrStaging ? { rejectUnauthorized: false } : false,
});

module.exports = db;
