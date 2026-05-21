const db = require('./config/db');

async function run() {
  try {
    const { rows: packages } = await db.query("SELECT id, name, description FROM packages");
    console.log("PACKAGES:");
    console.log(JSON.stringify(packages, null, 2));

    for (const pkg of packages) {
      const { rows: tests } = await db.query(`
        SELECT t.id, t.name, t.description 
        FROM tests t
        JOIN package_tests pt ON pt.test_id = t.id
        WHERE pt.package_id = $1
      `, [pkg.id]);
      console.log(`TESTS IN PACKAGE ${pkg.name}:`);
      console.log(JSON.stringify(tests, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
