import React, { useState, useEffect } from 'react';
import { S, getDistanceKm, compareNearby, formatDistance } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

export function PackageCompare({ selectedPackage, setPage, setTest, user, userLocation }) {
  const [labs, setLabs] = useState([]);
  const [includedTests, setIncludedTests] = useState([]);
  const [sort, setSort] = useState("low");

  useEffect(() => {
    if (!selectedPackage) return;

    // Fetch lab comparisons
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
        {/* Left: Included Tests */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, height: 'fit-content' }}>
          <h3 style={{ ...S.mono, fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Included Tests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {includedTests.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Lab Comparison Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ ...S.mono, fontSize: 14, textTransform: 'uppercase' }}>Compare Lab Pricing</h3>
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
            {sortedLabs.map(l => (
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
                  <div>
                    <button 
                      className="bl"
                      onClick={() => {
                        // Adapt the new modular package to the old "test" structure for the booking page
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
                      style={{ padding: '8px 16px', fontSize: 13 }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
