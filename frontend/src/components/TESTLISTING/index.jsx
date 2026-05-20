import React, { useState, useEffect } from 'react';
import { S, getDistanceKm, compareNearby } from '../../utils/reusables';
import { TestTHead, COL_TESTS, PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';
import { API_BASE_URL } from '../../config';

// TEST LISTING
export function Listing({ cat, title, setPage, setTestName, allTests, packages, setSelectedPackage, loading, userLocation, setUserLocation, requestGeolocation }) {
  const [sort, setSort] = useState("loc");
  const [pageIdx, setPageIdx] = useState(1);
  const pageSize = 10;

  // Comparative states for package-to-package comparison (max 3)
  const [selectedPackagesForCompare, setSelectedPackagesForCompare] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparedPackagesTests, setComparedPackagesTests] = useState([]);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  const handlePackageSelectForCompare = (pkg) => {
    setSelectedPackagesForCompare(prev => {
      const exists = prev.find(p => p.id === pkg.id);
      if (exists) {
        return prev.filter(p => p.id !== pkg.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 packages at the same time.");
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const startPackageComparison = () => {
    if (selectedPackagesForCompare.length < 2) return;
    setIsLoadingCompare(true);
    setIsCompareModalOpen(true);
    
    Promise.all(
      selectedPackagesForCompare.map(pkg =>
        fetch(`${API_BASE_URL}/api/packages/${pkg.id}/tests`).then(res => res.json())
      )
    )
    .then(results => {
      setComparedPackagesTests(results);
      setIsLoadingCompare(false);
    })
    .catch(err => {
      console.error("Failed to load compared packages tests:", err);
      setIsLoadingCompare(false);
    });
  };

  const getUniqueTests = () => {
    const allUnique = [];
    const testNamesSet = new Set();
    
    comparedPackagesTests.forEach((testsList) => {
      if (Array.isArray(testsList)) {
        testsList.forEach(t => {
          const normalName = t.name.trim();
          if (!testNamesSet.has(normalName.toLowerCase())) {
            testNamesSet.add(normalName.toLowerCase());
            allUnique.push({
              name: normalName,
              description: t.description || ""
            });
          }
        });
      }
    });
    
    return allUnique.sort((a, b) => a.name.localeCompare(b.name));
  };

  const packageHasTest = (pkgTestsList, testName) => {
    if (!Array.isArray(pkgTestsList)) return false;
    return pkgTestsList.some(t => t.name.toLowerCase().trim() === testName.toLowerCase().trim());
  };

  const isPackage = cat === "package";
  const sourceData = isPackage ? packages : (allTests || []).filter((t) => (t.cat || "").toLowerCase() === cat.toLowerCase());
  
  const grouped = {};
  if (isPackage) {
    sourceData.forEach(p => {
      grouped[p.name] = {
        ...p,
        minPrice: p.min_price || 0,
        count: p.lab_count || 0,
        testCount: p.test_count || 0
      };
    });
  } else {
    sourceData.forEach((t) => {
      const distance = getDistanceKm(t);
      if (!grouped[t.name])
        grouped[t.name] = {
          name: t.name,
          minPrice: t.price,
          count: 1,
          nearestDistance: distance,
        };
      else {
        grouped[t.name].count++;
        if (t.price < grouped[t.name].minPrice)
          grouped[t.name].minPrice = t.price;
        if (
          distance !== null &&
          (grouped[t.name].nearestDistance === null ||
            grouped[t.name].nearestDistance === undefined ||
            distance < grouped[t.name].nearestDistance)
        ) {
          grouped[t.name].nearestDistance = distance;
        }
      }
    });
  }

  const allRows = Object.values(grouped).sort((a, b) => {
    if (sort === "low") return a.minPrice - b.minPrice;
    if (sort === "high") return b.minPrice - a.minPrice;
    if (sort === "rating") return b.count - a.count; // Most available/rated
    if (sort === "loc") return compareNearby(a, b);
    return 0;
  });
  const totalPages = Math.ceil(allRows.length / pageSize) || 1;
  const rows = allRows.slice((pageIdx - 1) * pageSize, pageIdx * pageSize);

  useEffect(() => setPageIdx(1), [sort, cat]);

  if (loading && rows.length === 0) {
    return (
      <div className="fu">
        {/* Skeleton Page Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 3 }}>
            <h1 style={{ ...S.serif, fontSize: 34, letterSpacing: "-.02em" }}>{title}</h1>
            <span style={{ ...S.mono, ...S.muted, fontSize: 12 }} className="pulse-shimmer">
              Loading available tests...
            </span>
          </div>
        </div>

        {/* Shimmer Table */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
          <div style={{ padding: "15px 20px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", gap: 20 }}>
            <div style={{ width: 120, height: 12, borderRadius: 4, background: "var(--border)" }} />
            <div style={{ width: 100, height: 12, borderRadius: 4, background: "var(--border)" }} />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="pulse-shimmer"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "20px",
                gap: 20,
                alignItems: "center",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--border)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ width: 180, height: 16, borderRadius: 4, background: "var(--border)" }} />
                  <div style={{ width: 90, height: 10, borderRadius: 3, background: "var(--border)" }} />
                </div>
              </div>
              <div style={{ width: 120, height: 14, borderRadius: 4, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 60, height: 18, borderRadius: 4, background: "var(--border)" }} />
                <div style={{ width: 90, height: 32, borderRadius: 8, background: "var(--border)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fu">
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 3,
          }}
        >
          <h1 style={{ ...S.serif, fontSize: 34, letterSpacing: "-.02em" }}>
            {title}
          </h1>
          <span style={{ ...S.mono, ...S.muted, fontSize: 12 }}>
            {rows.length} tests available
          </span>
        </div>
        <div
          style={{
            ...S.muted,
            fontSize: 12,
            ...S.mono,
            display: "flex",
            gap: 8,
          }}
        >
          <button
            onClick={() => setPage("home")}
            style={{
              background: "none",
              border: "none",
              ...S.muted,
              ...S.mono,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Home
          </button>
          <span>/</span>
          <span style={S.lime}>{title}</span>
        </div>
      </div>

      {/* Sort & Location */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={requestGeolocation}
          title="Detect Location"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontSize: 14,
            width: 32,
            height: 32,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📍
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          <span
            style={{
              ...S.mono,
              ...S.muted,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              width: "auto",
              padding: "6px 12px",
              ...S.mono,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="loc">Nearby First</option>
          <option value="rating">Most Rated</option>
        </select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Custom Table Head to perfectly match the dynamic column widths */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isPackage ? "3fr 1.2fr 360px" : COL_TESTS,
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "9px 20px",
            gap: 12,
          }}
        >
          {["Test Details", "Available Offers", isPackage ? "Price & Actions" : "Price"].map((h) => (
            <div
              key={h}
              style={{
                ...S.mono,
                ...S.muted,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {rows.map((t, i) => (
          <div
            key={t.name}
            className="tbl-row"
            onClick={() => {
              if (isPackage) {
                setSelectedPackage(t);
                setPage("package-compare");
              } else {
                setTestName(t.name);
                setPage("lab-listing");
              }
            }}
            style={{
              display: "grid",
              gridTemplateColumns: isPackage ? "3fr 1.2fr 360px" : COL_TESTS,
              padding: "15px 20px",
              gap: 12,
              alignItems: "center",
              borderBottom: "1px solid var(--border)",
              background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
              transition: "background .12s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                i % 2 === 0 ? "var(--card)" : "var(--surface)")
            }
          >
            {/* Name cell */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  background: "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                  borderRadius: 8,
                }}
              >
                {isPackage ? '📦' : '🧪'}
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "var(--fb)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text)",
                    textAlign: "left",
                    lineHeight: 1.3,
                  }}
                >
                  {t.name}
                </span>
                {isPackage && t.testCount > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 500, marginTop: 4 }}>
                    {t.testCount} Tests Included
                  </div>
                )}
                {!isPackage && cat === "package" && PACKAGE_INCLUDES[t.name] && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap",
                      marginTop: 5,
                    }}
                  >
                    {PACKAGE_INCLUDES[t.name].slice(0, 3).map((inc) => (
                      <span
                        key={inc}
                        style={{
                          ...S.pill,
                          background: "var(--border)",
                          color: "var(--text)",
                          fontSize: 9,
                          padding: "3px 8px",
                        }}
                      >
                        {inc}
                      </span>
                    ))}
                    {PACKAGE_INCLUDES[t.name].length > 3 && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--muted)",
                          alignSelf: "center",
                        }}
                      >
                        +{PACKAGE_INCLUDES[t.name].length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}
            >
              {t.count} Lab{t.count !== 1 ? "s" : ""} Available
              {!isPackage && Number.isFinite(t.nearestDistance) && (
                <div style={{ ...S.muted, ...S.mono, fontSize: 10, marginTop: 3 }}>
                  nearest {t.nearestDistance < 1
                    ? `${Math.round(t.nearestDistance * 1000)} m`
                    : `${t.nearestDistance.toFixed(1)} km`}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div>
                <div
                  style={{
                    ...S.muted,
                    ...S.mono,
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 2,
                  }}
                >
                  Starting at
                </div>
                <div
                  style={{
                    ...S.mono,
                    fontSize: 16,
                    fontWeight: 600,
                    ...S.lime,
                  }}
                >
                  ₹{t.minPrice}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="bl"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPackage) {
                      setSelectedPackage(t);
                      setPage("package-compare");
                    } else {
                      setTestName(t.name);
                      setPage("lab-listing");
                    }
                  }}
                  style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap" }}
                >
                  {isPackage ? 'View Details' : 'View Labs →'}
                </button>
                {isPackage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackageSelectForCompare(t);
                    }}
                    style={{
                      padding: "7px 14px",
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: selectedPackagesForCompare.some(p => p.id === t.id) ? "var(--lime)" : "var(--surface)",
                      color: selectedPackagesForCompare.some(p => p.id === t.id) ? "#fff" : "var(--text)",
                      cursor: "pointer",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      ...S.mono
                    }}
                  >
                    {selectedPackagesForCompare.some(p => p.id === t.id) ? '✓ Selected' : '⚖ Compare'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            ...S.muted,
            ...S.mono,
            fontSize: 11,
          }}
        >
          <span>
            Showing {(pageIdx - 1) * pageSize + 1}–
            {Math.min(pageIdx * pageSize, allRows.length)} of {allRows.length}
          </span>
          <div style={{ display: "flex", gap: 3 }}>
            {/* First Page Button */}
            <button
              onClick={() => setPageIdx(1)}
              disabled={pageIdx === 1}
              style={{
                width: 28,
                height: 28,
                cursor: pageIdx === 1 ? "not-allowed" : "pointer",
                background: "var(--surface)",
                color: pageIdx === 1 ? "#ccc" : "var(--muted)",
                border: "1px solid var(--border)",
                ...S.mono,
                fontSize: 12,
                borderRadius: 6,
                opacity: pageIdx === 1 ? 0.5 : 1
              }}
              title="First Page"
            >
              «
            </button>
            
            {/* Ellipsis Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => Math.abs(n - pageIdx) <= 2 || n === 1 || n === totalPages)
              .map((n, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && n - prev > 1;
                return (
                  <React.Fragment key={n}>
                    {showEllipsis && <span style={{ alignSelf: "center", padding: "0 4px", color: "var(--muted)" }}>...</span>}
                    <button
                      onClick={() => setPageIdx(n)}
                      style={{
                        width: 28,
                        height: 28,
                        cursor: "pointer",
                        background: n === pageIdx ? "var(--lime)" : "var(--surface)",
                        color: n === pageIdx ? "#fff" : "var(--muted)",
                        border: "1px solid var(--border)",
                        ...S.mono,
                        fontSize: 12,
                        borderRadius: 6,
                      }}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                );
              })}
              
            {/* Last Page Button */}
            <button
              onClick={() => setPageIdx(totalPages)}
              disabled={pageIdx === totalPages}
              style={{
                width: 28,
                height: 28,
                cursor: pageIdx === totalPages ? "not-allowed" : "pointer",
                background: "var(--surface)",
                color: pageIdx === totalPages ? "#ccc" : "var(--muted)",
                border: "1px solid var(--border)",
                ...S.mono,
                fontSize: 12,
                borderRadius: 6,
                opacity: pageIdx === totalPages ? 0.5 : 1
              }}
              title="Last Page"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM STICKY TOP COMPARE PANEL */}
      {isPackage && selectedPackagesForCompare.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 64, // Positioned perfectly right below the sticky Navbar!
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 20,
          padding: '12px 20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          zIndex: 999,
          width: '92%',
          maxWidth: 780,
          justifyContent: 'space-between',
          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="sticky-compare-bar animate-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, overflow: 'hidden' }}>
            <div style={{
              background: 'var(--lime)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 12,
              padding: '6px 12px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              ...S.mono
            }}>
              <span>⚖</span>
              <span>{selectedPackagesForCompare.length} Selected</span>
            </div>
            
            {/* Selected Package Badges / Chips */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar hide-scrollbar-mobile">
              {selectedPackagesForCompare.map(pkg => (
                <span 
                  key={pkg.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {pkg.name}
                  <button 
                    onClick={() => handlePackageSelectForCompare(pkg)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: 10 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button 
              className="bl"
              disabled={selectedPackagesForCompare.length < 2}
              onClick={startPackageComparison}
              style={{
                padding: '8px 18px',
                fontSize: 12,
                fontWeight: 700,
                opacity: selectedPackagesForCompare.length < 2 ? 0.5 : 1,
                cursor: selectedPackagesForCompare.length < 2 ? 'not-allowed' : 'pointer',
                background: selectedPackagesForCompare.length >= 2 ? 'var(--lime)' : 'var(--border)',
                border: 'none',
                color: '#fff',
                borderRadius: 10,
                ...S.mono
              }}
            >
              {selectedPackagesForCompare.length < 2 ? 'Select 2 to Compare' : 'Compare Now'}
            </button>
            <button 
              onClick={() => setSelectedPackagesForCompare([])}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.target.style.color = 'var(--danger)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN PACKAGE COMPARISON MATRIX MODAL */}
      {isCompareModalOpen && (
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
            maxWidth: selectedPackagesForCompare.length === 3 ? 980 : 800,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'var(--card)',
              zIndex: 10
            }}>
              <div>
                <h2 style={{ ...S.serif, fontSize: 24, margin: 0 }}>Package Comparison Details</h2>
                <p style={{ ...S.muted, fontSize: 13, margin: '4px 0 0' }}>
                  Comparing test inclusions side-by-side (Max 3 Packages)
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  transition: 'all 0.15s'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', flex: 1 }}>
              {isLoadingCompare ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="pulse-shimmer" style={{ fontSize: 16, color: 'var(--lime)', fontWeight: 600 }}>
                    ⚡ Fetching package test inclusions...
                  </div>
                </div>
              ) : (
                <>
                  {/* Top package columns grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `1.5fr repeat(${selectedPackagesForCompare.length}, 1fr)`,
                    gap: 16,
                    paddingBottom: 20,
                    borderBottom: '2px solid var(--border)',
                    marginBottom: 20
                  }} className="modal-compare-grid">
                    {/* Blank spacer col */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} className="compare-spacer-col">
                      <span style={{ ...S.mono, fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
                        Package Details
                      </span>
                    </div>

                    {selectedPackagesForCompare.map((pkg, idx) => (
                      <div key={pkg.id} style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minWidth: 150
                      }}>
                        <div>
                          <span style={{ ...S.pill, background: 'rgba(37,99,235,0.1)', color: 'var(--lime)', fontSize: 9 }}>
                            Package {idx + 1}
                          </span>
                          <h4 style={{ fontSize: 15, fontWeight: 700, margin: '8px 0 4px', color: 'var(--text)' }}>
                            {pkg.name}
                          </h4>
                          <p style={{ ...S.muted, fontSize: 12, margin: 0 }}>
                            {comparedPackagesTests[idx]?.length || pkg.testCount || 0} tests included
                          </p>
                        </div>
                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ ...S.mono, ...S.lime, fontSize: 16, fontWeight: 700 }}>
                            ₹{pkg.minPrice}
                          </span>
                          <button
                            className="bl"
                            onClick={() => {
                              setIsCompareModalOpen(false);
                              setSelectedPackage(pkg);
                              setPage("package-compare");
                            }}
                            style={{ padding: '6px 12px', fontSize: 11 }}
                          >
                            View Labs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ ...S.serif, fontSize: 18, marginBottom: 16 }}>
                    Test Availability Matrix
                  </h3>

                  {/* matrix rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {getUniqueTests().map((testItem) => {
                      const inclusionStates = selectedPackagesForCompare.map((pkg, idx) => 
                        packageHasTest(comparedPackagesTests[idx], testItem.name)
                      );
                      const isDivergent = inclusionStates.some(x => x === true) && inclusionStates.some(x => x === false);

                      return (
                        <div
                          key={testItem.name}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `1.5fr repeat(${selectedPackagesForCompare.length}, 1fr)`,
                            gap: 16,
                            padding: '14px 16px',
                            background: isDivergent ? '#fffbeb' : 'var(--card)',
                            border: isDivergent ? '1px solid #fde68a' : '1px solid var(--border)',
                            borderRadius: 12,
                            alignItems: 'center',
                            transition: 'all 0.15s'
                          }}
                          className="modal-compare-grid"
                        >
                          {/* Test Info */}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                              {testItem.name}
                            </div>
                            {testItem.description && (
                              <div style={{ ...S.muted, fontSize: 11, marginTop: 4 }}>
                                {testItem.description}
                              </div>
                            )}
                            {isDivergent && (
                              <span style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                fontSize: 9,
                                fontWeight: 600,
                                padding: '2px 6px',
                                borderRadius: 4,
                                marginTop: 6,
                                display: 'inline-block'
                              }}>
                                ⚠️ DIFFERENTIATOR
                              </span>
                            )}
                          </div>

                          {/* Inclusion Badges */}
                          {selectedPackagesForCompare.map((pkg, idx) => {
                            const hasIt = inclusionStates[idx];
                            return (
                              <div key={pkg.id} style={{ display: 'flex', justifyContent: 'center', width: '100%' }} className="mobile-inclusion-indicator">
                                {/* Desktop indicator */}
                                <div className="desktop-indicator" style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: hasIt ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                                  color: hasIt ? '#15803d' : '#b91c1c',
                                  padding: '6px 12px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 600
                                }}>
                                  <span className="mobile-only-package-name" style={{ marginRight: 6 }}>{pkg.name.split(' ')[0]}:</span>
                                  <span>{hasIt ? '✓' : '—'}</span>
                                  <span className="desktop-only-text" style={{ marginLeft: 4 }}>{hasIt ? 'Included' : 'Not Included'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

