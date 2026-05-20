export const CATEGORIES = [
  {
    id: 1,
    name: "Pregnancy",
    icon: "🤰",
    tag: "Maternal Health",
    page: "blood",
  },
  {
    id: 2,
    name: "Diabetic",
    icon: "🩸",
    tag: "Glucose & HbA1c",
    page: "blood",
  },
  { id: 3, name: "Thyroid", icon: "🦋", tag: "T3 · T4 · TSH", page: "package" },
  {
    id: 4,
    name: "Cancer Care",
    icon: "🎗️",
    tag: "Tumor Markers",
    page: "package",
  },
  { id: 5, name: "Heart", icon: "❤️", tag: "Cardiac Panel", page: "blood" },
  {
    id: 6,
    name: "Allergy",
    icon: "🌿",
    tag: "IgE Profiling",
    page: "blood",
  },
  {
    id: 7,
    name: "Vitamin Panel",
    icon: "☀️",
    tag: "D3 · B12 · Iron",
    page: "package",
  },
  {
    id: 8,
    name: "Kidney Care",
    icon: "💧",
    tag: "Urea & Creatinine",
    page: "blood",
  },
  {
    id: 9,
    name: "Liver Wellness",
    icon: "🧪",
    tag: "Bilirubin & SGPT",
    page: "blood",
  },
  {
    id: 10,
    name: "Full Body Check",
    icon: "📋",
    tag: "Comprehensive Panel",
    page: "package",
  },
  {
    id: 11,
    name: "Bone & Joint",
    icon: "🦴",
    tag: "Calcium & Joints",
    page: "blood",
  },
  {
    id: 12,
    name: "Fever & Infection",
    icon: "🤒",
    tag: "CBC & Widal",
    page: "blood",
  },
];

// The ALL_TESTS hardcoded list was removed!
// We now fetch tests dynamically from our PostgreSQL database.
