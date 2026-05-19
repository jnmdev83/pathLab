import React, { useState, useEffect } from 'react';
import { S, getDistanceKm, compareNearby } from '../../utils/reusables';
import { TestTHead, COL_TESTS, PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';

// TEST LISTING
export function Listing({ cat, title, setPage, setTestName, allTests, packages, setSelectedPackage, loading }) {
  const [sort, setSort] = useState("loc");
  const [pageIdx, setPageIdx] = useState(1);
  const pageSize = 10;

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

      {/* Sort */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
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
          <option value="low">Starting Price: Low → High</option>
          <option value="high">Starting Price: High → Low</option>
          <option value="loc">Nearby First</option>
          <option value="rating">Most Rated</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <TestTHead />
        {rows.map((t, i) => (
          <div
            key={t.name}
            className="tbl-row"
            style={{
              display: "grid",
              gridTemplateColumns: COL_TESTS,
              padding: "15px 20px",
              gap: 12,
              alignItems: "center",
              borderBottom: "1px solid var(--border)",
              background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
              transition: "background .12s",
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
                <button
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
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--fb)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text)",
                    textAlign: "left",
                    lineHeight: 1.3,
                    transition: "color .12s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--lime)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
                >
                  {t.name}
                </button>
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
              <button
                className="bl"
                onClick={() => {
                  if (isPackage) {
                    setSelectedPackage(t);
                    setPage("package-compare");
                  } else {
                    setTestName(t.name);
                    setPage("lab-listing");
                  }
                }}
                style={{ padding: "7px 14px", fontSize: 12 }}
              >
                {isPackage ? 'Compare Labs →' : 'View Labs →'}
              </button>
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
  );
}

