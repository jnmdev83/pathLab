const db = require('../config/db');
const { validCoordinate, haversineSql } = require('../utils/helpers');

exports.get_api_labs_nearby = async (req, res) => {

  const userLat = validCoordinate(req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.lng, -180, 180);
  const radius = Number(req.query.radius || 5);

  if (userLat === null || userLng === null) {
    return res.status(400).json({ error: "Valid lat and lng query parameters are required" });
  }

  try {
    const distanceExpr = haversineSql('$1', '$2');
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
        lb.home_collection,
        round((${distanceExpr})::numeric, 2) AS distance_km
      FROM lab_branches lb
      JOIN labs l ON l.id = lb.lab_id
      WHERE l.is_active = true
        AND lb.is_active = true
        AND (${distanceExpr}) <= $3
      ORDER BY distance_km ASC, CASE WHEN l.name = 'Demo Nearby Lab' THEN 0 ELSE 1 END, l.name ASC
      LIMIT 20
    `, [userLat, userLng, Number.isFinite(radius) && radius > 0 ? radius : 5]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch nearby labs" });
  }

};

exports.post_api_dev_seed_nearby_lab = async (req, res) => {

  const userLat = validCoordinate(req.body.lat, -90, 90);
  const userLng = validCoordinate(req.body.lng, -180, 180);

  if (userLat === null || userLng === null) {
    return res.status(400).json({ error: "Valid lat and lng are required" });
  }

  try {
    const labResult = await db.query(`
      INSERT INTO labs (name, phone, email, website, is_active, is_verified)
      VALUES ('Demo Nearby Lab', '011-0000-9999', 'demo-nearby@choosemylab.example', 'https://example.com/demo-nearby', true, true)
      ON CONFLICT (name) DO UPDATE SET
        phone = EXCLUDED.phone,
        is_active = true,
        is_verified = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, name
    `);
    const lab = labResult.rows[0];

    const branchResult = await db.query(`
      INSERT INTO lab_branches (
        lab_id, branch_name, address, city, state, postal_code, latitude,
        longitude, phone, operating_hours, home_collection, is_active
      )
      VALUES (
        $1,
        'Current Location Demo',
        'Demo branch generated at your current GPS location',
        'Your City',
        'Demo State',
        '000000',
        $2,
        $3,
        '011-0000-9999',
        '9 AM - 6 PM, Mon-Sat',
        true,
        true
      )
      ON CONFLICT (lab_id, branch_name, city) DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        is_active = true
      RETURNING id, branch_name, address, city, phone
    `, [lab.id, userLat, userLng]);
    const branch = branchResult.rows[0];

    const tests = await db.query(`
      SELECT DISTINCT ON (name) id, name, price, rep, ok
      FROM tests
      WHERE name IN (
        'CBC (Complete Blood Count)',
        'LFT (Liver Function Test)',
        'KFT (Kidney Function Test)',
        'HbA1c (Glycosylated Hemoglobin)',
        'Thyroid Profile (T3, T4, TSH)'
      )
      ORDER BY name, price ASC
      LIMIT 5
    `);

    for (const test of tests.rows) {
      await db.query(`
        INSERT INTO lab_test_branches (
          lab_id, lab_branch_id, test_id, price, reporting_time, is_available
        )
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (lab_branch_id, test_id) DO UPDATE SET
          price = EXCLUDED.price,
          reporting_time = EXCLUDED.reporting_time,
          is_available = true
      `, [lab.id, branch.id, test.id, Math.max(99, Number(test.price) - 25), test.rep || '6 HR']);
    }

    res.json({
      success: true,
      lab_id: lab.id,
      lab_name: lab.name,
      branch_id: branch.id,
      branch_name: branch.branch_name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      latitude: userLat,
      longitude: userLng,
      tests_added: tests.rows.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not seed nearby demo lab" });
  }

};

exports.get_api_labs_city = async (req, res) => {

  const city = (req.query.city || '').trim();
  const verifiedOnly = req.query.verified_only !== 'false';

  if (!city) {
    return res.status(400).json({ error: "city query parameter is required" });
  }

  try {
    const result = await db.query(`
      SELECT
        l.id AS lab_id,
        l.name AS lab_name,
        lb.id AS branch_id,
        lb.branch_name,
        lb.address,
        lb.city,
        lb.phone,
        lb.home_collection,
        lb.latitude,
        lb.longitude
      FROM lab_branches lb
      JOIN labs l ON l.id = lb.lab_id
      WHERE lower(lb.city) = lower($1)
        AND l.is_active = true
        AND lb.is_active = true
        AND ($2::boolean = false OR l.is_verified = true)
      ORDER BY l.name ASC, lb.branch_name ASC
    `, [city, verifiedOnly]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch labs for city" });
  }

};

exports.get_api_labs_labId_branches = async (req, res) => {
  const labId = Number(req.params.labId);
  if (!Number.isInteger(labId) || labId <= 0) {
    return res.status(400).json({ error: 'Valid labId is required' });
  }

  try {
    const result = await db.query(`
      SELECT
        lb.*,
        lb.branch_name AS name
      FROM lab_branches lb
      WHERE lb.lab_id = $1
      ORDER BY lb.is_active DESC, lb.branch_name ASC
    `, [labId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch lab branches' });
  }
};

exports.post_api_branches = async (req, res) => {
  const {
    lab_id,
    branch_name,
    name, // Support both fields
    address,
    city,
    state,
    postal_code,
    latitude,
    longitude,
    phone,
    operating_hours,
    home_collection,
    is_active,
  } = req.body;

  const actualBranchName = branch_name || name;

  if (!lab_id || !actualBranchName) {
    return res.status(400).json({ error: 'lab_id and branch_name are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO lab_branches (
         lab_id, branch_name, address, city, state, postal_code,
         latitude, longitude, phone, operating_hours, home_collection, is_active
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        lab_id,
        actualBranchName.trim(),
        address || null,
        city || null,
        state || null,
        postal_code || null,
        latitude || null,
        longitude || null,
        phone || null,
        operating_hours || null,
        home_collection === true,
        is_active !== false,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create branch' });
  }
};

exports.put_api_branches_id = async (req, res) => {
  const { id } = req.params;
  const {
    branch_name,
    name, // Support both fields
    address,
    city,
    state,
    postal_code,
    latitude,
    longitude,
    phone,
    operating_hours,
    home_collection,
    is_active,
  } = req.body;

  const actualBranchName = branch_name || name;

  if (!actualBranchName) {
    return res.status(400).json({ error: 'branch_name is required' });
  }

  try {
    const result = await db.query(
      `UPDATE lab_branches
       SET branch_name = $1,
           address = $2,
           city = $3,
           state = $4,
           postal_code = $5,
           latitude = $6,
           longitude = $7,
           phone = $8,
           operating_hours = $9,
           home_collection = $10,
           is_active = $11,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        actualBranchName.trim(),
        address || null,
        city || null,
        state || null,
        postal_code || null,
        latitude || null,
        longitude || null,
        phone || null,
        operating_hours || null,
        home_collection === true,
        is_active !== false,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update branch' });
  }
};

exports.put_api_branches_id_status = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await db.query(
      `UPDATE lab_branches
       SET is_active = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [is_active === true, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update branch status' });
  }
};

exports.delete_api_branches_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM lab_branches WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete branch' });
  }
};

exports.get_api_labs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        l.*,
        COUNT(lb.id) AS branch_count
      FROM labs l
      LEFT JOIN lab_branches lb ON lb.lab_id = l.id
      GROUP BY l.id
      ORDER BY l.created_at DESC, l.name ASC
    `);
    res.json(result.rows.map((row) => ({
      ...row,
      branch_count: parseInt(row.branch_count, 10) || 0,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch labs' });
  }
};

exports.post_api_labs = async (req, res) => {
  const { name, phone, email, website, is_active, is_verified } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Lab name is required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO labs (name, phone, email, website, is_active, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name.trim(), phone || null, email || null, website || null, is_active !== false, is_verified === true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create lab' });
  }
};

exports.put_api_labs_id = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, website, is_active, is_verified } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Lab name is required' });
  }

  try {
    const result = await db.query(
      `UPDATE labs
       SET name = $1,
           phone = $2,
           email = $3,
           website = $4,
           is_active = $5,
           is_verified = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name.trim(), phone || null, email || null, website || null, is_active !== false, is_verified === true, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update lab' });
  }
};

exports.delete_api_labs_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`DELETE FROM labs WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete lab' });
  }
};

exports.put_api_labs_id_toggle_verify = async (req, res) => {
  const { id } = req.params;
  const { is_verified } = req.body;

  try {
    const result = await db.query(
      `UPDATE labs
       SET is_verified = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [is_verified === true, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update verification status' });
  }
};

exports.get_api_branches = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        lb.id,
        lb.branch_name AS name,
        lb.lab_id,
        l.name AS lab_name,
        lb.city,
        lb.is_active
      FROM lab_branches lb
      LEFT JOIN labs l ON l.id = lb.lab_id
      ORDER BY l.name ASC, lb.branch_name ASC
    `);
    res.json(result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      lab_id: row.lab_id,
      lab_name: row.lab_name,
      city: row.city,
      is_active: row.is_active,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch branches' });
  }
};

exports.get_api_branches_branchId_tests = async (req, res) => {

  try {
    const result = await db.query(`
      SELECT
        t.id AS test_id,
        t.name AS test_name,
        t.cat AS category,
        COALESCE(t.description, '') AS description,
        ltb.price,
        ltb.reporting_time,
        ltb.is_available,
        ltb.id AS lab_test_branch_id,
        l.id AS lab_id,
        l.name AS lab_name,
        lb.id AS lab_branch_id,
        lb.branch_name,
        lb.address,
        lb.city,
        lb.phone AS branch_phone,
        lb.operating_hours,
        lb.home_collection
      FROM lab_test_branches ltb
      JOIN tests t ON t.id = ltb.test_id
      JOIN labs l ON l.id = ltb.lab_id
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
      WHERE ltb.lab_branch_id = $1
        AND ltb.is_available = true
        AND l.is_active = true
        AND lb.is_active = true
      ORDER BY t.cat ASC, ltb.price ASC
    `, [req.params.branchId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch branch tests" });
  }

};

exports.get_api_branches_popular = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 5));
    const { rows } = await db.query(`
      SELECT
        COALESCE(lb.branch_name, l.name) AS name,
        COUNT(b.id) AS value
      FROM lab_branches lb
      LEFT JOIN labs l ON l.id = lb.lab_id
      LEFT JOIN bookings b ON b.lab_branch_id = lb.id
      WHERE lb.is_active = true
      GROUP BY lb.id, lb.branch_name, l.name
      ORDER BY value DESC, lb.branch_name ASC
      LIMIT $1
    `, [limit]);

    res.json(rows.map((row) => ({
      name: row.name,
      value: parseInt(row.value, 10) || 0,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch popular branches' });
  }
};

exports.post_api_lab_test_branches = async (req, res) => {
  const { test_id, branch_id, price, reporting_time } = req.body;
  try {
    // Get lab_id from branch
    const branchRes = await db.query('SELECT lab_id FROM lab_branches WHERE id = $1', [branch_id]);
    if (branchRes.rows.length === 0) return res.status(404).json({ error: "Branch not found" });
    const lab_id = branchRes.rows[0].lab_id;

    const result = await db.query(
      `INSERT INTO lab_test_branches (lab_id, lab_branch_id, test_id, price, reporting_time)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (lab_branch_id, test_id) DO UPDATE SET
         price = EXCLUDED.price,
         reporting_time = EXCLUDED.reporting_time
       RETURNING *`,
      [lab_id, branch_id, test_id, price, reporting_time]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not assign test to branch" });
  }
};

exports.put_api_lab_test_branches_id = async (req, res) => {
  const { id } = req.params;
  const { price, reporting_time, is_available } = req.body;
  try {
    const result = await db.query(
      `UPDATE lab_test_branches 
       SET price = COALESCE($1, price), 
           reporting_time = COALESCE($2, reporting_time),
           is_available = COALESCE($3, is_available)
       WHERE id = $4 RETURNING *`,
      [price, reporting_time, is_available, id]
    );
    if (result.rows.length > 0) res.json({ success: true, data: result.rows[0] });
    else res.status(404).json({ error: "Mapping not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update mapping" });
  }
};

