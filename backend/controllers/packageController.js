const db = require('../config/db');

// Fetch all common packages
exports.get_api_packages = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        p.*,
        COUNT(pt.test_id) AS test_count,
        MIN(lpb.price) AS min_price,
        COUNT(DISTINCT lpb.lab_id) AS lab_count
      FROM packages p
      LEFT JOIN package_tests pt ON pt.package_id = p.id
      LEFT JOIN lab_package_branches lpb ON lpb.package_id = p.id AND lpb.is_available = true
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch packages' });
  }
};

// Fetch comparison data for a specific package
exports.get_api_package_comparison = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT 
        lpb.*,
        l.name AS lab_name,
        lb.branch_name,
        lb.address,
        lb.city,
        lb.latitude,
        lb.longitude
      FROM lab_package_branches lpb
      JOIN labs l ON l.id = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
      WHERE lpb.package_id = $1 AND lpb.is_available = true
      ORDER BY lpb.price ASC
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package comparison' });
  }
};

// Fetch tests inside a package
exports.get_api_package_tests = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT t.*
      FROM tests t
      JOIN package_tests pt ON pt.test_id = t.id
      WHERE pt.package_id = $1
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package tests' });
  }
};

// --- ADMIN ENDPOINTS ---

// Fetch all packages with test details for admin
exports.get_api_admin_packages = async (req, res) => {
  console.log("ADMIN: Fetching all packages...");
  try {
    const { rows } = await db.query(`
      SELECT 
        p.id, p.name, p.description, p.category, p.is_active, p.created_at, p.updated_at,
        (
          SELECT COALESCE(json_agg(t.name), '[]'::json)
          FROM package_tests pt
          JOIN tests t ON t.id = pt.test_id
          WHERE pt.package_id = p.id
        ) AS included_tests,
        (
          SELECT COALESCE(json_agg(pt.test_id), '[]'::json)
          FROM package_tests pt
          WHERE pt.package_id = p.id
        ) AS test_ids,
        (
          SELECT COUNT(DISTINCT lab_id)::INT
          FROM lab_package_branches
          WHERE package_id = p.id
        ) AS lab_count
      FROM packages p
      ORDER BY p.updated_at DESC
    `);
    console.log(`ADMIN: Found ${rows.length} packages`);
    res.json(rows);
  } catch (error) {
    console.error("ADMIN FETCH PACKAGES CRITICAL ERROR:", error);
    res.status(500).json({ 
      error: 'Database error while fetching packages',
      details: error.message,
      code: error.code
    });
  }
};

// Create a new package
exports.post_api_admin_packages = async (req, res) => {
  const { name, description, category, test_ids } = req.body;
  console.log("CREATING PACKAGE:", { name, category, test_ids });
  try {
    const { rows } = await db.query(
      'INSERT INTO packages (name, description, category) VALUES ($1, $2, $3) RETURNING id',
      [name, description, category]
    );
    const packageId = rows[0].id;

    if (test_ids && test_ids.length > 0) {
      console.log(`Mapping ${test_ids.length} tests to package ${packageId}`);
      for (const testId of test_ids) {
        await db.query(
          'INSERT INTO package_tests (package_id, test_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [packageId, testId]
        );
      }
    }
    res.status(201).json({ id: packageId, message: 'Package created' });
  } catch (error) {
    console.error("CREATE PACKAGE ERROR:", error);
    res.status(500).json({ error: error.message || 'Could not create package' });
  }
};

// Update package
exports.put_api_admin_packages_id = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, is_active, test_ids } = req.body;
  console.log("UPDATING PACKAGE:", { id, name, test_ids });
  try {
    await db.query(
      'UPDATE packages SET name = $1, description = $2, category = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
      [name, description, category, is_active, id]
    );

    if (test_ids) {
      console.log(`Refreshing test mappings for package ${id}`);
      // Refresh test mappings
      await db.query('DELETE FROM package_tests WHERE package_id = $1', [id]);
      for (const testId of test_ids) {
        await db.query(
          'INSERT INTO package_tests (package_id, test_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, testId]
        );
      }
    }
    res.json({ message: 'Package updated' });
  } catch (error) {
    console.error("UPDATE PACKAGE ERROR:", error);
    res.status(500).json({ error: error.message || 'Could not update package' });
  }
};

// Delete package
exports.delete_api_admin_packages_id = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM packages WHERE id = $1', [id]);
    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete package' });
  }
};

// Manage Lab-Package Mappings
exports.get_api_admin_package_mappings = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        lpb.*,
        p.name AS package_name,
        l.name AS lab_name,
        lb.branch_name
      FROM lab_package_branches lpb
      JOIN packages p ON p.id = lpb.package_id
      JOIN labs l ON l.id = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
      ORDER BY lpb.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch mappings' });
  }
};

exports.post_api_admin_package_mappings = async (req, res) => {
  const { lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes } = req.body;
  try {
    if (lab_branch_id === 'all') {
      const { rows: branches } = await db.query('SELECT id FROM lab_branches WHERE lab_id = $1', [lab_id]);
      if (branches.length === 0) {
        return res.status(400).json({ error: 'No branches found for this laboratory' });
      }
      for (const branch of branches) {
        await db.query(`
          INSERT INTO lab_package_branches (
            lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (lab_branch_id, package_id) DO UPDATE SET
            price = EXCLUDED.price,
            reporting_time = EXCLUDED.reporting_time,
            home_collection = EXCLUDED.home_collection,
            discount_label = EXCLUDED.discount_label,
            notes = EXCLUDED.notes
        `, [lab_id, branch.id, package_id, price, reporting_time, home_collection, discount_label, notes]);
      }
      res.status(201).json({ message: 'Package assigned to all lab branches successfully' });
    } else {
      await db.query(`
        INSERT INTO lab_package_branches (
          lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (lab_branch_id, package_id) DO UPDATE SET
          price = EXCLUDED.price,
          reporting_time = EXCLUDED.reporting_time,
          home_collection = EXCLUDED.home_collection,
          discount_label = EXCLUDED.discount_label,
          notes = EXCLUDED.notes
      `, [lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes]);
      res.status(201).json({ message: 'Mapping created/updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create mapping' });
  }
};

exports.delete_api_admin_package_mappings_id = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM lab_package_branches WHERE id = $1', [id]);
    res.json({ message: 'Mapping removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not remove mapping' });
  }
};
