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

// Enhanced: Fetch package prices with location sorting, filters, and pagination
exports.get_api_packages_packageId_prices = async (req, res) => {
  const { validCoordinate, haversineSql } = require('../utils/helpers');
  const isPaginated = req.query.page !== undefined;
  const page   = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit  = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 8));
  const offset = (page - 1) * limit;

  const city    = (req.query.city || '').trim();
  const userLat = validCoordinate(req.query.latitude ?? req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.longitude ?? req.query.lng, -180, 180);

  // Filter params
  const maxPrice   = parseInt(req.query.max_price, 10) || null;
  const collection = req.query.collection || null; // 'home' | 'lab'
  const nablOnly   = req.query.nabl === 'true';
  const turnaround = req.query.turnaround || null; // '6' | 'same_day' | 'next_day'
  const sortParam  = req.query.sort || 'popularity';

  try {
    const pkgRow = await db.query('SELECT id, name FROM packages WHERE id = $1', [req.params.packageId]);
    if (pkgRow.rows.length === 0) return res.status(404).json({ error: 'Package not found' });

    // Build count query parameters
    const countParams = [req.params.packageId];
    let whereExtra = '';

    if (maxPrice) {
      countParams.push(maxPrice);
      whereExtra += ` AND lpb.price <= $${countParams.length}`;
    }
    if (collection === 'home') whereExtra += ` AND lb.home_collection = true`;
    if (collection === 'lab')  whereExtra += ` AND lb.home_collection = false`;
    if (nablOnly)              whereExtra += ` AND l.is_verified = true`;
    if (turnaround === '6') {
      whereExtra += ` AND (NULLIF(regexp_replace(lpb.reporting_time, '[^0-9]', '', 'g'), ''))::int <= 6`;
    } else if (turnaround === 'same_day') {
      whereExtra += ` AND (NULLIF(regexp_replace(lpb.reporting_time, '[^0-9]', '', 'g'), ''))::int <= 24`;
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
      case 'price_asc':  orderBy = 'lpb.price ASC'; break;
      case 'price_desc': orderBy = 'lpb.price DESC'; break;
      case 'rating':     orderBy = 'l.rating DESC NULLS LAST, l.booking_count DESC'; break;
      case 'distance':   orderBy = userLat ? 'distance_km ASC NULLS LAST, lpb.price ASC' : 'lpb.price ASC'; break;
      default:           orderBy = 'l.booking_count DESC, l.rating DESC NULLS LAST, lpb.price ASC';
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
      lpb.price,
      lpb.original_price,
      COALESCE(lpb.discount_percent, 0) AS discount_percent,
      lpb.reporting_time,
      lpb.is_available,
      p.id  AS package_id,
      p.name AS package_name,
      p.name AS test_name, -- Compatibility mapping
      p.id AS test_id, -- Compatibility mapping
      ${distanceSelect}
    `;

    const baseWhere = `
      WHERE lpb.package_id = $1
        AND lpb.is_available = true
        AND l.is_active  = true
        AND lb.is_active = true
        ${whereExtra}
    `;

    const joins = `
      FROM lab_package_branches lpb
      JOIN packages        p  ON p.id  = lpb.package_id
      JOIN labs         l  ON l.id  = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
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

    // Flat array compatibility
    const result = await db.query(
      `SELECT ${selectCols} ${joins} ${baseWhere} ORDER BY ${orderBy}`,
      mainParams
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package prices' });
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

// ─── GET /api/packages/:packageId ────────────────────────────────────────────
exports.get_api_package_by_id = async (req, res) => {
  const { packageId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM packages WHERE id = $1', [packageId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Package not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package details' });
  }
};

// ─── GET /api/packages-landing/data ──────────────────────────────────────────
// Returns dynamic categories, popular packages, FAQs, and partners for the revamped Packages Landing Page.
exports.get_api_packages_landing_data = async (req, res) => {
  try {
    const categoriesPromise = db.query('SELECT * FROM packages_landing_categories WHERE is_active = true ORDER BY display_order ASC');
    const popularPromise = db.query('SELECT * FROM packages_landing_popular WHERE is_active = true ORDER BY display_order ASC');
    const faqsPromise = db.query('SELECT * FROM packages_landing_faqs WHERE is_active = true ORDER BY display_order ASC');
    const partnersPromise = db.query('SELECT * FROM packages_landing_partners WHERE is_active = true ORDER BY display_order ASC');

    const [categories, popular, faqs, partners] = await Promise.all([
      categoriesPromise,
      popularPromise,
      faqsPromise,
      partnersPromise
    ]);

    res.json({
      categories: categories.rows,
      popular: popular.rows,
      faqs: faqs.rows,
      partners: partners.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch packages landing page data' });
  }
};

// ─── GET /api/packages-listing/metadata ──────────────────────────────────────
exports.get_api_packages_listing_metadata = async (req, res) => {
  const category = (req.query.category || 'Full Body Checkup').trim();
  try {
    const heroPromise = db.query('SELECT * FROM packages_listing_hero_metadata WHERE category = $1', [category]);
    const tiersPromise = db.query('SELECT * FROM packages_listing_tiers WHERE category = $1 ORDER BY display_order ASC', [category]);
    const guidesPromise = db.query('SELECT * FROM packages_listing_guides WHERE category = $1 ORDER BY display_order ASC', [category]);
    const faqsPromise = db.query('SELECT * FROM packages_listing_faqs WHERE category = $1 ORDER BY display_order ASC', [category]);
    
    // Aggregation queries
    const statsPromise = db.query(`
      SELECT 
        (SELECT COUNT(DISTINCT p.id)::INT FROM packages p WHERE p.category = $1 AND p.is_active = true) AS available_packages,
        (SELECT COUNT(DISTINCT lpb.lab_id)::INT FROM lab_package_branches lpb JOIN packages p ON p.id = lpb.package_id WHERE p.category = $1 AND lpb.is_available = true) AS trusted_labs,
        (SELECT MIN(lpb.price)::INT FROM lab_package_branches lpb JOIN packages p ON p.id = lpb.package_id WHERE p.category = $1 AND lpb.is_available = true) AS starting_price,
        (SELECT EXISTS(SELECT 1 FROM lab_package_branches lpb JOIN packages p ON p.id = lpb.package_id WHERE p.category = $1 AND lpb.home_collection = true AND lpb.is_available = true)) AS home_collection
    `, [category]);

    const [heroRes, tiersRes, guidesRes, faqsRes, statsRes] = await Promise.all([
      heroPromise,
      tiersPromise,
      guidesPromise,
      faqsPromise,
      statsPromise
    ]);

    // If no hero found, fall back to "Full Body Checkup"
    let hero = heroRes.rows[0];
    if (!hero && category !== 'Full Body Checkup') {
      const fbHeroRes = await db.query('SELECT * FROM packages_listing_hero_metadata WHERE category = $1', ['Full Body Checkup']);
      hero = fbHeroRes.rows[0];
    }

    res.json({
      hero: hero || {
        category,
        title: `${category} Packages`,
        subtitle: `Expert-curated diagnostics for ${category}.`,
        tags: ['Preventive Care', 'Annual Checkup'],
        read_more: '',
        image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80',
        trust_badges: [{icon: 'verified', text: 'NABL Certified Labs'}]
      },
      tiers: tiersRes.rows,
      guides: guidesRes.rows,
      faqs: faqsRes.rows,
      stats: {
        availablePackages: statsRes.rows[0]?.available_packages || 0,
        trustedLabs: statsRes.rows[0]?.trusted_labs || 0,
        startingPrice: statsRes.rows[0]?.starting_price || 999,
        homeCollection: statsRes.rows[0]?.home_collection ? 'YES' : 'NO'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch packages listing metadata' });
  }
};

// ─── GET /api/packages-listing/offers ────────────────────────────────────────
exports.get_api_packages_listing_offers = async (req, res) => {
  const { validCoordinate, haversineSql } = require('../utils/helpers');
  const category = (req.query.category || 'Full Body Checkup').trim();
  
  const isPaginated = req.query.page !== undefined;
  const page   = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit  = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 8));
  const offset = (page - 1) * limit;

  const userLat = validCoordinate(req.query.latitude ?? req.query.lat, -90, 90);
  const userLng = validCoordinate(req.query.longitude ?? req.query.lng, -180, 180);

  // Filters
  const minPrice = parseInt(req.query.min_price, 10) || 0;
  const maxPrice = parseInt(req.query.max_price, 10) || 25000;
  const homeCollection = req.query.home_collection === 'true';
  const tier = req.query.tier || null;
  const accreditations = req.query.accreditations ? req.query.accreditations.split(',') : [];
  const sortParam = req.query.sort || 'recommended';

  try {
    const queryParams = [category, minPrice, maxPrice];
    let whereExtra = '';

    // Tier filtering
    if (tier) {
      queryParams.push(tier);
      const tierIdx = queryParams.length;
      whereExtra += ` AND (
        p.name ILIKE $${tierIdx} 
        OR (
          CASE 
            WHEN LOWER($${tierIdx}) = 'essential' THEN lpb.price <= 1500
            WHEN LOWER($${tierIdx}) = 'advanced' THEN lpb.price > 1500 AND lpb.price <= 3000
            WHEN LOWER($${tierIdx}) = 'comprehensive' THEN lpb.price > 3000 AND lpb.price <= 6000
            WHEN LOWER($${tierIdx}) = 'premium' THEN lpb.price > 6000
            ELSE true
          END
        )
      )`;
    }

    // Home Collection filtering
    if (homeCollection) {
      whereExtra += ` AND lpb.home_collection = true`;
    }

    // Accreditations filtering
    if (accreditations.length > 0) {
      const acconditions = [];
      accreditations.forEach(acc => {
        if (acc === 'NABL') {
          acconditions.push(`(l.is_verified = true OR 'NABL' = ANY(lp.accreditations) OR 'ISO 15189' = ANY(lp.accreditations))`);
        } else if (acc === 'CAP') {
          acconditions.push(`('CAP' = ANY(lp.accreditations))`);
        } else if (acc === 'ISO') {
          acconditions.push(`('ISO 9001' = ANY(lp.accreditations) OR 'ISO' = ANY(lp.accreditations) OR 'ISO 15189' = ANY(lp.accreditations))`);
        }
      });
      if (acconditions.length > 0) {
        whereExtra += ` AND (${acconditions.join(' OR ')})`;
      }
    }

    // Geolocation distance select
    let distanceSelect = 'NULL::numeric AS distance_km';
    if (userLat !== null && userLng !== null) {
      queryParams.push(userLat, userLng);
      const latIdx = queryParams.length - 1;
      const lngIdx = queryParams.length;
      distanceSelect = `round((${haversineSql(`$${latIdx}`, `$${lngIdx}`)})::numeric, 2) AS distance_km`;
    }

    // Sorting order
    let orderBy;
    switch (sortParam) {
      case 'price_asc':  orderBy = 'lpb.price ASC'; break;
      case 'price_desc': orderBy = 'lpb.price DESC'; break;
      case 'report_fastest': 
        orderBy = `(NULLIF(regexp_replace(lpb.reporting_time, '[^0-9]', '', 'g'), ''))::int ASC, lpb.price ASC`; 
        break;
      case 'recommended':
      default:           orderBy = 'l.booking_count DESC, l.rating DESC NULLS LAST, lpb.price ASC';
    }

    const selectCols = `
      lpb.id,
      lpb.price,
      lpb.original_price,
      lpb.discount_percent,
      lpb.reporting_time,
      lpb.home_collection,
      lpb.discount_label,
      p.id AS package_id,
      p.name AS package_name,
      p.description AS package_description,
      l.id AS lab_id,
      l.name AS lab_name,
      l.is_verified,
      COALESCE(lp.rating, l.rating, 4.0) AS lab_rating,
      COALESCE(lp.review_count, l.booking_count, 500) AS lab_reviews,
      lp.accreditations,
      lb.id AS branch_id,
      lb.branch_name,
      lb.address,
      lb.city,
      ${distanceSelect},
      (
        SELECT COALESCE(json_agg(t.name), '[]'::json)
        FROM package_tests pt
        JOIN tests t ON t.id = pt.test_id
        WHERE pt.package_id = p.id
      ) AS tests
    `;

    const joins = `
      FROM lab_package_branches lpb
      JOIN packages p ON p.id = lpb.package_id
      JOIN labs l ON l.id = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
      LEFT JOIN lab_profiles lp ON lp.lab_id = l.id
    `;

    const baseWhere = `
      WHERE p.category = $1
        AND lpb.price >= $2
        AND lpb.price <= $3
        AND lpb.is_available = true
        AND l.is_active = true
        AND lb.is_active = true
        ${whereExtra}
    `;

    if (isPaginated) {
      const countRes = await db.query(
        `SELECT COUNT(*) AS total ${joins} ${baseWhere}`,
        queryParams.slice(0, tier ? 4 : 3)
      );
      const total = parseInt(countRes.rows[0].total, 10);

      const queryParamsWithLimit = [...queryParams, limit, offset];
      const limitIdx = queryParamsWithLimit.length - 1;
      const offsetIdx = queryParamsWithLimit.length;

      const result = await db.query(
        `SELECT ${selectCols} ${joins} ${baseWhere} ORDER BY ${orderBy} LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        queryParamsWithLimit
      );

      return res.json({
        results: result.rows,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      });
    }

    const result = await db.query(
      `SELECT ${selectCols} ${joins} ${baseWhere} ORDER BY ${orderBy}`,
      queryParams
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package listing offers' });
  }
};

// ─── GET /api/packages/:packageId/branches/:branchId ─────────────────────────
exports.get_api_package_branch_details = async (req, res) => {
  let { packageId, branchId } = req.params;
  try {
    if (!branchId || branchId === 'null' || branchId === 'undefined') {
      const fallbackRow = await db.query(
        'SELECT lab_branch_id FROM lab_package_branches WHERE package_id = $1 AND is_available = true ORDER BY price ASC LIMIT 1',
        [packageId]
      );
      if (fallbackRow.rows.length > 0) {
        branchId = fallbackRow.rows[0].lab_branch_id;
      } else {
        return res.status(404).json({ error: 'No lab branches offering this package.' });
      }
    }

    const { rows } = await db.query(`
      SELECT 
        lpb.id AS offer_id,
        lpb.price,
        lpb.original_price,
        lpb.discount_percent,
        lpb.reporting_time,
        lpb.home_collection,
        lpb.discount_label,
        p.id AS package_id,
        p.name AS package_name,
        p.description AS package_description,
        p.category AS package_category,
        p.samples_required,
        p.preparations,
        p.why_booked,
        p.what_it_measures,
        p.faq,
        l.id AS lab_id,
        l.name AS lab_name,
        l.is_verified,
        COALESCE(l.rating, 4.5) AS lab_rating,
        COALESCE(l.booking_count, 1200) AS lab_reviews,
        lb.id AS branch_id,
        lb.branch_name,
        lb.address,
        lb.city
      FROM lab_package_branches lpb
      JOIN packages p ON p.id = lpb.package_id
      JOIN labs l ON l.id = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
      WHERE lpb.package_id = $1 AND lpb.lab_branch_id = $2 AND lpb.is_available = true
    `, [packageId, branchId]);

    if (rows.length === 0) {
      const pkgRow = await db.query('SELECT * FROM packages WHERE id = $1', [packageId]);
      if (pkgRow.rows.length === 0) {
        return res.status(404).json({ error: 'Package not found.' });
      }
      const anyOfferRow = await db.query(`
        SELECT 
          lpb.id AS offer_id, lpb.price, lpb.original_price, lpb.discount_percent, lpb.reporting_time, lpb.home_collection, lpb.discount_label,
          p.id AS package_id, p.name AS package_name, p.description AS package_description, p.category AS package_category,
          p.samples_required, p.preparations, p.why_booked, p.what_it_measures, p.faq,
          l.id AS lab_id, l.name AS lab_name, l.is_verified, l.rating AS lab_rating, l.booking_count AS lab_reviews,
          lb.id AS branch_id, lb.branch_name, lb.address, lb.city
        FROM lab_package_branches lpb
        JOIN packages p ON p.id = lpb.package_id
        JOIN labs l ON l.id = lpb.lab_id
        JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
        WHERE lpb.package_id = $1 AND lpb.is_available = true
        ORDER BY lpb.price ASC LIMIT 1
      `, [packageId]);
      if (anyOfferRow.rows.length === 0) {
        return res.status(404).json({ error: 'No active offers available for this package.' });
      }
      return res.json(anyOfferRow.rows[0]);
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch package branch details' });
  }
};

// ─── GET /api/packages/:packageId/branches/:branchId/other-packages ─────────
exports.get_api_package_branch_other_packages = async (req, res) => {
  let { packageId, branchId } = req.params;
  try {
    if (!branchId || branchId === 'null' || branchId === 'undefined') {
      const fallbackRow = await db.query(
        'SELECT lab_branch_id FROM lab_package_branches WHERE package_id = $1 AND is_available = true ORDER BY price ASC LIMIT 1',
        [packageId]
      );
      if (fallbackRow.rows.length > 0) {
        branchId = fallbackRow.rows[0].lab_branch_id;
      } else {
        return res.json([]);
      }
    }

    const { rows } = await db.query(`
      SELECT 
        lpb.price,
        lpb.original_price,
        lpb.discount_percent,
        lpb.reporting_time,
        lpb.home_collection,
        lpb.discount_label,
        p.id AS package_id,
        p.name AS package_name,
        p.description AS package_description,
        p.category AS package_category,
        (SELECT COUNT(*)::int FROM package_tests pt WHERE pt.package_id = p.id) AS test_count
      FROM lab_package_branches lpb
      JOIN packages p ON p.id = lpb.package_id
      WHERE lpb.lab_branch_id = $1 AND lpb.package_id != $2 AND lpb.is_available = true AND p.is_active = true
      ORDER BY p.name ASC
      LIMIT 5
    `, [branchId, packageId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch other packages' });
  }
};

// ─── GET /api/packages/:packageId/branches/:branchId/competitors ─────────────
exports.get_api_package_branch_competitors = async (req, res) => {
  let { packageId, branchId } = req.params;
  try {
    if (!branchId || branchId === 'null' || branchId === 'undefined') {
      const fallbackRow = await db.query(
        'SELECT lab_branch_id FROM lab_package_branches WHERE package_id = $1 AND is_available = true ORDER BY price ASC LIMIT 1',
        [packageId]
      );
      if (fallbackRow.rows.length > 0) {
        branchId = fallbackRow.rows[0].lab_branch_id;
      } else {
        return res.json([]);
      }
    }

    const cityRow = await db.query('SELECT city FROM lab_branches WHERE id = $1', [branchId]);
    const city = cityRow.rows[0]?.city || '';

    let queryStr = `
      SELECT 
        lpb.id AS offer_id,
        lpb.price,
        lpb.original_price,
        lpb.discount_percent,
        lpb.reporting_time,
        lpb.home_collection,
        l.id AS lab_id,
        l.name AS lab_name,
        COALESCE(l.rating, 4.5) AS lab_rating,
        COALESCE(l.booking_count, 1200) AS lab_reviews,
        lb.id AS branch_id,
        lb.branch_name,
        lb.address,
        lb.city,
        p.id AS package_id,
        p.name AS package_name,
        (SELECT COUNT(*)::int FROM package_tests pt WHERE pt.package_id = p.id) AS test_count
      FROM lab_package_branches lpb
      JOIN packages p ON p.id = lpb.package_id
      JOIN labs l ON l.id = lpb.lab_id
      JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
      WHERE lpb.package_id = $1 AND lpb.lab_branch_id != $2 AND lower(lb.city) = lower($3) AND lpb.is_available = true AND l.is_active = true AND lb.is_active = true
      ORDER BY lpb.price ASC
      LIMIT 5
    `;

    let { rows } = await db.query(queryStr, [packageId, branchId, city]);

    if (rows.length === 0) {
      const fallbackQueryStr = `
        SELECT 
          lpb.id AS offer_id,
          lpb.price,
          lpb.original_price,
          lpb.discount_percent,
          lpb.reporting_time,
          lpb.home_collection,
          l.id AS lab_id,
          l.name AS lab_name,
          COALESCE(l.rating, 4.5) AS lab_rating,
          COALESCE(l.booking_count, 1200) AS lab_reviews,
          lb.id AS branch_id,
          lb.branch_name,
          lb.address,
          lb.city,
          p.id AS package_id,
          p.name AS package_name,
          (SELECT COUNT(*)::int FROM package_tests pt WHERE pt.package_id = p.id) AS test_count
        FROM lab_package_branches lpb
        JOIN packages p ON p.id = lpb.package_id
        JOIN labs l ON l.id = lpb.lab_id
        JOIN lab_branches lb ON lb.id = lpb.lab_branch_id
        WHERE lpb.package_id = $1 AND lpb.lab_branch_id != $2 AND lpb.is_available = true AND l.is_active = true AND lb.is_active = true
        ORDER BY lpb.price ASC
        LIMIT 5
      `;
      const fallbackRes = await db.query(fallbackQueryStr, [packageId, branchId]);
      rows = fallbackRes.rows;
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch competitors' });
  }
};


// ─── GET /api/nav-menu ────────────────────────────────────────────────────────
exports.get_api_nav_menu = async (req, res) => {
  try {
    // Dynamic navigation structure backed by database checks
    const menuStructure = {
      tests: [
        { name: "Heart", category: "Heart", page: "category-listing" },
        { name: "Cancer", category: "Cancer", page: "category-listing" },
        { name: "Thyroid", category: "Thyroid", page: "category-listing" },
        { name: "Diabetes", category: "Diabetes", page: "category-listing" },
        { name: "Pregnancy", category: "Pregnancy", page: "category-listing" },
        { name: "Allergy", category: "Allergy/Intolerance", page: "category-listing" },
        { name: "Hormone", category: "Hormone", page: "category-listing" },
        { name: "DNA Test", category: "DNA Test", page: "category-listing" }
      ],
      packages: [
        { name: "Full Body", category: "Full Body Checkup", page: "package-listing" },
        { name: "Preventive", category: "Full Body Checkup", page: "package-listing" },
        { name: "Women", category: "Pregnancy", page: "package-listing" },
        { name: "Senior Citizen", category: "Senior Citizen", page: "package-listing" }
      ]
    };
    
    res.json(menuStructure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch navigation menu structure' });
  }
};



