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
        <button 
          onClick={() => setPage("package")}
          style={{ ...S.mono, ...S.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10 }}
        >
          ← Back to Packages
        </button>
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

      <div className="package-detail-grid">
        {/* Left Sidebar: Included Tests */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, height: 'fit-content' }}>
          <h3 style={{ ...S.mono, fontSize: 14, textTransform: 'uppercase', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📋</span> Included Tests
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...S.muted, fontSize: 11, marginBottom: 10 }}>💡 Click any test below to read its description.</div>
            {includedTests.map(t => {
              const isExpanded = !!expandedTests[t.id];
              return (
                <div 
                  key={t.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border)', 
                    padding: '12px 0', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => toggleTestExpand(t.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>✅</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</span>
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
                      marginTop: 8, 
                      marginLeft: 26, 
                      fontSize: 12, 
                      color: 'var(--muted)', 
                      lineHeight: 1.5,
                      background: 'var(--surface)',
                      padding: '10px 14px',
                      borderRadius: 8,
                      borderLeft: '2px solid var(--lime)'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 8px", borderRadius: 6, fontSize: 11 }}>
              <span style={{ ...S.mono, color: "var(--muted)" }}>{userLocation?.label || "Delhi"}</span>
              <button
                onClick={requestGeolocation}
                title="Detect Location"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: 2,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                📍
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ ...S.mono, ...S.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em' }}>Sort</span>
              <select 
                value={sort} 
                onChange={e => setSort(e.target.value)}
                style={{ padding: '6px 12px', ...S.mono, fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', width: 'auto' }}
              >
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="loc">Distance: Nearest First</option>
              </select>
            </div>
          </div>

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
