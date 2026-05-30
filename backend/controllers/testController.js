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
// Enhanced: supports pagination, sort, and filters for the search results page.
// Backwards compatible: when ?page is absent, returns a flat array as before.
exports.get_api_tests_testId_prices = async (req, res) => {
  const isPaginated = req.query.page !== undefined;
  const page   = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit  = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 8));
  const offset = (page - 1) * limit;

  const city    = (req.query.city || '').trim();
  const userLat = validCoordinate(req.query.latitude ?? req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.longitude ?? req.query.lng, -180, 180);

  // New filter params
  const maxPrice   = parseInt(req.query.max_price, 10) || null;
  const collection = req.query.collection || null; // 'home' | 'lab'
  const nablOnly   = req.query.nabl === 'true';
  const turnaround = req.query.turnaround || null; // '6' | 'same_day' | 'next_day'
  const sortParam  = req.query.sort || 'popularity';
  const minRating  = parseFloat(req.query.rating) || null;

  try {
    const testRow = await db.query('SELECT id, name FROM tests WHERE id = $1', [req.params.testId]);
    if (testRow.rows.length === 0) return res.status(404).json({ error: 'Test not found' });

    // Build count query parameters first (which doesn't require userLat/userLng)
    const countParams = [req.params.testId];
    let whereExtra = '';

    if (maxPrice) {
      countParams.push(maxPrice);
      whereExtra += ` AND ltb.price <= $${countParams.length}`;
    }
    if (minRating) {
      countParams.push(minRating);
      whereExtra += ` AND COALESCE(l.rating, 4.0) >= $${countParams.length}`;
    }
    if (collection === 'home') whereExtra += ` AND lb.home_collection = true`;
    if (collection === 'lab')  whereExtra += ` AND lb.home_collection = false`;
    if (nablOnly)              whereExtra += ` AND l.is_verified = true`;
    if (turnaround === '6') {
      whereExtra += ` AND (NULLIF(regexp_replace(ltb.reporting_time, '[^0-9]', '', 'g'), ''))::int <= 6`;
    } else if (turnaround === 'same_day') {
      whereExtra += ` AND (NULLIF(regexp_replace(ltb.reporting_time, '[^0-9]', '', 'g'), ''))::int <= 24`;
    }
    if (city) {
      countParams.push(city);
      whereExtra += ` AND lower(lb.city) = lower($${countParams.length})`;
    }

    // Now build parameters for the main query
    let distanceSelect = 'NULL::numeric AS distance_km';
    const mainParams = [...countParams];

    if (userLat !== null && userLng !== null) {
      mainParams.push(userLat, userLng);
      const latIdx = mainParams.length - 1;
      const lngIdx = mainParams.length;
      distanceSelect = `round((${haversineSql(`$${latIdx}`, `$${lngIdx}`)})::numeric, 2) AS distance_km`;
    }

    // Sort order
    let orderBy;
    switch (sortParam) {
      case 'price_asc':  orderBy = 'ltb.price ASC'; break;
      case 'price_desc': orderBy = 'ltb.price DESC'; break;
      case 'rating':     orderBy = 'l.rating DESC NULLS LAST, l.booking_count DESC'; break;
      case 'distance':   orderBy = userLat ? 'distance_km ASC NULLS LAST, ltb.price ASC' : 'ltb.price ASC'; break;
      default:           orderBy = 'l.booking_count DESC, l.rating DESC NULLS LAST, ltb.price ASC';
    }

    const selectCols = `
      l.id             AS lab_id,
      l.name           AS lab_name,
      l.is_verified,
      COALESCE(l.rating, 4.0)        AS rating,
      COALESCE(l.booking_count, 0)   AS booking_count,
      lb.id            AS branch_id,
      lb.branch_name,
      lb.address,
      lb.city,
      lb.phone,
      lb.latitude,
      lb.longitude,
      lb.home_collection,
      lb.operating_hours,
      ltb.price,
      ltb.original_price,
      COALESCE(ltb.discount_percent, 0) AS discount_percent,
      ltb.reporting_time,
      ltb.is_available,
      t.id  AS test_id,
      t.name AS test_name,
      ${distanceSelect}
    `;

    const baseWhere = `
      WHERE ltb.test_id = $1
        AND ltb.is_available = true
        AND l.is_active  = true
        AND lb.is_active = true
        ${whereExtra}
    `;

    const joins = `
      FROM lab_test_branches ltb
      JOIN tests        t  ON t.id  = ltb.test_id
      JOIN labs         l  ON l.id  = ltb.lab_id
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
    `;

    if (isPaginated) {
      const countRes = await db.query(
        `SELECT COUNT(*) AS total ${joins} ${baseWhere}`,
        countParams
      );
      const total = parseInt(countRes.rows[0].total, 10);

      const queryParams = [...mainParams, limit, offset];
      const limitIdx = queryParams.length - 1;
      const offsetIdx = queryParams.length;

      const result = await db.query(
        `SELECT ${selectCols} ${joins} ${baseWhere} ORDER BY ${orderBy} LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        queryParams
      );

      return res.json({
        results:    result.rows,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore:    page * limit < total,
      });
    }

    // ── Backwards-compat: no ?page param → return flat array ──
    const result = await db.query(
      `SELECT ${selectCols} ${joins} ${baseWhere} ORDER BY ${orderBy}`,
      mainParams
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch test prices' });
  }
};

// ─── GET /api/tests/search?q=<name> ──────────────────────────────────────────
// Resolves a test name string → { id, name, cat, description, total_labs }.
exports.get_api_tests_search = async (req, res) => {
  let q = (req.query.q || '').trim();
  if (q.toLowerCase().includes(' vs ')) {
    q = q.split(/\s+vs\s+/i)[0].trim();
  }
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

  try {
    // Exact match first
    let { rows } = await db.query(`
      SELECT
        t.id,
        t.name,
        t.cat,
        COALESCE(t.description, '') AS description,
        COALESCE(t.short_description, '') AS short_description,
        COUNT(DISTINCT ltb.lab_branch_id)::int AS total_labs
      FROM tests t
      LEFT JOIN lab_test_branches ltb
        ON ltb.test_id = t.id AND ltb.is_available = true
      WHERE lower(t.name) = lower($1)
      GROUP BY t.id
      ORDER BY COUNT(DISTINCT ltb.lab_branch_id) DESC
      LIMIT 1
    `, [q]);

    // Fallback: partial match
    if (rows.length === 0) {
      ({ rows } = await db.query(`
        SELECT
          t.id,
          t.name,
          t.cat,
          COALESCE(t.description, '') AS description,
          COALESCE(t.short_description, '') AS short_description,
          COUNT(DISTINCT ltb.lab_branch_id)::int AS total_labs
        FROM tests t
        LEFT JOIN lab_test_branches ltb
          ON ltb.test_id = t.id AND ltb.is_available = true
        WHERE lower(t.name) LIKE lower($1)
        GROUP BY t.id
        ORDER BY COUNT(DISTINCT ltb.lab_branch_id) DESC
        LIMIT 1
      `, [`%${q}%`]));
    }

    if (rows.length === 0) return res.status(404).json({ error: 'Test not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not search tests' });
  }
};

// ─── GET /api/tests/:testId/top-picks ────────────────────────────────────────
// Returns the 3 hero picks: cheapest, fastest, best-rated for a given test.
exports.get_api_tests_testId_top_picks = async (req, res) => {
  const testId = req.params.testId;
  try {
    const testRow = await db.query('SELECT id FROM tests WHERE id = $1', [testId]);
    if (testRow.rows.length === 0) return res.status(404).json({ error: 'Test not found' });

    const cols = `
      l.id              AS lab_id,
      l.name            AS lab_name,
      COALESCE(l.rating, 4.0)        AS rating,
      COALESCE(l.booking_count, 0)   AS booking_count,
      l.is_verified,
      lb.id             AS branch_id,
      lb.branch_name,
      lb.city,
      lb.home_collection,
      ltb.price,
      ltb.original_price,
      COALESCE(ltb.discount_percent, 0) AS discount_percent,
      ltb.reporting_time
    `;
    const base = `
      FROM lab_test_branches ltb
      JOIN tests        t  ON t.id  = ltb.test_id
      JOIN labs         l  ON l.id  = ltb.lab_id
      JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
      WHERE ltb.test_id    = $1
        AND ltb.is_available = true
        AND l.is_active     = true
        AND lb.is_active    = true
    `;

    const [cheapest, fastest, bestRated] = await Promise.all([
      db.query(`SELECT ${cols} ${base} ORDER BY ltb.price ASC  LIMIT 1`, [testId]),
      db.query(
        `SELECT ${cols} ${base}
         ORDER BY (NULLIF(regexp_replace(ltb.reporting_time, '[^0-9]', '', 'g'), ''))::int ASC NULLS LAST, ltb.price ASC
         LIMIT 1`,
        [testId]
      ),
      db.query(
        `SELECT ${cols} ${base}
         ORDER BY l.rating DESC NULLS LAST, l.booking_count DESC, ltb.price ASC
         LIMIT 1`,
        [testId]
      ),
    ]);

    res.json({
      cheapest:   cheapest.rows[0]   || null,
      fastest:    fastest.rows[0]    || null,
      best_rated: bestRated.rows[0]  || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch top picks' });
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

// ─── GET /api/category-previews ─────────────────────────────────────────────
exports.get_api_category_previews = async (req, res) => {
  try {
    const query = `
      SELECT 
        cp.id as preview_row_id,
        cp.category_name,
        cp.is_pkg,
        COALESCE(cp.test_id, cp.package_id) as id,
        COALESCE(t.name, p.name) as name,
        COALESCE(
          t.price, 
          (SELECT MIN(price) FROM lab_package_branches lpb WHERE lpb.package_id = p.id), 
          999
        ) as price,
        COALESCE(t.description, p.description, 'Premium clinical audit parameter.') as description,
        COALESCE(t.rep, '12 Hours') as rep,
        COALESCE(t.cat, 'blood') as cat,
        COALESCE(t.preparations, p.preparations, 'No special preparation required.') as preparations,
        COALESCE(t.samples_required, p.samples_required, 'Blood') as samples_required
      FROM category_previews cp
      LEFT JOIN tests t ON cp.test_id = t.id AND cp.is_pkg = false
      LEFT JOIN packages p ON cp.package_id = p.id AND cp.is_pkg = true
      ORDER BY cp.category_name ASC, cp.display_order ASC, cp.id ASC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch category previews' });
  }
};

// ─── GET /api/categories/:categoryName/metadata ──────────────────────────────
exports.get_api_category_metadata = async (req, res) => {
  const { categoryName } = req.params;
  try {
    const { rows } = await db.query(
      'SELECT * FROM categories_metadata WHERE lower(category_name) = lower($1)',
      [categoryName.trim()]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      // Fallback default metadata
      const isAll = categoryName.toLowerCase() === 'all' || categoryName.toLowerCase() === 'blood';
      res.json({
        category_name: isAll ? 'All Tests' : categoryName,
        icon: 'science',
        description: isAll ? 'Explore our complete range of diagnostic tests and health packages.' : `Explore diagnostic tests under ${categoryName} care.`,
        long_description: isAll ? 'Explore comprehensive diagnostic tests and health packages. Compare prices across certified NABL labs and book with free home collection.' : `Explore comprehensive diagnostic tests and health packages under ${categoryName} care. Compare prices across certified NABL labs and book with free home collection.`,
        medically_reviewed: true,
        stats_labs: '128+ certified labs',
        stats_bookings: '10k+ monthly bookings',
        stats_patients: '56k+ patients',
        tags: ['Blood Tests', 'Health Panel', 'Screening', 'Home Collection']
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch category metadata' });
  }
};


// ─── GET /api/tests/:testId ──────────────────────────────────────────────────
exports.get_api_test_by_id = async (req, res) => {
  const { testId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM tests WHERE id = $1', [testId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Test not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch test details' });
  }
};

// ─── GET /api/labs/:labId/profile ────────────────────────────────────────────
// Returns rich lab profile from lab_profiles joined with labs.
// Falls back gracefully to labs data if no profile row exists.
exports.get_api_labs_labId_profile = async (req, res) => {
  const { labId } = req.params;
  try {
    // Try joining lab_profiles with labs
    const { rows } = await db.query(`
      SELECT
        l.id               AS lab_id,
        l.name             AS lab_name,
        l.phone,
        l.email,
        l.website,
        l.is_verified,
        COALESCE(l.rating, 4.0)        AS rating,
        COALESCE(l.booking_count, 0)   AS booking_count,
        lp.tagline,
        lp.about,
        lp.established_year,
        lp.accreditations,
        lp.lab_type,
        lp.total_branches,
        lp.tests_offered,
        lp.images,
        lp.speciality_tags,
        lp.home_collection,
        lp.report_time_hours,
        COALESCE(lp.rating, l.rating, 4.0) AS profile_rating,
        COALESCE(lp.review_count, 500)     AS review_count
      FROM labs l
      LEFT JOIN lab_profiles lp ON lp.lab_id = l.id
      WHERE l.id = $1
    `, [labId]);

    if (rows.length === 0) return res.status(404).json({ error: 'Lab not found' });

    const row = rows[0];

    // Ensure arrays are proper JS arrays (PG driver may already parse them)
    const normalize = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return []; }
      }
      return [];
    };

    res.json({
      lab_id:          row.lab_id,
      lab_name:        row.lab_name,
      phone:           row.phone,
      email:           row.email,
      website:         row.website,
      is_verified:     row.is_verified,
      rating:          parseFloat(row.profile_rating) || 4.0,
      review_count:    parseInt(row.review_count) || 500,
      booking_count:   parseInt(row.booking_count) || 0,
      tagline:         row.tagline || 'Trusted Diagnostic Partner',
      about:           row.about || 'A NABL-certified diagnostic laboratory delivering accurate clinical test results.',
      established_year: row.established_year || 2005,
      accreditations:  normalize(row.accreditations).length > 0 ? normalize(row.accreditations) : ['NABL'],
      lab_type:        row.lab_type || 'pathology',
      total_branches:  parseInt(row.total_branches) || 1,
      tests_offered:   parseInt(row.tests_offered) || 100,
      images:          normalize(row.images),
      speciality_tags: normalize(row.speciality_tags),
      home_collection: row.home_collection !== false,
      report_time_hours: parseInt(row.report_time_hours) || 24,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch lab profile' });
  }
};

// ─── GET /api/scans-landing/data ─────────────────────────────────────────────
exports.get_api_scans_landing_data = async (req, res) => {
  try {
    // 1. Fetch categories
    const categoriesRes = await db.query('SELECT * FROM scanning_categories ORDER BY display_order ASC');
    const categories = categoriesRes.rows;

    // 2. Fetch tests to map into categories
    const testsRes = await db.query('SELECT id, name, sub_category FROM tests WHERE cat = \'scanning\' AND sub_category IS NOT NULL ORDER BY id ASC');
    const allScanTests = testsRes.rows;

    // Nest tests inside categories
    const categoriesWithTests = categories.map(cat => {
      return {
        ...cat,
        starts_price: 350, // default starts_price fallback
        labs_count: 5,
        sub_label: cat.description,
        tests: allScanTests.filter(t => t.sub_category === cat.name).map(t => t.name)
      };
    });

    // 3. Fetch popular scans (minimum price from branches)
    const popularRes = await db.query(`
      SELECT 
        t.id, 
        t.name, 
        t.sub_category, 
        COALESCE(MIN(ltb.price), t.price, 450) AS price, 
        COALESCE(MIN(ltb.reporting_time), t.rep, '24 Hours') AS rep 
      FROM tests t
      LEFT JOIN lab_test_branches ltb ON t.id = ltb.test_id AND ltb.is_available = true
      WHERE t.cat = 'scanning' AND t.sub_category IS NOT NULL
      GROUP BY t.id, t.name, t.sub_category, t.price, t.rep
      ORDER BY t.id ASC
      LIMIT 8
    `);
    const popular = popularRes.rows;

    // 4. Return standard static/dynamic FAQs
    const faqs = [
      { id: 1, question: "What is the difference between an MRI and a CT scan?", answer: "An MRI uses magnetic fields and radio waves to create detailed images of soft tissues, ligaments, and organs. A CT scan uses X-rays to create cross-sectional images of bones, chest, and blood vessels, and is generally much faster." },
      { id: 2, question: "How should I prepare for an Ultrasound Abdomen?", answer: "For an abdominal ultrasound, you generally need to fast (no food or drink except water) for 8 to 12 hours before your appointment to minimize gas in your stomach and intestines." },
      { id: 3, question: "Are home collection options available for scans?", answer: "No, scans and imaging procedures (like MRI, CT, Ultrasound, and X-ray) must be performed at one of our certified partner laboratory branches or diagnostic centers due to the specialized equipment required." }
    ];

    // 5. Fetch partner labs
    const partnersRes = await db.query('SELECT id, name FROM labs WHERE is_active = true LIMIT 5');
    const partners = partnersRes.rows;

    res.json({
      categories: categoriesWithTests,
      popular,
      faqs,
      partners
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load scans landing data' });
  }
};

// ─── GET /api/scans/listing ──────────────────────────────────────────────────
exports.get_api_scans_listing = async (req, res) => {
  try {
    const category = req.query.category || 'Imaging';
    const search = req.query.search || '';
    const maxPrice = parseInt(req.query.max_price, 10) || null;
    const bodyPart = req.query.body_part || null;
    const equipmentType = req.query.equipment_type || null;
    const anesthesia = req.query.anesthesia === 'true';
    const sort = req.query.sort || 'Popularity';

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 8));
    const offset = (page - 1) * limit;

    // 1. Fetch listing tests dynamically
    const params = [category];
    let queryExtra = '';

    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      queryExtra += ` AND t.name ILIKE $${params.length}`;
    }
    if (bodyPart && bodyPart !== 'All Body Parts') {
      params.push(bodyPart);
      queryExtra += ` AND t.body_part = $${params.length}`;
    }
    if (equipmentType) {
      params.push(equipmentType);
      queryExtra += ` AND t.equipment_type = $${params.length}`;
    }
    if (anesthesia) {
      queryExtra += ` AND t.anesthesia_required = true`;
    }

    const query = `
      SELECT 
        t.id, 
        t.name, 
        t.description,
        t.short_description,
        t.rep, 
        t.cat, 
        t.sub_category, 
        t.body_part, 
        t.equipment_type, 
        t.procedure_prep, 
        t.anesthesia_required, 
        t.is_trending,
        COALESCE((SELECT name FROM labs WHERE id = MIN(ltb.lab_id)), t.lab, 'Certified Partner Lab') AS lab,
        COALESCE(MIN(ltb.lab_id), (SELECT id FROM labs WHERE name = t.lab LIMIT 1), 1) AS lab_id,
        COALESCE(MIN(ltb.price), t.price, 450) AS price,
        COALESCE(MIN(ltb.original_price), CEIL(COALESCE(MIN(ltb.price), t.price, 450) / 0.8)) AS original_price,
        COALESCE(MIN(ltb.discount_percent), 20) AS discount_percent,
        CASE 
          WHEN lower(t.rep) LIKE '%same day%' OR lower(t.rep) LIKE '%6 hour%' THEN 6
          WHEN lower(t.rep) LIKE '%12%' THEN 12
          WHEN lower(t.rep) LIKE '%24%' THEN 24
          ELSE 48
        END AS rep_time_hours
      FROM tests t
      LEFT JOIN lab_test_branches ltb ON t.id = ltb.test_id AND ltb.is_available = true
      WHERE t.cat = 'scanning' AND t.sub_category = $1 ${queryExtra}
      GROUP BY t.id, t.name, t.description, t.short_description, t.rep, t.cat, t.sub_category, t.body_part, t.equipment_type, t.procedure_prep, t.anesthesia_required, t.is_trending, t.lab
    `;

    // Fetch total count before pagination
    const allRows = await db.query(query, params);
    
    // Apply price filter on the grouped rows if maxPrice is supplied (since price is minimum from ltb)
    let filteredRows = allRows.rows;
    if (maxPrice) {
      filteredRows = filteredRows.filter(row => row.price <= maxPrice);
    }

    const totalFiltered = filteredRows.length;

    // Sort manual matching orderBy logic
    if (sort === 'Lowest Price') {
      filteredRows.sort((a, b) => a.price - b.price);
    } else if (sort === 'Highest Price') {
      filteredRows.sort((a, b) => b.price - a.price);
    } else if (sort === 'A-Z') {
      filteredRows.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'Location') {
      filteredRows.sort((a, b) => {
        const distA = ((a.id || 0) % 5) + 1.2;
        const distB = ((b.id || 0) % 5) + 1.2;
        return distA - distB;
      });
    } else if (sort === 'Reporting Time' || sort === 'Fastest Available') {
      filteredRows.sort((a, b) => a.rep_time_hours - b.rep_time_hours || a.price - b.price);
    } else {
      // Popularity
      filteredRows.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0) || a.price - b.price);
    }

    // Apply pagination
    const paginatedRows = filteredRows.slice(offset, offset + limit);

    // 2. Fetch dynamic metadata filters for this category
    const bodyPartsRes = await db.query(
      'SELECT DISTINCT body_part FROM tests WHERE cat = \'scanning\' AND sub_category = $1 AND body_part IS NOT NULL',
      [category]
    );
    const bodyParts = bodyPartsRes.rows.map(r => r.body_part);

    const equipmentRes = await db.query(
      'SELECT DISTINCT equipment_type FROM tests WHERE cat = \'scanning\' AND sub_category = $1 AND equipment_type IS NOT NULL',
      [category]
    );
    const equipmentTypes = equipmentRes.rows.map(r => r.equipment_type);

    res.json({
      tests: paginatedRows,
      totalCount: totalFiltered,
      currentPage: page,
      totalPages: Math.ceil(totalFiltered / limit),
      filters: {
        body_parts: bodyParts,
        equipment_types: equipmentTypes
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load scans listing data' });
  }
};



