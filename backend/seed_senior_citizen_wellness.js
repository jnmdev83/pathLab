const db = require('./config/db');

async function run() {
  try {
    console.log("Seeding Senior Citizen Wellness Panel subtests...");
    
    // Find the package id
    const pRes = await db.query("SELECT id FROM packages WHERE name = 'Senior Citizen Wellness Panel'");
    if (pRes.rows.length === 0) {
      console.log("Package 'Senior Citizen Wellness Panel' not found.");
      process.exit(0);
    }
    const pkgId = pRes.rows[0].id;
    console.log(`Found package with ID: ${pkgId}`);

    const tTerms = ['Kidney', 'Calcium', 'Uric Acid', 'Lipid', 'Thyroid', 'CBC'];
    let count = 0;

    for (const term of tTerms) {
      const tRes = await db.query('SELECT id, name FROM tests WHERE name ILIKE $1 LIMIT 3', [`%${term}%`]);
      for (const testRow of tRes.rows) {
        await db.query(`
          INSERT INTO package_tests (package_id, test_id)
          VALUES ($1, $2) ON CONFLICT DO NOTHING
        `, [pkgId, testRow.id]);
        console.log(`Mapped test: ${testRow.name}`);
        count++;
      }
    }

    console.log(`Successfully mapped ${count} tests to Senior Citizen Wellness Panel!`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
