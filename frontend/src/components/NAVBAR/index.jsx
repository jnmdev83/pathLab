import React, { useState, useEffect, useRef } from 'react';
import { S } from '../../utils/reusables';

// NAVBAR
export function Navbar({ page, setPage, q, setQ, user, setUser }) {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    ["Home", "home"],
    ["Blood Test", "blood"],
    ["Packages", "package"],
    ["Scanning", "scanning"],
    ["Gastro", "gastro"],
    ["Consultation", "consultation"],
  ];

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <nav
      style={{
        background: "var(--surface)",
        borderBottom: "1.5px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 54,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          style={{
            ...S.serif,
            fontSize: 22,
            ...S.lime,
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "-.02em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          PathLab<span style={S.muted}>.</span>
        </button>

        {/* Links */}
        <div className="desktop-nav-links" style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
          {links.map(([label, p]) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                background: page === p ? "rgba(37,99,235,.08)" : "transparent",
                color: page === p ? "var(--lime)" : "var(--muted)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fb)",
                fontWeight: 600,
                fontSize: 13,
                padding: "7px 14px",
                borderRadius: 8,
                letterSpacing: ".02em",
                whiteSpace: "nowrap",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                if (page !== p) {
                  e.target.style.color = "var(--text)";
                  e.target.style.background = "rgba(37,99,235,.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (page !== p) {
                  e.target.style.color = "var(--muted)";
                  e.target.style.background = "transparent";
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              fontSize: 13,
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            placeholder="Search tests…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setPage("search")}
            style={{
              width: 180,
              paddingLeft: 28,
              paddingRight: 10,
              paddingTop: 7,
              paddingBottom: 7,
              ...S.mono,
              fontSize: 12,
            }}
          />
        </div>

        {/* Auth Area */}
        {user ? (
          <div ref={dropRef} style={{ position: "relative", flexShrink: 0 }}>
            {/* Avatar button */}
            <button
              onClick={() => setDropOpen((o) => !o)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--lime)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--fb)",
                fontWeight: 700,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(37,99,235,.25)",
                transition: "transform .12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {initials}
            </button>

            {/* Dropdown */}
            {dropOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 12,
                  minWidth: 220,
                  boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {user.name}
                  </div>
                  <div
                    style={{
                      ...S.muted,
                      ...S.mono,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {user.email}
                  </div>
                  {user.phone && (
                    <div style={{ ...S.muted, ...S.mono, fontSize: 11 }}>
                      📞 {user.phone}
                    </div>
                  )}
                </div>
                {/* Menu items */}
                {[
                  ["📋", "My Bookings", "bookings-page"],
                  ["📄", "My Reports", "reports-page"],
                  ["👤", "Personal Information", "profile-page"],
                ].map(([icon, label, pg]) => (
                  <button
                    key={pg}
                    onClick={() => {
                      setPage(pg);
                      setDropOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "11px 18px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--fb)",
                      fontSize: 13,
                      color: "var(--text)",
                      textAlign: "left",
                      transition: "background .1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <span style={{ fontSize: 15 }}>{icon}</span>
                    {label}
                  </button>
                ))}
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    margin: "4px 0",
                  }}
                />
                <button
                  onClick={() => {
                    setUser(null);
                    setDropOpen(false);
                    setPage("home");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "11px 18px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--fb)",
                    fontSize: 13,
                    color: "var(--danger)",
                    textAlign: "left",
                    transition: "background .1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,82,82,.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <span style={{ fontSize: 15 }}>🚪</span>Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bl"
            onClick={() => setPage("signup")}
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Sign Up
          </button>
        )}
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="bottom-nav">
        <button onClick={() => setPage("home")} className={page === "home" ? "active" : ""}>
          <span>🏠</span>Home
        </button>
        <button onClick={() => setPage("search")} className={page === "search" ? "active" : ""}>
          <span>⌕</span>Search
        </button>
        <button onClick={() => { if(user) setPage("bookings-page"); else setPage("signup"); }} className={page === "bookings-page" ? "active" : ""}>
          <span>📋</span>Bookings
        </button>
        <button onClick={() => { if(user) setPage("profile-page"); else setPage("signup"); }} className={page === "profile-page" ? "active" : ""}>
          <span>👤</span>Profile
        </button>
      </div>
    </nav>
  );
}

