const db = require('./config/db');

async function getOrInsertTest(name, cat, description) {
  const { rows } = await db.query("SELECT id FROM tests WHERE lower(name) = lower($1)", [name]);
  if (rows.length > 0) return rows[0].id;

  const result = await db.query(
    "INSERT INTO tests (name, cat, description) VALUES ($1, $2, $3) RETURNING id",
    [name, cat, description]
  );
  return result.rows[0].id;
}

async function run() {
  try {
    console.log("Starting package tests seeding...");

    // 1. Seed dummy/real tests that might be missing
    const HbA1c = await getOrInsertTest(
      "HbA1c (Glycated Haemoglobin)", 
      "blood", 
      "Measures average blood sugar levels over the past 3 months. Essential for tracking diabetes control."
    );
    const PostPrandial = await getOrInsertTest(
      "Blood Sugar (Post Prandial)", 
      "blood", 
      "Measures blood sugar level 2 hours after a meal to evaluate body's insulin response."
    );
    const TSH = await getOrInsertTest(
      "Thyroid Stimulating Hormone (TSH)", 
      "blood", 
      "Checks thyroid function by measuring TSH in blood. High levels suggest underactive thyroid (hypothyroidism)."
    );
    const ECG = await getOrInsertTest(
      "ECG (Electrocardiogram)", 
      "cardiac", 
      "Records electrical signals of the heart. Used to detect heart rate, rhythm issues, or past cardiac events."
    );
    const CBC = await getOrInsertTest(
      "Complete Blood Count (CBC)", 
      "blood", 
      "Checks overall health by measuring red blood cells, white blood cells, platelets, and haemoglobin."
    );
    const PapSmear = await getOrInsertTest(
      "Pap Smear Screening", 
      "oncology", 
      "Cervical cell screening to detect early changes that could lead to cervical cancer."
    );

    // Get existing tests
    const getTestId = async (name) => {
      const { rows } = await db.query("SELECT id FROM tests WHERE name = $1 OR name ILIKE $2", [name, `%${name}%`]);
      return rows.length > 0 ? rows[0].id : null;
    };

    const CEA = await getTestId("Tumor Marker - CEA");
    const CA125 = await getTestId("Tumor Marker - CA 125");
    const PSA = await getTestId("Tumor Marker - PSA");
    const PET = await getTestId("PET Scan");
    const CT = await getTestId("CT Scan");
    const Fasting = await getTestId("Blood Sugar (Fasting)");
    const Lipid = await getTestId("Lipid Profile");
    const LFT = await getTestId("Liver Function Test");
    const RFT = await getTestId("Renal Function Test");
    const ESR = await getTestId("ESR");

    // Fetch all packages
    const { rows: packages } = await db.query("SELECT id, name FROM packages");
    console.log(`Found ${packages.length} packages to seed tests for.`);

    // Clear existing package_tests mappings first to prevent duplicates
    await db.query("DELETE FROM package_tests");

    for (const pkg of packages) {
      const name = pkg.name.toLowerCase();
      const testIds = [];

      if (name.includes("cancer")) {
        if (CEA) testIds.push(CEA);
        if (CA125) testIds.push(CA125);
        if (PSA) testIds.push(PSA);
        if (PapSmear) testIds.push(PapSmear);
        if (PET) testIds.push(PET);
        if (CT) testIds.push(CT);
      } else if (name.includes("diab")) {
        if (Fasting) testIds.push(Fasting);
        if (PostPrandial) testIds.push(PostPrandial);
        if (HbA1c) testIds.push(HbA1c);
        if (RFT) testIds.push(RFT);
        if (Lipid) testIds.push(Lipid);
      } else if (name.includes("cardiac") || name.includes("heart")) {
        if (ECG) testIds.push(ECG);
        if (Lipid) testIds.push(Lipid);
        if (RFT) testIds.push(RFT);
        if (CBC) testIds.push(CBC);
      } else if (name.includes("thyroid")) {
        if (TSH) testIds.push(TSH);
        if (CBC) testIds.push(CBC);
      } else if (name.includes("complete") || name.includes("checkup") || name.includes("health")) {
        if (CBC) testIds.push(CBC);
        if (Fasting) testIds.push(Fasting);
        if (Lipid) testIds.push(Lipid);
        if (LFT) testIds.push(LFT);
        if (RFT) testIds.push(RFT);
        if (TSH) testIds.push(TSH);
        if (ESR) testIds.push(ESR);
      } else {
        // Fallback dummy tests
        if (CBC) testIds.push(CBC);
        if (Fasting) testIds.push(Fasting);
      }

      // Filter out nulls and insert unique IDs
      const uniqueTestIds = [...new Set(testIds.filter(Boolean))];
      console.log(`Seeding package "${pkg.name}" with ${uniqueTestIds.length} tests...`);

      for (const tId of uniqueTestIds) {
        await db.query(
          "INSERT INTO package_tests (package_id, test_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [pkg.id, tId]
        );
      }
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Critical Seeding Error:", err);
  } finally {
    process.exit(0);
  }
}

run();
