import React, { useState, useEffect } from 'react';
import { S, formatDistance, compareNearby, MapLink } from '../../utils/reusables';
import { LabTHead, COL_LABS } from '../TABLEHEADERROWHELPERS';

// SEARCH PAGE
export function Search({ q, setPage, setTest, allTests, user }) {
  const [pageIdx, setPageIdx] = useState(1);
  const pageSize = 10;

  // Reset page when search term changes
  useEffect(() => {
    setPageIdx(1);
  }, [q]);

  const results = (allTests || [])
    .filter((t) => {
      const searchStr = q.toLowerCase().trim();
      if (!searchStr) return true;

      const name = (t.name || "").toLowerCase();
      const labName = (t.lab_name || t.lab || "").toLowerCase();
      const branchName = (t.branch_name || "").toLowerCase();
      const address = (t.address || t.loc || "").toLowerCase();

      // Dynamic acronym mapping (e.g., "House of Diagnostic" -> "hod", "Malik Radix Healthcare" -> "mrh")
      const labWords = labName.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 0);
      const labAcronym = labWords.map(w => w[0]).join("");
      const labAcronymNoOf = labWords.filter(w => w !== "of" && w !== "and" && w !== "the").map(w => w[0]).join("");

      const matchesAcronym = 
        labAcronym === searchStr || 
        labAcronymNoOf === searchStr;

      return (
        name.includes(searchStr) ||
        labName.includes(searchStr) ||
        branchName.includes(searchStr) ||
        address.includes(searchStr) ||
        matchesAcronym
      );
    });

  // Alphabetical sort (A-Z actual alphabets first, digits like "2D Echo" at the very end)
  const sortedResults = q.trim()
    ? [...results].sort(compareNearby)
    : [...results].sort((a, b) => {
        const nameA = (a.name || "").trim().toLowerCase();
        const nameB = (b.name || "").trim().toLowerCase();

        const isNumA = /^\d/.test(nameA);
        const isNumB = /^\d/.test(nameB);

        if (isNumA && !isNumB) return 1;
        if (!isNumA && isNumB) return -1;

        return nameA.localeCompare(nameB);
      });

  const totalPages = Math.ceil(sortedResults.length / pageSize) || 1;
  const rows = sortedResults.slice((pageIdx - 1) * pageSize, pageIdx * pageSize);

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
        {q.trim() ? `"${q}"` : "All Tests"} — {sortedResults.length} found
      </p>
      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", ...S.muted }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⌕</div>
          <p>No results for "{q}"</p>
        </div>
      ) : (
        <>
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
                <div style={{ ...S.tag, fontSize: 11, textAlign: "center" }}>
                  {t.rep}
                </div>
                 {/* Column 5: Price */}
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
                 {/* Column 6: Action */}
                 <button
                   className="bl"
                   onClick={() => {
                     setTest(t);
                     user ? setPage("booking") : setPage("signup");
                   }}
                   style={{ padding: "7px 14px", fontSize: 12, justifySelf: "end" }}
                 >
                   Book
                 </button>
              </div>
            ))}
          </div>

          {/* Premium Pagination Controls with Ellipsis and First/Last Buttons */}
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
                {Math.min(pageIdx * pageSize, sortedResults.length)} of {sortedResults.length}
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
                
                {/* Dynamically Filtered Page Numbers with Ellipsis */}
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
        </>
      )}
    </div>
  );
}

