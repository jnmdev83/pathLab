const db = require('./config/db');

async function run() {
  try {
    const { rows: tests } = await db.query("SELECT id, name, cat, description FROM tests LIMIT 10");
    console.log("EXISTING TESTS SAMPLE:");
    console.log(JSON.stringify(tests, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
