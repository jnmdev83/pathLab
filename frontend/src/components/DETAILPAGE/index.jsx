import React from 'react';
import { S, MapLink } from '../../utils/reusables';
import { PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';

// DETAIL PAGE
export function BranchTests({ selectedBranch, branchTests, setPage, setTest, user }) {
  if (!selectedBranch) {
    return (
      <div className="fu" style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ ...S.muted, marginBottom: 14 }}>Select a lab branch first.</p>
        <button className="bl" onClick={() => setPage("home")}>Go Home</button>
      </div>
    );
  }

  const grouped = branchTests.reduce((acc, row) => {
    const cat = row.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(row);
    return acc;
  }, {});

  const bookTest = (row) => {
    setTest({
      id: row.test_id,
      name: row.test_name,
      cat: row.category,
      price: row.price,
      rep: row.reporting_time,
      ok: row.is_available,
      lab: row.lab_name,
      lab_name: row.lab_name,
      lab_id: row.lab_id,
      lab_branch_id: row.lab_branch_id,
      branch_name: row.branch_name,
      address: row.address,
      loc: `${row.branch_name}, ${row.city}`,
      branch_phone: row.branch_phone,
      operating_hours: row.operating_hours,
      home_collection: row.home_collection,
      lab_test_branch_id: row.lab_test_branch_id,
    });
    user ? setPage("booking") : setPage("signup");
  };

  return (
    <div className="fu">
      <div style={{ marginBottom: 18 }}>
        <button
          onClick={() => setPage("home")}
          style={{ background: "none", border: "none", ...S.muted, ...S.mono, fontSize: 12, cursor: "pointer" }}
        >
          Home / Location Search
        </button>
        <h1 style={{ ...S.serif, fontSize: 34, marginTop: 8 }}>
          {selectedBranch.lab_name}
        </h1>
        <div style={{ ...S.muted, fontSize: 13, lineHeight: 1.6, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <div>{selectedBranch.branch_name} Branch - {selectedBranch.address}</div>
          <div>{selectedBranch.phone || "Phone unavailable"}</div>
          <MapLink item={selectedBranch} style={{ marginTop: 2 }} />
        </div>
      </div>

      {branchTests.length === 0 ? (
        <div style={{ ...S.muted, textAlign: "center", padding: "50px 0" }}>
          No available tests at this branch yet.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, tests]) => (
          <div key={cat} style={{ marginBottom: 22 }}>
            <h2 style={{ ...S.serif, fontSize: 24, textTransform: "capitalize", marginBottom: 10 }}>
              {cat}
            </h2>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              {tests.map((row, i) => (
                <div
                  key={row.lab_test_branch_id}
                  className="tbl-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: COL_LABS,
                    padding: "15px 20px",
                    gap: 12,
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{row.test_name}</div>
                  <div style={{ ...S.muted, fontSize: 13 }}>{row.lab_name}</div>
                  <div style={{ ...S.muted, ...S.mono, fontSize: 12 }}>{selectedBranch.branch_name}</div>
                  <div style={{ ...S.tag, textAlign: "center", justifySelf: "start" }}>{row.reporting_time}</div>
                  {/* Column 5: Price */}
                  <span style={{ ...S.mono, ...S.lime, fontSize: 16, fontWeight: 700, justifySelf: "start" }}>₹{row.price}</span>
                  {/* Column 6: Action */}
                  <button className="bl" onClick={() => bookTest(row)} style={{ padding: "7px 14px", fontSize: 12, justifySelf: "start" }}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import { useState } from 'react';

// Educational descriptions for standard sub-tests
const SUBTEST_DETAILS = {
  "LFT (Liver Function)": "Evaluates liver health by measuring enzymes, proteins, and bilirubin. Vital for detecting hepatitis, liver damage, or potential side effects of medications.",
  "KFT (Kidney Function)": "Assesses kidney filtration efficiency by measuring Urea, Creatinine, and Electrolytes to check for dehydration, kidney disease, or stone risk.",
  "CBC (Complete Blood Count)": "Analyzes red/white blood cells and platelets to diagnose anemia, hidden infections, chronic inflammation, and immune system strength.",
  "Thyroid Profile": "Measures T3, T4, and TSH levels to screen for metabolic disorders like hypothyroidism (sluggishness) or hyperthyroidism (overactive metabolism).",
  "Lipid Profile": "Measures cholesterol, HDL (good), LDL (bad), and triglycerides to evaluate cardiovascular risk, heart health, and artery conditions.",
  "Blood Sugar Fasting": "Checks glucose levels in the blood after an 8-12 hour fast. The gold standard screening test for pre-diabetes and diabetes monitoring.",
  "Urine Routine": "Screens for urinary tract infections (UTIs), kidney health issues, sugar excretion, and metabolic indicators via chemical analysis.",
  "Bone Health (Calcium)": "Measures calcium levels to screen for bone density loss, osteoporosis, thyroid conditions, and nerve function.",
  "HbA1c": "Measures average blood sugar levels over the past 3 months to monitor diabetes control and insulin efficiency.",
  "Vitamin D": "Crucial for bone density, calcium absorption, muscle strength, immune system defense, and emotional well-being.",
  "Vitamin B12": "Essential for red blood cell production, healthy brain function, nerve endings, and overall energy levels.",
  "ECG": "Records electrical signals of the heart. Detects heart rate irregularities, rhythm issues, or past cardiac stress.",
  "Iron Profile": "Checks serum iron and ferritin to discover anemia, body oxygen carrying capacity, and iron store reserves.",
  "Pap Smear": "Screening for cervical cell health to check for abnormalities, infections, or early cellular changes.",
  "FSH/LH": "Hormonal test measuring follicle-stimulating and luteinizing hormone levels to track reproductive wellness and cycle regularities.",
  "Fasting": "Blood sugar check after fasting to detect insulin resistance.",
  "Blood Sugar (Fasting)": "Checks glucose levels in blood after fasting, the key standard screening test for pre-diabetes and diabetes monitoring."
};

// Target organ systems / biomarker categories for packages
const MEASURE_CATEGORIES = [
  { name: "Blood Health (CBC & ESR)", desc: "Checks for anemia, infections, and basic immunity markers.", strength: "100%" },
  { name: "Liver health (LFT)", desc: "Assesses enzymes, protein metabolism, and waste filtration.", strength: "95%" },
  { name: "Kidney Function (KFT)", desc: "Checks filtration efficiency, uric acid, and urea levels.", strength: "90%" },
  { name: "Heart Risk (Lipid Profile)", desc: "Screens cholesterol levels and cardiovascular health.", strength: "85%" },
  { name: "Thyroid & Hormone health", desc: "Measures TSH to evaluate metabolic speeds.", strength: "80%" },
  { name: "Diabetes Screening", desc: "Fasting Blood Sugar checks insulin control.", strength: "100%" }
];

export function Detail({ test, setPage, user }) {
  if (!test) return null;

  const isPackage = test.cat === "package" || test.name.toLowerCase().includes("package") || test.name.toLowerCase().includes("checkup");
  const [expandedTest, setExpandedTest] = useState(null);

  // Extract included tests from database test_includes, or fallback to static mapping or default lists
  let includes = test.test_includes;
  if (!includes || !Array.isArray(includes) || includes.length === 0) {
    includes = PACKAGE_INCLUDES[test.name];
    if (!includes) {
      // Look up case-insensitively or use a smart comprehensive fallback list
      const foundKey = Object.keys(PACKAGE_INCLUDES).find(
        k => k.toLowerCase() === test.name.toLowerCase()
      );
      includes = foundKey ? PACKAGE_INCLUDES[foundKey] : [
        "CBC (Complete Blood Count)",
        "LFT (Liver Function)",
        "KFT (Kidney Function)",
        "Lipid Profile",
        "Thyroid Profile",
        "Blood Sugar Fasting",
        "Urine Routine"
      ];
    }
  }

  // Toggle helper for accordion
  const toggleTest = (index) => {
    setExpandedTest(expandedTest === index ? null : index);
  };

  return (
    <div className="fu">
      {/* Breadcrumb */}
      <div
        style={{
          ...S.mono,
          ...S.muted,
          fontSize: 11,
          marginBottom: 22,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {[
          ["HOME", "home"],
          [test.cat.toUpperCase(), test.cat],
        ].map(([l, p]) => (
          <span
            key={p}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <button
              onClick={() => setPage(p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...S.muted,
                ...S.mono,
                fontSize: 11,
              }}
            >
              {l}
            </button>
            <span>/</span>
          </span>
        ))}
        <span style={S.lime}>{test.name}</span>
      </div>

      <div className="package-detail-grid">
        {/* LEFT COLUMN: Premium Package Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Main Info Card */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 28,
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Glowing background gradient indicator */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: "linear-gradient(90deg, var(--lime) 0%, var(--lime2) 100%)" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ ...S.pill, background: "rgba(37,99,235,.07)", color: "var(--lime)", fontWeight: 600 }}>{test.cat.toUpperCase()}</div>
              {isPackage && <span style={{ ...S.mono, fontSize: 11, color: "var(--lime)", fontWeight: 700 }}>★ SMART SMART-REPORT PACK</span>}
            </div>

            <h2
              style={{
                ...S.serif,
                fontSize: 28,
                letterSpacing: "-.015em",
                margin: "8px 0 16px",
                lineHeight: 1.25,
                color: "var(--text)"
              }}
            >
              {test.name}
            </h2>

            <div
              style={{
                width: 48,
                height: 3,
                background: "var(--lime)",
                borderRadius: 99,
                marginBottom: 20,
              }}
            />

            <h3 style={{ ...S.serif, fontSize: 18, marginBottom: 8, color: "var(--text)" }}>Know more about this package test</h3>
            <p style={{ ...S.muted, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
              {test.description || "This comprehensive full-body checkup is customized to evaluate key health parameters of your body. Designed by expert pathologists, it provides a deep clinical overview of your organ systems, helping screen for hidden issues, metabolic changes, and basic fitness markers before they turn into major symptoms."}
            </p>
          </div>

          {/* SAMPLES & PREPARATION ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Samples Required */}
            <div
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                gap: 16,
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 28, background: "rgba(37,99,235,.05)", width: 50, height: 50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>🧪</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>Samples Required</div>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--text)", marginTop: 2 }}>{test.samples_required || "Blood & Urine"}</div>
              </div>
            </div>

            {/* Preparation Required */}
            <div
              style={{
                background: "var(--card)",
                border: "1.5px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                gap: 16,
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 28, background: "rgba(37,99,235,.05)", width: 50, height: 50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>🍽️</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700 }}>Preparations Required</div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)", marginTop: 2, lineHeight: 1.3 }}>{test.preparations || "Overnight fasting required for 8 to 12 hours"}</div>
              </div>
            </div>
          </div>

          {/* WHY BOOK THIS PACKAGE? */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: "var(--text)" }}>Find out: Why is this package booked?</h3>
            </div>
            
            <div style={{ display: "grid", gap: 12 }}>
              {(Array.isArray(test.why_booked) ? test.why_booked : [
                { title: "Early Disease Screening", body: "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur." },
                { title: "Comprehensive Organ Tracking", body: "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to ensure optimal systemic metabolism." },
                { title: "Active Health Auditing", body: "Provides a benchmark assessment of your current health status to review life safety, lifestyle, and dietary patterns." }
              ]).map((reason, index) => (
                <div 
                  key={index}
                  style={{
                    padding: 16,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    display: "flex",
                    gap: 12
                  }}
                >
                  <div style={{ color: "var(--lime)", fontWeight: 700, fontSize: 14 }}>0{index + 1}.</div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{reason.title}</h4>
                    <p style={{ ...S.muted, fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>{reason.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT DOES IT MEASURE? */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: "var(--text)" }}>What does {test.name} measure?</h3>
            </div>
            <p style={{ ...S.muted, fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
              This profile tracks essential bio-indicators across major physiological categories to present a complete metabolic overview:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {(Array.isArray(test.what_it_measures) ? test.what_it_measures : MEASURE_CATEGORIES).map((cat, idx) => (
                <div key={idx} style={{ padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{cat.name}</span>
                    <span style={{ ...S.mono, fontSize: 10, color: "var(--lime)", fontWeight: 700 }}>{cat.strength || "100%"} Coverage</span>
                  </div>
                  <div style={{ ...S.muted, fontSize: 11.5, lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TESTS INCLUDED & DESCRIPTIONS (ACCORDION) */}
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: "var(--text)" }}>Test includes</h3>
                <p style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>Click on any test to see its clinical description</p>
              </div>
              <div style={{ ...S.pill, background: "rgba(37,99,235,.07)", color: "var(--lime)", fontWeight: 700 }}>
                {includes.length} Total Parameters
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {includes.map((incName, index) => {
                const isOpen = expandedTest === index;
                const desc = SUBTEST_DETAILS[incName] || SUBTEST_DETAILS[Object.keys(SUBTEST_DETAILS).find(k => incName.includes(k))] || "Measures clinical markers and values to screen, track, and monitor vital parameters related to systemic organ performance.";
                
                return (
                  <div 
                    key={incName} 
                    style={{ 
                      border: "1px solid var(--border)", 
                      borderRadius: 10,
                      overflow: "hidden",
                      transition: "all 0.15s ease",
                      background: isOpen ? "var(--surface)" : "transparent"
                    }}
                  >
                    <button
                      onClick={() => toggleTest(index)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        background: "none",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        outline: "none",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "var(--lime)", fontSize: 14 }}>✓</span>
                        <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)" }}>{incName}</span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--muted)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                        ▼
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div 
                        style={{ 
                          padding: "0 20px 18px", 
                          fontSize: 13, 
                          color: "var(--muted)", 
                          lineHeight: 1.6,
                          borderTop: "1px solid var(--border)",
                          paddingTop: 12,
                          background: "var(--bg)"
                        }}
                      >
                        <div style={{ ...S.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>Clinical Description</div>
                        {desc}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Panel */}
        <div style={{ position: "self-start", top: 24 }}>
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.04)"
            }}
          >
            <div
              style={{
                ...S.muted,
                ...S.mono,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Selected Package Offer
            </div>

            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
            >
              {[
                ["⏱", "Report: " + test.rep],
                ["💰", "₹" + test.price + " all-in"],
                [test.ok ? "✅" : "❌", test.ok ? "Available" : "Fully Booked"],
              ].map(([ic, tx]) => (
                <div key={tx} style={{ ...S.tag, display: "flex", gap: 5, fontSize: 11, background: "var(--surface)" }}>
                  <span>{ic}</span>
                  <span>{tx}</span>
                </div>
              ))}
            </div>
            
            {test.ok ? (
              <>
                <div
                  style={{
                    borderLeft: "3px solid var(--lime)",
                    paddingLeft: 14,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: "var(--text)" }}>
                    {test.lab_name || test.lab}
                  </div>
                  <div style={{ ...S.muted, ...S.mono, fontSize: 11, display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                    <div>{test.address || test.loc}</div>
                    <MapLink item={test} />
                  </div>
                </div>
                
                <div
                  style={{
                    borderLeft: "3px solid var(--border)",
                    paddingLeft: 14,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      ...S.muted,
                      ...S.mono,
                      fontSize: 11,
                      marginBottom: 2,
                    }}
                  >
                    Reporting Time
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                    Results in {test.rep}
                  </div>
                </div>
                
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1.5px solid var(--lime)",
                    borderRadius: 10,
                    padding: "14px 18px",
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        ...S.muted,
                        ...S.mono,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        marginBottom: 2,
                      }}
                    >
                      Package Price
                    </div>
                    <div
                      style={{
                        ...S.mono,
                        fontSize: 28,
                        ...S.lime,
                        fontWeight: 700,
                      }}
                    >
                      ₹ {test.price}
                    </div>
                  </div>
                  <div style={{ ...S.muted, fontSize: 11, textAlign: "right" }}>
                    Inclusive of
                    <br />
                    all charges
                  </div>
                </div>
                
                <button
                  className="bl"
                  onClick={() => (user ? setPage("booking") : setPage("signup"))}
                  style={{ width: "100%", padding: 13, fontSize: 14, borderRadius: 10 }}
                >
                  Book This Test →
                </button>
              </>
            ) : (
              <div
                style={{
                  background: "rgba(255,82,82,.07)",
                  border: "1px solid rgba(255,82,82,.3)",
                  padding: 24,
                  textAlign: "center",
                  borderRadius: 12
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>⛔</div>
                <div style={{ color: "var(--danger)", fontWeight: 600 }}>
                  Fully Booked
                </div>
                <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>
                  Please check back later
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

