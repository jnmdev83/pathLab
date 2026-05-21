const db = require('./config/db');

async function run() {
  try {
    const { rows } = await db.query("SELECT id, branch_name, address, city, latitude, longitude FROM lab_branches WHERE branch_name ILIKE '%Stephen%'");
    console.log("BRANCHES:");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
