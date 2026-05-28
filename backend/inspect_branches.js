const db = require('./config/db');

async function run() {
  try {
    const branches = await db.query("SELECT id, branch_name, city, latitude, longitude FROM lab_branches");
    const testBranches = await db.query("SELECT * FROM lab_test_branches LIMIT 10");
    console.log("BRANCHES:");
    console.log(JSON.stringify(branches.rows, null, 2));
    console.log("TEST BRANCHES SAMPLE:");
    console.log(JSON.stringify(testBranches.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
