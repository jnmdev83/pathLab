import React, { useState, useEffect } from 'react';
import { S, formatDistance, compareNearby, MapLink } from '../../utils/reusables';
import { PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';

// LAB LISTING
export function LabListing({ testName, setPage, setTest, allTests, user, userLocation, setUserLocation, requestGeolocation }) {
  const [sort, setSort] = useState("loc");
  const [pageIdx, setPageIdx] = useState(1);
  const [activeModalTest, setActiveModalTest] = useState(null);
  const [comparedLabs, setComparedLabs] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const pageSize = 10;

  // Lock body scroll when modal is active so it stays perfectly visible at center without background scrolling
  useEffect(() => {
    if (activeModalTest || showCompareModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModalTest, showCompareModal]);

  const toggleCompare = (lab) => {
    if (comparedLabs.some(x => x.lab_branch_id === lab.lab_branch_id)) {
      setComparedLabs(comparedLabs.filter(x => x.lab_branch_id !== lab.lab_branch_id));
    } else {
      if (comparedLabs.length >= 5) {
        alert("You can compare up to 5 labs at a time.");
        return;
      }
      setComparedLabs([...comparedLabs, lab]);
    }
  };

  const allRows = (allTests || [])
    .filter((t) => t.name === testName)
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "loc") return compareNearby(a, b);
      if (sort === "rating") return (b.id % 100) - (a.id % 100); // Pseudo-rating based on ID
      return 0;
    });

  const totalPages = Math.ceil(allRows.length / pageSize) || 1;
  const rows = allRows.slice((pageIdx - 1) * pageSize, pageIdx * pageSize);

  useEffect(() => setPageIdx(1), [sort, testName]);

  if (!testName) return null;

  return (
    <>
      <div className="fu">
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
              {testName}
            </h1>
            <span style={{ ...S.mono, ...S.muted, fontSize: 12 }}>
              {rows.length} labs
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
            <span style={S.lime}>Labs for {testName}</span>
          </div>
        </div>

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
          {/* Extremely Compact Location Detect Pill */}
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
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

        {/* Lab List Cards Container */}
        <div
          style={{
            display: "grid",
            gap: 12,
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--card)"
          }}
        >
          {rows.map((t, i) => (
            <div
              key={`${t.id}-${t.lab_branch_id}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border)",
                background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {/* Left side: Lab Name, Branch and Compare Checkbox Pill */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200, flex: 1 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {i === 0 && (
                    <span
                      style={{
                        ...S.pill,
                        background: "rgba(37,99,235,0.1)",
                        color: "var(--lime)",
                        fontSize: 8,
                        padding: "2px 6px",
                      }}
                    >
                      Sponsored
                    </span>
                  )}
                  {i === 1 && (
                    <span
                      style={{
                        ...S.pill,
                        background: "rgba(245,158,11,0.1)",
                        color: "#d97706",
                        fontSize: 8,
                        padding: "2px 6px",
                      }}
                    >
                      Best Value
                    </span>
                  )}
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                    {t.lab_name || t.lab}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ ...S.muted, fontSize: 12 }}>
                    🏢 {t.branch_name || "Main"} Branch
                  </span>
                </div>
              </div>

              {/* Right side: Action Buttons */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  className="bg"
                  onClick={() => setActiveModalTest(t)}
                  style={{
                    padding: "7px 13px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 6,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  View Details
                </button>
                <button
                  className="bl"
                  onClick={() => {
                    setTest(t);
                    user ? setPage("booking") : setPage("signup");
                  }}
                  style={{
                    padding: "7px 13px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 6,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  Book Test
                </button>

                {/* Clean Flat Compare Label with NO background and NO border */}
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: comparedLabs.some(x => x.lab_branch_id === t.lab_branch_id) ? "var(--lime)" : "var(--muted)",
                    background: "none",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={comparedLabs.some(x => x.lab_branch_id === t.lab_branch_id)}
                    onChange={() => toggleCompare(t)}
                    style={{ display: "none" }}
                  />
                  <span>{comparedLabs.some(x => x.lab_branch_id === t.lab_branch_id) ? "✓ Selected" : "⚖ Compare"}</span>
                </label>
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
      </div>

      {/* Floating Compare Bar */}
      {comparedLabs.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            borderRadius: 16,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            maxWidth: 500,
            width: "calc(100% - 32px)",
            zIndex: 999,
            animation: "slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              ⚖️ Compare Prices ({comparedLabs.length}/5)
            </div>
            <div style={{ ...S.muted, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {comparedLabs.map(x => x.lab_name || x.lab).join(", ")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setComparedLabs([])}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: 11,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              Clear
            </button>
            <button
              className="bl"
              onClick={() => setShowCompareModal(true)}
              style={{
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Detail Modal / Slide-over Drawer RENDERED OUTSIDE OF FADE-UP ANIMATED CONTAINER */}
      {activeModalTest && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setActiveModalTest(null)}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
              animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface)",
              }}
            >
              <div>
                <h3 style={{ ...S.serif, fontSize: 20, fontWeight: 700, margin: 0 }}>
                  {activeModalTest.name}
                </h3>
                <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>
                  Provided by <strong>{activeModalTest.lab_name || activeModalTest.lab}</strong> ({activeModalTest.branch_name || "Main"} Branch)
                </div>
              </div>
              <button
                onClick={() => setActiveModalTest(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: "var(--muted)",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: 24,
                maxHeight: "calc(80vh - 120px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Distance / Location info if available */}
              {formatDistance(activeModalTest) && (
                <div
                  style={{
                    background: "rgba(37,99,235,0.06)",
                    border: "1px solid rgba(37,99,235,0.15)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--lime)" }}>
                    📍 Nearest branch is {formatDistance(activeModalTest)}
                  </span>
                  <MapLink item={activeModalTest} style={{ margin: 0 }} />
                </div>
              )}

              {/* Specifications pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ ...S.tag, background: "var(--surface)" }}>
                  ⏱ Report: {activeModalTest.rep}
                </span>
                <span style={{ ...S.tag, background: "var(--surface)", color: "var(--lime)" }}>
                  ⚡ Status: Available
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)", margin: "0 0 6px 0" }}>
                  Description & Information
                </h4>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
                  {activeModalTest.description || "This diagnostic test is performed to measure clinical parameters. Certified technicians will collect your blood or sample at home or at the lab branch to provide accurate reports."}
                </p>
              </div>

              {/* Address details */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)", margin: "0 0 6px 0" }}>
                  Lab Address & Contact
                </h4>
                <div style={{ ...S.mono, fontSize: 12, lineHeight: 1.5 }}>
                  📍 {activeModalTest.address || activeModalTest.loc || "Address not provided"}<br />
                  📞 {activeModalTest.phone || "Phone unavailable"}
                </div>
                {!formatDistance(activeModalTest) && (
                  <MapLink item={activeModalTest} style={{ display: "flex", marginTop: 8 }} />
                )}
              </div>

              {/* Package includes */}
              {activeModalTest.cat === "package" && PACKAGE_INCLUDES[activeModalTest.name] && (
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)", margin: "0 0 10px 0" }}>
                    Included Tests ({PACKAGE_INCLUDES[activeModalTest.name].length})
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {PACKAGE_INCLUDES[activeModalTest.name].map((inc) => (
                      <div key={inc} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <span style={{ color: "var(--lime)" }}>✓</span>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--border)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ ...S.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  All-Inclusive Price
                </div>
                <div style={{ ...S.mono, fontSize: 24, fontWeight: 700, color: "var(--lime)" }}>
                  ₹{activeModalTest.price}
                </div>
              </div>

              <button
                className="bl"
                onClick={() => {
                  setTest(activeModalTest);
                  setActiveModalTest(null);
                  user ? setPage("booking") : setPage("signup");
                }}
                style={{
                  padding: "12px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                }}
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Comparison Modal */}
      {showCompareModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setShowCompareModal(false)}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              maxWidth: 550,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
              animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface)",
              }}
            >
              <div>
                <h3 style={{ ...S.serif, fontSize: 20, fontWeight: 700, margin: 0 }}>
                  ⚖️ Price Comparison
                </h3>
                <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>
                  Comparing rates for <strong>{testName}</strong> across your selected labs
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: "var(--muted)",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: 24,
                maxHeight: "calc(80vh - 120px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {(() => {
                // Find the lowest price among the selected compared labs
                const lowestPrice = Math.min(...comparedLabs.map(x => Number(x.price)));
                
                return comparedLabs.map((lab, idx) => {
                  const isLowest = Number(lab.price) === lowestPrice;
                  
                  return (
                    <div
                      key={lab.lab_branch_id}
                      style={{
                        background: isLowest ? "rgba(37,99,235,0.02)" : "var(--surface)",
                        border: isLowest ? "1.5px solid var(--lime)" : "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        position: "relative",
                        flexWrap: "wrap",
                      }}
                    >
                      {isLowest && (
                        <div
                          style={{
                            position: "absolute",
                            top: -10,
                            right: 16,
                            background: "var(--lime)",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 99,
                            letterSpacing: ".04em",
                            textTransform: "uppercase",
                          }}
                        >
                          🏆 Lowest Rate
                        </div>
                      )}

                      <div style={{ minWidth: 200, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          {lab.lab_name || lab.lab}
                        </div>
                        <div style={{ ...S.muted, fontSize: 11, marginTop: 3 }}>
                          🏢 {lab.branch_name || "Main"} Branch
                        </div>
                        <div style={{ ...S.muted, ...S.mono, fontSize: 10, marginTop: 4 }}>
                          ⏱ Report: {lab.rep} | 📍 Distance: {formatDistance(lab) || "N/A"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ ...S.mono, fontSize: 20, fontWeight: 700, color: isLowest ? "var(--lime)" : "var(--text)" }}>
                            ₹{lab.price}
                          </span>
                        </div>
                        <button
                          className="bl"
                          onClick={() => {
                            setTest(lab);
                            setShowCompareModal(false);
                            user ? setPage("booking") : setPage("signup");
                          }}
                          style={{
                            padding: "8px 16px",
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 8,
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
