import React, { useState, useEffect } from 'react';
import { S, getDistanceKm, compareNearby, formatDistance } from '../../utils/reusables';

export function PackageCompare({ selectedPackage, setPage, setTest, user, userLocation }) {
  const [labs, setLabs] = useState([]);
  const [includedTests, setIncludedTests] = useState([]);
  const [sort, setSort] = useState("low");

  useEffect(() => {
    if (!selectedPackage) return;

    // Fetch lab comparisons
    fetch(`http://localhost:5000/api/packages/${selectedPackage.id}/comparison`)
      .then(res => res.json())
      .then(data => setLabs(data));

    // Fetch included tests
    fetch(`http://localhost:5000/api/packages/${selectedPackage.id}/tests`)
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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 30 }}>
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
              style={{ padding: '6px 12px', ...S.mono, fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
            >
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="loc">Distance: Nearest First</option>
            </select>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <th style={{ padding: '15px 20px', ...S.mono, fontSize: 11, fontWeight: 600 }}>PATHOLOGY LAB</th>
                  <th style={{ padding: '15px 20px', ...S.mono, fontSize: 11, fontWeight: 600 }}>REPORTING TIME</th>
                  <th style={{ padding: '15px 20px', ...S.mono, fontSize: 11, fontWeight: 600 }}>OFFERS</th>
                  <th style={{ padding: '15px 20px', ...S.mono, fontSize: 11, fontWeight: 600 }}>PRICE</th>
                  <th style={{ padding: '15px 20px', ...S.mono, fontSize: 11, fontWeight: 600 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {sortedLabs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .1s' }} className="hover-row">
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{l.lab_name}</div>
                      <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>{l.branch_name}, {l.city}</div>
                      {userLocation && (
                        <div style={{ color: 'var(--lime)', fontSize: 11, ...S.mono, marginTop: 4 }}>
                          {formatDistance(l)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ ...S.tag, fontSize: 11 }}>{l.reporting_time}</span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      {l.discount_label && (
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                          {l.discount_label}
                        </span>
                      )}
                      {l.home_collection && (
                        <div style={{ fontSize: 10, color: 'var(--lime)', marginTop: 5 }}>Free Home Collection</div>
                      )}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>₹{l.price}</div>
                    </td>
                    <td style={{ padding: '20px' }}>
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
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
