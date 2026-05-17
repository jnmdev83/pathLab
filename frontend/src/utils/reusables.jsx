import React from 'react';
export const S = {
  muted: { color: "var(--muted)" },
  lime: { color: "var(--lime)" },
  mono: { fontFamily: "var(--fm)" },
  serif: { fontFamily: "var(--fd)" },
  pill: {
    background: "var(--lime)",
    color: "#fff",
    fontFamily: "var(--fm)",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 999,
    display: "inline-block",
    letterSpacing: ".04em",
    textTransform: "uppercase",
  },
  tag: {
    background: "rgba(37,99,235,.06)",
    color: "var(--lime)",
    border: "1px solid rgba(37,99,235,.15)",
    fontFamily: "var(--fm)",
    fontSize: 11,
    borderRadius: 6,
    padding: "4px 10px",
    display: "inline-block",
    letterSpacing: ".03em",
  },
};

export function Divider() {
  return (
    <div style={{ height: 1, background: "var(--border)", width: "100%" }} />
  );
}

export function getDistanceKm(test) {
  if (test?.distance_km === null || test?.distance_km === undefined) return null;
  const distance = Number(test.distance_km);
  return Number.isFinite(distance) ? distance : null;
}

export function formatDistance(test) {
  const distance = getDistanceKm(test);
  if (distance === null) return null;
  return distance < 1
    ? `${Math.round(distance * 1000)} m away`
    : `${distance.toFixed(1)} km away`;
}

export function compareNearby(a, b) {
  const aDistance = a.nearestDistance ?? getDistanceKm(a) ?? Number.POSITIVE_INFINITY;
  const bDistance = b.nearestDistance ?? getDistanceKm(b) ?? Number.POSITIVE_INFINITY;
  if (aDistance !== bDistance) return aDistance - bDistance;
  return (a.price ?? a.minPrice ?? 0) - (b.price ?? b.minPrice ?? 0);
}

export function getMapLink(t) {
  if (!t) return '#';
  const lat = t.latitude ?? t.lat;
  const lng = t.longitude ?? t.lng;
  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const query = t.address || t.loc || `${t.branch_name || ''} ${t.city || ''}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function MapLink({ item, style }) {
  const url = getMapLink(item);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color: "var(--lime)",
        textDecoration: "none",
        fontSize: 11,
        fontFamily: "var(--fm)",
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 4,
        transition: "opacity .15s",
        ...style
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
    >
      <span>📍</span>
      <span style={{ textDecoration: "underline" }}>Get Location</span>
    </a>
  );
}

