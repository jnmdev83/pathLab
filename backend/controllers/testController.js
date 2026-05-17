const db = require('../config/db');
const { validCoordinate, haversineSql } = require('../utils/helpers');

exports.get_api_tests = async (req, res) => {

  try {
    const userLat = validCoordinate(req.query.lat, -90, 90);
    const userLng = validCoordinate(req.query.lng, -180, 180);

    const result = userLat !== null && userLng !== null
      ? await db.query(`
          SELECT
            t.*,
            l.id AS lab_id,
            l.name AS lab_name,
            l.name AS lab,
            lb.id AS lab_branch_id,
            lb.branch_name,
            lb.address,
            lb.address AS loc,
            lb.city,
            lb.phone AS branch_phone,
            lb.home_collection,
            lb.latitude,
            lb.longitude,
            ltb.price,
            ltb.reporting_time AS rep,
            ltb.is_available AS ok,
            (${haversineSql('$1', '$2')}) AS distance_km
          FROM lab_test_branches ltb
          JOIN tests t ON t.id = ltb.test_id
          JOIN labs l ON l.id = ltb.lab_id
          JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
          WHERE l.is_active = true AND lb.is_active = true
          ORDER BY distance_km ASC NULLS LAST, ltb.price ASC
        `, [userLat, userLng])
      : await db.query(`
          SELECT
            t.*,
            l.id AS lab_id,
            l.name AS lab_name,
            l.name AS lab,
            lb.id AS lab_branch_id,
            lb.branch_name,
            lb.address,
            lb.address AS loc,
            lb.city,
            lb.phone AS branch_phone,
            lb.home_collection,
            lb.latitude,
            lb.longitude,
            ltb.price,
            ltb.reporting_time AS rep,
            ltb.is_available AS ok,
            NULL::numeric AS distance_km
          FROM lab_test_branches ltb
          JOIN tests t ON t.id = ltb.test_id
          JOIN labs l ON l.id = ltb.lab_id
          JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
          WHERE l.is_active = true AND lb.is_active = true
          ORDER BY ltb.price ASC
        `);
    res.json(result.rows); // Send the tests back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }

};

exports.get_api_tests_testId_prices = async (req, res) => {

  const city = (req.query.city || '').trim();
  const userLat = validCoordinate(req.query.latitude ?? req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.longitude ?? req.query.lng, -180, 180);
  const radius = Number(req.query.radius || 10);

  try {
    const selected = await db.query('SELECT name FROM tests WHERE id = $1', [req.params.testId]);
    if (selected.rows.length === 0) return res.status(404).json({ error: "Test not found" });

    const params = [selected.rows[0].name];
    let distanceSelect = 'NULL::numeric AS distance_km';
    let distanceFilter = '';
    let orderBy = 'ltb.price ASC';

    if (userLat !== null && userLng !== null) {
      params.push(userLat, userLng);
      distanceSelect = `round((${haversineSql('$2', '$3')})::numeric, 2) AS distance_km`;
      distanceFilter = `AND (${haversineSql('$2', '$3')}) <= $${params.length + 1}`;
      params.push(Number.isFinite(radius) && radius > 0 ? radius : 10);
      orderBy = 'distance_km ASC, ltb.price ASC';
    }

    if (city) params.push(city);
    const cityFilter = city ? `AND lower(lb.city) = lower($${params.length})` : '';

    const result = await db.query(`
      SELECT
        l.id AS lab_id,
        l.name AS lab_name,
        lb.id AS branch_id,
        lb.branch_name,
        lb.address,
        lb.city,
        lb.phone,
        lb.latitude,
        lb.longitude,
        ltb.price,
        ltb.reporting_time,
        ltb.is_available,
        t.id AS test_id,
        ${distanceSelect}
      FROM lab_test_branches ltb
      JOIN tests t ON t.id = ltb.test_id
      JOIN labs l ON l.id = ltb.lab_id
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
      WHERE t.name = $1
        AND ltb.is_available = true
        AND l.is_active = true
        AND lb.is_active = true
        ${cityFilter}
        ${distanceFilter}
      ORDER BY ${orderBy}
    `, params);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch test prices" });
  }

};

exports.get_api_tests_popular = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 10));
    const { rows } = await db.query(`
      SELECT t.name, COUNT(b.id) AS count
      FROM tests t
      LEFT JOIN bookings b ON b.test_id = t.id
      GROUP BY t.id, t.name
      ORDER BY count DESC, t.name ASC
      LIMIT $1
    `, [limit]);

    res.json(rows.map((row) => ({
      name: row.name,
      count: parseInt(row.count, 10) || 0,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch popular tests' });
  }
};

exports.get_api_admin_tests = async (req, res) => {
  try {
    const { lab_id } = req.query;
    let query = `
      SELECT 
        t.id, 
        t.name AS test_name, 
        t.cat AS category, 
        COALESCE(t.description, '') AS description, 
        COUNT(ltb.id)::INT AS branch_count
      FROM tests t
      LEFT JOIN lab_test_branches ltb ON ltb.test_id = t.id
      WHERE 1=1
    `;
    const params = [];
    
    if (lab_id) {
      params.push(lab_id);
      query += ` AND ltb.lab_id = $${params.length}`;
    }
    
    query += ` GROUP BY t.id ORDER BY t.name ASC`;
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch tests" });
  }
};

exports.post_api_admin_tests = async (req, res) => {
  const { test_name, category, description, price, reporting_time } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tests (name, cat, description, price, rep) VALUES ($1, $2, $3, $4, $5) RETURNING id, name AS test_name, cat AS category, description',
      [test_name, category, description, price || 0, reporting_time || '24 HR']
    );
    res.json({ success: true, test: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not create test" });
  }
};

exports.put_api_admin_tests_id = async (req, res) => {
  const { id } = req.params;
  const { test_name, category, description } = req.body;
  try {
    const result = await db.query(
      'UPDATE tests SET name = $1, cat = $2, description = $3 WHERE id = $4 RETURNING id, name AS test_name, cat AS category, description',
      [test_name, category, description, id]
    );
    if (result.rows.length > 0) res.json({ success: true, test: result.rows[0] });
    else res.status(404).json({ error: "Test not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update test" });
  }
};

exports.delete_api_admin_tests_id = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tests WHERE id = $1', [id]);
    res.json({ success: true, message: "Test deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete test" });
  }
};

exports.get_api_admin_tests_id_branches = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT 
        lb.id AS branch_id,
        lb.branch_name,
        l.name AS lab_name,
        ltb.price,
        ltb.reporting_time,
        ltb.is_available
      FROM lab_test_branches ltb
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
      JOIN labs l ON l.id = lb.lab_id
      WHERE ltb.test_id = $1
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch test branches" });
  }
};

