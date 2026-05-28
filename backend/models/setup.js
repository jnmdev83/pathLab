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
    
    // Add premium package-specific columns
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS samples_required VARCHAR(150)`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS preparations TEXT`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS why_booked JSONB`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS what_it_measures JSONB`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS test_includes TEXT[]`);

    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lab_branch_id INTEGER REFERENCES lab_branches(id)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_latitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_longitude DECIMAL(10, 7)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_location VARCHAR(255)`);
    await db.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_id INTEGER REFERENCES packages(id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings (package_id)`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tests_coordinates ON tests (latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tests_name_coordinates ON tests (name, latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_branches_city ON lab_branches (lower(city))`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_branches_coordinates ON lab_branches (latitude, longitude)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_test_branches_test ON lab_test_branches (test_id)`);

    // Search results page columns
    await db.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.0`);
    await db.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE lab_test_branches ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE lab_test_branches ADD COLUMN IF NOT EXISTS original_price INTEGER`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS short_description VARCHAR(300)`);

    // Seed realistic and beautiful short descriptions for tests if null
    await db.query(`
      UPDATE tests
      SET short_description = CASE
        WHEN lower(name) LIKE '%cbc%' OR lower(name) LIKE '%complete blood%' THEN 'Comprehensive blood test evaluating red/white cells, hemoglobin, and platelets to screen for anemia and infection.'
        WHEN lower(name) LIKE '%lipid%' OR lower(name) LIKE '%cholesterol%' THEN 'Key lipid panel measuring HDL, LDL, and triglycerides to evaluate cardiovascular risk.'
        WHEN lower(name) LIKE '%thyroid%' OR lower(name) LIKE '%tsh%' THEN 'Hormone profile assessing T3, T4, and TSH to evaluate thyroid gland activity and metabolic function.'
        WHEN lower(name) LIKE '%liver%' OR lower(name) LIKE '%lft%' THEN 'Screening panel checking liver enzymes, bilirubin, and proteins to detect hepatic dysfunction.'
        WHEN lower(name) LIKE '%kidney%' OR lower(name) LIKE '%kft%' THEN 'Kidney function panel assessing creatinine, BUN, and electrolytes to evaluate renal health.'
        WHEN lower(name) LIKE '%hba1c%' OR lower(name) LIKE '%diabetes%' THEN 'Glycosylated hemoglobin test measuring average blood glucose levels over the past 3 months.'
        WHEN lower(name) LIKE '%vitamin d%' THEN 'Vital screening measuring vitamin D levels for bone health, immune support, and calcium absorption.'
        WHEN lower(name) LIKE '%ultrasound%' OR lower(name) LIKE '%scan%' THEN 'High-resolution imaging diagnostic to examine internal organs, tissues, and blood vessels.'
        ELSE 'Premium diagnostic pathology profile analyzing key clinical bio-markers.'
      END
      WHERE short_description IS NULL OR short_description = ''
    `);

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

    // Category Previews Table for Navigation Mega-Menu (Relational Mapping)
    await db.query(`DROP TABLE IF EXISTS category_previews CASCADE`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS category_previews (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL,
        test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
        package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
        is_pkg BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        CONSTRAINT chk_test_or_package CHECK (
          (test_id IS NOT NULL AND package_id IS NULL AND is_pkg = false) OR
          (test_id IS NULL AND package_id IS NOT NULL AND is_pkg = true)
        )
      );
    `);

    // Alter packages and tests table to add premium clinical columns
    await db.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS samples_required VARCHAR(150)`);
    await db.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS preparations TEXT`);
    await db.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS why_booked JSONB`);
    await db.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS what_it_measures JSONB`);
    await db.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS faq JSONB`);

    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS samples_required VARCHAR(150)`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS preparations TEXT`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS why_booked JSONB`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS what_it_measures JSONB`);
    await db.query(`ALTER TABLE tests ADD COLUMN IF NOT EXISTS faq JSONB`);

    // ─── Search Results Enhancement Columns (IF NOT EXISTS — safe on existing DB) ──
    await db.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.0`);
    await db.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE lab_test_branches ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE lab_test_branches ADD COLUMN IF NOT EXISTS original_price INTEGER`);
    await db.query(`ALTER TABLE lab_package_branches ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0`);
    await db.query(`ALTER TABLE lab_package_branches ADD COLUMN IF NOT EXISTS original_price INTEGER`);

    // Seed realistic ratings for labs that still have the default value
    await db.query(`
      UPDATE labs
      SET
        rating       = ROUND((3.8 + (id % 12) * 0.1)::numeric, 1),
        booking_count = 50 + ((id * 137) % 4950)
      WHERE rating = 4.0 OR booking_count = 0
    `);

    // Seed some discount data across lab_test_branches for variety (idempotent)
    await db.query(`
      UPDATE lab_test_branches
      SET discount_percent = 15,
          original_price   = CEIL(price / 0.85)
      WHERE id % 4 = 0
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);
    await db.query(`
      UPDATE lab_test_branches
      SET discount_percent = 10,
          original_price   = CEIL(price / 0.90)
      WHERE id % 7 = 3
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);
    await db.query(`
      UPDATE lab_test_branches
      SET discount_percent = 20,
          original_price   = CEIL(price / 0.80)
      WHERE id % 11 = 0
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);

    // Seed some discount data across lab_package_branches for variety (idempotent)
    await db.query(`
      UPDATE lab_package_branches
      SET discount_percent = 15,
          original_price   = CEIL(price / 0.85)
      WHERE id % 4 = 0
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);
    await db.query(`
      UPDATE lab_package_branches
      SET discount_percent = 10,
          original_price   = CEIL(price / 0.90)
      WHERE id % 7 = 3
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);
    await db.query(`
      UPDATE lab_package_branches
      SET discount_percent = 20,
          original_price   = CEIL(price / 0.80)
      WHERE id % 11 = 0
        AND discount_percent = 0
        AND original_price IS NULL
        AND price IS NOT NULL
    `);

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
          lower(regexp_replace(lab, '[^a-zA-Z0-9]+', '', 'g')) || '@choosemylab.example',
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
    await db.query(`INSERT INTO users (name, email, phone, password, role) VALUES ('System Admin', 'admin@choosemylab.com', '0000000000', 'admin123', 'admin') ON CONFLICT DO NOTHING`);

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

      // 4. Hydrate package premium clinical metadata columns in packages table
      await db.query(`
        UPDATE packages
        SET 
          samples_required = 'Blood & Urine Specimen',
          preparations = 'Requires 10-12 hours of strict overnight fasting. Water is permitted.',
          why_booked = '[
            {"title": "Full System Screening", "body": "Checks 64 critical markers across heart, liver, kidneys, blood, and thyroid systems to establish a baseline health score."},
            {"title": "Early Detection of Silent Killers", "body": "Screens for pre-diabetes, high cholesterol, liver fatty changes, and chronic inflammation before any physical symptoms manifest."},
            {"title": "Preventative Lifestyle Auditing", "body": "Provides concrete biochemical feedback on your sleep, diet, stress, and exercise impacts to help customize your wellness roadmap."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Cardiovascular Health", "desc": "Evaluates lipid profiles, LDL/HDL ratio, and triglycerides for coronary risk tracking.", "strength": "95%"},
            {"name": "Hepatic Metabolic Output", "desc": "LFT checks enzymes like SGOT/SGPT, albumin, and total bilirubin.", "strength": "100%"},
            {"name": "Renal Filtration Rate", "desc": "KFT measures creatinine, blood urea nitrogen, and waste clearance.", "strength": "90%"},
            {"name": "Thyroid Speed (TSH)", "desc": "TSH checks metabolic activation levels for hypothyroidism tracking.", "strength": "100%"},
            {"name": "Hematological Vitality", "desc": "CBC counts red/white cells, hemoglobin level, and platelet values.", "strength": "100%"},
            {"name": "Glycemic Control Index", "desc": "Fasting blood sugar tracks average insulin regularities and glucose levels.", "strength": "95%"}
          ]'::jsonb
        WHERE name LIKE '%Full Body%' OR name LIKE '%Checkup%'
      `);

      await db.query(`
        UPDATE packages
        SET 
          samples_required = 'Blood & Urine Specimen',
          preparations = 'Overnight fasting required for 10 to 12 hours. Do not consume alcohol 24 hours prior.',
          why_booked = '[
            {"title": "Geriatric Health Baseline", "body": "Custom-designed for adults aged 60+ to evaluate systemic metabolic slowing and age-associated chronic conditions."},
            {"title": "Cardio-Vascular & Bone Checks", "body": "Tracks artery clogging cholesterol ratios alongside bone mineral calcium retention to monitor stroke and fracture risks."},
            {"title": "Dehydration & Kidney Auditing", "body": "Checks renal clearance and electrolyte balances, which frequently fluctuate in older adults and impact cognitive function."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Bone Density & Calcium", "desc": "Measures serum calcium levels to track osteoporosis risk and joint health.", "strength": "95%"},
            {"name": "Kidney Health & Clearance", "desc": "BUN, Creatinine, and Urea checks to track hydration and kidney age.", "strength": "100%"},
            {"name": "Heart & Artery Integrity", "desc": "Lipid screening to evaluate stroke and cardiovascular artery blocks.", "strength": "90%"},
            {"name": "Blood Composition", "desc": "CBC screens for geriatric anemia, chronic inflammation, and immune strength.", "strength": "100%"},
            {"name": "Liver Waste Filtering", "desc": "LFT screening to track liver enzyme health and toxic chemical filtering.", "strength": "95%"},
            {"name": "Diabetes & Sugar Control", "desc": "HbA1c & Fasting glucose tracks average long-term insulin efficiency.", "strength": "100%"}
          ]'::jsonb
        WHERE name LIKE '%Senior Citizen%'
      `);

      await db.query(`
        UPDATE packages
        SET 
          samples_required = 'Blood & Urine Specimen',
          preparations = 'Requires overnight fasting for 8 to 10 hours. Best scheduled 5-10 days after menstrual cycle.',
          why_booked = '[
            {"title": "Hormonal & Thyroid Balance", "body": "Tracks TSH, bone density minerals, and blood counts to screen for thyroid disorders and hormonal imbalances common in women."},
            {"title": "Anemia & Iron Store Screening", "body": "Evaluates hemoglobin, ferritin, and iron indexes to detect hidden chronic anemia or heavy-cycle iron loss."},
            {"title": "Immunity & Metabolic Health", "body": "Measures kidney and liver filtration capacity alongside lipid indexes to screen for metabolic syndrome risk."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Anemia & Iron Levels", "desc": "Hemoglobin and iron profiles to diagnose fatigue and blood health.", "strength": "100%"},
            {"name": "Thyroid Stimulation", "desc": "Measures TSH to monitor weight changes, energy, and hormonal speed.", "strength": "95%"},
            {"name": "Heart Risk (Lipids)", "desc": "Cholesterol, triglycerides, and HDL/LDL ratio screening.", "strength": "90%"},
            {"name": "Bone Mineral Retention", "desc": "Tracks calcium levels to screen for osteopenia and bone thinning.", "strength": "100%"},
            {"name": "Kidney Filtration", "desc": "KFT screens for uric acid, hydration levels, and waste filtration.", "strength": "95%"},
            {"name": "Liver Performance", "desc": "LFT checks enzymes and proteins to monitor detox capacity.", "strength": "95%"}
          ]'::jsonb
        WHERE name LIKE '%Women%'
      `);

      // Fill fallback general values for other packages just in case
      await db.query(`
        UPDATE packages
        SET 
          samples_required = COALESCE(samples_required, 'Blood & Urine Specimen'),
          preparations = COALESCE(preparations, 'Overnight fasting required for 8 to 12 hours'),
          why_booked = COALESCE(why_booked, '[
            {"title": "Early Disease Screening", "body": "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur."},
            {"title": "Comprehensive Organ Tracking", "body": "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to ensure optimal systemic metabolism."},
            {"title": "Active Health Auditing", "body": "Provides a benchmark assessment of your current health status to review life safety, lifestyle, and dietary patterns."}
          ]'::jsonb),
          what_it_measures = COALESCE(what_it_measures, '[
            {"name": "Blood Health (CBC & ESR)", "desc": "Checks for anemia, infections, and basic immunity markers.", "strength": "100%"},
            {"name": "Liver health (LFT)", "desc": "Assesses enzymes, protein metabolism, and waste filtration.", "strength": "95%"},
            {"name": "Kidney Function (KFT)", "desc": "Checks filtration efficiency, uric acid, and urea levels.", "strength": "90%"},
            {"name": "Heart Risk (Lipid Profile)", "desc": "Screens cholesterol levels and cardiovascular health.", "strength": "85%"},
            {"name": "Thyroid & Hormone health", "desc": "Measures TSH to evaluate metabolic speeds.", "strength": "80%"},
            {"name": "Diabetes Screening", "desc": "Fasting Blood Sugar checks insulin control.", "strength": "100%"}
          ]'::jsonb)
        WHERE samples_required IS NULL OR preparations IS NULL OR why_booked IS NULL OR what_it_measures IS NULL
      `);

      // Seed FAQs for packages
      await db.query(`
        UPDATE packages
        SET faq = '[
          {"q": "How long does it take to get the package results?", "a": "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection."},
          {"q": "Is fasting mandatory for this package?", "a": "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water."},
          {"q": "Is home collection free for this package?", "a": "Yes, free home sample collection is available for all premium diagnostic packages."}
        ]'::jsonb
        WHERE faq IS NULL
      `);

      // Seeding for specific popular tests
      await db.query(`
        UPDATE tests
        SET
          samples_required = 'Blood Specimen',
          preparations = 'Requires 10-12 hours of overnight fasting. Only plain water is permitted. Avoid alcohol and fatty food for 24 hours prior.',
          why_booked = '[
            {"title": "Cardiovascular Risk Audit", "body": "Checks total cholesterol, HDL, LDL, and triglycerides to predict plaque buildup and heart disease risk."},
            {"title": "Active Health Tracking", "body": "Essential for monitoring metabolic response to diet, exercise, and lipid-lowering therapies."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Total Cholesterol", "desc": "The overall amount of cholesterol in your blood.", "strength": "100%"},
            {"name": "HDL (Good Cholesterol)", "desc": "Helps remove extra cholesterol from your bloodstream.", "strength": "100%"},
            {"name": "LDL (Bad Cholesterol)", "desc": "Main contributor to plaque buildup and artery clogging.", "strength": "100%"},
            {"name": "Triglycerides", "desc": "Type of fat stored in cells, associated with metabolic syndrome.", "strength": "100%"},
            {"name": "VLDL Cholesterol", "desc": "Carries triglycerides through your blood, highly atherogenic.", "strength": "100%"}
          ]'::jsonb,
          faq = '[
            {"q": "How long does it take to get Lipid Profile results?", "a": "Most labs provide digital reports within 8-12 hours of sample collection."},
            {"q": "Is fasting mandatory for Lipid Profile?", "a": "Yes, a strict 10-12 hour overnight fast is mandatory for accurate LDL and Triglycerides readings. Only plain water is allowed."},
            {"q": "Can I drink tea or coffee before the test?", "a": "No, tea, coffee, milk, or any beverages must be avoided as they can interfere with metabolic markers. Only plain water is allowed."}
          ]'::jsonb
        WHERE name ILIKE '%Lipid%'
      `);

      await db.query(`
        UPDATE tests
        SET
          samples_required = 'Blood Specimen',
          preparations = 'No fasting required. Best collected in the morning before taking thyroid medication.',
          why_booked = '[
            {"title": "Metabolism Clearance Audit", "body": "Screens for overactive (hyperthyroidism) or underactive (hypothyroidism) thyroid gland function."},
            {"title": "Hormonal Balance Check", "body": "Tracks T3, T4, and TSH levels to identify systemic sluggishness, fatigue, or unexplained weight shifts."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "T3 (Triiodothyronine)", "desc": "Active thyroid hormone regulating body temperature and metabolic rate.", "strength": "100%"},
            {"name": "T4 (Thyroxine)", "desc": "Primary thyroid hormone converted by the body into active T3.", "strength": "100%"},
            {"name": "TSH (Thyroid Stimulating Hormone)", "desc": "Pituitary hormone that prompts the thyroid gland to produce T3/T4.", "strength": "100%"}
          ]'::jsonb,
          faq = '[
            {"q": "Should I take my thyroid medicine before the test?", "a": "It is recommended to give your blood sample in the morning before taking your daily thyroid dose, unless advised otherwise by your doctor."},
            {"q": "Is fasting required for a Thyroid test?", "a": "No, fasting is not mandatory for a basic thyroid profile test. You can eat and drink normally."}
          ]'::jsonb
        WHERE name ILIKE '%Thyroid%'
      `);

      await db.query(`
        UPDATE tests
        SET
          samples_required = 'Blood Specimen',
          preparations = 'No fasting required. Can be done at any time of the day.',
          why_booked = '[
            {"title": "3-Month Glycemic Tracking", "body": "Provides a reliable average of blood sugar levels over the past 90 days, unaffected by recent meals."},
            {"title": "Diabetes Diagnosis & Control", "body": "The gold standard for diagnosing pre-diabetes and monitoring diabetic therapy efficacy."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Glycated Hemoglobin (HbA1c)", "desc": "Percentage of hemoglobin bound to glucose, reflecting long-term sugar stores.", "strength": "100%"},
            {"name": "Estimated Average Glucose (eAG)", "desc": "Calculated average blood sugar in mg/dL corresponding to the HbA1c percentage.", "strength": "100%"}
          ]'::jsonb,
          faq = '[
            {"q": "Do I need to fast for an HbA1c test?", "a": "No, fasting is not required for HbA1c. You can have this test at any time, regardless of when you last ate."},
            {"q": "How is HbA1c different from regular blood sugar tests?", "a": "Regular glucose tests show real-time sugar at that exact second. HbA1c shows a 3-month average, which is much more stable and accurate for diagnostic trends."}
          ]'::jsonb
        WHERE name ILIKE '%HbA1c%'
      `);

      await db.query(`
        UPDATE tests
        SET
          samples_required = 'Blood Specimen',
          preparations = 'Requires strict 8-10 hours overnight fasting. No food or drinks except plain water.',
          why_booked = '[
            {"title": "Real-time Insulin Check", "body": "Measures basic circulating glucose levels after fasting to check insulin release efficiency."},
            {"title": "Pre-Diabetes Screening", "body": "Identifies early-stage insulin resistance or elevated glucose before clinical symptoms develop."}
          ]'::jsonb,
          what_it_measures = '[
            {"name": "Fasting Blood Glucose", "desc": "Circulating sugar level in your bloodstream after fasting.", "strength": "100%"}
          ]'::jsonb,
          faq = '[
            {"q": "How long should I fast before the fasting sugar test?", "a": "You must fast for at least 8 to 10 hours overnight. Do not fast for more than 12 hours as it can artificially skew results."},
            {"q": "Can I drink tea or coffee during the fast?", "a": "No. Only plain water is permitted during the fasting hours."}
          ]'::jsonb
        WHERE name ILIKE '%Fasting%'
      `);

      // Fallback for all other tests to ensure they are never static / empty
      await db.query(`
        UPDATE tests
        SET
          samples_required = COALESCE(samples_required, 'Blood Specimen'),
          preparations = COALESCE(preparations, 'No special preparation or fasting is required.'),
          why_booked = COALESCE(why_booked, '[
            {"title": "Clinical Status Evaluation", "body": "Tracks specific bio-markers to provide deep diagnostic visibility into target systems."},
            {"title": "Accredited Health Screening", "body": "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes."}
          ]'::jsonb),
          what_it_measures = COALESCE(what_it_measures, '[
            {"name": "Primary Parameter", "desc": "Direct measurement of target clinical bio-markers in specimen.", "strength": "100%"}
          ]'::jsonb),
          faq = COALESCE(faq, '[
            {"q": "How long do reports take for this test?", "a": "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp."},
            {"q": "Is home collection available for this test?", "a": "Yes, our certified phlebotomists can collect the sample directly from your home or office."}
          ]'::jsonb)
        WHERE samples_required IS NULL OR preparations IS NULL OR why_booked IS NULL OR what_it_measures IS NULL OR faq IS NULL
      `);

    // Seed Category Previews (Relational mapping lookup-and-seed)
    const categoryCount = await db.query('SELECT COUNT(*) FROM category_previews');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      console.log("Seeding category previews relationally...");
      
      const seedItems = [
        // Heart
        { category_name: 'Heart', name: 'Lipid Profile (Cholesterol)', price: 499, description: 'Screens cholesterol levels, HDL, LDL, and cardiovascular risks to identify systemic heart conditions.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Lipid Profile%' },
        { category_name: 'Heart', name: 'Cardiac Risk Panel', price: 1299, description: 'Evaluates biochemical markers and inflammatory risk levels for early warning signs of coronary disease.', rep: '24 Hours', cat: 'blood', is_pkg: false, search_name: '%Cardiac Risk%' },
        { category_name: 'Heart', name: 'ECG (Heart Rhythm)', price: 390, description: 'Records electrical heart signals to detect irregularities, rhythm disorders, or past cardiac muscle stress.', rep: '6 Hours', cat: 'scanning', is_pkg: false, search_name: '%ECG%' },
        { category_name: 'Heart', name: 'Apolipoprotein A1', price: 650, description: 'Measures Apolipoprotein A1 to evaluate anti-atherogenic cardiovascular protection capabilities.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Apolipoprotein A1%' },
        { category_name: 'Heart', name: 'Apolipoprotein B', price: 700, description: 'Evaluates atherogenic particles to audit risk factors for coronary artery blockages.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Apolipoprotein B%' },
        { category_name: 'Heart', name: 'High Sensitivity CRP (hs-CRP)', price: 550, description: 'Highly sensitive C-reactive protein screen assessing baseline arterial inflammation parameters.', rep: '8 Hours', cat: 'blood', is_pkg: false, search_name: '%hs-CRP%' },
        { category_name: 'Heart', name: 'Lipoprotein (a) [Lp(a)]', price: 900, description: 'Measures Lipoprotein (a) levels to evaluate genetically determined coronary risk variables.', rep: '16 Hours', cat: 'blood', is_pkg: false, search_name: '%Lipoprotein (a)%' },
        { category_name: 'Heart', name: 'Homocysteine Cardio', price: 1100, description: 'Assesses blood Homocysteine to screen for early arterial tissue damage and stroke markers.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Homocysteine%' },
        { category_name: 'Heart', name: 'Cardio Myoglobin', price: 1200, description: 'Measures myoglobin levels to audit acute cardiac cellular integrity.', rep: '4 Hours', cat: 'blood', is_pkg: false, search_name: '%Cardio Myoglobin%' },
        { category_name: 'Heart', name: 'Heart CK-MB Isoenzyme', price: 800, description: 'Evaluates CK-MB levels to track enzyme releases specific to cardiovascular systems.', rep: '6 Hours', cat: 'blood', is_pkg: false, search_name: '%CK-MB%' },
        
        // Cancer
        { category_name: 'Cancer', name: 'Tumor Marker - PSA (Prostate Screening)', price: 699, description: 'Measures Prostate Specific Antigen to screen for cellular changes, hypertrophy, or early warning signs.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%PSA%' },
        { category_name: 'Cancer', name: 'Pap Smear (Cervical Health)', price: 950, description: 'Analyzes cervical cells to check for abnormalities, chronic infections, or cellular adjustments.', rep: '48 Hours', cat: 'blood', is_pkg: false, search_name: '%Pap Smear%' },
        { category_name: 'Cancer', name: 'Tumor Marker - CA 125 (Ovarian Marker)', price: 1499, description: 'Tracks protein levels commonly associated with maternal cellular wellness and reproductive system tracking.', rep: '24 Hours', cat: 'blood', is_pkg: false, search_name: '%CA 125%' },
        
        // Thyroid
        { category_name: 'Thyroid', name: 'Thyroid Profile (T3, T4, TSH)', price: 349, description: 'Standard screening test evaluating essential hormone levels to audit metabolism speeds.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Thyroid Profile%' },
        { category_name: 'Thyroid', name: 'TSH (Ultrasensitive)', price: 199, description: 'Measures Thyroid Stimulating Hormone specifically to screen for hyper/hypoactive metabolic states.', rep: '8 Hours', cat: 'blood', is_pkg: false, search_name: '%TSH%' },
        
        // Diabetes
        { category_name: 'Diabetes', name: 'HbA1c (Average Sugar)', price: 349, description: 'Evaluates average blood sugar levels over the past 3 months to monitor insulin control.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%HbA1c%' },
        { category_name: 'Diabetes', name: 'Blood Sugar Fasting', price: 149, description: 'Checks glucose levels in blood after an 8-12 hour fast to screen for pre-diabetes risks.', rep: '6 Hours', cat: 'blood', is_pkg: false, search_name: '%Fasting%' },
        { category_name: 'Diabetes', name: 'Post-Prandial Blood Sugar', price: 149, description: 'Measures glucose levels exactly 2 hours after a meal to track active body sugar clearances.', rep: '6 Hours', cat: 'blood', is_pkg: false, search_name: '%Post-Prandial%' },
        { category_name: 'Diabetes', name: 'Random Blood Sugar (RBS)', price: 99, description: 'Checks glucose values at a random point in time to screen for immediate systemic spikes.', rep: '4 Hours', cat: 'blood', is_pkg: false, search_name: '%Random Blood Sugar%' },
        { category_name: 'Diabetes', name: 'Fructosamine Sugar Index', price: 800, description: 'Tracks glycated proteins to audit intermediate glucose changes over the past 2-3 weeks.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Fructosamine%' },
        { category_name: 'Diabetes', name: 'Urine Microalbumin Screen', price: 450, description: 'Evaluates trace albumin in urine to audit early renal filtration changes due to sugar levels.', rep: '8 Hours', cat: 'blood', is_pkg: false, search_name: '%Microalbumin%' },
        { category_name: 'Diabetes', name: 'Oral Glucose Tolerance (OGTT)', price: 350, description: 'Tracks active glucose clearance speeds after administering a calibrated sugar loading dose.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Oral Glucose%' },
        { category_name: 'Diabetes', name: 'C-Peptide Insulin Release', price: 950, description: 'Measures C-peptide to audit endogenous insulin secretion capability in pancreatic islet cells.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%C-Peptide%' },
        { category_name: 'Diabetes', name: 'Insulin Resistance (HOMA-IR)', price: 1499, description: 'Calculates baseline insulin resistance indices to screen metabolic sensitivities.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%HOMA-IR%' },
        
        // Pregnancy
        { category_name: 'Pregnancy', name: 'Beta HCG (Quantitative)', price: 549, description: 'Measures exact hormone levels to confirm early pregnancy and track gestational timelines.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%HCG%' },
        { category_name: 'Pregnancy', name: 'Dual Marker Screening', price: 2499, description: 'Comprehensive biochemical maternal screen assessing fetal genetic timelines during the first trimester.', rep: '36 Hours', cat: 'blood', is_pkg: false, search_name: '%Dual Marker%' },
        
        // Allergy/Intolerance
        { category_name: 'Allergy/Intolerance', name: 'IgE Total (Allergy)', price: 599, description: 'Checks immunoglobulin E stores to identify hypersensitive triggers or basic environmental allergies.', rep: '24 Hours', cat: 'blood', is_pkg: false, search_name: '%IgE Total%' },
        { category_name: 'Allergy/Intolerance', name: 'Food Intolerance Panel (Primary)', price: 3490, description: 'Comprehensive mapping of bodily responses to various primary dietary antigens and food profiles.', rep: '48 Hours', cat: 'blood', is_pkg: false, search_name: '%Food Intolerance%' },
        
        // Hormone
        { category_name: 'Hormone', name: 'Testosterone (Total)', price: 499, description: 'Measures primary androgen levels to evaluate muscle wellness, vitality, and hormonal pathways.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Testosterone%' },
        { category_name: 'Hormone', name: 'Prolactin Profile', price: 399, description: 'Hormonal check tracking reproductive organ system balance and stress biomarker parameters.', rep: '12 Hours', cat: 'blood', is_pkg: false, search_name: '%Prolactin%' },
        
        // DNA Test
        { category_name: 'DNA Test', name: 'Genetic Wellness Mapping', price: 6999, description: 'Unlocks personalized insights on diet, fitness, and inherent physiological predispositions via DNA.', rep: '7 Days', cat: 'blood', is_pkg: false, search_name: '%Genetic%' },
        { category_name: 'DNA Test', name: 'Carrier Screening (Basic)', price: 12499, description: 'Advanced molecular sequencing to evaluate hereditary genes for clinical planning.', rep: '10 Days', cat: 'blood', is_pkg: false, search_name: '%Carrier%' },
        
        // Full Body Checkup
        { category_name: 'Full Body Checkup', name: 'Full Body Health Checkup (64 Tests)', price: 899, description: 'Includes Liver, Kidney, Lipid, Sugar, and Urine metrics under certified lab setups.', rep: '24 Hours', cat: 'package', is_pkg: true, search_name: '%Health Checkup%' },
        { category_name: 'Full Body Checkup', name: 'Senior Citizen Wellness Panel', price: 1800, description: 'Specifically curated for geriatric health, tracking bones, clearances, and artery conditions.', rep: '24 Hours', cat: 'package', is_pkg: true, search_name: '%Senior%' }
      ];

      for (let i = 0; i < seedItems.length; i++) {
        const item = seedItems[i];
        let testId = null;
        let packageId = null;
        
        if (item.is_pkg) {
          // Lookup package in database
          const pkgRes = await db.query('SELECT id FROM packages WHERE name ILIKE $1', [item.search_name]);
          if (pkgRes.rows.length > 0) {
            packageId = pkgRes.rows[0].id;
          } else {
            // Create a package
            const newPkg = await db.query(
              'INSERT INTO packages (name, description, category) VALUES ($1, $2, $3) RETURNING id',
              [item.name, item.description, item.category_name]
            );
            packageId = newPkg.rows[0].id;
          }
        } else {
          // Lookup test in database
          const testRes = await db.query('SELECT id FROM tests WHERE name ILIKE $1', [item.search_name]);
          if (testRes.rows.length > 0) {
            testId = testRes.rows[0].id;
          } else {
            // Create a test
            const newTest = await db.query(
              'INSERT INTO tests (name, description, price, rep, cat) VALUES ($1, $2, $3, $4, $5) RETURNING id',
              [item.name, item.description, item.price, item.rep, item.cat]
            );
            testId = newTest.rows[0].id;
          }
        }
        
        // Insert into category_previews
        await db.query(
          'INSERT INTO category_previews (category_name, test_id, package_id, is_pkg, display_order) VALUES ($1, $2, $3, $4, $5)',
          [item.category_name, testId, packageId, item.is_pkg, i]
        );
      }
      // Ensure EVERY test mapped in category_previews has active mappings in lab_test_branches
      await db.query(`
        INSERT INTO lab_test_branches (lab_id, lab_branch_id, test_id, price, reporting_time, is_available)
        SELECT 
          lb.lab_id,
          lb.id AS lab_branch_id,
          cp.test_id,
          COALESCE(t.price, 499) AS price,
          COALESCE(t.rep, '12 Hours') AS reporting_time,
          true AS is_available
        FROM category_previews cp
        JOIN tests t ON t.id = cp.test_id
        CROSS JOIN (
          SELECT id, lab_id FROM lab_branches WHERE is_active = true LIMIT 5
        ) lb
        WHERE cp.is_pkg = false AND cp.test_id IS NOT NULL
        ON CONFLICT (lab_branch_id, test_id) DO NOTHING
      `);

      // Ensure EVERY package mapped in category_previews has active mappings in lab_package_branches
      await db.query(`
        INSERT INTO lab_package_branches (lab_id, lab_branch_id, package_id, price, reporting_time, home_collection, discount_label, notes, is_available)
        SELECT 
          lb.lab_id,
          lb.id AS lab_branch_id,
          cp.package_id,
          899 AS price,
          '24 Hours' AS reporting_time,
          true AS home_collection,
          '15% OFF' AS discount_label,
          'Premium health panel mapping.' AS notes,
          true AS is_available
        FROM category_previews cp
        JOIN packages p ON p.id = cp.package_id
        CROSS JOIN (
          SELECT id, lab_id FROM lab_branches WHERE is_active = true LIMIT 5
        ) lb
        WHERE cp.is_pkg = true AND cp.package_id IS NOT NULL
        ON CONFLICT (lab_branch_id, package_id) DO NOTHING
      `);

      console.log("✅ Successfully completed relational category previews seeding and lab mapping!");
    }

    // ─── Create categories_metadata Table ───
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories_metadata (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(100),
        description TEXT,
        long_description TEXT,
        medically_reviewed BOOLEAN DEFAULT true,
        stats_labs VARCHAR(100) DEFAULT '128+ certified labs',
        stats_bookings VARCHAR(100) DEFAULT '10k+ monthly bookings',
        stats_patients VARCHAR(100) DEFAULT '56k+ patients',
        tags TEXT[] DEFAULT '{}'
      );
    `);

    // ─── Seed categories_metadata Records ───
    await db.query(`
      INSERT INTO categories_metadata (category_name, icon, description, long_description, medically_reviewed, stats_labs, stats_bookings, stats_patients, tags) VALUES
      (
        'Heart', 
        'favorite', 
        'Heart-related tests help assess cholesterol levels, cardiac risk, and cardiovascular health.', 
        'Heart-related tests help assess cholesterol levels, cardiac risk, and cardiovascular health. Regular monitoring is essential for early detection and prevention of conditions such as hypertension, coronary artery disease, and stroke. Our partner certified NABL labs provide gold-standard lipid profiling, apolipoprotein checks, and electrocardiogram (ECG) screening under certified medical supervision.', 
        true, 
        '142+ certified labs', 
        '12k+ monthly bookings', 
        '65k+ patients', 
        ARRAY['Cholesterol Check', 'ECG', 'Cardiac Risk', 'Preventive Screening']
      ),
      (
        'Cancer', 
        'shield', 
        'Cancer screening tests detect tumour markers, abnormal cells, and genetic mutations early.', 
        'Cancer screening tests detect tumour markers, abnormal cells, and genetic mutations early. Early detection significantly improves treatment outcomes, longevity, and survival rates. Certified laboratory networks offer premium clinical tumor marker tests (PSA, CA-125) and specialized cytology checks (Pap Smear) with high diagnostic specificity.', 
        true, 
        '96+ certified labs', 
        '8k+ monthly bookings', 
        '32k+ patients', 
        ARRAY['PSA Test', 'CA-125', 'Tumour Markers', 'Genetic Screening']
      ),
      (
        'Thyroid', 
        'bubble_chart', 
        'Thyroid tests evaluate T3, T4, and TSH levels to identify hypo or hyperthyroidism.', 
        'Thyroid tests evaluate T3, T4, and TSH levels to identify hypo or hyperthyroidism. Essential for managing metabolism, weight, and energy levels. Regular checks help doctors tailor hormone replacement therapies and detect thyroiditis early.', 
        true, 
        '120+ certified labs', 
        '15k+ monthly bookings', 
        '78k+ patients', 
        ARRAY['TSH Test', 'T3 / T4', 'Thyroid Profile', 'Anti-TPO']
      ),
      (
        'Diabetes', 
        'water_drop', 
        'Diabetes diagnostics track blood glucose and HbA1c levels for early detection and ongoing management.', 
        'Diabetes diagnostics track blood glucose and HbA1c levels for early detection and ongoing management of Type 1, Type 2, and gestational diabetes. Maintaining optimal glycemic control is vital to avoid long-term renal, cardiovascular, and ophthalmic complications. Includes HbA1c (3-month average), Fasting Blood Glucose, and Post-Prandial checks.', 
        true, 
        '150+ certified labs', 
        '20k+ monthly bookings', 
        '98k+ patients', 
        ARRAY['HbA1c', 'Fasting Sugar', 'PPBS', 'Insulin Test']
      ),
      (
        'Pregnancy', 
        'pregnant_woman', 
        'Prenatal and maternal health panels monitor foetal development and pregnancy-related risks.', 
        'Prenatal and maternal health panels monitor foetal development, hormonal shifts, and pregnancy-related risks throughout each trimester. Provides peace of mind for expecting mothers through quantitative Beta HCG screening, dual/quadruple prenatal markers, and gestational diabetes glucose screenings.', 
        true, 
        '84+ certified labs', 
        '5k+ monthly bookings', 
        '22k+ patients', 
        ARRAY['HCG Test', 'Dual Marker', 'OGTT', 'Maternal Health']
      ),
      (
        'Allergy/Intolerance', 
        'coronavirus', 
        'Allergy panels identify IgE-mediated responses, sensitivities, and environmental triggers.', 
        'Allergy and intolerance panels identify IgE-mediated responses, food sensitivities, and environmental triggers affecting your daily quality of life. From chronic sinus issues to dietary discomfort, comprehensive antibody profiles isolate exact reaction causes.', 
        true, 
        '72+ certified labs', 
        '3k+ monthly bookings', 
        '14k+ patients', 
        ARRAY['IgE Total', 'Food Panel', 'Respiratory', 'Skin Allergy']
      ),
      (
        'Hormone', 
        'bolt', 
        'Hormone panel tests measure testosterone, estrogen, prolactin, FSH, and LH.', 
        'Hormone panel tests measure testosterone, estrogen, prolactin, FSH, and LH to assess fertility, hormonal balance, thyroid interactions, and general endocrine health. Essential for tracking reproductive vitality and unexplained energy or mood shifts.', 
        true, 
        '90+ certified labs', 
        '6k+ monthly bookings', 
        '28k+ patients', 
        ARRAY['Testosterone', 'Prolactin', 'FSH / LH', 'DHEA-S']
      ),
      (
        'DNA Test', 
        'dna', 
        'DNA and genetic tests uncover hereditary disease risks and personalised wellness insights.', 
        'DNA and genetic tests uncover hereditary disease risks, carrier status, and personalised wellness insights based on your unique genetic profile. Modern molecular sequencing charts a clear path for preventative living, nutritional planning, and early genetic awareness.', 
        true, 
        '45+ certified labs', 
        '2k+ monthly bookings', 
        '10k+ patients', 
        ARRAY['Carrier Status', 'BRCA Gene', 'Wellness DNA', 'Hereditary Risk']
      )
      ON CONFLICT (category_name) DO UPDATE SET
        icon = EXCLUDED.icon,
        description = EXCLUDED.description,
        long_description = EXCLUDED.long_description,
        medically_reviewed = EXCLUDED.medically_reviewed,
        stats_labs = EXCLUDED.stats_labs,
        stats_bookings = EXCLUDED.stats_bookings,
        stats_patients = EXCLUDED.stats_patients,
        tags = EXCLUDED.tags;
    `);

    // ─── Create lab_profiles Table (rich lab display metadata) ───────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_profiles (
        id SERIAL PRIMARY KEY,
        lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE UNIQUE,
        tagline VARCHAR(255),
        about TEXT,
        established_year INTEGER,
        accreditations TEXT[] DEFAULT '{}',
        lab_type VARCHAR(50) DEFAULT 'pathology',
        total_branches INTEGER DEFAULT 1,
        tests_offered INTEGER DEFAULT 100,
        images TEXT[] DEFAULT '{}',
        speciality_tags TEXT[] DEFAULT '{}',
        home_collection BOOLEAN DEFAULT true,
        report_time_hours INTEGER DEFAULT 24,
        rating DECIMAL(2,1) DEFAULT 4.0,
        review_count INTEGER DEFAULT 500,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ─── Seed lab_profiles for all existing labs (idempotent) ────────────────
    // Uses ON CONFLICT DO UPDATE so safe to re-run on every server start
    await db.query(`
      INSERT INTO lab_profiles (
        lab_id, tagline, about, established_year, accreditations, lab_type,
        total_branches, tests_offered, images, speciality_tags,
        home_collection, report_time_hours, rating, review_count
      )
      SELECT
        l.id,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN 'India''s Most Trusted Diagnostic Chain Since 1988'
          WHEN lower(l.name) LIKE '%apollo%'    THEN 'World-Class Diagnostics, Apollo Standards'
          WHEN lower(l.name) LIKE '%thyro%'     THEN 'Affordable Precision Diagnostics Nationwide'
          WHEN lower(l.name) LIKE '%srl%'       THEN 'Scientific Rigour. Reliable Results.'
          WHEN lower(l.name) LIKE '%max%'       THEN 'Advanced Diagnostics by Max Healthcare'
          WHEN lower(l.name) LIKE '%ganesh%'    THEN 'Your Neighbourhood Diagnostic Partner'
          WHEN lower(l.name) LIKE '%health%'    THEN 'Diagnostics Delivered to Your Doorstep'
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 'Smart Diagnostics, Smarter Pricing'
          WHEN lower(l.name) LIKE '%pathkind%'  THEN 'Kind Care. Precise Results.'
          WHEN lower(l.name) LIKE '%metropol%'  THEN 'Precision Diagnostics, Pan-India Presence'
          WHEN lower(l.name) LIKE '%dang%'      THEN 'Legacy of Clinical Excellence Since 1958'
          WHEN lower(l.name) LIKE '%indira%'    THEN 'Diagnostic Excellence, Patient-First Care'
          WHEN lower(l.name) LIKE '%mahajan%'   THEN 'Premium Imaging & Diagnostic Solutions'
          WHEN lower(l.name) LIKE '%city%'      THEN 'Affordable Full-Service Diagnostics'
          ELSE 'Trusted Diagnostic Partner'
        END,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN 'Dr. Lal PathLabs is India''s largest diagnostic chain with over 4,000 collection centres nationwide. Founded in 1988, the lab delivers NABL-certified, quality-assured reports with cutting-edge automation technology.'
          WHEN lower(l.name) LIKE '%apollo%'    THEN 'Apollo Diagnostics brings global standards to everyday diagnostics. Backed by the Apollo Hospital network, it offers a comprehensive test catalogue with strict quality control and ISO-certified lab infrastructure.'
          WHEN lower(l.name) LIKE '%thyro%'     THEN 'Thyrocare Technologies pioneered affordable home collection in India. Known for its high-throughput central processing hub, it delivers accurate results at industry-leading prices with a fully automated workflow.'
          WHEN lower(l.name) LIKE '%srl%'       THEN 'SRL Diagnostics is one of India''s top 3 diagnostic chains with over 400 clinical labs and 5,000+ collection points. ISO 15189 certified, it serves over 70,000 patients daily with a 3,800+ test catalogue.'
          WHEN lower(l.name) LIKE '%max%'       THEN 'Max Lab operates under the Max Healthcare umbrella, providing hospital-grade diagnostic accuracy in a community setting. Features state-of-the-art equipment and internationally trained pathologists.'
          WHEN lower(l.name) LIKE '%ganesh%'    THEN 'Ganesh Diagnostic & Imaging Centre is a trusted neighbourhood lab network in Delhi NCR. Known for fast report turnaround and affordable pricing with quality NABL-certified infrastructure.'
          WHEN lower(l.name) LIKE '%health%'    THEN 'Healthians disrupted diagnostics with its tech-driven home collection model. Offering 1,500+ tests with certified phlebotomist home visits, digital reports, and competitive pricing, it''s India''s top at-home lab.'
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 'Redcliffe Labs is one of India''s fastest-growing diagnostic startups. Combining AI-driven logistics with 1,000+ test offerings, it delivers NABL-certified reports with unprecedented speed.'
          WHEN lower(l.name) LIKE '%pathkind%'  THEN 'Pathkind Labs has built a strong network across Tier-1 and Tier-2 cities, with NABL-certified labs and a focus on personalized diagnostic care for every patient.'
          WHEN lower(l.name) LIKE '%dang%'      THEN 'Dr. Dang''s Lab has been Delhi''s most respected independent clinical laboratory since 1958. Known for its meticulous quality standards, it serves top hospitals, clinics, and individual patients across the NCR.'
          WHEN lower(l.name) LIKE '%indira%'    THEN 'Indira Path Labs is a full-service diagnostic laboratory delivering accurate, NABL-certified results to thousands of patients across the NCR. A unit of Indira IVF, it specializes in fertility and hormonal diagnostics alongside routine pathology.'
          WHEN lower(l.name) LIKE '%mahajan%'   THEN 'Mahajan Imaging is Delhi''s premier radiology and imaging centre, offering everything from MRI to digital X-rays with internationally trained radiologists and state-of-the-art imaging equipment.'
          WHEN lower(l.name) LIKE '%city%'      THEN 'City X-Ray & Scan Centre provides affordable X-ray, CT, MRI, and pathology services across Delhi NCR. With decades of experience, it offers accurate and fast diagnostic imaging to all communities.'
          ELSE 'A NABL-certified diagnostic laboratory delivering accurate clinical test results with a patient-first approach. Equipped with modern instruments and staffed by experienced pathologists.'
        END,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN 1988
          WHEN lower(l.name) LIKE '%apollo%'    THEN 2001
          WHEN lower(l.name) LIKE '%thyro%'     THEN 1996
          WHEN lower(l.name) LIKE '%srl%'       THEN 1995
          WHEN lower(l.name) LIKE '%max%'       THEN 2000
          WHEN lower(l.name) LIKE '%ganesh%'    THEN 1985
          WHEN lower(l.name) LIKE '%health%'    THEN 2013
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 2019
          WHEN lower(l.name) LIKE '%pathkind%'  THEN 2010
          WHEN lower(l.name) LIKE '%dang%'      THEN 1958
          WHEN lower(l.name) LIKE '%indira%'    THEN 2004
          WHEN lower(l.name) LIKE '%mahajan%'   THEN 1982
          WHEN lower(l.name) LIKE '%city%'      THEN 1992
          ELSE 2005
        END,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN ARRAY['NABL', 'ISO 15189', 'CAP']
          WHEN lower(l.name) LIKE '%apollo%'    THEN ARRAY['NABL', 'ISO 15189', 'JCI']
          WHEN lower(l.name) LIKE '%thyro%'     THEN ARRAY['NABL', 'ISO 9001']
          WHEN lower(l.name) LIKE '%srl%'       THEN ARRAY['NABL', 'ISO 15189', 'CAP']
          WHEN lower(l.name) LIKE '%max%'       THEN ARRAY['NABL', 'NABH', 'JCI']
          WHEN lower(l.name) LIKE '%health%'    THEN ARRAY['NABL', 'ISO 9001']
          WHEN lower(l.name) LIKE '%redcliffe%' THEN ARRAY['NABL', 'ISO 15189']
          WHEN lower(l.name) LIKE '%dang%'      THEN ARRAY['NABL', 'ISO 15189', 'ILAC']
          WHEN lower(l.name) LIKE '%indira%'    THEN ARRAY['NABL', 'NABH']
          ELSE ARRAY['NABL']
        END,
        CASE
          WHEN lower(l.name) LIKE '%mahajan%' OR lower(l.name) LIKE '%city%' OR lower(l.name) LIKE '%star%' OR lower(l.name) LIKE '%focus%' THEN 'radiology'
          WHEN lower(l.name) LIKE '%apollo%' OR lower(l.name) LIKE '%max%' THEN 'multi-specialty'
          ELSE 'pathology'
        END,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN 4000
          WHEN lower(l.name) LIKE '%apollo%'    THEN 400
          WHEN lower(l.name) LIKE '%thyro%'     THEN 2000
          WHEN lower(l.name) LIKE '%srl%'       THEN 500
          WHEN lower(l.name) LIKE '%max%'       THEN 150
          WHEN lower(l.name) LIKE '%health%'    THEN 1200
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 300
          WHEN lower(l.name) LIKE '%dang%'      THEN 12
          ELSE 25
        END,
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN 4000
          WHEN lower(l.name) LIKE '%apollo%'    THEN 1800
          WHEN lower(l.name) LIKE '%thyro%'     THEN 1100
          WHEN lower(l.name) LIKE '%srl%'       THEN 3800
          WHEN lower(l.name) LIKE '%max%'       THEN 2500
          WHEN lower(l.name) LIKE '%health%'    THEN 1500
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 1000
          WHEN lower(l.name) LIKE '%dang%'      THEN 600
          ELSE 300
        END,
        ARRAY[
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
          'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80',
          'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80'
        ],
        CASE
          WHEN lower(l.name) LIKE '%lal%'       THEN ARRAY['Blood Tests', 'Genetic Testing', 'Microbiology', 'Hormones', 'Thyroid', 'Lipid Profiles']
          WHEN lower(l.name) LIKE '%apollo%'    THEN ARRAY['Full Body Checkup', 'Cardiac', 'Oncology', 'Diabetes', 'Womens Health']
          WHEN lower(l.name) LIKE '%thyro%'     THEN ARRAY['Thyroid', 'Diabetes', 'Blood Tests', 'Vitamin Profiles']
          WHEN lower(l.name) LIKE '%srl%'       THEN ARRAY['Blood Tests', 'Pathology', 'Radiology', 'Genetics', 'Toxicology']
          WHEN lower(l.name) LIKE '%health%'    THEN ARRAY['Home Collection', 'Blood Tests', 'Preventive Care', 'Packages']
          WHEN lower(l.name) LIKE '%mahajan%'   THEN ARRAY['MRI', 'CT Scan', 'Ultrasound', 'X-Ray', 'PET Scan']
          WHEN lower(l.name) LIKE '%city%'      THEN ARRAY['X-Ray', 'Ultrasound', 'CT Scan', 'Blood Tests']
          WHEN lower(l.name) LIKE '%indira%'    THEN ARRAY['Fertility Tests', 'Hormones', 'Blood Tests', 'Pathology']
          WHEN lower(l.name) LIKE '%dang%'      THEN ARRAY['Clinical Pathology', 'Immunology', 'Microbiology', 'Hormones']
          ELSE ARRAY['Blood Tests', 'Pathology', 'Home Collection']
        END,
        true,
        CASE
          WHEN lower(l.name) LIKE '%thyro%'     THEN 12
          WHEN lower(l.name) LIKE '%health%'    THEN 8
          WHEN lower(l.name) LIKE '%redcliffe%' THEN 6
          WHEN lower(l.name) LIKE '%dang%'      THEN 6
          WHEN lower(l.name) LIKE '%lal%'       THEN 6
          ELSE 12
        END,
        ROUND((3.8 + (l.id % 12) * 0.1)::numeric, 1),
        500 + ((l.id * 137) % 9500)
      FROM labs l
      ON CONFLICT (lab_id) DO UPDATE SET
        tagline = EXCLUDED.tagline,
        about = EXCLUDED.about,
        established_year = EXCLUDED.established_year,
        accreditations = EXCLUDED.accreditations,
        lab_type = EXCLUDED.lab_type,
        total_branches = EXCLUDED.total_branches,
        tests_offered = EXCLUDED.tests_offered,
        images = EXCLUDED.images,
        speciality_tags = EXCLUDED.speciality_tags,
        home_collection = EXCLUDED.home_collection,
        report_time_hours = EXCLUDED.report_time_hours,
        updated_at = CURRENT_TIMESTAMP;
    `);

    // ─── Modular Packages Landing Page Tables ────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS packages_landing_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        sub_label VARCHAR(100),
        starts_price INTEGER,
        labs_count INTEGER,
        icon VARCHAR(50),
        color_theme VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS packages_landing_popular (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL,
        tagline VARCHAR(255),
        tests_included_summary TEXT,
        price INTEGER,
        original_price INTEGER,
        labs_count INTEGER,
        savings_badge VARCHAR(50),
        image_url VARCHAR(255),
        is_premium BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS packages_landing_faqs (
        id SERIAL PRIMARY KEY,
        question TEXT UNIQUE NOT NULL,
        answer TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS packages_landing_partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        logo_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0
      );
    `);

    // ─── Seeding Categories ──────────────────────────────────────────────────
    await db.query(`
      INSERT INTO packages_landing_categories (name, sub_label, starts_price, labs_count, icon, color_theme, display_order)
      VALUES
        ('Full Body Checkup', '120+ Tests included', 999, 42, 'health_and_safety', 'primary', 0),
        ('Heart Screening', 'Cardiac profiles', 1499, 28, 'favorite', 'error', 1),
        ('Diabetes Monitoring', 'HbA1c & Glucose', 499, 56, 'bloodtype', 'secondary', 2),
        ('Women Wellness', 'Hormonal & PCOD', 1299, 35, 'woman', 'tertiary', 3),
        ('Senior Citizen', 'Comprehensive Care', 1999, 20, 'elderly', 'surface-highest', 4),
        ('Thyroid Packages', 'T3, T4, TSH', 349, 60, 'biotech', 'surface-dim', 5)
      ON CONFLICT (name) DO UPDATE SET
        sub_label = EXCLUDED.sub_label,
        starts_price = EXCLUDED.starts_price,
        labs_count = EXCLUDED.labs_count,
        icon = EXCLUDED.icon,
        color_theme = EXCLUDED.color_theme,
        display_order = EXCLUDED.display_order;
    `);

    // ─── Seeding Popular Packages ────────────────────────────────────────────
    await db.query(`
      INSERT INTO packages_landing_popular (name, tagline, tests_included_summary, price, original_price, labs_count, savings_badge, image_url, is_premium, display_order)
      VALUES
        (
          'Essential Full Body', 
          'Best Value', 
          'Includes Vitamin D, B12, CBC + 60 more', 
          1299, 2499, 12, 
          'Best Value', 
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', 
          false, 0
        ),
        (
          'Advanced Checkup', 
          'Comprehensive metabolic screening', 
          'Cardiac markers, Iron, Thyroid + 85 tests', 
          2199, 4200, 8, 
          'Popular', 
          'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', 
          false, 1
        ),
        (
          'Executive Plus', 
          'Most Comprehensive', 
          'Cancer markers, Heavy metals + 120 tests', 
          4999, 8500, 5, 
          'Most Comprehensive', 
          'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80', 
          true, 2
        ),
        (
          'Diabetes Advanced', 
          'Targeted glucose & cardiac panel', 
          'HbA1c, Microalbumin + Lipid profile', 
          1499, 2800, 22, 
          'Targeted Care', 
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80', 
          false, 3
        )
      ON CONFLICT (name) DO UPDATE SET
        tagline = EXCLUDED.tagline,
        tests_included_summary = EXCLUDED.tests_included_summary,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        labs_count = EXCLUDED.labs_count,
        savings_badge = EXCLUDED.savings_badge,
        image_url = EXCLUDED.image_url,
        is_premium = EXCLUDED.is_premium,
        display_order = EXCLUDED.display_order;
    `);

    // Link real package IDs dynamically based on name matches
    await db.query(`
      UPDATE packages_landing_popular plp
      SET package_id = p.id
      FROM packages p
      WHERE lower(p.name) LIKE '%' || lower(plp.name) || '%';
    `);

    // ─── Seeding FAQs ────────────────────────────────────────────────────────
    await db.query(`
      INSERT INTO packages_landing_faqs (question, answer, display_order)
      VALUES
        (
          'Are the prices on ChooseMyLab guaranteed?', 
          'Yes, the prices shown are finalized negotiated rates with our lab partners. You won''t have to pay anything extra at the lab or to the phlebotomist.', 
          0
        ),
        (
          'How do I get my reports?', 
          'Reports are sent via email and WhatsApp once the lab completes the analysis. You can also download them from your ChooseMyLab dashboard.', 
          1
        ),
        (
          'What if I need to cancel or reschedule?', 
          'Cancellations are free up to 2 hours before the scheduled collection time. You can easily reschedule from your booking panel.', 
          2
        )
      ON CONFLICT (question) DO UPDATE SET
        answer = EXCLUDED.answer,
        display_order = EXCLUDED.display_order;
    `);

    // ─── Seeding Partner Logo Strip ──────────────────────────────────────────
    await db.query(`
      INSERT INTO packages_landing_partners (name, logo_url, display_order)
      VALUES
        ('Dr Lal PathLabs', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80', 0),
        ('Thyrocare', 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=200&q=80', 1),
        ('Redcliffe Labs', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&q=80', 2),
        ('Metropolis', 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=200&q=80', 3),
        ('Apollo Diagnostics', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&q=80', 4)
      ON CONFLICT (name) DO UPDATE SET
        display_order = EXCLUDED.display_order;
    `);

    // ─── Modular Packages Listing Page Schemas & Seeding ─────────────────────
    console.log("Migrating database schemas for Package Listing revamps...");

    await db.query(`
      CREATE TABLE IF NOT EXISTS packages_listing_hero_metadata (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        subtitle TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        read_more TEXT,
        image_url VARCHAR(255),
        trust_badges JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS packages_listing_tiers (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        tier_name VARCHAR(100) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        display_order INTEGER DEFAULT 0,
        UNIQUE (category, tier_name)
      );

      CREATE TABLE IF NOT EXISTS packages_listing_guides (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) NOT NULL,
        display_order INTEGER DEFAULT 0,
        UNIQUE (category, title)
      );

      CREATE TABLE IF NOT EXISTS packages_listing_faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        UNIQUE (category, question)
      );
    `);

    console.log("Seeding Package Listing dynamic content for all categories...");

    // 1. Seed Listing Hero Metadata (idempotent via ON CONFLICT)
    await db.query(`
      INSERT INTO packages_listing_hero_metadata (category, title, subtitle, tags, read_more, image_url, trust_badges)
      VALUES
        (
          'Cancer', 
          'Cancer Screening Packages', 
          'Early detection screening packages designed to identify potential cancer markers and support proactive health monitoring.', 
          ARRAY['Preventive Screening', 'Family Risk History', 'Annual Checkup', 'High Risk Monitoring'], 
          $$Early detection significantly increases the success rate of cancer treatments. Regular screenings can identify cellular changes before they become symptomatic. Recommended for individuals over 35, those with familial history, or specific environmental risk factors.$$, 
          'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Heart', 
          'Heart Health Screening Packages', 
          'Advanced cardiac profiling designed to detect cholesterol levels, coronary risk factors, and basic cardiovascular vulnerabilities early.', 
          ARRAY['Lipid Panel', 'Coronary Risk', 'Artery Health', 'Blood Pressure'], 
          $$Cardiovascular diseases are often silent and progressive. Screening packages assess lipids, cardiac markers (like Hs-CRP, ApoA/ApoB), and metabolic markers to predict plaque deposit rates. Highly recommended for people with stressful lifestyles, family history of hypertension, high cholesterol, or sedentary habits.$$, 
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Diabetes', 
          'Diabetes Care & Monitoring Packages', 
          'Comprehensive glycemic assessments evaluating HbA1c, fasting glucose, and organ filtration to track and manage blood sugar levels.', 
          ARRAY['HbA1c Average', 'Glucose Fasting', 'Renal Protection', 'Insulin Sensitivity'], 
          $$Diabetes impacts every major organ system, especially kidneys and nerves. Monitoring panels check glycosylated hemoglobin (HbA1c) alongside microalbumin and creatinine to evaluate early kidney leakage. Essential for diabetics, pre-diabetics, or those with family histories.$$, 
          'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Pregnancy', 
          'Women Wellness & Hormonal Packages', 
          'Specialized screenings designed to evaluate female hormone balances, ovarian health, bone retention, and thyroid efficiency.', 
          ARRAY['Hormonal Harmony', 'Anemia Screening', 'Ovarian Markers', 'Bone Calcium'], 
          $$Women have distinct physiological timelines. Wellness packages track iron storage (ferritin), thyroid speed (TSH), bone minerals (calcium, Vitamin D), and vital blood counts. Recommended for tracking PCOS, fatigue, menstrual irregularities, or routine age-specific wellness.$$, 
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Senior Citizen', 
          'Senior Citizen Health Packages', 
          'Geriatric-focused diagnostic panels designed to monitor kidney filtration, joint degeneration, anemia, and cardiac strength.', 
          ARRAY['Geriatric Precision', 'Organ Age', 'Bone Strength', 'Chronic Check'], 
          $$Aging changes how our bodies process drugs and nutrients. These panels assess renal clearance (eGFR), uric acid, calcium, lipid blockages, and blood indices to manage chronic wellness. Optimized for senior adults to maintain active independence.$$, 
          'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Thyroid', 
          'Thyroid Health & Metabolic Packages', 
          'Specific hormone panels evaluating T3, T4, and TSH levels to identify underactive or overactive metabolic states.', 
          ARRAY['TSH Control', 'Active T3', 'Free Thyroxine', 'Metabolic Speed'], 
          $$The thyroid gland controls how every cell uses energy. Tiny imbalances trigger systemic fatigue, mood changes, weight gain, or heart palpitations. Our panels track hormone levels with chemical precision. Highly recommended for chronic fatigue, thinning hair, or weight shifts.$$, 
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        ),
        (
          'Full Body Checkup', 
          'Comprehensive Full Body Checkup Packages', 
          'Standardized clinical screenings analyzing vital metabolic biomarkers across blood, heart, liver, kidneys, and thyroid systems.', 
          ARRAY['64+ Vital Markers', 'Systemic Screen', 'Organ Health', 'Baseline Audit'], 
          $$An annual full body checkup is the cornerstone of preventative longevity. By mapping 64+ key markers, it discovers metabolic shifts, pre-diabetes, fatty liver, and kidney inefficiencies early when they are 100% reversible. Recommended once a year for all adults.$$, 
          'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&q=80', 
          '[{"icon": "verified", "text": "NABL Certified Labs"}, {"icon": "shield_with_heart", "text": "Secure Data Privacy"}]'::jsonb
        )
      ON CONFLICT (category) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        tags = EXCLUDED.tags,
        read_more = EXCLUDED.read_more,
        image_url = EXCLUDED.image_url,
        trust_badges = EXCLUDED.trust_badges;
    `);

    // 2. Seed Listing Tiers
    await db.query(`
      INSERT INTO packages_listing_tiers (category, tier_name, subtitle, icon, price, display_order)
      VALUES
        ('Cancer', 'Essential', 'Basic screening markers', 'clinical_notes', 1499, 0),
        ('Cancer', 'Advanced', 'Enhanced marker profile', 'science', 3999, 1),
        ('Cancer', 'Comprehensive', 'Full oncology screening', 'biotech', 7499, 2),
        ('Cancer', 'Premium', 'Elite predictive profile', 'health_and_safety', 12999, 3),

        ('Heart', 'Essential', 'Basic lipid and BP screening', 'favorite', 999, 0),
        ('Heart', 'Advanced', 'Enhanced cholesterol & risk panel', 'monitoring', 1999, 1),
        ('Heart', 'Comprehensive', 'Full cardiac biomarker check', 'biotech', 3499, 2),
        ('Heart', 'Premium', 'Elite cardio-vascular tracking', 'health_and_safety', 5999, 3),

        ('Diabetes', 'Essential', 'Basic sugar monitoring', 'bloodtype', 349, 0),
        ('Diabetes', 'Advanced', 'HbA1c & lipid profiles', 'monitoring', 999, 1),
        ('Diabetes', 'Comprehensive', 'Organ impact screening', 'biotech', 1899, 2),
        ('Diabetes', 'Premium', 'Full diabetic systemic checkup', 'health_and_safety', 2999, 3),

        ('Pregnancy', 'Essential', 'Basic health & blood counts', 'woman', 899, 0),
        ('Pregnancy', 'Advanced', 'Hormone & thyroid panel', 'monitoring', 1799, 1),
        ('Pregnancy', 'Comprehensive', 'Full wellness & cancer markers', 'biotech', 2999, 2),
        ('Pregnancy', 'Premium', 'Elite ovarian & metabolic profile', 'health_and_safety', 4999, 3),

        ('Senior Citizen', 'Essential', 'Basic metabolic baseline', 'elderly', 1299, 0),
        ('Senior Citizen', 'Advanced', 'Kidney, bone & heart panel', 'monitoring', 2199, 1),
        ('Senior Citizen', 'Comprehensive', 'Full system geriatric check', 'biotech', 3499, 2),
        ('Senior Citizen', 'Premium', 'Elite longevity profile', 'health_and_safety', 5499, 3),

        ('Thyroid', 'Essential', 'Basic T3, T4, TSH panel', 'biotech', 299, 0),
        ('Thyroid', 'Advanced', 'Free T3/T4 & TSH screening', 'monitoring', 699, 1),
        ('Thyroid', 'Comprehensive', 'Thyroid & metabolic screen', 'biotech', 1299, 2),
        ('Thyroid', 'Premium', 'Thyroid antibody autoimmune check', 'health_and_safety', 2499, 3),

        ('Full Body Checkup', 'Essential', 'Core metabolic baseline', 'health_and_safety', 999, 0),
        ('Full Body Checkup', 'Advanced', 'Comprehensive organ & bone screen', 'monitoring', 1899, 1),
        ('Full Body Checkup', 'Comprehensive', 'Full system oncology & mineral check', 'biotech', 3499, 2),
        ('Full Body Checkup', 'Premium', 'Elite whole-body predictive profile', 'health_and_safety', 6999, 3)
      ON CONFLICT (category, tier_name) DO UPDATE SET
        subtitle = EXCLUDED.subtitle,
        icon = EXCLUDED.icon,
        price = EXCLUDED.price,
        display_order = EXCLUDED.display_order;
    `);

    // 3. Seed Listing comparative guides
    await db.query(`
      INSERT INTO packages_listing_guides (category, title, description, icon, display_order)
      VALUES
        ('Cancer', 'Tumor Markers', 'Blood tests that look for proteins or substances made by cancer cells. Essential for initial screening.', 'detection_and_zone', 0),
        ('Cancer', 'Genetic Predisposition', 'Advanced screening that analyzes specific genes linked to hereditary cancer risks like BRCA1/BRCA2.', 'genetics', 1),
        ('Cancer', 'Systemic Impact', 'Comprehensive profiles that include organ function tests to see how the whole body is performing.', 'monitor_heart', 2),

        ('Heart', 'Atherogenic Lipids', 'Measures sub-fractions like ApoB and ApoA1 to evaluate deep arterial clogging tendencies.', 'water_drop', 0),
        ('Heart', 'Cardiac Markers', 'High-sensitivity CRP (Hs-CRP) checks for vascular wall inflammation, a primary trigger for cardiac events.', 'clinical_notes', 1),
        ('Heart', 'Electro-Metabolic Panel', 'Integrates essential electrolytes (Sodium, Potassium) to ensure proper cardiac electrical conduction rhythm.', 'speed', 2),

        ('Diabetes', 'Average Glycemia', 'HbA1c provides a stable 3-month sugar storage index, unaffected by short-term dietary slips.', 'analytics', 0),
        ('Diabetes', 'Kidney Leakage Check', 'Microalbuminuria checks if kidneys are leaking microscopic protein, a primary sign of diabetic nephropathy.', 'verified_user', 1),
        ('Diabetes', 'Lipid Coordination', 'Uncontrolled blood sugar alters lipid profiles, increasing vascular clogging risks. We track them jointly.', 'biotech', 2),

        ('Pregnancy', 'Iron Stores (Ferritin)', 'Folate and ferritin screening evaluates cellular iron backup levels, detecting hidden fatigue sources early.', 'blood_transfusion', 0),
        ('Pregnancy', 'Metabolic Activator', 'TSH and Thyroid hormones screen for hypothyroidism, a major trigger for unexplained weight gain.', 'speed', 1),
        ('Pregnancy', 'Bone Preservation', 'Calcium and Vitamin D profiles track mineral retention, helping prevent progressive bone-density loss.', 'accessibility_new', 2),

        ('Senior Citizen', 'Filtration Rate (eGFR)', 'Tracks renal waste clearing speed rather than simple creatinine, providing a highly specific kidney age assessment.', 'filter_alt', 0),
        ('Senior Citizen', 'Joint Minerals', 'Uric acid and calcium monitoring evaluates arthritis triggers and skeletal mineral integrity side-by-side.', 'accessibility_new', 1),
        ('Senior Citizen', 'Chronic Anemia', 'Assesses red blood cell indices to distinguish between nutritional deficiencies and chronic age-related anemias.', 'bloodtype', 2),

        ('Thyroid', 'Pituitary Signal (TSH)', 'TSH is the brains hormone driving your thyroid output. It reacts immediately to minor metabolic drops.', 'notifications', 0),
        ('Thyroid', 'Free vs. Total Hormones', 'Free T3 and Free T4 measure unbound active hormones, showing the exact levels available for cellular use.', 'analytics', 1),
        ('Thyroid', 'Autoimmune Attack Check', 'Anti-TPO and Anti-TG antibodies screen if your bodys immune system is attacking its own thyroid cells.', 'shield', 2),

        ('Full Body Checkup', 'Whole System Audit', 'Analyzes blood counts, blood sugar, lipids, thyroid speed, kidney filtration, and liver enzymes in a single visit.', 'checklist', 0),
        ('Full Body Checkup', 'Nutrient Backups', 'Tracks Vitamin D and Vitamin B12 levels, critical for nervous system, bones, and immunity backing.', 'nutrition', 1),
        ('Full Body Checkup', 'Toxicity & Clearance', 'Reviews uric acid and urea levels alongside liver waste filtration to track daily detox efficiency.', 'biotech', 2)
      ON CONFLICT (category, title) DO UPDATE SET
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        display_order = EXCLUDED.display_order;
    `);

    // 4. Seed Listing FAQs
    await db.query(`
      INSERT INTO packages_listing_faqs (category, question, answer, display_order)
      VALUES
        ('Cancer', 'Whats typically included in a cancer screening package?', 'Our packages typically include a combination of Tumor Markers (like PSA, CEA, CA 125), Complete Blood Count (CBC) with differential, Metabolic panels, and specific organ function tests (Liver, Kidney).', 0),
        ('Cancer', 'Who should consider these packages?', 'They are recommended for adults over 35, individuals with a family history of cancer, long-term smokers, or those exposed to environmental toxins.', 1),
        ('Cancer', 'How often should I get screened?', 'For preventive health, an annual screening is generally recommended. Consult with a physician for a personalized schedule.', 2),

        ('Heart', 'Is fasting mandatory for cardiac packages?', 'Yes, a strict 10-12 hours overnight fast is mandatory because lipid ratios and triglycerides can fluctuate after meals. Plain water is permitted.', 0),
        ('Heart', 'What is Hs-CRP and why is it included?', 'Hs-CRP measures low-level vascular inflammation. Even if cholesterol is normal, high Hs-CRP indicates a cardiac risk.', 1),
        ('Heart', 'How long do reports take?', 'Reports are sent electronically within 12 to 18 hours of blood collection.', 2),

        ('Diabetes', 'What is the difference between Fasting Glucose and HbA1c?', 'Fasting glucose shows blood sugar at that exact second. HbA1c shows the stable average of the past 90 days.', 0),
        ('Diabetes', 'How frequently should a pre-diabetic get tested?', 'Pre-diabetics should monitor their HbA1c every 3 to 6 months to track if lifestyle corrections are successfully reversing the trend.', 1),
        ('Diabetes', 'Is fasting required for HbA1c alone?', 'Fasting is not required for a standalone HbA1c test. However, if your package includes Fasting Sugar or Lipids, you must fast.', 2),

        ('Pregnancy', 'When is the best time to take a hormonal profile?', 'Basic wellness checkups can be taken anytime. For specific fertility screens (like FSH, LH), it is best scheduled during day 2-5 of your cycle.', 0),
        ('Pregnancy', 'Is fasting required for female packages?', 'Fasting is recommended for 8 to 10 hours if the package includes lipid profiles or fasting sugar, which most of our panels do.', 1),
        ('Pregnancy', 'How do bone markers help?', 'Estrogen reductions over time affect calcium absorption. Tracking calcium and Vitamin D allows for timely therapeutic supplementation.', 2),

        ('Senior Citizen', 'Can senior citizen samples be collected at home?', 'Yes, we specialize in free home collection with highly trained geriatric phlebotomists who use extra-fine needles for delicate veins.', 0),
        ('Senior Citizen', 'Is fasting mandatory for older adults?', 'Fasting for 10 hours is ideal. If a senior is prone to low blood sugar (hypoglycemia), please carry a light snack for immediately after.', 1),
        ('Senior Citizen', 'Are reports elder-friendly?', 'Yes, our digital dashboard presents results in high-contrast oversized fonts with simplified green/red indicators for instant understanding.', 2),

        ('Thyroid', 'Should I take my thyroid medicine before blood collection?', 'No. Give your blood sample in the morning before consuming your daily thyroid hormone pill, as taking it beforehand will falsely elevate blood levels.', 0),
        ('Thyroid', 'Is fasting required for thyroid tests?', 'Fasting is not required for a standalone Thyroid panel. Morning tests are preferred as TSH has minor diurnal variation.', 1),
        ('Thyroid', 'What is an autoimmune thyroid screen?', 'Autoimmune screens (like Anti-TPO) check if thyroid sluggishness is due to Hashimotos thyroiditis, where your body attacks the gland.', 2),

        ('Full Body Checkup', 'What is included in a Full Body Checkup?', 'Our packages combine Complete Blood Count (CBC), Liver Panel (LFT), Kidney Panel (KFT), Lipid Profile (Heart), Thyroid Profile, Blood Sugar, Urine examination, and vital Vitamins.', 0),
        ('Full Body Checkup', 'Is home collection really free?', 'Yes, we provide free home sample collection across all areas. A certified clinical phlebotomist will handle the draw at your selected slot.', 1),
        ('Full Body Checkup', 'How should I prepare for a Full Body Checkup?', 'Fast for 10 to 12 hours overnight. Avoid alcohol and extreme physical exercise 24 hours prior. Plain water is permitted.', 2)
      ON CONFLICT (category, question) DO UPDATE SET
        answer = EXCLUDED.answer,
        display_order = EXCLUDED.display_order;
    `);

    // 5. Seed actual Clinical Packages for each Category (if they do not exist)
    console.log("Seeding diagnostic packages for all categories...");
    const dynamicPackages = [
      // Cancer
      ['Cancer Marker Gold Profile - Male', 'Cancer', 'Comprehensive screen for key male oncology markers and core clinical checkups.'],
      ['Onco-Screen Female Plus', 'Cancer', 'Premium oncology markers screening specifically designed for women.'],
      ['Essential Cancer Screening - Male', 'Cancer', 'Basic screening markers for male cancer risk auditing.'],
      ['Essential Cancer Screening - Female', 'Cancer', 'Basic screening markers for female cancer risk auditing.'],
      // Heart
      ['Healthy Heart Gold Profile', 'Heart', 'Complete heart health panel assessing key cardiac indicators and lipid fractions.'],
      ['Cardiac Risk Biomarker Panel', 'Heart', 'Specific cardiac risk indices including Hs-CRP, ApoA and ApoB levels.'],
      ['Lipid Profile Advanced', 'Heart', 'Standard lipid panels with extended cardiovascular indicators.'],
      // Diabetes
      ['Diabetes Comprehensive Care Package', 'Diabetes', 'Full system diabetic health check, including microalbuminuria and renal markers.'],
      ['HbA1c & Glucose Level Monitor', 'Diabetes', 'Regular diabetic glycemic control screen for monthly/quarterly tracking.'],
      // Pregnancy / Women
      ['PCOS Health Screening', 'Pregnancy', 'Hormonal profile specifically curated for PCOS and metabolic tracking.'],
      ['Hormonal Balance Profile', 'Pregnancy', 'Core hormonal health profile assessing thyroid, estrogen, and blood counts.'],
      // Senior Citizen
      ['Senior Citizen Care Profile - Male', 'Senior Citizen', 'Geriatric-focused systemic checkup evaluating kidneys, bone health, and lipids.'],
      ['Senior Citizen Care Profile - Female', 'Senior Citizen', 'Geriatric-focused systemic checkup with bone-density and female hormonal checks.'],
      // Thyroid
      ['Thyroid Hormone Gold Profile', 'Thyroid', 'Standard thyroid profile evaluating active metabolic activation (T3, T4, TSH).'],
      ['Thyroid Autoimmune Auto-antibody Screen', 'Thyroid', 'Autoimmune thyroid condition audit checking Anti-TPO antibodies.'],
      // Full Body
      ['Essential Full Body Checkup (64 Tests)', 'Full Body Checkup', 'Core preventive health baseline checking heart, liver, kidneys, and blood.'],
      ['Advanced Full Body Checkup (85 Tests)', 'Full Body Checkup', 'Comprehensive wellness checkup including vital vitamin profiles.'],
      ['Executive Full Body Checkup (120 Tests)', 'Full Body Checkup', 'Elite whole-body metabolic panel with heavy metals and diagnostic indices.']
    ];

    for (const [pName, cat, desc] of dynamicPackages) {
      await db.query(`
        INSERT INTO packages (name, category, description, samples_required, preparations, why_booked, what_it_measures)
        VALUES (
          $1, $2, $3,
          'Blood & Urine Specimen',
          'Requires 10-12 hours of overnight fasting. Plain water is permitted.',
          '[{"title": "Core Screening", "body": "Tracks early indicators for standard chronic conditions before symptoms show."}]'::jsonb,
          '[{"name": "Whole Body Checkup", "desc": "Covers vital metabolic benchmarks.", "strength": "100%"}]'::jsonb
        ) ON CONFLICT (name) DO UPDATE SET 
          category = EXCLUDED.category,
          description = EXCLUDED.description;
      `, [pName, cat, desc]);
    }

    // 6. Map Packages to Tests dynamically
    console.log("Mapping packages to sub-tests...");
    const packageTestMappings = [
      ['Cancer Marker Gold Profile - Male', ['PSA', 'CEA', 'AFP', 'CBC', 'LDH']],
      ['Onco-Screen Female Plus', ['CA 125', 'CA 15.3', 'Pap Smear', 'CEA', 'Thyroid']],
      ['Essential Cancer Screening - Male', ['PSA', 'CEA', 'CBC']],
      ['Essential Cancer Screening - Female', ['CA 125', 'Pap Smear', 'CEA', 'CBC']],
      ['Healthy Heart Gold Profile', ['Lipid Profile', 'Hs-CRP', 'Electrolytes', 'CBC']],
      ['Cardiac Risk Biomarker Panel', ['CRP', 'Apolipoprotein', 'Lipid']],
      ['Lipid Profile Advanced', ['Lipid Profile', 'Apolipoprotein']],
      ['Diabetes Comprehensive Care Package', ['HbA1c', 'Glucose', 'Serum Creatinine', 'Urea']],
      ['HbA1c & Glucose Level Monitor', ['HbA1c', 'Glucose', 'Sugar']],
      ['PCOS Health Screening', ['Thyroid', 'Calcium', 'CBC', 'Glucose']],
      ['Hormonal Balance Profile', ['Thyroid', 'Calcium', 'CBC']],
      ['Senior Citizen Care Profile - Male', ['Kidney', 'Calcium', 'Uric Acid', 'Lipid', 'CBC']],
      ['Senior Citizen Care Profile - Female', ['CA 125', 'Calcium', 'Thyroid', 'Kidney', 'Lipid', 'CBC']],
      ['Thyroid Hormone Gold Profile', ['Thyroid Profile']],
      ['Thyroid Autoimmune Auto-antibody Screen', ['Antibody', 'Thyroid Profile', 'TSH']],
      ['Essential Full Body Checkup (64 Tests)', ['CBC', 'Lipid Profile', 'Thyroid Profile', 'Liver Function Test', 'Kidney Function Test']],
      ['Advanced Full Body Checkup (85 Tests)', ['CBC', 'Lipid Profile', 'Thyroid Profile', 'Liver Function Test', 'Kidney Function Test', 'Vitamin D', 'Vitamin B12', 'Calcium', 'Glucose', 'Uric', 'Electrolytes']],
      ['Executive Full Body Checkup (120 Tests)', ['CBC', 'Lipid Profile', 'Thyroid Profile', 'Liver Function Test', 'Kidney Function Test', 'Vitamin D', 'Vitamin B12', 'Calcium', 'Glucose', 'Uric', 'Electrolytes', 'Iron']],
      ['Senior Citizen Wellness Panel', ['Kidney', 'Calcium', 'Uric Acid', 'Lipid', 'Thyroid', 'CBC']]
    ];

    for (const [pName, tTerms] of packageTestMappings) {
      const pRes = await db.query('SELECT id FROM packages WHERE name = $1', [pName]);
      if (pRes.rows.length > 0) {
        const pkgId = pRes.rows[0].id;
        for (const term of tTerms) {
          const tRes = await db.query('SELECT id FROM tests WHERE name ILIKE $1 LIMIT 3', [`%${term}%`]);
          for (const testRow of tRes.rows) {
            await db.query(`
              INSERT INTO package_tests (package_id, test_id)
              VALUES ($1, $2) ON CONFLICT DO NOTHING
            `, [pkgId, testRow.id]);
          }
        }
      }
    }

    // 7. Map Packages to all available Lab Branches at realistic prices
    console.log("Mapping packages to lab branches dynamically...");
    const packagePricingConfig = {
      'Cancer': { price: 2999, original: 3999, discount: 25 },
      'Heart': { price: 1999, original: 2499, discount: 20 },
      'Diabetes': { price: 999, original: 1299, discount: 23 },
      'Pregnancy': { price: 1499, original: 1999, discount: 25 },
      'Senior Citizen': { price: 2499, original: 2999, discount: 16 },
      'Thyroid': { price: 399, original: 499, discount: 20 },
      'Full Body Checkup': { price: 1299, original: 2499, discount: 48 }
    };

    const branchesRes = await db.query('SELECT id, lab_id FROM lab_branches');
    const pkgListRes = await db.query('SELECT id, name, category FROM packages');

    for (const pkg of pkgListRes.rows) {
      const config = packagePricingConfig[pkg.category] || { price: 1499, original: 1999, discount: 25 };
      
      // Select branches for this package
      for (const branch of branchesRes.rows) {
        // Apply slight randomization to make prices feel highly dynamic across different labs
        const priceSalt = ((branch.id * 17) % 5) * 100 - 200; // -200 to +200
        const price = Math.max(299, config.price + priceSalt);
        const originalPrice = Math.max(price + 100, Math.ceil(price / (1 - config.discount / 100)));
        const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
        
        const repTime = (branch.id % 2 === 0) ? '24 HR' : '48 HR';
        const discountLabel = `${discountPercent}% OFF`;

        await db.query(`
          INSERT INTO lab_package_branches (
            lab_id, lab_branch_id, package_id, price, original_price, discount_percent, 
            reporting_time, home_collection, discount_label, notes, is_available
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, true)
          ON CONFLICT (lab_branch_id, package_id) DO UPDATE SET
            price = EXCLUDED.price,
            original_price = EXCLUDED.original_price,
            discount_percent = EXCLUDED.discount_percent,
            reporting_time = EXCLUDED.reporting_time,
            discount_label = EXCLUDED.discount_label;
        `, [
          branch.lab_id, 
          branch.id, 
          pkg.id, 
          price, 
          originalPrice, 
          discountPercent, 
          repTime, 
          discountLabel,
          `Standard package offered by branch ${branch.id}`
        ]);
      }
    }

    // 8. Add Cancer Screening to landing page categories
    await db.query(`
      INSERT INTO packages_landing_categories (name, sub_label, starts_price, labs_count, icon, color_theme, display_order)
      VALUES ('Cancer Screening', 'Early Tumor Markers', 1499, 24, 'clinical_notes', 'tertiary', 6)
      ON CONFLICT (name) DO UPDATE SET
        sub_label = EXCLUDED.sub_label,
        starts_price = EXCLUDED.starts_price,
        labs_count = EXCLUDED.labs_count,
        icon = EXCLUDED.icon,
        color_theme = EXCLUDED.color_theme,
        display_order = EXCLUDED.display_order;
    `);

    console.log("✅ Dynamic PostgreSQL dynamic package listings migrated and seeded successfully!");
    console.log("✅ PostgreSQL Database is ready with premium package specifications!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
  }
}

module.exports = setupDatabase;
