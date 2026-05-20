import React, { useState, useEffect, useRef, useMemo } from 'react';
import { S } from '../../utils/reusables';

// TABLE HEADER / ROW HELPERS
export const PACKAGE_INCLUDES = {
  "Full Body Health Checkup (64 Tests)": [
    "LFT (Liver Function)",
    "KFT (Kidney Function)",
    "CBC (Complete Blood Count)",
    "Thyroid Profile",
    "Lipid Profile",
    "Blood Sugar Fasting",
    "Urine Routine",
  ],
  "Senior Citizen Package": [
    "CBC",
    "Bone Health (Calcium)",
    "KFT",
    "HbA1c",
    "Vitamin D",
    "Vitamin B12",
    "ECG",
  ],
  "Women's Wellness Package": [
    "CBC",
    "Thyroid Profile",
    "Iron Profile",
    "Vitamin D",
    "Calcium",
    "Pap Smear",
    "FSH/LH",
  ],
};

export const COL_TESTS = "3fr 2fr 180px";
export function TestTHead() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COL_TESTS,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "9px 20px",
        gap: 12,
      }}
    >
      {["Test Details", "Available Offers", "Price"].map((h) => (
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
  );
}

export const COL_LABS = "2.1fr 1.5fr 1.5fr 100px 80px 100px";
export function LabTHead() {
  return (
    <div
      className="tbl-head"
      style={{
        display: "grid",
        gridTemplateColumns: COL_LABS,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "9px 20px",
        gap: 12,
      }}
    >
      {[
        "Test Details",
        "Lab / Clinic",
        "Location",
        "Report",
        "Price",
        "",
      ].map((h) => (
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
  );
}

