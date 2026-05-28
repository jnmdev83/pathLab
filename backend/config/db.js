const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Dynamically detect environment from Git branch (main always runs production, stg runs stg)
let nodeEnv;
try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (branch === 'main') {
    nodeEnv = 'production';
  } else if (branch === 'stg') {
    nodeEnv = 'stg';
  }
} catch (e) {
  // Ignore git error
}

if (!nodeEnv) {
  nodeEnv = process.env.NODE_ENV || 'development';
}

dotenv.config({ path: path.resolve(__dirname, `../.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Enforce SSL only for production/stg (Neon cloud), disable for local development
const isProductionOrStg = ['production', 'stg'].includes(nodeEnv);

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProductionOrStg ? { rejectUnauthorized: false } : false,
});

module.exports = db;
