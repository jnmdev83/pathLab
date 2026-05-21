import React, { useState, useEffect } from 'react';
import { S, MapLink, getMapLink } from '../../utils/reusables';
import { CATEGORIES } from '../../utils/data';
import { API_BASE_URL } from '../../config';

// HOME
export function LocationSearchHub({ setPage, setSelectedBranch, setBranchTests, userLocation, requestGeolocation }) {
  const [searchMethod, setSearchMethod] = useState("city");
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

  const [hasRequested, setHasRequested] = useState(false);

  const requestUserLocation = () => {
    setSearchMethod("gps");
    setGpsLoading(true);
    setGpsError("");
    setNearbyLabs([]);
    setHasRequested(false);

    const handleFetchWithCoords = (latitude, longitude) => {
      fetch(`${API_BASE_URL}/api/dev/seed-nearby-lab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, lng: longitude }),
      })
        .catch(() => null)
        .finally(() => {
          fetchNearbyLabs(latitude, longitude);
          setHasRequested(true);
          setGpsLoading(false);
        });
    };

    if (!navigator.geolocation) {
      setGpsLoading(false);
      setSearchMethod("city");
      setGpsError("Geolocation not supported. Please search for a city/region manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleFetchWithCoords(latitude, longitude);
      },
      (error) => {
        setGpsLoading(false);
        setSearchMethod("city");
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError(
            isMobile
              ? "Location permission denied. Please allow location access in your phone settings or search by city manually below."
              : "Location access was denied. Please allow location permissions in your browser or search by city manually below."
          );
        } else if (error.code === error.TIMEOUT) {
          setGpsError(
            isMobile
              ? "GPS request timed out. Please turn on high-accuracy GPS on your mobile device and try again, or search by city below."
              : "Location request timed out. Please ensure GPS is active and try again, or search by city below."
          );
        } else {
          setGpsError(
            isMobile
              ? "Unable to detect location. Please turn on your phone's GPS/Location services (e.g. from swipe down quick settings) and try again, or search by city below."
              : "Unable to detect location. Please ensure location services are enabled on your device and try again, or search by city below."
          );
        }
        setHasRequested(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
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

  const handleMapClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getMapLink(item);
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
      </div>
      <div style={{ ...S.muted, ...S.mono, fontSize: 11, marginTop: 10, lineHeight: 1.6 }}>
        {lab.address}<br />
        {lab.phone || "Phone unavailable"}
        {showDistance && lab.distance_km !== undefined && (
          <a
            href={getMapLink(lab)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleMapClick(e, lab)}
            style={{
              ...S.lime,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".02em",
              marginTop: 6,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            📍 {Number(lab.distance_km).toFixed(1)} km away
          </a>
        )}
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
    <section style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        
        {/* Sleek Row Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h2 style={{ ...S.serif, fontSize: 18, fontWeight: 700, margin: 0 }}>Find Labs near you</h2>
          </div>
          <button 
            onClick={() => {
              if (searchMethod === "gps") {
                setSearchMethod("city");
                setNearbyLabs([]);
                setHasRequested(false);
                setGpsError("");
              } else {
                requestUserLocation();
              }
            }}
            style={{
              background: "rgba(37,99,235,.06)",
              color: "var(--lime)",
              border: "1px solid rgba(37,99,235,.15)",
              fontFamily: "var(--fb)",
              fontWeight: 600,
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 99,
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(37,99,235,.12)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(37,99,235,.06)"}
          >
            {searchMethod === "gps" ? "🔍 Search by City" : "🔍 Search Nearby"}
          </button>
        </div>

        {searchMethod === "gps" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ margin: 0 }}>Radius</label>
            <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} style={{ width: 100, height: 34, padding: "0 8px" }}>
              <option value={3}>3 KM</option>
              <option value={5}>5 KM</option>
              <option value={10}>10 KM</option>
              <option value={25}>25 KM</option>
            </select>
            <button className="location-search-pill-btn" style={{ height: 34, padding: "0 18px" }} onClick={requestUserLocation}>
              Search
            </button>
          </div>
        )}

        {searchMethod === "city" && (
          <div className="location-search-pill-container">
            <input
              className="location-search-pill-input"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="Enter city, e.g. Delhi, Noida..."
            />
            <button className="location-search-pill-btn" onClick={handleCitySearch}>
              Search
            </button>
          </div>
        )}

        {gpsError && (
          <div style={{ color: "var(--danger)", ...S.mono, fontSize: 11 }}>
            {gpsError}
          </div>
        )}
        {isLoadingResults && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10, marginTop: 14 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="pulse-shimmer"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ width: 120, height: 16, borderRadius: 4, background: "var(--border)" }} />
                    <div style={{ width: 80, height: 12, borderRadius: 3, background: "var(--border)" }} />
                  </div>
                  <div style={{ width: 50, height: 18, borderRadius: 4, background: "var(--border)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  <div style={{ width: "90%", height: 10, borderRadius: 2, background: "var(--border)" }} />
                  <div style={{ width: "70%", height: 10, borderRadius: 2, background: "var(--border)" }} />
                </div>
                <div style={{ width: 80, height: 28, borderRadius: 6, background: "var(--border)", marginTop: 8 }} />
              </div>
            ))}
          </div>
        )}


          {searchMethod === "gps" && hasRequested && nearbyLabs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
              {nearbyLabs.map((lab) => renderLabCard(lab, true))}
            </div>
          )}
        {searchMethod === "gps" && !isLoadingResults && nearbyLabs.length === 0 && !gpsError && (
          <div style={{ ...S.muted, fontSize: 13 }}>No labs found in this radius yet.</div>
        )}

        {searchMethod === "city" && cityLabs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {cityLabs.map((branch) => renderLabCard(branch))}
          </div>
        )}
        {searchMethod === "city" && !isLoadingResults && cityLabs.length === 0 && !gpsError && (
          <div style={{ ...S.muted, fontSize: 13 }}>Search a city to see available branches.</div>
        )}
      </div>
    </section>
  );
}

export function Home({ setPage, setSelectedBranch, setBranchTests, userLocation, requestGeolocation }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };
  const categoryChunks = chunkArray(CATEGORIES, 4);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      setActiveSlide(index);
    }
  };

  return (
    <div className="fu">
      {/* Hero */}
      <div
        className="fu hc"
        style={{
          padding: "var(--hero-pad)",
          marginBottom: 24,
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
        <div className="hero-pill">India's Local Lab Finder</div>
        <h1
          style={{
            ...S.serif,
            fontSize: "clamp(24px,4.5vw,44px)",
            lineHeight: 1.05,
            letterSpacing: "-.02em",
            color: "var(--text)",
            maxWidth: 500,
            margin: "12px 0 10px",
          }}
        >
          Stop overpaying
          <br />
          <em style={S.lime}>for lab tests.</em>
        </h1>
        <p
          style={{
            ...S.muted,
            fontSize: 13,
            maxWidth: 430,
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Compare prices from local diagnostic labs that big platforms ignore.
          Book in 30 seconds. Save up to 70%.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="bl" onClick={() => setPage("blood")}>
            Compare Tests →
          </button>
          <button className="bg" onClick={() => setPage("package")}>
            View Packages
          </button>
        </div>
        {/* Stats row */}
        <div
          className="hero-stats-grid"
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            ["324+", "Tests Listed"],
            ["50+", "Local Labs"],
            ["₹99", "Lowest Price"],
            ["1 HR", "Fastest Report"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="stats-val">
                {v}
              </div>
              <div className="stats-lbl">
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
        userLocation={userLocation}
        requestGeolocation={requestGeolocation}
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

      {/* Grouped Category Carousel Viewport */}
      <div 
        className="cat-carousel-viewport"
        onScroll={handleScroll}
      >
        {categoryChunks.map((chunk, pageIdx) => (
          <div key={pageIdx} className="cat-carousel-page">
            {chunk.map((cat) => (
              <button
                key={cat.id}
                className="hc"
                onClick={() => setPage(cat.page)}
                style={{
                  padding: "16px 14px",
                  textAlign: "left",
                  border: "1.5px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, color: "var(--text)" }}>
                  {cat.name}
                </div>
                <div
                  style={{
                    ...S.mono,
                    ...S.muted,
                    fontSize: 9,
                    letterSpacing: ".02em",
                  }}
                >
                  {cat.tag}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Elegant Dot Indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10, marginBottom: 14 }}>
        {categoryChunks.map((_, idx) => (
          <span 
            key={idx}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: idx === activeSlide ? "var(--lime)" : "var(--border)",
              transition: "all 0.25s ease",
              transform: idx === activeSlide ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Redesigned Value Props Ticker */}
      <div
        className="fu4 redesigned-props-bar"
        style={{
          marginTop: 24,
          background: "linear-gradient(135deg, var(--lime) 0%, #1e40af 100%)",
          padding: "14px 20px",
          borderRadius: 12,
          boxShadow: "0 4px 15px -3px rgba(37, 99, 235, 0.15)",
        }}
      >
        <div className="props-flex-container">
          <div className="prop-item">
            <span className="prop-icon">⚡</span>
            <div className="prop-text-wrap">
              <span className="prop-title">100% Local Labs</span>
              <span className="prop-desc">Direct verified branch prices</span>
            </div>
          </div>
          
          <div className="prop-item-divider" />
          
          <div className="prop-item">
            <span className="prop-icon">🏷️</span>
            <div className="prop-text-wrap">
              <span className="prop-title">Unbeatable Rates</span>
              <span className="prop-desc">Tests starting from ₹99</span>
            </div>
          </div>
          
          <div className="prop-item-divider" />
          
          <div className="prop-item">
            <span className="prop-icon">🏠</span>
            <div className="prop-text-wrap">
              <span className="prop-title">Home Collection</span>
              <span className="prop-desc">Available on demand</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

