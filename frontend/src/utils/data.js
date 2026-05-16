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
  { id: 5, name: "Heart", icon: "❤️", tag: "Cardiac Panel", page: "scanning" },
  {
    id: 6,
    name: "Allergy",
    icon: "🌿",
    tag: "IgE Profiling",
    page: "scanning",
  },
];

// The ALL_TESTS hardcoded list was removed!
// We now fetch tests dynamically from our PostgreSQL database.

