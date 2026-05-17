const db = require('../config/db');
const { DELHI_COORDS } = require('../utils/helpers');

async function setupDatabase() {
  try {
    // Users Table (With role for CMS)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tests Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        lab VARCHAR(100),
        loc VARCHAR(100),
        latitude DECIMAL(10, 7),
        longitude DECIMAL(10, 7),
        description TEXT,
        rep VARCHAR(50),
        price INTEGER,
        cat VARCHAR(50),
        ok BOOLEAN DEFAULT true
      );
    `);

    // Labs Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS labs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(30),
        email VARCHAR(150),
        website VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Lab Branches Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_branches (
        id SERIAL PRIMARY KEY,
        lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE,
        branch_name VARCHAR(150),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        postal_code VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(30),
        operating_hours VARCHAR(150),
        home_collection BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (lab_id, branch_name, city)
      );
    `);

    // Branch-specific test availability and pricing
    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_test_branches (
        id SERIAL PRIMARY KEY,
        lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE,
        lab_branch_id INTEGER REFERENCES lab_branches(id) ON DELETE CASCADE,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        price INTEGER,
        reporting_time VARCHAR(50),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (lab_branch_id, test_id)
      );
    `);

    // Bookings Table (Your CMS will read this!)
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        test_id INTEGER REFERENCES tests(id),
        patient_name VARCHAR(100),
        patient_phone VARCHAR(20),
        booking_date DATE,
        time_slot VARCHAR(50),
        lab_branch_id INTEGER REFERENCES lab_branches(id),
        user_latitude DECIMAL(10, 7),
        user_longitude DECIMAL(10, 7),
        user_location VARCHAR(255),
        notes TEXT,
        status VARCHAR(20) DEFAULT 'pending'
      );
    `);

    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS description TEXT`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lab_branch_id INTEGER REFERENCES lab_branches(id)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_latitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_longitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_location VARCHAR(255)`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tests_coordinates ON tests (latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tests_name_coordinates ON tests (name, latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_branches_city ON lab_branches (lower(city))`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_branches_coordinates ON lab_branches (latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_test_branches_test ON lab_test_branches (test_id)`);

    // Reports Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        booking_id INTEGER REFERENCES bookings(id),
        report_url VARCHAR(255),
        result_summary TEXT,
        date_generated DATE
      );
    `);

    // Modular Package Architecture Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS package_tests (
        id SERIAL PRIMARY KEY,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        UNIQUE(package_id, test_id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_package_branches (
        id SERIAL PRIMARY KEY,
        lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE,
        lab_branch_id INTEGER REFERENCES lab_branches(id) ON DELETE CASCADE,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        price INTEGER,
        reporting_time VARCHAR(50),
        home_collection BOOLEAN DEFAULT true,
        discount_label VARCHAR(100),
        notes TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (lab_branch_id, package_id)
      );
    `);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_packages_name ON packages (name)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_package_branches_package ON lab_package_branches (package_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_package_branches_price ON lab_package_branches (price)`);

    // Seeding logic is guarded by the SEED_DEMO_DATA environment variable.
    // By default, it will not auto-delete or auto-seed so you can work with actual real data.
    const shouldSeed = process.env.SEED_DEMO_DATA === 'true';
    if (shouldSeed) {
      console.log("SEED_DEMO_DATA is true. Adding rich Delhi sample tests...");
      await db.query(`
        INSERT INTO tests (name, lab, loc, rep, price, cat, ok) VALUES
        ('LFT (Liver Function Test)', 'Dr. Lal PathLabs', 'Rohini, Delhi', '6 HR', 350, 'blood', true),
        ('LFT (Liver Function Test)', 'SRL Diagnostics', 'Pitampura, Delhi', '4 HR', 299, 'blood', true),
        ('LFT (Liver Function Test)', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', '2 HR', 199, 'blood', true),
        ('LFT (Liver Function Test)', 'Healthians', 'Saket, Delhi', '6 HR', 250, 'blood', true),
        ('LFT (Liver Function Test)', 'Redcliffe Labs', 'Dwarka, Delhi', '8 HR', 200, 'blood', true),

        ('KFT (Kidney Function Test)', 'Apollo Diagnostics', 'Dwarka, Delhi', '8 HR', 450, 'blood', true),
        ('KFT (Kidney Function Test)', 'Max Lab', 'Saket, Delhi', '6 HR', 500, 'blood', true),
        ('KFT (Kidney Function Test)', 'City X-Ray & Scan', 'Tilak Nagar, Delhi', '3 HR', 250, 'blood', true),
        ('KFT (Kidney Function Test)', 'Thyrocare', 'Janakpuri, Delhi', '12 HR', 220, 'blood', true),
        ('KFT (Kidney Function Test)', 'Dr. Dang Lab', 'SDA, Delhi', '6 HR', 550, 'blood', true),

        ('CBC (Complete Blood Count)', 'Dr. Lal PathLabs', 'Vasant Kunj, Delhi', '4 HR', 300, 'blood', true),
        ('CBC (Complete Blood Count)', 'Saral Advanced', 'Pitampura, Delhi', '2 HR', 200, 'blood', true),
        ('CBC (Complete Blood Count)', 'Dr. Dang Lab', 'SDA, Delhi', '6 HR', 450, 'blood', false),
        ('CBC (Complete Blood Count)', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', '4 HR', 250, 'blood', true),
        ('CBC (Complete Blood Count)', 'Prognosis Laboratories', 'Dwarka, Delhi', '8 HR', 280, 'blood', true),

        ('Thyroid Profile (T3, T4, TSH)', 'Dr. Lal PathLabs', 'Rohini, Delhi', '12 HR', 550, 'blood', true),
        ('Thyroid Profile (T3, T4, TSH)', 'Pathkind Labs', 'Janakpuri, Delhi', '8 HR', 400, 'blood', true),
        ('Thyroid Profile (T3, T4, TSH)', 'Healthians', 'Vasant Kunj, Delhi', '6 HR', 350, 'blood', true),
        ('Thyroid Profile (T3, T4, TSH)', 'Bhasin Medicare', 'Greater Kailash, Delhi', '12 HR', 450, 'blood', true),

        ('HbA1c (Glycosylated Hemoglobin)', 'SRL Diagnostics', 'Pitampura, Delhi', '6 HR', 450, 'blood', true),
        ('HbA1c (Glycosylated Hemoglobin)', 'Thyrocare', 'Okhla, Delhi', '8 HR', 300, 'blood', true),
        ('HbA1c (Glycosylated Hemoglobin)', 'Dr. Dang Lab', 'SDA, Delhi', '6 HR', 600, 'blood', true),

        ('Vitamin D (25-OH)', 'Dr. Lal PathLabs', 'Rohini, Delhi', '12 HR', 1200, 'blood', true),
        ('Vitamin D (25-OH)', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', '8 HR', 900, 'blood', true),
        ('Vitamin D (25-OH)', 'Redcliffe Labs', 'Dwarka, Delhi', '24 HR', 699, 'blood', true),

        ('Ultrasound Abdomen', 'Mahajan Imaging', 'South Extension, Delhi', '2 HR', 1200, 'scanning', true),
        ('Ultrasound Abdomen', 'City X-Ray & Scan', 'Vikas Puri, Delhi', '1 HR', 900, 'scanning', true),
        ('Ultrasound Abdomen', 'Ganesh Diagnostic', 'Rohini, Delhi', '1 HR', 750, 'scanning', true),
        ('Ultrasound Abdomen', 'Star Imaging', 'Tilak Nagar, Delhi', '2 HR', 800, 'scanning', true),
        ('Ultrasound Abdomen', 'Focus Imaging', 'Green Park, Delhi', '1 HR', 1100, 'scanning', true),

        ('X-Ray Chest PA View', 'City X-Ray & Scan', 'Tilak Nagar, Delhi', '1 HR', 350, 'scanning', true),
        ('X-Ray Chest PA View', 'Saral Advanced', 'Pitampura, Delhi', '2 HR', 400, 'scanning', true),
        ('X-Ray Chest PA View', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', '1 HR', 300, 'scanning', true),
        ('X-Ray Chest PA View', 'Modern Diagnostic', 'Laxmi Nagar, Delhi', '2 HR', 350, 'scanning', true),

        ('MRI Brain', 'Mahajan Imaging', 'Defence Colony, Delhi', '4 HR', 6500, 'scanning', true),
        ('MRI Brain', 'Dr. Lal PathLabs', 'Preet Vihar, Delhi', '6 HR', 5500, 'scanning', true),
        ('MRI Brain', 'Metro Diagnostics', 'Punjabi Bagh, Delhi', '4 HR', 5000, 'scanning', true),
        ('MRI Brain', 'Focus Imaging', 'Green Park, Delhi', '6 HR', 6000, 'scanning', true),

        ('CT Scan Chest', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', '4 HR', 3500, 'scanning', true),
        ('CT Scan Chest', 'Ganesh Diagnostic', 'Rohini, Delhi', '2 HR', 3200, 'scanning', true),
        ('CT Scan Chest', 'Star Imaging', 'Tilak Nagar, Delhi', '4 HR', 3400, 'scanning', true),

        ('Full Body Health Checkup (64 Tests)', 'Apollo Diagnostics', 'Dwarka, Delhi', '24 HR', 1499, 'package', true),
        ('Full Body Health Checkup (64 Tests)', 'SRL Diagnostics', 'Connaught Place, Delhi', '24 HR', 1299, 'package', true),
        ('Full Body Health Checkup (64 Tests)', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', '12 HR', 899, 'package', true),
        ('Full Body Health Checkup (64 Tests)', 'Healthians', 'Vasant Kunj, Delhi', '12 HR', 1099, 'package', true),
        ('Full Body Health Checkup (64 Tests)', 'Redcliffe Labs', 'Okhla, Delhi', '24 HR', 999, 'package', true),

        ('Senior Citizen Package', 'Dr. Lal PathLabs', 'Rohini, Delhi', '24 HR', 2500, 'package', true),
        ('Senior Citizen Package', 'Max Lab', 'Saket, Delhi', '18 HR', 2200, 'package', true),
        ('Senior Citizen Package', 'Thyrocare', 'Dwarka, Delhi', '24 HR', 1800, 'package', true),
        ('Senior Citizen Package', 'House of Diagnostics (HOD)', 'Karkardooma, Delhi', '18 HR', 1999, 'package', true),
        
        ('Women''s Wellness Package', 'SRL Diagnostics', 'Pitampura, Delhi', '24 HR', 3000, 'package', true),
        ('Women''s Wellness Package', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', '24 HR', 2800, 'package', true),
        ('Women''s Wellness Package', 'Pathkind Labs', 'Janakpuri, Delhi', '24 HR', 2500, 'package', true),

        ('Endoscopy', 'Max Lab', 'Saket, Delhi', '2 HR', 3500, 'gastro', true),
        ('Endoscopy', 'Apollo Diagnostics', 'Sarita Vihar, Delhi', '4 HR', 4000, 'gastro', true),
        ('Endoscopy', 'Fortis Diagnostic', 'Shalimar Bagh, Delhi', '3 HR', 4200, 'gastro', true),
        
        ('Colonoscopy', 'Ganesh Diagnostic', 'Laxmi Nagar, Delhi', '3 HR', 4500, 'gastro', true),
        ('Colonoscopy', 'Max Lab', 'Patparganj, Delhi', '2 HR', 5000, 'gastro', false),
        ('Colonoscopy', 'Metro Diagnostics', 'Punjabi Bagh, Delhi', '4 HR', 4800, 'gastro', true)
      `);

      // Real medical tests for pagination
      const realTests = [
        "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Complete Blood Count", "Thyroid Profile",
        "HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Vitamin D", "Vitamin B12",
        "Calcium", "Iron Profile", "Uric Acid", "Cholesterol Total", "Triglycerides",
        "Widal Test", "Dengue NS1 Antigen", "Malaria Parasite", "Typhoid IgG/IgM", "CRP (C-Reactive Protein)",
        "ESR (Erythrocyte Sedimentation Rate)", "Serum Creatinine", "Blood Urea Nitrogen", "Serum Electrolytes",
        "Hb Electrophoresis", "PSA (Prostate Specific Antigen)", "Testosterone", "Prolactin", "FSH", "LH"
      ];
      
      const realLabs = [
        "Dr. Lal PathLabs", "SRL Diagnostics", "Ganesh Diagnostic", "Max Lab", "Apollo Diagnostics",
        "City X-Ray & Scan", "Thyrocare", "Dr. Dang Lab", "Pathkind Labs", "Healthians",
        "Redcliffe Labs", "House of Diagnostics (HOD)", "Prognosis Laboratories", "Bhasin Medicare",
        "Saral Advanced", "Star Imaging", "Focus Imaging", "Metro Diagnostics", "Modern Diagnostic",
        "Mahajan Imaging"
      ];

      const locations = ["Rohini, Delhi", "Pitampura, Delhi", "Dwarka, Delhi", "Saket, Delhi", "Vasant Kunj, Delhi", "Janakpuri, Delhi", "Laxmi Nagar, Delhi", "Connaught Place, Delhi"];
      
      console.log("Generating unique realistic combinations...");
      let authenticData = [];
      
      // Generate 60 unique tests by picking random combinations
      for (let i = 0; i < 60; i++) {
        const testName = realTests[i % realTests.length];
        const labName = realLabs[(i * 3) % realLabs.length];
        const loc = locations[i % locations.length];
        const price = 200 + ((i * 37) % 800);
        
        // Skip inserting if it overlaps completely with our manual inserts
        if (!testName.includes("LFT") && !testName.includes("CBC")) {
          authenticData.push(`('${testName}', '${labName}', '${loc}', '12 HR', ${price}, 'blood', true)`);
        }
      }
      
      // Generate 30 different labs for 'HbA1c (Glycosylated Hemoglobin)' to test lab pagination
      for (let i = 0; i < 30; i++) {
        const labName = realLabs[i % realLabs.length] + (i >= realLabs.length ? ` Branch ${i}` : "");
        const loc = locations[i % locations.length];
        const price = 300 + (i * 15);
        authenticData.push(`('HbA1c (Glycosylated Hemoglobin)', '${labName}', '${loc}', '8 HR', ${price}, 'blood', true)`);
      }

      await db.query(`INSERT INTO tests (name, lab, loc, rep, price, cat, ok) VALUES ` + authenticData.join(', '));
      for (const [loc, [latitude, longitude]] of Object.entries(DELHI_COORDS)) {
        await db.query(
          `UPDATE tests SET latitude = $1, longitude = $2 WHERE loc = $3`,
          [latitude, longitude, loc]
        );
      }

      // Add generic descriptions for tests that don't have one
      await db.query(`
        UPDATE tests 
        SET description = CASE 
          WHEN name LIKE '%LFT%' THEN 'Comprehensive evaluation of liver enzymes, proteins, and bilirubin levels.'
          WHEN name LIKE '%KFT%' THEN 'Assessment of kidney function through creatinine, urea, and electrolyte levels.'
          WHEN name LIKE '%CBC%' THEN 'Detailed count of red blood cells, white blood cells, and platelets.'
          WHEN name LIKE '%Thyroid%' THEN 'Measurement of T3, T4, and TSH levels to evaluate thyroid health.'
          WHEN name LIKE '%HbA1c%' THEN 'Measures average blood sugar levels over the past 2-3 months.'
          WHEN name LIKE '%MRI%' THEN 'High-resolution diagnostic imaging using magnetic resonance.'
          WHEN name LIKE '%Ultrasound%' THEN 'Diagnostic imaging using high-frequency sound waves.'
          WHEN name LIKE '%Health Checkup%' THEN 'Comprehensive screening for various vital health parameters.'
          WHEN name LIKE '%Lipid%' THEN 'Measures cholesterol and triglyceride levels to assess heart health.'
          WHEN name LIKE '%Vitamin D%' THEN 'Checks for deficiency of Vitamin D to ensure bone health.'
          ELSE 'Diagnostic laboratory test for medical evaluation.'
        END
        WHERE description IS NULL OR description = ''
      `);

      await db.query(`
        INSERT INTO labs (name, phone, email, website, is_active, is_verified)
        SELECT DISTINCT
          lab,
          '011-' || lpad(((abs(hashtext(lab)) % 9000) + 1000)::text, 4, '0') || '-' ||
            lpad(((abs(hashtext(lab || 'phone')) % 9000) + 1000)::text, 4, '0'),
          lower(regexp_replace(lab, '[^a-zA-Z0-9]+', '', 'g')) || '@pathlab.example',
          'https://example.com/' || lower(regexp_replace(lab, '[^a-zA-Z0-9]+', '-', 'g')),
          true,
          true
        FROM tests
        ON CONFLICT (name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      `);

      await db.query(`
        INSERT INTO lab_branches (
          lab_id, branch_name, address, city, state, postal_code, latitude,
          longitude, phone, operating_hours, home_collection, is_active
        )
        SELECT DISTINCT ON (l.id, t.loc)
          l.id,
          split_part(t.loc, ',', 1),
          split_part(t.loc, ',', 1) || ' Branch, ' || t.loc,
          trim(split_part(t.loc, ',', 2)),
          'Delhi',
          '110001',
          t.latitude,
          t.longitude,
          l.phone,
          '9 AM - 6 PM, Mon-Sat',
          true,
          true
        FROM tests t
        JOIN labs l ON l.name = t.lab
        WHERE t.latitude IS NOT NULL AND t.longitude IS NOT NULL
        ON CONFLICT (lab_id, branch_name, city) DO NOTHING
      `);

      await db.query(`
        INSERT INTO lab_test_branches (
          lab_id, lab_branch_id, test_id, price, reporting_time, is_available
        )
        SELECT
          l.id,
          lb.id,
          t.id,
          t.price,
          t.rep,
          t.ok
        FROM tests t
        JOIN labs l ON l.name = t.lab
        JOIN lab_branches lb
          ON lb.lab_id = l.id
          AND lb.branch_name = split_part(t.loc, ',', 1)
          AND lb.city = trim(split_part(t.loc, ',', 2))
        ON CONFLICT (lab_branch_id, test_id) DO UPDATE SET
          price = EXCLUDED.price,
          reporting_time = EXCLUDED.reporting_time,
          is_available = EXCLUDED.is_available
      `);

    }

    // Always ensure the demo user and admin user exist for authentication and CMS access
    await db.query(`INSERT INTO users (name, email, phone, password) VALUES ('Demo User', 'test@test.com', '9876543210', 'test') ON CONFLICT DO NOTHING`);
    await db.query(`INSERT INTO users (name, email, phone, password, role) VALUES ('System Admin', 'admin@pathlab.com', '0000000000', 'admin123', 'admin') ON CONFLICT DO NOTHING`);

    // --- MIGRATION: Old Duplicated Packages to New Modular Structure ---
      console.log("Migrating legacy package data to modular architecture...");
      
      // 1. Migrate Unique Packages
      await db.query(`
        INSERT INTO packages (name, category, description)
        SELECT DISTINCT name, cat, description
        FROM tests
        WHERE cat = 'package'
        ON CONFLICT (name) DO UPDATE SET 
          category = EXCLUDED.category,
          description = EXCLUDED.description
      `);

      // 2. Migrate Lab-Package Mappings
      await db.query(`
        INSERT INTO lab_package_branches (
          lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes
        )
        SELECT 
          lb.lab_id,
          lb.id AS lab_branch_id,
          p.id AS package_id,
          ltb.price,
          ltb.reporting_time,
          true AS home_collection,
          (CASE WHEN ltb.price > 2000 THEN '15% OFF' ELSE 'Limited Offer' END) AS discount_label,
          'Standard package offered by ' || l.name AS notes
        FROM lab_test_branches ltb
        JOIN tests t ON t.id = ltb.test_id
        JOIN packages p ON p.name = t.name
        JOIN labs l ON l.id = ltb.lab_id
        JOIN lab_branches lb ON lb.id = ltb.lab_branch_id
        WHERE t.cat = 'package'
        ON CONFLICT (lab_branch_id, package_id) DO UPDATE SET
          price = EXCLUDED.price,
          reporting_time = EXCLUDED.reporting_time
      `);

      // 3. Populate Package-Test Mappings (Common tests for all packages for demo)
      const commonPackageTests = [
        'Complete Blood Count', 'Lipid Profile', 'Thyroid Profile', 
        'Liver Function Test', 'Kidney Function Test', 'HbA1c'
      ];
      
      for (const pName of ['Full Body Health Checkup (64 Tests)', 'Senior Citizen Package', "Women's Wellness Package"]) {
        const pkgRes = await db.query('SELECT id FROM packages WHERE name = $1', [pName]);
        if (pkgRes.rows.length > 0) {
          const pkgId = pkgRes.rows[0].id;
          for (const tName of commonPackageTests) {
            const testRes = await db.query('SELECT id FROM tests WHERE name LIKE $1 LIMIT 1', [`%${tName}%`]);
            if (testRes.rows.length > 0) {
              await db.query('INSERT INTO package_tests (package_id, test_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [pkgId, testRes.rows[0].id]);
            }
          }
        }
      }

    console.log("✅ PostgreSQL Database is ready!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
  }
}

module.exports = setupDatabase;
