const db = require('../config/db');
const { validCoordinate, haversineSql } = require('../utils/helpers');
const jwt = require('jsonwebtoken');

exports.post_api_signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, phone, password]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not sign up. Maybe email already exists?" });
  }
};

exports.post_api_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, name, email, phone FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Wrong email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.post_api_admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2 AND role = \'admin\'',
      [email, password]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Generate a simple JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        'your_jwt_secret', // In production, use environment variable
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true, 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        } 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid admin credentials or insufficient permissions" });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.get_api_user_id_dashboard = async (req, res) => {

  try {
    const { id } = req.params;
    const bookings = await db.query(`
      SELECT
        b.*,
        t.name as test_name,
        COALESCE(l.name, t.lab) AS lab,
        lb.branch_name,
        lb.address AS branch_address,
        COALESCE(ltb.price, t.price) AS price
      FROM bookings b
      JOIN tests t ON b.test_id = t.id
      LEFT JOIN lab_branches lb ON lb.id = b.lab_branch_id
      LEFT JOIN labs l ON l.id = lb.lab_id
      LEFT JOIN lab_test_branches ltb ON ltb.test_id = t.id AND ltb.lab_branch_id = b.lab_branch_id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
    `, [id]);
    
    const reports = await db.query(`
      SELECT r.*, t.name as test_name, COALESCE(l.name, t.lab) AS lab
      FROM reports r
      JOIN bookings b ON r.booking_id = b.id
      JOIN tests t ON b.test_id = t.id
      LEFT JOIN lab_branches lb ON lb.id = b.lab_branch_id
      LEFT JOIN labs l ON l.id = lb.lab_id
      WHERE r.user_id = $1
      ORDER BY r.date_generated DESC
    `, [id]);
    
    res.json({ success: true, bookings: bookings.rows, reports: reports.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch dashboard data" });
  }

};

exports.put_api_user_id = async (req, res) => {

  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, name, email, phone',
      [name, phone, id]
    );
    if (result.rows.length > 0) res.json({ success: true, user: result.rows[0] });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update profile" });
  }

};

exports.get_api_admin_users = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, phone, role, is_active, last_login FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch users" });
  }
};

exports.post_api_admin_users = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role, is_active',
      [name, email, phone, password, role || 'staff']
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not create user" });
  }
};

exports.put_api_admin_users_id = async (req, res) => {
  const { id } = req.params;
  const { name, phone, role, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), role = COALESCE($3, role), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING id, name, email, phone, role, is_active',
      [name, phone, role, is_active, id]
    );
    if (result.rows.length > 0) res.json({ success: true, user: result.rows[0] });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update user" });
  }
};

exports.delete_api_admin_users_id = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length > 0) res.json({ success: true, message: "User deleted" });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete user" });
  }
};

