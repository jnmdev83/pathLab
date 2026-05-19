import React, { useState, useEffect } from 'react';
import { S, getDistanceKm, compareNearby, formatDistance } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

export function PackageCompare({ selectedPackage, setPage, setTest, user, userLocation }) {
  const [labs, setLabs] = useState([]);
  const [includedTests, setIncludedTests] = useState([]);
  const [sort, setSort] = useState("low");

  // State for Accordion
  const [expandedTests, setExpandedTests] = useState({});

  // States for Package vs Package Comparison
  const [allPackages, setAllPackages] = useState([]);
  const [comparePkgId, setComparePkgId] = useState("");
  const [comparePkgTests, setComparePkgTests] = useState([]);
  const [comparePkgData, setComparePkgData] = useState(null);
  const [compareTab, setCompareTab] = useState("all");

  // States for Lab vs Lab Comparison
  const [selectedLabsForCompare, setSelectedLabsForCompare] = useState([]);
  const [labATests, setLabATests] = useState([]);
  const [labBTests, setLabBTests] = useState([]);
  const [isLoadingLabTests, setIsLoadingLabTests] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

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

    // Fetch other packages for package comparison dropdown
    fetch(`${API_BASE_URL}/api/packages`)
      .then(res => res.json())
      .then(data => setAllPackages(data.filter(p => p.id !== selectedPackage.id)));
  }, [selectedPackage]);

  // Load compared package tests when dropdown changes
  useEffect(() => {
    if (!comparePkgId) {
      setComparePkgTests([]);
      setComparePkgData(null);
      return;
    }
    const pkg = allPackages.find(p => p.id === Number(comparePkgId));
    setComparePkgData(pkg);

    fetch(`${API_BASE_URL}/api/packages/${comparePkgId}/tests`)
      .then(res => res.json())
      .then(data => setComparePkgTests(data));
  }, [comparePkgId, allPackages]);

  // Load compared lab tests when 2 labs are selected
  useEffect(() => {
    if (selectedLabsForCompare.length === 2) {
      setIsLoadingLabTests(true);
      setIsCompareModalOpen(true);
      const [labA, labB] = selectedLabsForCompare;

      Promise.all([
        fetch(`${API_BASE_URL}/api/branches/${labA.lab_branch_id}/tests`).then(res => res.json()),
        fetch(`${API_BASE_URL}/api/branches/${labB.lab_branch_id}/tests`).then(res => res.json())
      ])
      .then(([testsA, testsB]) => {
        setLabATests(testsA);
        setLabBTests(testsB);
        setIsLoadingLabTests(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingLabTests(false);
      });
    }
  }, [selectedLabsForCompare]);

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

  const handleLabSelectForCompare = (lab) => {
    setSelectedLabsForCompare(prev => {
      const alreadySelected = prev.find(l => l.id === lab.id);
      if (alreadySelected) {
        return prev.filter(l => l.id !== lab.id);
      }
      if (prev.length >= 2) {
        return [prev[0], lab];
      }
      return [...prev, lab];
    });
  };

  // Helper matching tests by name to check if offered by branch
  const isTestOffered = (labTests, packageTest) => {
    return labTests.some(t => 
      t.test_name.toLowerCase().includes(packageTest.name.toLowerCase()) || 
      packageTest.name.toLowerCase().includes(t.test_name.toLowerCase())
    );
  };

  // Package-to-package comparison sets
  const pkgATestNames = includedTests.map(t => t.name.toLowerCase());
  const pkgBTestNames = comparePkgTests.map(t => t.name.toLowerCase());

  const commonTests = includedTests.filter(t => pkgBTestNames.includes(t.name.toLowerCase()));
  const onlyInA = includedTests.filter(t => !pkgBTestNames.includes(t.name.toLowerCase()));
  const onlyInB = comparePkgTests.filter(t => !pkgATestNames.includes(t.name.toLowerCase()));

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
        {/* Left Sidebar: Included Tests & Package Comparison */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, height: 'fit-content' }}>
          
          {/* Package-to-Package Comparison Dropdown */}
          <div style={{ marginBottom: 20, paddingBottom: 15, borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ ...S.mono, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📊</span> Compare with Another Package
            </h4>
            <select
              value={comparePkgId}
              onChange={e => {
                setComparePkgId(e.target.value);
                setCompareTab("all");
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 13,
                cursor: 'pointer',
                ...S.mono
              }}
            >
              <option value="">-- Select Package --</option>
              {allPackages.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <h3 style={{ ...S.mono, fontSize: 14, textTransform: 'uppercase', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📋</span> {comparePkgId ? 'Package Comparison Results' : 'Included Tests'}
          </h3>

          {/* Standard Accordion View of Tests */}
          {!comparePkgId ? (
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
          ) : (
            /* Compared Packages Tabbed View */
            <div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 15, flexWrap: 'wrap' }}>
                {['all', 'common', 'onlyA', 'onlyB'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCompareTab(tab)}
                    style={{
                      padding: '6px 10px',
                      fontSize: 10,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      background: compareTab === tab ? 'var(--lime)' : 'var(--surface)',
                      color: compareTab === tab ? '#fff' : 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      ...S.mono
                    }}
                  >
                    {tab === 'all' && `All (${includedTests.length + onlyInB.length})`}
                    {tab === 'common' && `Common (${commonTests.length})`}
                    {tab === 'onlyA' && `Only Here (${onlyInA.length})`}
                    {tab === 'onlyB' && `Only There (${onlyInB.length})`}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {compareTab === 'all' && (
                  <>
                    {includedTests.map(t => (
                      <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                          <span style={{ ...S.pill, background: pkgBTestNames.includes(t.name.toLowerCase()) ? 'var(--border)' : 'rgba(37,99,235,0.1)', color: pkgBTestNames.includes(t.name.toLowerCase()) ? 'var(--text)' : 'var(--lime)', fontSize: 9 }}>
                            {pkgBTestNames.includes(t.name.toLowerCase()) ? 'In Both' : 'Only Here'}
                          </span>
                        </div>
                        <p style={{ ...S.muted, fontSize: 11, margin: 0 }}>{t.description || "Diagnostic laboratory test included for evaluation."}</p>
                      </div>
                    ))}
                    {onlyInB.map(t => (
                      <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                          <span style={{ ...S.pill, background: 'rgba(245,158,11,0.1)', color: '#d97706', fontSize: 9 }}>
                            Only in {comparePkgData?.name.split(' ')[0]}
                          </span>
                        </div>
                        <p style={{ ...S.muted, fontSize: 11, margin: 0 }}>{t.description || "Diagnostic laboratory test included for evaluation."}</p>
                      </div>
                    ))}
                  </>
                )}

                {compareTab === 'common' && commonTests.map(t => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ ...S.pill, background: 'var(--border)', fontSize: 9 }}>In Both</span>
                    </div>
                    <p style={{ ...S.muted, fontSize: 11, margin: 0 }}>{t.description || "Diagnostic laboratory test included for evaluation."}</p>
                  </div>
                ))}

                {compareTab === 'onlyA' && onlyInA.map(t => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ ...S.pill, background: 'rgba(37,99,235,0.1)', color: 'var(--lime)', fontSize: 9 }}>Only Here</span>
                    </div>
                    <p style={{ ...S.muted, fontSize: 11, margin: 0 }}>{t.description || "Diagnostic laboratory test included for evaluation."}</p>
                  </div>
                ))}

                {compareTab === 'onlyB' && onlyInB.map(t => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ ...S.pill, background: 'rgba(245,158,11,0.1)', color: '#d97706', fontSize: 9 }}>Only There</span>
                    </div>
                    <p style={{ ...S.muted, fontSize: 11, margin: 0 }}>{t.description || "Diagnostic laboratory test included for evaluation."}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Compare Lab Pricing & Compare Lab Selector */}
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
            {sortedLabs.map(l => {
              const isSelectedForCompare = selectedLabsForCompare.some(selected => selected.id === l.id);
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

                  {/* 4 & 5. Booking Info & Compare Selector */}
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
                        style={{ padding: '8px 16px', fontSize: 13 }}
                      >
                        Book
                      </button>
                      <button
                        onClick={() => handleLabSelectForCompare(l)}
                        style={{
                          padding: '8px 12px',
                          fontSize: 12,
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: isSelectedForCompare ? 'var(--lime)' : 'var(--surface)',
                          color: isSelectedForCompare ? '#fff' : 'var(--text)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          ...S.mono
                        }}
                      >
                        {isSelectedForCompare ? '✓ Selected' : '⚖ Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STICKY FLOATING COMPARE ACTION BAR */}
      {selectedLabsForCompare.length === 1 && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '2px solid var(--lime)',
          borderRadius: 18,
          padding: '14px 24px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          zIndex: 999,
          width: '90%',
          maxWidth: 550,
          justifyContent: 'space-between',
          animation: 'pulse-shimmer 2s infinite ease-in-out'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            ⚡ Compare: <strong>{selectedLabsForCompare[0].lab_name.split(' ')[0]}</strong> is active. Select a second lab to compare tests side-by-side!
          </div>
          <button 
            onClick={() => setSelectedLabsForCompare([])}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: 12,
              padding: '4px 8px'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* FULLSCREEN RESPONSIVE LAB-TO-LAB COMPARISON MODAL */}
      {isCompareModalOpen && selectedLabsForCompare.length === 2 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            width: '100%',
            maxWidth: 780,
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <h2 style={{ ...S.serif, fontSize: 22, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚖</span> Side-by-Side Lab Comparison
              </h2>
              <button 
                onClick={() => {
                  setIsCompareModalOpen(false);
                  setSelectedLabsForCompare([]);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {isLoadingLabTests ? (
              <div style={{ padding: '80px 0', textAlign: 'center', ...S.muted, ...S.mono }} className="pulse-shimmer">
                🔄 Fetching laboratory branch test listings...
              </div>
            ) : (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* 2 Column Comparison Grid */}
                <div className="modal-compare-grid">
                  
                  {/* Lab A */}
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 16, 
                    padding: 18, 
                    background: 'var(--surface)',
                    position: 'relative'
                  }}>
                    {Number(selectedLabsForCompare[0].price) < Number(selectedLabsForCompare[1].price) && (
                      <span style={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        background: 'var(--lime)', 
                        color: '#fff', 
                        fontSize: 9, 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: 6,
                        ...S.mono
                      }}>
                        🏆 CHEAPER
                      </span>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text)' }}>
                      {selectedLabsForCompare[0].lab_name}
                    </h3>
                    <p style={{ ...S.muted, fontSize: 12, margin: '0 0 16px 0' }}>
                      {selectedLabsForCompare[0].branch_name}, {selectedLabsForCompare[0].city}
                    </p>
                    
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Package Price:</span>
                        <strong style={{ fontSize: 20, color: 'var(--lime)' }}>₹{selectedLabsForCompare[0].price}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Reporting Time:</span>
                        <strong style={{ fontSize: 13 }}>⏱ {selectedLabsForCompare[0].reporting_time}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Home Collection:</span>
                        <strong style={{ fontSize: 13 }}>{selectedLabsForCompare[0].home_collection ? '✅ Free' : '❌ N/A'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Lab B */}
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 16, 
                    padding: 18, 
                    background: 'var(--surface)',
                    position: 'relative'
                  }}>
                    {Number(selectedLabsForCompare[1].price) < Number(selectedLabsForCompare[0].price) && (
                      <span style={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        background: 'var(--lime)', 
                        color: '#fff', 
                        fontSize: 9, 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: 6,
                        ...S.mono
                      }}>
                        🏆 CHEAPER
                      </span>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text)' }}>
                      {selectedLabsForCompare[1].lab_name}
                    </h3>
                    <p style={{ ...S.muted, fontSize: 12, margin: '0 0 16px 0' }}>
                      {selectedLabsForCompare[1].branch_name}, {selectedLabsForCompare[1].city}
                    </p>
                    
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Package Price:</span>
                        <strong style={{ fontSize: 20, color: 'var(--lime)' }}>₹{selectedLabsForCompare[1].price}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Reporting Time:</span>
                        <strong style={{ fontSize: 13 }}>⏱ {selectedLabsForCompare[1].reporting_time}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                        <span style={S.muted}>Home Collection:</span>
                        <strong style={{ fontSize: 13 }}>{selectedLabsForCompare[1].home_collection ? '✅ Free' : '❌ N/A'}</strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Package Test Availability Comparison */}
                <div>
                  <h4 style={{ ...S.mono, fontSize: 12, textTransform: 'uppercase', marginBottom: 15, borderBottom: '1px solid var(--border)', paddingBottom: 8, color: 'var(--text)' }}>
                    📊 Test Inclusions & Availability Highlight
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {includedTests.map(t => {
                      const hasA = isTestOffered(labATests, t);
                      const hasB = isTestOffered(labBTests, t);
                      const bothHave = hasA && hasB;
                      const onlyAHave = hasA && !hasB;
                      const onlyBHave = hasB && !hasA;
                      
                      return (
                        <div key={t.id} style={{ 
                          border: '1px solid var(--border)', 
                          borderRadius: 14, 
                          padding: 16, 
                          background: 'var(--card)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{t.name}</span>
                            {bothHave ? (
                              <span style={{ ...S.pill, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 9 }}>Available in Both</span>
                            ) : onlyAHave ? (
                              <span style={{ ...S.pill, background: 'rgba(37,99,235,0.1)', color: 'var(--lime)', fontSize: 9 }}>
                                Only in {selectedLabsForCompare[0].lab_name.split(' ')[0]}
                              </span>
                            ) : onlyBHave ? (
                              <span style={{ ...S.pill, background: 'rgba(245,158,11,0.1)', color: '#d97706', fontSize: 9 }}>
                                Only in {selectedLabsForCompare[1].lab_name.split(' ')[0]}
                              </span>
                            ) : (
                              <span style={{ ...S.pill, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 9 }}>Unavailable in Both</span>
                            )}
                          </div>
                          <p style={{ ...S.muted, fontSize: 11, margin: '0 0 8px 0' }}>
                            {t.description || "Diagnostic laboratory test included for evaluation."}
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{hasA ? '🟢 Offered' : '🔴 Not Offered'}</span>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{hasB ? '🟢 Offered' : '🔴 Not Offered'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <button 
                    className="bl"
                    onClick={() => {
                      const l = selectedLabsForCompare[0];
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
                      setIsCompareModalOpen(false);
                      setSelectedLabsForCompare([]);
                    }}
                    style={{ padding: 12, fontSize: 14 }}
                  >
                    Book {selectedLabsForCompare[0].lab_name.split(' ')[0]}
                  </button>

                  <button 
                    className="bl"
                    onClick={() => {
                      const l = selectedLabsForCompare[1];
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
                      setIsCompareModalOpen(false);
                      setSelectedLabsForCompare([]);
                    }}
                    style={{ padding: 12, fontSize: 14 }}
                  >
                    Book {selectedLabsForCompare[1].lab_name.split(' ')[0]}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
