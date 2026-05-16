import React from 'react';
import { S } from '../../utils/reusables';

// COMING SOON
export function ComingSoon({ title }) {
  return (
    <div className="fu" style={{ textAlign: "center", padding: "80px 0" }}>
      <div
        style={{
          ...S.serif,
          fontSize: 90,
          color: "var(--border)",
          marginBottom: 10,
          lineHeight: 1,
        }}
      >
        Soon.
      </div>
      <h2 style={{ ...S.serif, fontSize: 26, marginBottom: 8 }}>{title}</h2>
      <p style={{ ...S.muted, ...S.mono, fontSize: 12 }}>
        This feature is currently being developed.
      </p>
    </div>
  );
}

