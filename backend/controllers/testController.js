const db = require('../config/db');
const { validCoordinate, haversineSql } = require('../utils/helpers');

// ─── Shared SQL column list for test+lab join queries ─────────────────────────
// Both the "with location" and "without location" queries select the same columns.
// Only the distance expression and ORDER BY differ between them.
const TEST_LAB_COLUMNS = `
  t.*,
  l.id    AS lab_id,
  l.name  AS lab_name,
  l.name  AS lab,
  lb.id   AS lab_branch_id,
  lb.branch_name,
  lb.address,
  lb.address AS loc,
  lb.city,
  lb.phone         AS branch_phone,
  lb.home_collection,
  lb.latitude,
  lb.longitude,
  ltb.price,
  ltb.reporting_time AS rep,
  ltb.is_available   AS ok
`;

const TEST_LAB_JOINS = `
  FROM lab_test_branches ltb
  JOIN tests       t  ON t.id  = ltb.test_id
  JOIN labs        l  ON l.id  = ltb.lab_id
  JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
  WHERE l.is_active = true AND lb.is_active = true
`;

// ─── GET /api/tests ───────────────────────────────────────────────────────────
// Returns all active test+lab combinations.
// If lat/lng query params are provided, results are ordered by distance (nearest first).
// Otherwise falls back to price ascending.
exports.get_api_tests = async (req, res) => {
  try {
    const userLat = validCoordinate(req.query.lat, -90, 90);
    const userLng = validCoordinate(req.query.lng, -180, 180);
    const hasLocation = userLat !== null && userLng !== null;

    const result = hasLocation
      ? await db.query(`
          SELECT ${TEST_LAB_COLUMNS},
            (${haversineSql('$1', '$2')}) AS distance_km
          ${TEST_LAB_JOINS}
          ORDER BY distance_km ASC NULLS LAST, ltb.price ASC
        `, [userLat, userLng])
      : await db.query(`
          SELECT ${TEST_LAB_COLUMNS},
            NULL::numeric AS distance_km
          ${TEST_LAB_JOINS}
          ORDER BY ltb.price ASC
        `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ─── GET /api/tests/:testId/prices ───────────────────────────────────────────
// Returns all labs offering a specific test (looked up by test ID).
// Supports optional location filtering (radius in km) and city filtering.
exports.get_api_tests_testId_prices = async (req, res) => {
  const city    = (req.query.city || '').trim();
  const userLat = validCoordinate(req.query.latitude ?? req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.longitude ?? req.query.lng, -180, 180);
  const radius  = Number(req.query.radius || 10);

  try {
    // First confirm the test exists
    const testRow = await db.query('SELECT name FROM tests WHERE id = $1', [req.params.testId]);
    if (testRow.rows.length === 0) return res.status(404).json({ error: 'Test not found' });

    const params = [testRow.rows[0].name];
    let distanceSelect = 'NULL::numeric AS distance_km';
    let distanceFilter = '';
    let orderBy = 'ltb.price ASC';

    // Add location-based distance expression and radius filter if coordinates provided
    if (userLat !== null && userLng !== null) {
      params.push(userLat, userLng);
      const safeRadius = Number.isFinite(radius) && radius > 0 ? radius : 10;
      distanceSelect = `round((${haversineSql('$2', '$3')})::numeric, 2) AS distance_km`;
      distanceFilter = `AND (${haversineSql('$2', '$3')}) <= $${params.length + 1}`;
      params.push(safeRadius);
      orderBy = 'distance_km ASC, ltb.price ASC';
    }

    // Add optional city filter
    if (city) params.push(city);
    const cityFilter = city ? `AND lower(lb.city) = lower($${params.length})` : '';

    const result = await db.query(`
      SELECT
        l.id   AS lab_id,
        l.name AS lab_name,
        lb.id  AS branch_id,
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
      JOIN tests        t  ON t.id  = ltb.test_id
      JOIN labs         l  ON l.id  = ltb.lab_id
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
    res.status(500).json({ error: 'Could not fetch test prices' });
  }
};

// ─── GET /api/tests/popular ───────────────────────────────────────────────────
// Returns tests ranked by number of bookings. Used by the CMS dashboard.
// Optional ?limit=N query param (default 10, max 50).
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

    res.json(rows.map(row => ({ name: row.name, count: parseInt(row.count, 10) || 0 })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch popular tests' });
  }
};

// ─── ADMIN: GET /api/admin/tests ──────────────────────────────────────────────
// Returns all tests with how many lab branches offer them.
// Optional ?lab_id=N to filter to a specific lab's tests only.
exports.get_api_admin_tests = async (req, res) => {
  try {
    const { lab_id } = req.query;
    const params = [];
    let labFilter = '';

    if (lab_id) {
      params.push(lab_id);
      labFilter = `AND ltb.lab_id = $${params.length}`;
    }

    const { rows } = await db.query(`
      SELECT
        t.id,
        t.name                         AS test_name,
        t.cat                          AS category,
        COALESCE(t.description, '')    AS description,
        COUNT(ltb.id)::INT             AS branch_count
      FROM tests t
      LEFT JOIN lab_test_branches ltb ON ltb.test_id = t.id
      WHERE 1=1 ${labFilter}
      GROUP BY t.id
      ORDER BY t.name ASC
    `, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch tests' });
  }
};

// ─── ADMIN: POST /api/admin/tests ─────────────────────────────────────────────
exports.post_api_admin_tests = async (req, res) => {
  const { test_name, category, description, price, reporting_time } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO tests (name, cat, description, price, rep)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name AS test_name, cat AS category, description`,
      [test_name, category, description, price || 0, reporting_time || '24 HR']
    );
    res.json({ success: true, test: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Could not create test' });
  }
};

// ─── ADMIN: PUT /api/admin/tests/:id ─────────────────────────────────────────
exports.put_api_admin_tests_id = async (req, res) => {
  const { id } = req.params;
  const { test_name, category, description } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE tests
       SET name = $1, cat = $2, description = $3
       WHERE id = $4
       RETURNING id, name AS test_name, cat AS category, description`,
      [test_name, category, description, id]
    );
    if (rows.length > 0) res.json({ success: true, test: rows[0] });
    else res.status(404).json({ error: 'Test not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update test' });
  }
};

// ─── ADMIN: DELETE /api/admin/tests/:id ──────────────────────────────────────
exports.delete_api_admin_tests_id = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tests WHERE id = $1', [id]);
    res.json({ success: true, message: 'Test deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete test' });
  }
};

// ─── ADMIN: GET /api/admin/tests/:id/branches ────────────────────────────────
// Returns which lab branches offer a specific test, with pricing.
exports.get_api_admin_tests_id_branches = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT
        lb.id          AS branch_id,
        lb.branch_name,
        l.name         AS lab_name,
        ltb.price,
        ltb.reporting_time,
        ltb.is_available
      FROM lab_test_branches ltb
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
      JOIN labs         l  ON l.id  = lb.lab_id
      WHERE ltb.test_id = $1
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch test branches' });
  }
};
