const db = require('../config/db');
const { validCoordinate, haversineSql } = require('../utils/helpers');

exports.post_api_bookings = async (req, res) => {

  const {
    user_id,
    test_id,
    patient_name,
    patient_phone,
    booking_date,
    time_slot,
    lab_branch_id,
    user_latitude,
    user_longitude,
    user_location,
    notes,
  } = req.body;
  const bookingLat = validCoordinate(user_latitude, -90, 90);
  const bookingLng = validCoordinate(user_longitude, -180, 180);
  try {
    const result = await db.query(
      `INSERT INTO bookings 
      (user_id, test_id, lab_branch_id, patient_name, patient_phone, booking_date, time_slot, user_latitude, user_longitude, user_location, notes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        user_id,
        test_id,
        lab_branch_id || null,
        patient_name,
        patient_phone,
        booking_date,
        time_slot,
        bookingLat,
        bookingLng,
        user_location || null,
        notes,
      ]
    );
    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create booking" });
  }

};

exports.put_api_bookings_id_reschedule = async (req, res) => {

  const { id } = req.params;
  const { booking_date, time_slot } = req.body;
  try {
    const result = await db.query(
      `UPDATE bookings SET booking_date = $1, time_slot = $2, status = 'pending'
       WHERE id = $3 AND status != 'completed'
       RETURNING *`,
      [booking_date, time_slot, id]
    );
    if (result.rows.length > 0) res.json({ success: true, booking: result.rows[0] });
    else res.status(400).json({ error: "Cannot reschedule a completed booking" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not reschedule booking" });
  }

};

exports.get_api_bookings_stats = async (req, res) => {
  try {
    const totalBookingsResult = await db.query('SELECT COUNT(*) AS count FROM bookings');
    const totalRevenueResult = await db.query(
      `SELECT COALESCE(SUM(t.price), 0) AS total_revenue
       FROM bookings b
       JOIN tests t ON t.id = b.test_id`
    );
    const activeLabsResult = await db.query('SELECT COUNT(*) AS count FROM labs WHERE is_active = true');
    const pendingBookingsResult = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE status = 'pending'");

    res.json({
      totalBookings: parseInt(totalBookingsResult.rows[0].count, 10) || 0,
      totalRevenue: parseInt(totalRevenueResult.rows[0].total_revenue, 10) || 0,
      activeLabs: parseInt(activeLabsResult.rows[0].count, 10) || 0,
      pendingBookings: parseInt(pendingBookingsResult.rows[0].count, 10) || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch booking statistics' });
  }
};

exports.get_api_bookings_daily = async (req, res) => {
  try {
    const days = Math.max(1, parseInt(req.query.days, 10) || 30);
    const { rows } = await db.query(
      `SELECT to_char(booking_date, 'Mon DD') AS date, COUNT(*)::INT AS count
       FROM bookings
       WHERE booking_date >= CURRENT_DATE - ($1 - 1)::INT
       GROUP BY booking_date
       ORDER BY booking_date ASC`,
      [days]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch daily booking statistics' });
  }
};

exports.get_api_bookings_recent = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const { rows } = await db.query(
      `SELECT b.id, b.patient_name, t.name AS test_name, lb.branch_name, b.booking_date, b.status
       FROM bookings b
       LEFT JOIN tests t ON t.id = b.test_id
       LEFT JOIN lab_branches lb ON lb.id = b.lab_branch_id
       ORDER BY b.booking_date DESC, b.id DESC
       LIMIT $1`,
      [limit]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch recent bookings' });
  }
};

exports.get_api_bookings = async (req, res) => {
  try {
    const { status, lab_id } = req.query;
    let query = `
      SELECT b.*, t.name as test_name, lb.branch_name, l.name as lab_name
      FROM bookings b
      LEFT JOIN tests t ON t.id = b.test_id
      LEFT JOIN lab_branches lb ON lb.id = b.lab_branch_id
      LEFT JOIN labs l ON l.id = lb.lab_id
      WHERE 1=1
    `;
    const params = [];
    
    if (status) {
      params.push(status);
      query += ` AND b.status = $${params.length}`;
    }
    if (lab_id) {
      params.push(lab_id);
      query += ` AND lb.lab_id = $${params.length}`;
    }
    
    query += ` ORDER BY b.booking_date DESC, b.time_slot DESC`;
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch bookings' });
  }
};

exports.put_api_bookings_id_status = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) res.json({ success: true, booking: result.rows[0] });
    else res.status(404).json({ error: "Booking not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update booking status" });
  }
};

exports.put_api_bookings_id_notes = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const result = await db.query(
      'UPDATE bookings SET notes = $1 WHERE id = $2 RETURNING *',
      [notes, id]
    );
    if (result.rows.length > 0) res.json({ success: true, booking: result.rows[0] });
    else res.status(404).json({ error: "Booking not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update booking notes" });
  }
};

