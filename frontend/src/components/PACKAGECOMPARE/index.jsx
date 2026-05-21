import React, { useState, useEffect } from 'react';
import { S, compareNearby, formatDistance } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

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

      <div className="package-detail-grid">
        {/* Left Sidebar: Included Tests */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: "24px 20px", height: 'fit-content' }}>
          <h3 style={{ ...S.mono, fontSize: 13, textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📋</span> Included Diagnostics
          </h3>
          <div style={{ ...S.muted, fontSize: 11, marginBottom: 20 }}>💡 Tap any test card below to read its clinical details.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {includedTests.map(t => {
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
                  onMouseEnter={e => {
                    if (!isExpanded) e.currentTarget.style.borderColor = 'rgba(37,99,235,.3)';
                  }}
                  onMouseLeave={e => {
                    if (!isExpanded) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
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
        </div>

        {/* Right column: Compare Lab Pricing */}
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
