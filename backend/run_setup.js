const setupDatabase = require('./models/setup');

async function run() {
  console.log("Starting manual database setup run...");
  await setupDatabase();
  console.log("Manual database setup run completed successfully!");
  process.exit(0);
}

run().catch(err => {
  console.error("Error during manual setup run:", err);
  process.exit(1);
});
