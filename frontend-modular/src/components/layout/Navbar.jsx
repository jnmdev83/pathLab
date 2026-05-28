import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export function Navbar({ 
  page, 
  setPage, 
  q, 
  setQ, 
  user, 
  setUser,
  userLocation,
  setUserLocation,
  requestGeolocation,
  activeCategoryFilter,
  setActiveCategoryFilter,
  allTests,
  packages,
  setTest,
  setSelectedPackage
}) {
  const [showLocMenu, setShowLocMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredTestIndex, setHoveredTestIndex] = useState(0);
  const [categoryPreviews, setCategoryPreviews] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const handlePincodeSearch = (e) => {
    if (e) e.preventDefault();
    setPincodeError("");
    
    const pin = pincodeInput.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }
    
    let lat = 28.6139; // Default New Delhi
    let lng = 77.2090;
    let locationLabel = `Pincode ${pin}`;
    
    // Dictionary of common Delhi NCR pincodes for high-precision local matching
    const pinMap = {
      "110092": { lat: 28.6314, lng: 77.2789, label: "Laxmi Nagar, Delhi" },
      "110091": { lat: 28.6150, lng: 77.3000, label: "Mayur Vihar, Delhi" },
      "110001": { lat: 28.6304, lng: 77.2177, label: "Connaught Place, Delhi" },
      "110085": { lat: 28.7077, lng: 77.1139, label: "Rohini, Delhi" },
      "110034": { lat: 28.6900, lng: 77.1350, label: "Pitampura, Delhi" },
      "110075": { lat: 28.5900, lng: 77.0500, label: "Dwarka, Delhi" },
      "110017": { lat: 28.5300, lng: 77.2100, label: "Saket, Delhi" },
      "201301": { lat: 28.5708, lng: 77.3272, label: "Sector 15, Noida" },
      "201303": { lat: 28.5600, lng: 77.3800, label: "Sector 62, Noida" },
      "122001": { lat: 28.4595, lng: 77.0266, label: "Gurgaon Center" },
      "122002": { lat: 28.4795, lng: 77.0800, label: "DLF Phase 2, Gurgaon" },
      "121001": { lat: 28.4089, lng: 77.3178, label: "Faridabad" }
    };
    
    if (pinMap[pin]) {
      lat = pinMap[pin].lat;
      lng = pinMap[pin].lng;
      locationLabel = `Delhi NCR (${pinMap[pin].label})`;
    } else {
      if (pin.startsWith("110")) {
        lat = 28.6139; lng = 77.2090; locationLabel = `Delhi (Pincode ${pin})`;
      } else if (pin.startsWith("201")) {
        lat = 28.5708; lng = 77.3272; locationLabel = `Noida/Gzb (Pincode ${pin})`;
      } else if (pin.startsWith("122")) {
        lat = 28.4595; lng = 77.0266; locationLabel = `Gurgaon (Pincode ${pin})`;
      } else if (pin.startsWith("121")) {
        lat = 28.4089; lng = 77.3178; locationLabel = `Faridabad (Pincode ${pin})`;
      } else {
        lat = 28.6139; lng = 77.2090; locationLabel = `Delhi NCR (Pincode ${pin})`;
      }
    }
    
    if (setUserLocation) {
      setUserLocation({
        lat,
        lng,
        label: locationLabel
      });
    }
    
    setShowLocMenu(false);
    setPincodeInput("");
  };

  // Load category previews dynamically from database API!
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/category-previews`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategoryPreviews(data);
        }
      })
      .catch(err => console.error("Error loading category previews from API:", err));
  }, []);

  // Track window resizing for reliable layout determinations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { name: "Full Body Checkup", page: "package" },
    { name: "Heart", page: "category-listing" },
    { name: "Cancer", page: "category-listing" },
    { name: "Thyroid", page: "category-listing" },
    { name: "Diabetes", page: "category-listing" },
    { name: "Pregnancy", page: "category-listing" },
    { name: "Allergy/Intolerance", page: "category-listing" },
    { name: "Hormone", page: "category-listing" },
    { name: "DNA Test", page: "category-listing" }
  ];

  const handleLocationClick = () => {
    if (requestGeolocation) {
      requestGeolocation(false);
    }
    setShowLocMenu(false);
  };

  const handleCategoryClick = (catName, catPage) => {
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(catName);
    }
    setPage(catPage);
  };

  // Fuel mega-menu with DBPreviews filtering
  const getHoveredTests = () => {
    if (!hoveredCategory) return [];
    
    const filterKey = hoveredCategory.toLowerCase();
    
    // Filter matches from db loaded preview table
    const filtered = categoryPreviews.filter(t => t.category_name.toLowerCase() === filterKey);
    return filtered.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description || "Clinical laboratory diagnostic test mapped to accredited pathology parameters.",
      price: t.price,
      rep: t.rep || "12 Hours",
      cat: t.cat || "blood",
      isPkg: !!t.is_pkg
    }));
  };

  const handleMenuTrigger = (catName) => {
    setHoveredCategory(catName);
    setHoveredTestIndex(0);
  };

  return (
    <header className="sticky top-0 z-50 bg-white w-full border-b border-outline-variant/20 shadow-[0_4px_30px_rgba(0,65,162,0.02)] relative">
      
      {/* ── TOP NAVIGATION ROW (Highly compact on mobile with small text) ── */}
      <div className="border-b border-outline-variant/10">
        <nav className="flex justify-between items-center h-14 md:h-20 px-3 md:px-8 w-full max-w-7xl mx-auto font-headline">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <a 
              onClick={() => handleCategoryClick("Home", "home")} 
              className="text-base md:text-2xl font-extrabold text-primary cursor-pointer hover:opacity-85 transition-opacity tracking-tight"
            >
              ChooseMyLab
            </a>
          </div>

          {/* User Profile & Location selectors */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-1.5 md:gap-3">
                <button 
                  onClick={() => setPage("profile-page")}
                  className="flex items-center gap-1 px-2.5 py-1.5 md:px-4 md:py-2.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl transition-all active:scale-95 font-semibold text-[10px] md:text-xs"
                >
                  <span className="material-symbols-outlined text-sm md:text-lg leading-none">account_circle</span>
                  <span className="max-w-[50px] md:max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                </button>
                <button 
                  onClick={() => {
                    setUser(null);
                    handleCategoryClick("Home", "home");
                  }}
                  className="px-1 py-1 text-on-surface-variant/60 hover:text-error text-[10px] md:text-xs font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setPage("signup")}
                className="px-3 py-1.5 md:px-5 md:py-2.5 font-bold text-primary border border-primary/20 hover:border-primary rounded-xl hover:bg-primary/5 transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-wide"
              >
                Login
              </button>
            )}

            {/* Relocated Location Selector bar */}
            <div className="relative">
              <button 
                onClick={() => setShowLocMenu(!showLocMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 md:px-4 md:py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 rounded-xl transition-all cursor-pointer font-headline text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm select-none"
              >
                <span className="material-symbols-outlined text-primary text-xs md:text-base leading-none">location_on</span>
                <span className="max-w-[60px] md:max-w-[120px] truncate leading-none">
                  {userLocation ? userLocation.label.replace("Delhi Pincode 110092 (Shakarpur)", "Delhi").replace("Delhi Pincode 110092", "Delhi") : "Location"}
                </span>
                <span className="material-symbols-outlined text-primary text-[10px] md:text-sm leading-none">keyboard_arrow_down</span>
              </button>

              {/* Dropdown Options */}
              {showLocMenu && (
                <div className="absolute top-10 md:top-12 right-0 w-56 md:w-64 bg-white border border-outline-variant/30 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-body">
                  <button 
                    onClick={handleLocationClick}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 text-left font-semibold text-[10px] md:text-xs text-primary flex items-center gap-2 outline-none"
                  >
                    <span className="material-symbols-outlined text-sm md:text-base">my_location</span>
                    GPS Detect
                  </button>
                  <div className="h-[1px] bg-outline-variant/10 my-1" />

                  {/* Pincode Search Input */}
                  <form onSubmit={handlePincodeSearch} className="px-4 py-2.5 border-b border-outline-variant/5">
                    <div className="text-[9px] uppercase font-extrabold text-on-surface-variant/40 tracking-wider mb-2 font-headline">
                      Search by Pincode
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit PIN"
                          value={pincodeInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPincodeInput(val);
                            if (pincodeError) setPincodeError("");
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-outline-variant/20 focus:border-primary/50 focus:bg-white rounded-lg text-[11px] font-bold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40"
                        />
                        {pincodeInput.length === 6 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-primary font-black uppercase">✓</span>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="h-7 w-7 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                    {pincodeError && (
                      <div className="text-[8px] text-error font-bold mt-1 leading-none">
                        ⚠️ {pincodeError}
                      </div>
                    )}
                  </form>
                  <div className="px-4 py-1.5 text-[9px] uppercase font-bold text-on-surface-variant/40 font-headline tracking-wider">
                    Cities
                  </div>
                  <button 
                    onClick={() => setShowLocMenu(false)}
                    className="w-full px-4 py-2 hover:bg-slate-50 text-left font-medium text-[10px] md:text-xs text-on-surface-variant/90 flex items-center gap-2"
                  >
                    📍 Delhi NCR
                  </button>
                  <button 
                    onClick={() => setShowLocMenu(false)}
                    className="w-full px-4 py-2 hover:bg-slate-50 text-left font-medium text-[10px] md:text-xs text-on-surface-variant/90 flex items-center gap-2"
                  >
                    📍 Gurgaon
                  </button>
                </div>
              )}
            </div>

          </div>
        </nav>
      </div>

      {/* ── BOTTOM DYNAMICS CATEGORY MENU BAR ── */}
      <div 
        className="bg-slate-50/50 w-full overflow-x-auto hide-scrollbar scroll-smooth"
        onMouseLeave={() => {
          if (!isMobile) {
            setHoveredCategory(null);
          }
        }}
      >
        <div className="flex items-center gap-4 md:gap-8 h-10 md:h-12 px-4 md:px-8 w-full max-w-7xl mx-auto font-headline text-[10px] md:text-xs font-extrabold text-on-surface-variant relative">
          {/* Home Nav Item (Uniquely styled & slightly smaller premium pill) */}
          <button 
            onClick={() => handleCategoryClick("Home", "home")}
            className={`flex items-center gap-1.5 rounded-full h-[33px] px-4 flex-shrink-0 cursor-pointer transition-all duration-200 select-none shadow-md active:scale-95 border ${
              activeCategoryFilter === "Home" 
                ? "bg-gradient-to-r from-primary to-blue-700 text-white border-transparent font-black shadow-primary/25 shadow-lg scale-[1.01] ring-2 ring-primary/30" 
                : "bg-white hover:bg-slate-50 border-outline-variant/20 text-on-surface-variant/90 font-extrabold hover:text-primary hover:border-primary/30"
            }`}
          >
            <span className="material-symbols-outlined text-[10px] md:text-sm leading-none">home</span>
            <span className="font-extrabold text-[10px] md:text-[11px] tracking-wide pt-0.5">Home</span>
          </button>
          
          {/* Category List */}
          {categories.map((cat, idx) => {
            const isActive = activeCategoryFilter === cat.name;
            
            return (
              <button
                key={idx}
                onClick={() => {
                  // Mobile: navigate directly to listing page
                  // Desktop: navigate too (hover triggers mega-menu)
                  handleCategoryClick(cat.name, cat.page);
                }}
                onMouseEnter={() => {
                  if (!isMobile) {
                    handleMenuTrigger(cat.name);
                  }
                }}
                className={`relative flex items-center gap-1 hover:text-primary transition-all duration-150 py-2.5 md:py-3.5 border-b-2 h-full flex-shrink-0 cursor-pointer text-[10px] md:text-[11px] lg:text-xs ${
                  isActive ? "text-primary border-primary font-bold" : "border-transparent text-on-surface-variant/80"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. DESKTOP HOVER MEGA-MENU WITH DYNAMIC RIGHT-EXPANSION (Strict Keying & Width Controls) ── */}
      {hoveredCategory && (!isMobile) && (
        <div 
          className="hidden md:block absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl border-t border-b border-outline-variant/15 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 w-full overflow-hidden"
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start w-full">
            
            {/* Left Column: Interactive Pre-filtered diagnostic list (Key collisions solved) */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-primary font-headline">
                  Popular Diagnostics under {hoveredCategory}
                </h4>
                <span className="text-[10px] font-bold text-on-surface-variant/60 font-headline">
                  {getHoveredTests().length} Available
                </span>
              </div>
              
              {categoryPreviews.length === 0 ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="border border-outline-variant/10 rounded-xl p-3 h-12 w-full pulse-shimmer bg-slate-50" />
                  ))}
                </div>
              ) : getHoveredTests().length === 0 ? (
                <div className="text-xs text-on-surface-variant py-4">No diagnostic tests loaded for this segment.</div>
              ) : (
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                  {getHoveredTests().map((t, idx) => {
                    const isHovered = hoveredTestIndex === idx;
                    return (
                      <div
                        key={`${t.id}-${idx}`}
                        onMouseEnter={() => setHoveredTestIndex(idx)}
                        onClick={() => {
                          if (t.isPkg) {
                            setSelectedPackage(t);
                            setPage("package-compare");
                          } else {
                            setTest(t);
                            setPage("detail");
                          }
                          setHoveredCategory(null);
                        }}
                        className={`border rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 w-full ${
                          isHovered 
                            ? "border-primary bg-primary/[0.03] translate-x-1" 
                            : "border-outline-variant/10 bg-transparent hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${isHovered ? "text-primary font-bold" : "text-on-surface-variant/60"}`}>✓</span>
                          <span className={`text-xs font-bold font-headline ${isHovered ? "text-primary" : "text-on-surface"}`}>
                            {t.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/50 font-bold font-headline leading-none">starts at</span>
                            <span className="text-xs font-extrabold text-primary font-headline mt-0.5">₹{t.price}</span>
                          </div>
                          <span className={`material-symbols-outlined text-xs transition-transform ${isHovered ? "text-primary translate-x-0.5" : "text-on-surface-variant/30"}`}>chevron_right</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Right-Expansion clinical significance card (Responsive widths, no cutting!) */}
            {(() => {
              const tests = getHoveredTests();
              const activeTest = tests[hoveredTestIndex] || tests[0];
              if (!activeTest) return null;

              return (
                <div className="bg-slate-50 border border-outline-variant/20 rounded-2xl p-5 relative overflow-hidden min-h-[240px] flex flex-col justify-between shadow-sm w-full max-w-full">
                  {/* Glowing micro-blobs */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 text-left">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-primary/5 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider font-headline border border-primary/10">
                        {activeTest.isPkg ? "Accredited Health Package" : "Accredited Blood Parameter"}
                      </span>
                      <span className="text-[9px] text-secondary font-bold font-headline flex items-center gap-1">
                        ⏱ Reports: {activeTest.rep || "12 Hours"}
                      </span>
                    </div>
                    
                    <h5 className="font-headline font-extrabold text-sm text-on-surface leading-tight mb-2">
                      {activeTest.name}
                    </h5>
                    
                    <p className="text-on-surface-variant text-[11px] leading-relaxed opacity-95">
                      {activeTest.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-4 w-full">
                    <div className="text-left">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant/50 block font-headline">starts at</span>
                      <span className="text-primary font-headline text-lg font-extrabold">₹{activeTest.price}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (activeTest.isPkg) {
                          setSelectedPackage(activeTest);
                          setPage("package-compare");
                        } else {
                          setTest(activeTest);
                          setPage("detail");
                        }
                        setHoveredCategory(null);
                      }}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold rounded-xl uppercase tracking-wider font-headline active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      Book Diagnostic
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ── 5. MOBILE DYNAMIC TOUCH-DRAWER BOTTOM SHEET (Zero cuts, vertical stack) ── */}
      {hoveredCategory && isMobile && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          {/* Tap backdrop to dismiss */}
          <div className="flex-1" onClick={() => setHoveredCategory(null)} />
          
          <div className="bg-white rounded-t-[2rem] max-h-[80vh] overflow-y-auto p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-bottom duration-300 relative text-left">
            
            {/* Header row */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10 mb-4">
              <div>
                <h4 className="font-headline font-extrabold text-xs text-primary uppercase tracking-wide">
                  {hoveredCategory} Preview
                </h4>
                <p className="text-[9px] text-on-surface-variant opacity-80 mt-0.5">Tapping parameters expands their clinical metrics</p>
              </div>
              <button 
                onClick={() => setHoveredCategory(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-on-surface-variant hover:bg-slate-200 active:scale-95 transition-all outline-none"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Previews vertical stacking list */}
            {getHoveredTests().length === 0 ? (
              <div className="text-xs text-on-surface-variant py-6 text-center">No active diagnostics available.</div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
                {getHoveredTests().map((t, idx) => {
                  const isExpanded = hoveredTestIndex === idx;
                  return (
                    <div 
                      key={`${t.id}-${idx}`}
                      onClick={() => setHoveredTestIndex(idx)}
                      className={`border rounded-xl p-3 transition-all duration-200 cursor-pointer ${
                        isExpanded ? "border-primary bg-primary/[0.02]" : "border-outline-variant/10 bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold ${isExpanded ? "text-primary" : "text-on-surface-variant/40"}`}>✓</span>
                          <span className={`text-[11px] font-bold font-headline ${isExpanded ? "text-primary" : "text-on-surface"}`}>
                            {t.name}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/50 font-bold font-headline leading-none">starts at</span>
                          <span className="text-[11px] font-bold text-primary font-headline mt-0.5">₹{t.price}</span>
                        </div>
                      </div>

                      {/* Inline Collapsible details for Mobile viewport stack */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-outline-variant/10 space-y-3 animate-in fade-in duration-200">
                          <div className="flex justify-between items-center text-[9px] text-on-surface-variant/80">
                            <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-md font-bold uppercase border border-primary/10">
                              {t.isPkg ? "Health Package" : "Accredited Check"}
                            </span>
                            <span className="font-bold">⏱ Reports: {t.rep || "12 Hours"}</span>
                          </div>
                          
                          <p className="text-on-surface-variant text-[10px] leading-relaxed opacity-95">
                            {t.description}
                          </p>
                          
                          <button
                            onClick={() => {
                              if (t.isPkg) {
                                setSelectedPackage(t);
                                setPage("package-compare");
                              } else {
                                setTest(t);
                                setPage("detail");
                              }
                              setHoveredCategory(null);
                            }}
                            className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold rounded-xl uppercase tracking-wider font-headline active:scale-95 transition-all shadow-md cursor-pointer"
                          >
                            Book Dynamic Diagnostic
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
}
