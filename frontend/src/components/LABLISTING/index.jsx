import React, { useState, useEffect } from 'react';
import { S, formatDistance, compareNearby, MapLink } from '../../utils/reusables';
import { LabTHead, COL_LABS, PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';

// LAB LISTING
export function LabListing({ testName, setPage, setTest, allTests, user, userLocation, setUserLocation, requestGeolocation }) {
  const [sort, setSort] = useState("loc");
  const [pageIdx, setPageIdx] = useState(1);
  const pageSize = 10;

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 8 }}>
          <span style={{ fontSize: 13 }}>📍 {userLocation?.label || "Delhi"}</span>
          <button
            className="bg"
            onClick={requestGeolocation}
            style={{ padding: "3px 8px", fontSize: 10, cursor: "pointer", borderRadius: 6 }}
          >
            Detect Location
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

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <LabTHead />
        {rows.map((t, i) => (
          <div
            key={`${t.id}-${t.lab_branch_id}-${i}`}
            className="tbl-row"
            style={{
              display: "grid",
              gridTemplateColumns: COL_LABS,
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 5,
              }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {i === 0 && (
                  <span
                    style={{
                      ...S.pill,
                      background: "rgba(37,99,235,0.1)",
                      color: "var(--lime)",
                      fontSize: 9,
                      padding: "3px 8px",
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
                      fontSize: 9,
                      padding: "3px 8px",
                    }}
                  >
                    Best by User Feedback
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setTest(t);
                  setPage("detail");
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
                  transition: "color .12s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--lime)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
              >
                {t.name}
              </button>
              {t.cat === "package" && PACKAGE_INCLUDES[t.name] && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginTop: 2,
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
            <div
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}
            >
              {t.lab_name || t.lab}
              {t.branch_name && (
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400, marginTop: 2 }}>
                  ({t.branch_name})
                </div>
              )}
            </div>
            <section
              style={{
                fontSize: 12,
                ...S.muted,
                ...S.mono,
                display: "block",
                width: "100%",
              }}
            >
              <div>{t.address || t.loc}</div>
              {formatDistance(t) && (
                <div style={{ color: "var(--lime)", marginTop: 3 }}>
                  {formatDistance(t)}
                </div>
              )}
              <MapLink item={t} />
            </section>
            <div style={{ ...S.tag, textAlign: "center", fontSize: 11 }}>
              {t.rep}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span
                style={{ ...S.mono, fontSize: 16, fontWeight: 600, ...S.lime }}
              >
                ₹{t.price}
              </span>
              <button
                className="bl"
                onClick={() => {
                  setTest(t);
                  user ? setPage("booking") : setPage("signup");
                }}
                style={{ padding: "7px 14px", fontSize: 12 }}
              >
                Book
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

