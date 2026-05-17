const { Pool } = require('pg');

// const db = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'pathlab',
//   password: 'postgres',
//   port: 5432,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); 

module.exports = db;
