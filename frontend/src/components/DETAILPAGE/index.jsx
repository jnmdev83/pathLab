import React from 'react';
import { S, MapLink } from '../../utils/reusables';
import { COL_LABS, PACKAGE_INCLUDES } from '../TABLEHEADERROWHELPERS';

// DETAIL PAGE
export function BranchTests({ selectedBranch, branchTests, setPage, setTest, user }) {
  if (!selectedBranch) {
    return (
      <div className="fu" style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ ...S.muted, marginBottom: 14 }}>Select a lab branch first.</p>
        <button className="bl" onClick={() => setPage("home")}>Go Home</button>
      </div>
    );
  }

  const grouped = branchTests.reduce((acc, row) => {
    const cat = row.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(row);
    return acc;
  }, {});

  const bookTest = (row) => {
    setTest({
      id: row.test_id,
      name: row.test_name,
      cat: row.category,
      price: row.price,
      rep: row.reporting_time,
      ok: row.is_available,
      lab: row.lab_name,
      lab_name: row.lab_name,
      lab_id: row.lab_id,
      lab_branch_id: row.lab_branch_id,
      branch_name: row.branch_name,
      address: row.address,
      loc: `${row.branch_name}, ${row.city}`,
      branch_phone: row.branch_phone,
      operating_hours: row.operating_hours,
      home_collection: row.home_collection,
      lab_test_branch_id: row.lab_test_branch_id,
    });
    user ? setPage("booking") : setPage("signup");
  };

  return (
    <div className="fu">
      <div style={{ marginBottom: 18 }}>
        <button
          onClick={() => setPage("home")}
          style={{ background: "none", border: "none", ...S.muted, ...S.mono, fontSize: 12, cursor: "pointer" }}
        >
          Home / Location Search
        </button>
        <h1 style={{ ...S.serif, fontSize: 34, marginTop: 8 }}>
          {selectedBranch.lab_name}
        </h1>
        <div style={{ ...S.muted, fontSize: 13, lineHeight: 1.6, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <div>{selectedBranch.branch_name} Branch - {selectedBranch.address}</div>
          <div>{selectedBranch.phone || "Phone unavailable"}</div>
          <MapLink item={selectedBranch} style={{ marginTop: 2 }} />
        </div>
      </div>

      {branchTests.length === 0 ? (
        <div style={{ ...S.muted, textAlign: "center", padding: "50px 0" }}>
          No available tests at this branch yet.
        </div>
      ) : (
        Object.entries(grouped).map(([cat, tests]) => (
          <div key={cat} style={{ marginBottom: 22 }}>
            <h2 style={{ ...S.serif, fontSize: 24, textTransform: "capitalize", marginBottom: 10 }}>
              {cat}
            </h2>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              {tests.map((row, i) => (
                <div
                  key={row.lab_test_branch_id}
                  className="tbl-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: COL_LABS,
                    padding: "15px 20px",
                    gap: 12,
                    alignItems: "center",
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{row.test_name}</div>
                  <div style={{ ...S.muted, fontSize: 13 }}>{row.lab_name}</div>
                  <div style={{ ...S.muted, ...S.mono, fontSize: 12 }}>{selectedBranch.branch_name}</div>
                  <div style={{ ...S.tag, textAlign: "center", justifySelf: "center" }}>{row.reporting_time}</div>
                  {/* Column 5: Price */}
                  <span style={{ ...S.mono, ...S.lime, fontSize: 16, fontWeight: 700, justifySelf: "center" }}>₹{row.price}</span>
                  {/* Column 6: Action */}
                  <button className="bl" onClick={() => bookTest(row)} style={{ padding: "7px 14px", fontSize: 12, justifySelf: "center" }}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function Detail({ test, setPage, user }) {
  if (!test) return null;
  return (
    <div className="fu">
      {/* Breadcrumb */}
      <div
        style={{
          ...S.mono,
          ...S.muted,
          fontSize: 11,
          marginBottom: 22,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {[
          ["HOME", "home"],
          [test.cat.toUpperCase(), test.cat],
        ].map(([l, p]) => (
          <span
            key={p}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <button
              onClick={() => setPage(p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...S.muted,
                ...S.mono,
                fontSize: 11,
              }}
            >
              {l}
            </button>
            <span>/</span>
          </span>
        ))}
        <span style={S.lime}>{test.name}</span>
      </div>

      <div className="detail-grid" style={{ display: "grid", gap: 14 }}>
        {/* Description */}
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            padding: 28,
          }}
        >
          <div style={S.pill}>{test.cat}</div>
          <h2
            style={{
              ...S.serif,
              fontSize: 24,
              letterSpacing: "-.01em",
              margin: "14px 0 16px",
              lineHeight: 1.2,
            }}
          >
            {test.name}
          </h2>
          <div
            style={{
              width: 36,
              height: 2,
              background: "var(--lime)",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              ...S.muted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              fontWeight: 700,
              ...S.mono,
              marginBottom: 8,
            }}
          >
            About This Test
          </div>
          <p style={{ ...S.muted, fontSize: 14, lineHeight: 1.75 }}>
            {test.description || "This test helps diagnose and monitor health conditions accurately. Performed by certified lab technicians at our partner laboratory."}
          </p>

          {/* Included tests for packages */}
          {test.cat === "package" && PACKAGE_INCLUDES[test.name] && (
            <div
              style={{
                marginTop: 26,
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  ...S.muted,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  fontWeight: 700,
                  ...S.mono,
                  marginBottom: 16,
                }}
              >
                Tests Included in this Package
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {PACKAGE_INCLUDES[test.name].map((inc) => (
                  <div
                    key={inc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "var(--lime)", fontSize: 16 }}>
                      ✓
                    </span>{" "}
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking panel */}
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            padding: 28,
          }}
        >
          <div
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Booking Details
          </div>

          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}
          >
            {[
              ["⏱", "Report: " + test.rep],
              ["💰", "₹" + test.price + " all-in"],
              [test.ok ? "✅" : "❌", test.ok ? "Available" : "Fully Booked"],
            ].map(([ic, tx]) => (
              <div key={tx} style={{ ...S.tag, display: "flex", gap: 5 }}>
                <span>{ic}</span>
                <span>{tx}</span>
              </div>
            ))}
          </div>
          {test.ok ? (
            <>
              <div
                style={{
                  borderLeft: "3px solid var(--lime)",
                  paddingLeft: 14,
                  marginBottom: 14,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                  {test.lab_name || test.lab}
                </div>
                <div style={{ ...S.muted, ...S.mono, fontSize: 11, display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                  <div>{test.address || test.loc}</div>
                  <MapLink item={test} />
                </div>
              </div>
              <div
                style={{
                  borderLeft: "3px solid var(--border)",
                  paddingLeft: 14,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    ...S.muted,
                    ...S.mono,
                    fontSize: 11,
                    marginBottom: 2,
                  }}
                >
                  Reporting Time
                </div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  Results in {test.rep}
                </div>
              </div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--lime)",
                  padding: "14px 18px",
                  marginBottom: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      ...S.muted,
                      ...S.mono,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 2,
                    }}
                  >
                    Total Price
                  </div>
                  <div
                    style={{
                      ...S.mono,
                      fontSize: 30,
                      ...S.lime,
                      fontWeight: 500,
                    }}
                  >
                    ₹ {test.price}
                  </div>
                </div>
                <div style={{ ...S.muted, fontSize: 11, textAlign: "right" }}>
                  Inclusive of
                  <br />
                  all charges
                </div>
              </div>
              <button
                className="bl"
                onClick={() => (user ? setPage("booking") : setPage("signup"))}
                style={{ width: "100%", padding: 13, fontSize: 14 }}
              >
                Book This Test →
              </button>
            </>
          ) : (
            <div
              style={{
                background: "rgba(255,82,82,.07)",
                border: "1px solid rgba(255,82,82,.3)",
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>⛔</div>
              <div style={{ color: "var(--danger)", fontWeight: 600 }}>
                Fully Booked
              </div>
              <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>
                Please check back later
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

