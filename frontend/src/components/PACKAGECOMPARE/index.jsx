import React, { useState, useEffect } from 'react';
import { S, compareNearby, formatDistance } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

// Helper to safely parse JSONB database columns (handles both parsed arrays and raw JSON strings)
const parseJsonColumn = (col, fallback) => {
  if (!col) return fallback;
  if (typeof col === 'string') {
    try {
      return JSON.parse(col);
    } catch (e) {
      return fallback;
    }
  }
  if (Array.isArray(col)) return col;
  return fallback;
};

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

  if (!selectedPackage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: 14 }}>
        <div className="pulse-shimmer" style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid var(--lime)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <span style={{ ...S.mono, ...S.muted, fontSize: 13 }}>Loading Clinical Comparisons...</span>
      </div>
    );
  }

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

  // Safe parsed database fields
  const whyBooked = parseJsonColumn(selectedPackage.why_booked, [
    { title: "Early Disease Screening", body: "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur." },
    { title: "Comprehensive Organ Tracking", body: "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to ensure optimal systemic metabolism." },
    { title: "Active Health Auditing", body: "Provides a benchmark assessment of your current health status to review life safety, lifestyle, and dietary patterns." }
  ]);

  const whatItMeasures = parseJsonColumn(selectedPackage.what_it_measures, [
    { name: "Blood Health (CBC & ESR)", desc: "Checks for anemia, infections, and basic immunity markers.", strength: "100%" },
    { name: "Liver health (LFT)", desc: "Assesses enzymes, protein metabolism, and waste filtration.", strength: "95%" },
    { name: "Kidney Function (KFT)", desc: "Checks filtration efficiency, uric acid, and urea levels.", strength: "90%" },
    { name: "Heart Risk (Lipid Profile)", desc: "Screens cholesterol levels and cardiovascular health.", strength: "85%" }
  ]);

  return (
    <div className="fu animate-in" style={{ maxWidth: 1280, margin: '0 auto' }}>
      
      {/* ── 1. PREMIUM HEADER SECTION ── */}
      <div style={{ marginBottom: 28, position: 'relative' }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setPage("package")}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--lime)',
            ...S.mono,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 14,
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          ← Back to Packages
        </button>

        {/* Title Block */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ ...S.pill, background: 'rgba(37,99,235,0.07)', color: 'var(--lime)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Health Package Details
              </span>
              <span style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                ★ Smart Report Enabled
              </span>
            </div>
            
            <h1 style={{ 
              ...S.serif, 
              fontSize: 'clamp(28px, 4vw, 42px)', 
              lineHeight: 1.15,
              color: 'var(--text)',
              margin: '0 0 10px 0',
              letterSpacing: '-.02em'
            }}>
              {selectedPackage.name}
            </h1>
            
            {/* Horizontal Divider */}
            <div style={{ width: 64, height: 4, background: 'var(--lime)', borderRadius: 99, marginBottom: 14 }} />

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{ ...S.mono, fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 8 }}>
                📋 <strong>{includedTests.length}</strong> Diagnostics Mapped
              </span>
              <span style={{ ...S.mono, fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 8 }}>
                🏥 <strong>{labs.length}</strong> Certified Labs Available
              </span>
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignSelf: 'flex-end' }}>
            <label style={{ margin: 0, fontSize: 10 }}>Compare Pricing By</label>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)}
              style={{ 
                padding: '10px 16px', 
                ...S.mono, 
                fontSize: 12, 
                borderRadius: 10, 
                border: '1.5px solid var(--border)', 
                background: 'var(--surface)',
                width: '210px',
                cursor: 'pointer'
              }}
            >
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="loc">Distance: Nearest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN SYSTEMATIC PORTAL GRID ── */}
      <div className="package-compare-grid">
        
        {/* ================= LEFT COLUMN: CLINICAL CARD PROFILE ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Card 1: Clinical Narrative */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '26px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
            <h3 style={{ ...S.serif, fontSize: 20, marginBottom: 10, color: 'var(--text)' }}>Diagnostic Description</h3>
            <p style={{ ...S.muted, fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>
              {selectedPackage.description || "This comprehensive full-body checkup is customized to evaluate key health parameters of your body. Designed by expert pathologists, it provides a deep clinical overview of your organ systems, helping screen for hidden issues, metabolic changes, and basic fitness markers before they turn into major symptoms."}
            </p>
          </div>

          {/* Card 2: Specimen Samples & Fasting Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Samples Card */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 24, background: 'rgba(37,99,235,0.05)', color: 'var(--lime)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🧪</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Specimen Type</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginTop: 2 }}>{selectedPackage.samples_required || "Blood & Urine"}</div>
              </div>
            </div>

            {/* Preparation Card */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 24, background: 'rgba(37,99,235,0.05)', color: 'var(--lime)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
              <div>
                <div style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Fasting Guidelines</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginTop: 2, lineHeight: 1.3 }}>{selectedPackage.preparations || "Overnight fasting required for 8 to 12 hours"}</div>
              </div>
            </div>
          </div>

          {/* Card 3: Why Choose This Package (Clinical Advisory timeline) */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '26px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <h3 style={{ ...S.serif, fontSize: 20, margin: 0, color: 'var(--text)' }}>Why is this package booked?</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {whyBooked.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 14, background: 'var(--surface)', border: '1px solid var(--border)', padding: 16, borderRadius: 12 }}>
                  <div style={{ 
                    ...S.mono, 
                    background: 'var(--card)', 
                    color: 'var(--lime)', 
                    border: '1.5px solid var(--border)', 
                    borderRadius: 8, 
                    width: 32, 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 700, 
                    fontSize: 12,
                    flexShrink: 0
                  }}>
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px 0' }}>{reason.title}</h4>
                    <p style={{ ...S.muted, fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>{reason.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Organ coverage & Biomarkers */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '26px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <h3 style={{ ...S.serif, fontSize: 20, margin: 0, color: 'var(--text)' }}>Organ System Coverages</h3>
            </div>
            <p style={{ ...S.muted, fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
              Tracks bio-indicators across vital physiological parameters to guarantee comprehensive health tracking:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {whatItMeasures.map((cat, idx) => {
                const strengthPct = cat.strength || "100%";
                return (
                  <div key={idx} style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{cat.name}</span>
                      <span style={{ ...S.mono, fontSize: 10, color: 'var(--lime)', fontWeight: 700, background: 'rgba(37,99,235,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                        {strengthPct} Coverage
                      </span>
                    </div>
                    
                    <p style={{ ...S.muted, fontSize: 12, lineHeight: 1.45, margin: '0 0 12px 0', flexGrow: 1 }}>{cat.desc}</p>
                    
                    {/* Clinical coverage progress tracker */}
                    <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: strengthPct, height: '100%', background: 'linear-gradient(90deg, var(--lime) 0%, #3b82f6 100%)', borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 5: Interactive Accordion of Sub-tests (Database driven) */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '26px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ ...S.serif, fontSize: 20, margin: 0, color: 'var(--text)' }}>Mapped Diagnostics</h3>
                <p style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>💡 Click on any test card below to read its clinical details.</p>
              </div>
              <div style={{ ...S.pill, background: 'rgba(37,99,235,.07)', color: 'var(--lime)', fontWeight: 700, fontSize: 11 }}>
                {includedTests.length} Total Parameters
              </div>
            </div>

            {includedTests.length === 0 ? (
              <div style={{ ...S.muted, textAlign: 'center', padding: '24px 0', fontSize: 13 }}>
                No active sub-tests mapped to this package.
              </div>
            ) : (
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
                          {t.description || "Diagnostic laboratory test included as part of this healthcare screening package."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT COLUMN: LAB DIRECTORY & DIRECT BOOKING ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: 4 }}>
            <h3 style={{ ...S.serif, fontSize: 20, color: 'var(--text)', margin: 0 }}>Available Laboratories</h3>
            <span style={{ ...S.mono, fontSize: 11, color: 'var(--muted)' }}>
              ({sortedLabs.length} rates found)
            </span>
          </div>

          {sortedLabs.length === 0 ? (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 32 }}>🏥</span>
              <h4 style={{ margin: 0, fontWeight: 700 }}>No Available Pathology Labs</h4>
              <p style={{ ...S.muted, fontSize: 13, margin: 0 }}>No laboratories in Delhi are offering this package at this time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sortedLabs.map((l) => {
                // Calculate simulated discount originally
                const originalPrice = Math.round(l.price * 1.25);
                
                return (
                  <div 
                    key={l.id} 
                    style={{ 
                      background: 'var(--card)', 
                      border: '1.5px solid var(--border)', 
                      borderRadius: 16, 
                      padding: 20, 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.015)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--lime)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.015)';
                    }}
                  >
                    
                    {/* Glowing highlight indicator */}
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'var(--lime)' }} />

                    {/* Lab Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>{l.lab_name}</div>
                        <div style={{ ...S.muted, fontSize: 12, marginTop: 3 }}>
                          📍 {l.branch_name}, {l.city}
                        </div>
                        {userLocation && (
                          <div style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            🚗 {formatDistance(l)} away
                          </div>
                        )}
                      </div>

                      {/* Distance / verified badge */}
                      <span style={{ ...S.pill, background: 'rgba(37,99,235,0.05)', color: 'var(--lime)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                        ✓ Certified
                      </span>
                    </div>

                    {/* Specifications List */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                      <span style={{ fontSize: 11, ...S.mono, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
                        ⏱️ Report: {l.reporting_time}
                      </span>
                      {l.home_collection && (
                        <span style={{ fontSize: 11, ...S.mono, color: '#16a34a', background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.15)', padding: '4px 10px', borderRadius: 8 }}>
                          🏠 Free Collection
                        </span>
                      )}
                      {l.discount_label && (
                        <span style={{ fontSize: 11, ...S.mono, color: '#b45309', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>
                          🔥 {l.discount_label}
                        </span>
                      )}
                    </div>

                    {/* Pricing & Checkout Block */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: 'var(--surface)', 
                      padding: '12px 16px', 
                      borderRadius: 12, 
                      border: '1px solid var(--border)' 
                    }}>
                      <div>
                        <div style={{ fontSize: 10, ...S.mono, color: 'var(--muted)', textDecoration: 'line-through' }}>₹{originalPrice}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>₹{l.price}</span>
                          <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 700 }}>20% OFF</span>
                        </div>
                      </div>

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
                        style={{ 
                          padding: '10px 24px', 
                          fontSize: 13, 
                          fontWeight: 700,
                          borderRadius: 10,
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                        }}
                      >
                        Book Package
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
