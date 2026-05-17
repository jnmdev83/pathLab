import React, { useState } from 'react';
import { S, MapLink } from '../../utils/reusables';
import { CATEGORIES } from '../../utils/data';
import { API_BASE_URL } from '../../config';

// HOME
export function LocationSearchHub({ setPage, setSelectedBranch, setBranchTests }) {
  const [searchMethod, setSearchMethod] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [radius, setRadius] = useState(5);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [nearbyLabs, setNearbyLabs] = useState([]);
  const [cityLabs, setCityLabs] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const fetchNearbyLabs = (lat, lng, searchRadius = radius) => {
    setIsLoadingResults(true);
    setGpsError("");
    fetch(`${API_BASE_URL}/api/labs/nearby?lat=${lat}&lng=${lng}&radius=${searchRadius}`)
      .then((res) => res.json())
      .then((data) => {
        setNearbyLabs(Array.isArray(data) ? data : []);
        if (data.error) setGpsError(data.error);
      })
      .catch(() => setGpsError("Could not fetch nearby labs."))
      .finally(() => setIsLoadingResults(false));
  };

  const requestUserLocation = () => {
    setSearchMethod("gps");
    setGpsLoading(true);
    setGpsError("");
    setNearbyLabs([]);
    if (!navigator.geolocation) {
      setGpsLoading(false);
      setGpsError("Geolocation not supported. Please use manual city search.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLoading(false);
        fetch(`${API_BASE_URL}/api/dev/seed-nearby-lab`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: latitude, lng: longitude }),
        })
          .catch(() => null)
          .finally(() => fetchNearbyLabs(latitude, longitude));
      },
      (error) => {
        setGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED)
          setGpsError("Permission denied. Please use manual city search.");
        else if (error.code === error.TIMEOUT)
          setGpsError("Location request timed out. Please try city search.");
        else setGpsError("Unable to detect your location.");
        setSearchMethod("city");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  };

  const handleCitySearch = () => {
    if (!selectedCity.trim()) {
      setGpsError("Please enter a city name.");
      return;
    }
    setSearchMethod("city");
    setIsLoadingResults(true);
    setGpsError("");
    fetch(`${API_BASE_URL}/api/labs/city?city=${encodeURIComponent(selectedCity.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setCityLabs(Array.isArray(data) ? data : []);
        if (data.error) setGpsError(data.error);
      })
      .catch(() => setGpsError("Could not fetch city labs."))
      .finally(() => setIsLoadingResults(false));
  };

  const fetchTestsAtBranch = (branch) => {
    setIsLoadingResults(true);
    fetch(`${API_BASE_URL}/api/branches/${branch.branch_id}/tests`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedBranch(branch);
        setBranchTests(Array.isArray(data) ? data : []);
        setPage("branch-tests");
      })
      .catch(() => setGpsError("Could not fetch tests for this branch."))
      .finally(() => setIsLoadingResults(false));
  };

  const groupedCityLabs = cityLabs.reduce((acc, lab) => {
    if (!acc[lab.lab_name]) acc[lab.lab_name] = [];
    acc[lab.lab_name].push(lab);
    return acc;
  }, {});

  const renderLabCard = (lab, showDistance = false) => (
    <div
      key={lab.branch_id}
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        borderRadius: 10,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{lab.lab_name}</div>
          <div style={{ ...S.muted, fontSize: 13, marginTop: 2 }}>
            {lab.branch_name} Branch
          </div>
        </div>
        {showDistance && lab.distance_km !== undefined && (
          <span style={{ ...S.tag }}>{Number(lab.distance_km).toFixed(1)} km away</span>
        )}
      </div>
      <div style={{ ...S.muted, ...S.mono, fontSize: 11, marginTop: 10, lineHeight: 1.6 }}>
        {lab.address}<br />
        {lab.phone || "Phone unavailable"}
        <MapLink item={lab} style={{ display: "flex", marginTop: 6 }} />
      </div>
      <button
        className="bl"
        onClick={() => fetchTestsAtBranch(lab)}
        style={{ marginTop: 12, padding: "8px 14px", fontSize: 12 }}
      >
        View Tests
      </button>
    </div>
  );

  return (
    <section style={{ marginBottom: 28 }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: 12,
          padding: 22,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <h2 style={{ ...S.serif, fontSize: 26, marginBottom: 4 }}>Find labs around you</h2>
            <p style={{ ...S.muted, fontSize: 13 }}>Choose GPS or city search, then book tests at a specific branch.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="bl" onClick={requestUserLocation} disabled={gpsLoading}>
              {gpsLoading ? "Detecting..." : "Find Labs Near Me"}
            </button>
            <button className="bg" onClick={() => setSearchMethod("city")}>
              Search by City
            </button>
          </div>
        </div>

        {searchMethod === "gps" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <label style={{ margin: 0 }}>Radius</label>
            <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} style={{ width: 120 }}>
              <option value={3}>3 KM</option>
              <option value={5}>5 KM</option>
              <option value={10}>10 KM</option>
              <option value={25}>25 KM</option>
            </select>
            <button className="bg" onClick={requestUserLocation}>Refresh GPS Search</button>
          </div>
        )}

        {searchMethod === "city" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
            <input
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="Enter city, e.g. Delhi"
            />
            <button className="bl" onClick={handleCitySearch}>Search</button>
          </div>
        )}

        {gpsError && (
          <div style={{ color: "var(--danger)", ...S.mono, fontSize: 12, marginBottom: 12 }}>
            {gpsError}
          </div>
        )}
        {isLoadingResults && <div style={{ ...S.muted, ...S.mono, fontSize: 12 }}>Loading labs...</div>}

        {searchMethod === "gps" && nearbyLabs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {nearbyLabs.map((lab) => renderLabCard(lab, true))}
          </div>
        )}
        {searchMethod === "gps" && !isLoadingResults && nearbyLabs.length === 0 && !gpsError && (
          <div style={{ ...S.muted, fontSize: 13 }}>No labs found in this radius yet.</div>
        )}

        {searchMethod === "city" && Object.keys(groupedCityLabs).length > 0 && (
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(groupedCityLabs).map(([labName, branches]) => (
              <div key={labName}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{labName}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
                  {branches.map((branch) => renderLabCard(branch))}
                </div>
              </div>
            ))}
          </div>
        )}
        {searchMethod === "city" && !isLoadingResults && cityLabs.length === 0 && !gpsError && (
          <div style={{ ...S.muted, fontSize: 13 }}>Search a city to see available branches.</div>
        )}
      </div>
    </section>
  );
}

export function Home({ setPage, setSelectedBranch, setBranchTests }) {
  return (
    <div className="fu">
      {/* Hero */}
      <div
        className="fu hc"
        style={{
          padding: "44px 40px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          cursor: "default",
        }}
      >
        <span
          style={{
            position: "absolute",
            right: -8,
            top: -24,
            ...S.serif,
            fontSize: 180,
            color: "var(--border)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ₹
        </span>
        <div style={S.pill}>India's Local Lab Finder</div>
        <h1
          style={{
            ...S.serif,
            fontSize: "clamp(30px,4.5vw,54px)",
            lineHeight: 1.05,
            letterSpacing: "-.02em",
            color: "var(--text)",
            maxWidth: 500,
            margin: "14px 0 14px",
          }}
        >
          Stop overpaying
          <br />
          <em style={S.lime}>for lab tests.</em>
        </h1>
        <p
          style={{
            ...S.muted,
            fontSize: 14,
            maxWidth: 430,
            marginBottom: 28,
            lineHeight: 1.7,
          }}
        >
          Compare prices from local diagnostic labs that big platforms ignore.
          Book in 30 seconds. Save up to 70%.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="bl" onClick={() => setPage("blood")}>
            Compare Tests →
          </button>
          <button className="bg" onClick={() => setPage("package")}>
            View Packages
          </button>
        </div>
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
          }}
        >
          {[
            ["324+", "Tests Listed"],
            ["50+", "Local Labs"],
            ["₹99", "Lowest Price"],
            ["1 HR", "Fastest Report"],
          ].map(([v, l]) => (
            <div key={l}>
              <div
                style={{ ...S.mono, fontSize: 22, ...S.lime, fontWeight: 500 }}
              >
                {v}
              </div>
              <div
                style={{
                  ...S.muted,
                  ...S.mono,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <LocationSearchHub
        setPage={setPage}
        setSelectedBranch={setSelectedBranch}
        setBranchTests={setBranchTests}
      />

      {/* Section label */}
      <h2
        className="fu2"
        style={{
          ...S.serif,
          fontSize: 28,
          letterSpacing: "-.01em",
          marginBottom: 14,
        }}
      >
        Browse by Category
      </h2>

      {/* Category cards */}
      <div
        className="cat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))",
          gap: 10,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="hc"
            onClick={() => setPage(cat.page)}
            style={{
              padding: "22px 18px",
              textAlign: "left",
              border: "1.5px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {cat.name}
            </div>
            <div
              style={{
                ...S.mono,
                ...S.muted,
                fontSize: 10,
                letterSpacing: ".03em",
              }}
            >
              {cat.tag}
            </div>
          </button>
        ))}
      </div>

      {/* Ticker */}
      <div
        className="fu4"
        style={{
          marginTop: 24,
          background: "var(--lime)",
          padding: "10px 20px",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            ...S.mono,
            fontSize: 12,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: ".05em",
          }}
        >
          ⚡ LOCAL LABS · PRICES FROM ₹99 · BOOK IN 30 SECONDS · HOME COLLECTION
          AVAILABLE
        </span>
      </div>
    </div>
  );
}

