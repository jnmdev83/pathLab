const db = require('./config/db');

async function run() {
  try {
    await db.query(`DROP TABLE IF EXISTS category_previews CASCADE`);
    console.log("DROPPED");
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
      )
    `);
    console.log("CREATED TABLE SUCCESSFULLY!");
  } catch (err) {
    console.error("ERROR CREATING TABLE:", err);
  } finally {
    process.exit(0);
  }
}
run();
