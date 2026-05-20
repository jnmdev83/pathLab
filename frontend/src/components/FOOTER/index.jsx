import React from 'react';
import { S } from '../../utils/reusables';

// FOOTER
export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1.5px solid var(--border)",
        padding: "28px 24px",
        maxWidth: 1280,
        margin: "var(--footer-margin-top) auto 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
      }}
    >
      <span style={{ ...S.serif, fontSize: 20, ...S.lime }}>
        ChooseMyLab<span style={S.muted}>.</span>
      </span>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
        {["Privacy Policy", "Terms of Service", "Contact", "Documentation"].map(
          (l) => (
            <a
              key={l}
              href="#"
              style={{
                ...S.muted,
                ...S.mono,
                fontSize: 11,
                textDecoration: "none",
                letterSpacing: ".04em",
                transition: "color .12s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--lime)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
            >
              {l}
            </a>
          ),
        )}
      </div>
      <span style={{ ...S.mono, fontSize: 10, color: "var(--border)" }}>
        © 2025 ChooseMyLab
      </span>
    </footer>
  );
}

