import React, { useState, useEffect } from 'react';
import { S, compareNearby, formatDistance } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

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

const MEASURE_CATEGORIES = [
  { name: "Blood Health (CBC & ESR)", desc: "Checks for anemia, infections, and basic immunity markers.", strength: "100%" },
  { name: "Liver health (LFT)", desc: "Assesses enzymes, protein metabolism, and waste filtration.", strength: "95%" },
  { name: "Kidney Function (KFT)", desc: "Checks filtration efficiency, uric acid, and urea levels.", strength: "90%" },
  { name: "Heart Risk (Lipid Profile)", desc: "Screens cholesterol levels and cardiovascular health.", strength: "85%" },
  { name: "Thyroid & Hormone health", desc: "Measures TSH to evaluate metabolic speeds.", strength: "80%" },
  { name: "Diabetes Screening", desc: "Fasting Blood Sugar checks insulin control.", strength: "100%" }
];

export function PackageCompare({ selectedPackage, setPage, setTest, user, userLocation, setUserLocation, requestGeolocation }) {
  const [labs, setLabs] = useState([]);
  const [includedTests, setIncludedTests] = useState([]);
  const [sort, setSort] = useState("low");

  // State for Accordion
  const [expandedTests, setExpandedTests] = useState({});

  useEffect(() => {
    if (!selectedPackage) return;

    // Fetch lab comparisons/pricing
    fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}/comparison`)
      .then(res => res.json())
      .then(data => setLabs(data));

    // Fetch included tests
    fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}/tests`)
      .then(res => res.json())
      .then(data => setIncludedTests(data));
  }, [selectedPackage]);

  if (!selectedPackage) return <div>Loading...</div>;

  const sortedLabs = [...labs].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "loc") return compareNearby(a, b);
    return 0;
  });

  const toggleTestExpand = (testId) => {
    setExpandedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  return (
    <div className="fu animate-in">
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ ...S.serif, fontSize: 38, marginBottom: 10 }}>{selectedPackage.name}</h1>
        <p style={{ ...S.muted, maxWidth: 700, fontSize: 16 }}>{selectedPackage.description}</p>
        
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <span style={{ ...S.pill, background: 'var(--lime)', color: '#fff' }}>
            {includedTests.length} Tests Included
          </span>
          <span style={{ ...S.pill, background: 'var(--border)' }}>
            {labs.length} Labs Offering this
          </span>
        </div>
      </div>

      {/* Full-width Actions Header: Back button on the Left, Sort options on the Right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button 
          onClick={() => setPage("package")}
          style={{
            ...S.mono,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(37,99,235,.05)',
            color: 'var(--lime)',
            border: '1px solid rgba(37,99,235,.15)',
            padding: '4px 10px',
            borderRadius: 99,
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,99,235,.05)'}
        >
          ← Back to Packages
        </button>

        <select 
          value={sort} 
          onChange={e => setSort(e.target.value)}
          style={{ padding: '4px 8px', ...S.mono, fontSize: 11, borderRadius: 6, border: '1px solid var(--border)', width: 'auto' }}
        >
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="loc">Distance: Nearest First</option>
        </select>
      </div>

      <div className="package-compare-grid">
        {/* Left Column: Premium Package Clinical Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Main Info Card */}
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: 28,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, var(--lime) 0%, var(--lime) 100%)' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ ...S.pill, background: 'rgba(37,99,235,.07)', color: 'var(--lime)', fontWeight: 600 }}>HEALTH PACKAGE</div>
              <span style={{ ...S.mono, fontSize: 11, color: 'var(--lime)', fontWeight: 700 }}>★ SMART SMART-REPORT PACK</span>
            </div>

            <h2
              style={{
                ...S.serif,
                fontSize: 28,
                letterSpacing: '-.015em',
                margin: '8px 0 16px',
                lineHeight: 1.25,
                color: 'var(--text)'
              }}
            >
              {selectedPackage.name}
            </h2>

            <div
              style={{
                width: 48,
                height: 3,
                background: 'var(--lime)',
                borderRadius: 99,
                marginBottom: 20,
              }}
            />

            <h3 style={{ ...S.serif, fontSize: 18, marginBottom: 8, color: 'var(--text)' }}>Know more about this package test</h3>
            <p style={{ ...S.muted, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
              {selectedPackage.description || "This comprehensive full-body checkup is customized to evaluate key health parameters of your body. Designed by expert pathologists, it provides a deep clinical overview of your organ systems, helping screen for hidden issues, metabolic changes, and basic fitness markers before they turn into major symptoms."}
            </p>
          </div>

          {/* SAMPLES & PREPARATION ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Samples Required */}
            <div
              style={{
                background: 'var(--card)',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: 28, background: 'rgba(37,99,235,.05)', width: 50, height: 50, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🧪</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Samples Required</div>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--text)', marginTop: 2 }}>{selectedPackage.samples_required || "Blood & Urine"}</div>
              </div>
            </div>

            {/* Preparation Required */}
            <div
              style={{
                background: 'var(--card)',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: 28, background: 'rgba(37,99,235,.05)', width: 50, height: 50, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Preparations Required</div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)', marginTop: 2, lineHeight: 1.3 }}>{selectedPackage.preparations || "Overnight fasting required for 8 to 12 hours"}</div>
              </div>
            </div>
          </div>

          {/* WHY BOOK THIS PACKAGE? */}
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: 'var(--text)' }}>Find out: Why is this package booked?</h3>
            </div>
            
            <div style={{ display: 'grid', gap: 12 }}>
              {(Array.isArray(selectedPackage.why_booked) ? selectedPackage.why_booked : [
                { title: "Early Disease Screening", body: "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur." },
                { title: "Comprehensive Organ Tracking", body: "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to ensure optimal systemic metabolism." },
                { title: "Active Health Auditing", body: "Provides a benchmark assessment of your current health status to review life safety, lifestyle, and dietary patterns." }
              ]).map((reason, index) => (
                <div 
                  key={index}
                  style={{
                    padding: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    display: 'flex',
                    gap: 12
                  }}
                >
                  <div style={{ color: 'var(--lime)', fontWeight: 700, fontSize: 14 }}>0{index + 1}.</div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{reason.title}</h4>
                    <p style={{ ...S.muted, fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>{reason.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT DOES IT MEASURE? */}
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: 'var(--text)' }}>What does {selectedPackage.name} measure?</h3>
            </div>
            <p style={{ ...S.muted, fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
              This profile tracks essential bio-indicators across major physiological categories to present a complete metabolic overview:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {(Array.isArray(selectedPackage.what_it_measures) ? selectedPackage.what_it_measures : MEASURE_CATEGORIES).map((cat, idx) => (
                <div key={idx} style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{cat.name}</span>
                    <span style={{ ...S.mono, fontSize: 10, color: 'var(--lime)', fontWeight: 700 }}>{cat.strength || "100%"} Coverage</span>
                  </div>
                  <div style={{ ...S.muted, fontSize: 11.5, lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TESTS INCLUDED & DESCRIPTIONS (ACCORDION) */}
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ ...S.serif, fontSize: 18, margin: 0, color: 'var(--text)' }}>Test includes</h3>
                <p style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>💡 Click on any test card below to read its clinical details.</p>
              </div>
              <div style={{ ...S.pill, background: 'rgba(37,99,235,.07)', color: 'var(--lime)', fontWeight: 700 }}>
                {includedTests.length} Included Diagnostics
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {includedTests.map((t) => {
                const isExpanded = !!expandedTests[t.id];
                let catLabel = "🧪 Diagnostic";
                let catBg = "rgba(37,99,235,.05)";
                let catColor = "var(--lime)";
                
                const category = (t.cat || '').toLowerCase();
                if (category.includes("blood")) {
                  catLabel = "🩸 Blood Specimen";
                  catBg = "rgba(239,68,68,.05)";
                  catColor = "#ef4444";
                } else if (category.includes("oncology") || category.includes("cancer")) {
                  catLabel = "🎗 Oncology Marker";
                  catBg = "rgba(139,92,246,.05)";
                  catColor = "#8b5cf6";
                } else if (category.includes("scanning") || category.includes("imaging")) {
                  catLabel = "📸 Imaging Scan";
                  catBg = "rgba(245,158,11,.05)";
                  catColor = "#f59e0b";
                } else if (category.includes("cardiac") || category.includes("heart")) {
                  catLabel = "❤️ Cardiology";
                  catBg = "rgba(236,72,153,.05)";
                  catColor = "#ec4899";
                }

                const subDescription = t.description || SUBTEST_DETAILS[t.name] || SUBTEST_DETAILS[Object.keys(SUBTEST_DETAILS).find(k => t.name.includes(k))] || "Diagnostic laboratory test included as part of this healthcare screening package.";

                return (
                  <div 
                    key={t.id} 
                    style={{ 
                      border: isExpanded ? '1px solid var(--lime)' : '1px solid var(--border)', 
                      borderRadius: 12,
                      padding: '14px 16px', 
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(37,99,235,.02)' : 'var(--card)',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => toggleTestExpand(t.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t.name}</span>
                        <div>
                          <span style={{ 
                            fontSize: 9, 
                            fontWeight: 700, 
                            color: catColor, 
                            background: catBg, 
                            padding: '3px 8px', 
                            borderRadius: 6, 
                            textTransform: 'uppercase',
                            letterSpacing: '.05em'
                          }}>
                            {catLabel}
                          </span>
                        </div>
                      </div>
                      <span style={{ 
                        fontSize: 10, 
                        color: 'var(--muted)', 
                        transition: 'transform 0.2s', 
                        transform: isExpanded ? 'rotate(180deg)' : 'none' 
                      }}>
                        ▼
                      </span>
                    </div>
                    {isExpanded && (
                      <div style={{ 
                        marginTop: 12, 
                        fontSize: 12, 
                        color: 'var(--muted)', 
                        lineHeight: 1.5,
                        background: 'var(--surface)',
                        padding: '12px 14px',
                        borderRadius: 8,
                        borderLeft: '3px solid var(--lime)'
                      }}>
                        {subDescription}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Compare Lab Pricing */}
        <div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Header row on desktop */}
            <div className="comparison-header">
              <div>PATHOLOGY LAB</div>
              <div>REPORTING TIME</div>
              <div>OFFERS</div>
              <div>PRICE</div>
              <div>ACTION</div>
            </div>

            {/* Comparison Cards list */}
            {sortedLabs.map(l => {
              return (
                <div key={l.id} className="comparison-card">
                  {/* 1. Lab Info */}
                  <div>
                    <div className="lab-title">{l.lab_name}</div>
                    <div className="lab-branch">{l.branch_name}, {l.city}</div>
                    {userLocation && (
                      <div className="lab-distance">
                        {formatDistance(l)}
                      </div>
                    )}
                  </div>

                  {/* 2. Reporting Time */}
                  <div>
                    <span style={{ ...S.tag, fontSize: 11 }}>{l.reporting_time}</span>
                  </div>

                  {/* 3. Offers */}
                  <div className="lab-details">
                    {l.discount_label && (
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, display: 'inline-block' }}>
                        {l.discount_label}
                      </span>
                    )}
                    {l.home_collection && (
                      <div style={{ fontSize: 10, color: 'var(--lime)', marginTop: l.discount_label ? 5 : 0 }}>Free Home Collection</div>
                    )}
                  </div>

                  {/* 4 & 5. Booking Info */}
                  <div className="lab-booking">
                    <div className="lab-price">₹{l.price}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button 
                        className="bl"
                        onClick={() => {
                          const mockTest = {
                            id: `pkg-${l.id}`,
                            name: selectedPackage.name,
                            price: l.price,
                            lab: l.lab_name,
                            loc: `${l.branch_name}, ${l.city}`,
                            lab_branch_id: l.lab_branch_id,
                            cat: 'package'
                          };
                          setTest(mockTest);
                          user ? setPage("booking") : setPage("signup");
                        }}
                        style={{ padding: '8px 20px', fontSize: 13 }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
