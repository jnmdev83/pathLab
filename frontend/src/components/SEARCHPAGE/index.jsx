import React from 'react';
import { S, formatDistance, compareNearby } from '../../utils/reusables';
import { LabTHead, COL_LABS } from '../TABLEHEADERROWHELPERS';

// SEARCH PAGE
export function Search({ q, setPage, setTest, allTests, user }) {
  const results = (allTests || [])
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.lab.toLowerCase().includes(q.toLowerCase()) ||
        t.loc.toLowerCase().includes(q.toLowerCase()),
    )
    .sort(compareNearby);
  return (
    <div className="fu">
      <h2
        style={{
          ...S.serif,
          fontSize: 28,
          letterSpacing: "-.01em",
          marginBottom: 3,
        }}
      >
        Search Results
      </h2>
      <p style={{ ...S.muted, ...S.mono, fontSize: 12, marginBottom: 20 }}>
        "{q}" — {results.length} found
      </p>
      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", ...S.muted }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⌕</div>
          <p>No results for "{q}"</p>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <LabTHead />
          {results.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: COL_LABS,
                padding: "14px 20px",
                gap: 12,
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
                background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
              }}
            >
              <div>
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
                    marginBottom: 6,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--lime)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
                >
                  {t.name}
                </button>
              </div>
              <div
                style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}
              >
                {t.lab}
              </div>
              <div style={{ fontSize: 12, ...S.muted, ...S.mono }}>
                <div>{t.loc}</div>
                {formatDistance(t) && (
                  <div style={{ color: "var(--lime)", marginTop: 3 }}>
                    {formatDistance(t)}
                  </div>
                )}
              </div>
              <div style={{ ...S.tag, fontSize: 11, textAlign: "center" }}>
                {t.rep}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span
                  style={{
                    ...S.mono,
                    fontSize: 16,
                    fontWeight: 600,
                    ...S.lime,
                  }}
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
      )}
    </div>
  );
}

