import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  setSelectedPackage,
  setTestName
}) {
  const [showLocMenu, setShowLocMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  
  // New States for Navigation Redesign
  const [navMenu, setNavMenu] = useState({ tests: [], packages: [], scans: [] });
  const [activeDropdown, setActiveDropdown] = useState(null); // 'tests' | 'packages' | 'scans' | null
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState(null); // 'tests' | 'packages' | 'scans' | null
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dropdownRef = useRef(null);

  // Default fallback navigation structure in case of network issue
  const defaultMenu = {
    tests: [
      { name: "Heart", category: "Heart", page: "category-listing" },
      { name: "Cancer Care", category: "Cancer", page: "category-listing" },
      { name: "Thyroid", category: "Thyroid", page: "category-listing" },
      { name: "Diabetes", category: "Diabetes", page: "category-listing" },
      { name: "Pregnancy", category: "Pregnancy", page: "category-listing" },
      { name: "Allergy", category: "Allergy/Intolerance", page: "category-listing" },
      { name: "Hormone", category: "Hormone", page: "category-listing" },
      { name: "DNA Test", category: "DNA Test", page: "category-listing" },
      { name: "Kidney Care", category: "Kidney Care", page: "category-listing" },
      { name: "Liver Wellness", category: "Liver Wellness", page: "category-listing" },
      { name: "Vitamin Panel", category: "Vitamin Panel", page: "category-listing" },
      { name: "Bone & Joint", category: "Bone & Joint", page: "category-listing" },
      { name: "Fever & Infection", category: "Fever & Infection", page: "category-listing" }
    ],
    packages: [
      { name: "Full Body", category: "Full Body Checkup", page: "package-listing" },
      { name: "Preventive", category: "Full Body Checkup", page: "package-listing" },
      { name: "Women", category: "Pregnancy", page: "package-listing" },
      { name: "Senior Citizen", category: "Senior Citizen", page: "package-listing" }
    ],
    scans: [
      { name: "Imaging", category: "Imaging", page: "scans-landing" },
      { name: "Endoscopy & Screening", category: "Endoscopy & Screening", page: "scans-landing" },
      { name: "Cardiac Diagnostics", category: "Cardiac Diagnostics", page: "scans-landing" }
    ]
  };

  // 1. Fetch dynamic navigation menu from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/nav-menu`)
      .then(res => {
        if (!res.ok) throw new Error("Could not load navigation menu");
        return res.json();
      })
      .then(data => {
        if (data && data.tests && data.packages) {
          setNavMenu(data);
        } else {
          setNavMenu(defaultMenu);
        }
      })
      .catch(err => {
        console.warn("Navigation API warning, using dynamic seeds fallback:", err);
        setNavMenu(defaultMenu);
      });
  }, []);

  // 2. Track window resize for responsive determination
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Use 1024px for cleaner desktop transition
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pincode Search handling
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
      setUserLocation({ lat, lng, label: locationLabel });
    }
    
    setShowLocMenu(false);
    setPincodeInput("");
  };

  const handleLocationClick = () => {
    if (requestGeolocation) {
      requestGeolocation(false);
    }
    setShowLocMenu(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchText.trim()) return;
    
    if (setTestName) {
      setTestName(searchText.trim());
    }
    setPage("lab-listing");
    setSearchBarOpen(false);
    setSearchText("");
  };

  const handleItemNavigation = (item) => {
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(item.category);
    }
    setPage(item.page);
    setActiveDropdown(null);
    setMobileDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] font-headline">
      
      {/* ─── DESKTOP HEADER (Large viewports) ─── */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center h-12 w-full gap-4">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a 
              onClick={() => { setPage("home"); if (setActiveCategoryFilter) setActiveCategoryFilter("Home"); }} 
              className="text-2xl font-black text-[#006d77] cursor-pointer hover:opacity-85 transition-opacity tracking-tight"
            >
              ChooseMyLab
            </a>
          </div>

          {/* Dynamic Dropdown Navigation links */}
          <div className="flex items-center gap-6 xl:gap-8 font-extrabold text-[13px] text-[#4d515a]" ref={dropdownRef}>
            
            {/* Tests Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'tests' ? null : 'tests')}
                onMouseEnter={() => setActiveDropdown('tests')}
                className={`flex items-center gap-1 hover:text-[#006d77] transition-colors py-2 outline-none select-none cursor-pointer ${
                  activeDropdown === 'tests' ? 'text-[#006d77]' : ''
                }`}
              >
                <span>Tests</span>
                <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                  activeDropdown === 'tests' ? 'rotate-180' : ''
                }`}>keyboard_arrow_down</span>
              </button>

              {activeDropdown === 'tests' && (
                <div 
                  className="absolute top-[42px] left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {navMenu.tests.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemNavigation(item)}
                      className="w-full px-4 py-2 hover:bg-slate-50 text-left font-bold text-xs text-[#202124] hover:text-[#006d77] transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scans & Procedures Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'scans' ? null : 'scans')}
                onMouseEnter={() => setActiveDropdown('scans')}
                className={`flex items-center gap-1 hover:text-[#006d77] transition-colors py-2 outline-none select-none cursor-pointer ${
                  activeDropdown === 'scans' ? 'text-[#006d77]' : ''
                }`}
              >
                <span onClick={(e) => { e.stopPropagation(); setPage("scans-landing"); setActiveDropdown(null); }} className="hover:underline">Scans &amp; Procedures</span>
                <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                  activeDropdown === 'scans' ? 'rotate-180' : ''
                }`}>keyboard_arrow_down</span>
              </button>

              {activeDropdown === 'scans' && (
                <div 
                  className="absolute top-[42px] left-0 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => { setPage("scans-landing"); setActiveDropdown(null); }}
                    className="w-full px-4 py-2 hover:bg-[#00535b]/5 text-left font-extrabold text-xs text-[#00535b] hover:text-[#006d77] transition-colors border-b border-slate-100/50 mb-1"
                  >
                    All Scans &amp; Procedures
                  </button>
                  {(navMenu.scans || []).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemNavigation(item)}
                      className="w-full px-4 py-2 hover:bg-slate-50 text-left font-bold text-xs text-[#202124] hover:text-[#006d77] transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Packages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'packages' ? null : 'packages')}
                onMouseEnter={() => setActiveDropdown('packages')}
                className={`flex items-center gap-1 hover:text-[#006d77] transition-colors py-2 outline-none select-none cursor-pointer ${
                  activeDropdown === 'packages' ? 'text-[#006d77]' : ''
                }`}
              >
                <span>Packages</span>
                <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                  activeDropdown === 'packages' ? 'rotate-180' : ''
                }`}>keyboard_arrow_down</span>
              </button>

              {activeDropdown === 'packages' && (
                <div 
                  className="absolute top-[42px] left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {navMenu.packages.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemNavigation(item)}
                      className="w-full px-4 py-2 hover:bg-slate-50 text-left font-bold text-xs text-[#202124] hover:text-[#006d77] transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Labs Direct Link */}
            <button
              onClick={() => setPage("lab-listing")}
              className="hover:text-[#006d77] transition-colors py-2 outline-none select-none cursor-pointer"
            >
              Labs
            </button>

            {/* Cyan Compare Pill */}
            <button
              onClick={() => setPage("package-compare")}
              className="flex items-center gap-1 px-4 py-2 bg-[#e7eeff] text-[#00535b] rounded-full hover:shadow-md transition-all active:scale-95 text-[11px] font-black uppercase tracking-wider outline-none select-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] leading-none">swap_horiz</span>
              <span>Compare</span>
            </button>

          </div>

          {/* Right Compact Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            
            {/* Dynamic Search Bar Toggle */}
            <div className="relative flex items-center">
              {searchBarOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 animate-in slide-in-from-right-3 duration-250">
                  <input 
                    type="text"
                    placeholder="Search tests or packages..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-48 bg-transparent text-xs font-bold text-[#202124] outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                  <button type="submit" className="text-slate-500 hover:text-[#006d77] leading-none">
                    <span className="material-symbols-outlined text-[16px]">search</span>
                  </button>
                  <button type="button" onClick={() => { setSearchBarOpen(false); setSearchText(""); }} className="text-slate-400 hover:text-red-500 leading-none">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setSearchBarOpen(true)}
                  className="w-10 h-10 rounded-full hover:bg-slate-50 text-[#4d515a] hover:text-[#006d77] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">search</span>
                </button>
              )}
            </div>

            {/* Location selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLocMenu(!showLocMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-[#4d515a] rounded-xl transition-all cursor-pointer font-extrabold text-[12px] uppercase select-none"
              >
                <span className="material-symbols-outlined text-[#006d77] text-[16px] leading-none">location_on</span>
                <span className="max-w-[100px] truncate leading-none">
                  {userLocation ? userLocation.label.split("(")[0].trim() : "Location"}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-[14px] leading-none">keyboard_arrow_down</span>
              </button>

              {showLocMenu && (
                <div className="absolute top-[44px] right-0 w-64 bg-white border border-slate-200/60 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-body text-left">
                  <button 
                    onClick={handleLocationClick}
                    className="w-full px-4 py-2.5 hover:bg-slate-50 text-left font-bold text-xs text-[#006d77] flex items-center gap-2 outline-none"
                  >
                    <span className="material-symbols-outlined text-sm">my_location</span>
                    GPS Detect
                  </button>
                  <div className="h-[1px] bg-slate-100 my-1" />

                  {/* Pincode Search */}
                  <form onSubmit={handlePincodeSearch} className="px-4 py-2.5">
                    <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider mb-2 font-headline">
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
                            setPincodeInput(e.target.value.replace(/\D/g, ""));
                            if (pincodeError) setPincodeError("");
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#006d77]/50 focus:bg-white rounded-lg text-xs font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="h-7 w-7 rounded-lg bg-[#006d77]/10 hover:bg-[#006d77] text-[#006d77] hover:text-white flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                    {pincodeError && (
                      <div className="text-[9px] text-red-500 font-bold mt-1.5 leading-none">
                        ⚠️ {pincodeError}
                      </div>
                    )}
                  </form>
                  <div className="px-4 py-1 text-[9px] uppercase font-bold text-slate-400 font-headline tracking-wider">
                    Cities
                  </div>
                  <button 
                    onClick={() => { setUserLocation({ lat: 28.6139, lng: 77.2090, label: "Delhi NCR" }); setShowLocMenu(false); }}
                    className="w-full px-4 py-2 hover:bg-slate-50 text-left font-bold text-xs text-slate-600 flex items-center gap-2"
                  >
                    📍 Delhi NCR
                  </button>
                  <button 
                    onClick={() => { setUserLocation({ lat: 28.4595, lng: 77.0266, label: "Gurgaon" }); setShowLocMenu(false); }}
                    className="w-full px-4 py-2 hover:bg-slate-50 text-left font-bold text-xs text-slate-600 flex items-center gap-2"
                  >
                    📍 Gurgaon
                  </button>
                </div>
              )}
            </div>

            {/* Authentication Widget */}
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage("profile-page")}
                  className="flex items-center gap-1 px-3.5 py-2 bg-[#006d77]/5 hover:bg-[#006d77]/10 text-[#006d77] rounded-xl transition-all active:scale-95 font-extrabold text-xs"
                >
                  <span className="material-symbols-outlined text-base leading-none">account_circle</span>
                  <span className="max-w-[70px] truncate">{user.name.split(" ")[0]}</span>
                </button>

              </div>
            ) : (
              <button 
                onClick={() => setPage("signup")}
                className="px-4 py-2 font-black text-[#006d77] hover:text-[#0a3e87] hover:underline transition-all text-xs uppercase tracking-wide cursor-pointer"
              >
                Login/Signup
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ─── MOBILE HEADER (Touch viewports) ─── */}
      <div className="lg:hidden w-full max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-14">
        
        {/* Left Side Hamburger + Brand */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer outline-none"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <a 
            onClick={() => { setPage("home"); if (setActiveCategoryFilter) setActiveCategoryFilter("Home"); }} 
            className="text-lg font-black text-[#006d77] cursor-pointer hover:opacity-85 tracking-tight pt-0.5"
          >
            ChooseMyLab
          </a>
        </div>

        {/* Right Side Widgets */}
        <div className="flex items-center gap-1">
          
          {/* Location button */}
          <button 
            onClick={() => setShowLocMenu(!showLocMenu)}
            className="w-9 h-9 flex items-center justify-center text-[#006d77] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </button>

          {/* Profile widget */}
          <button 
            onClick={() => setPage(user ? "profile-page" : "signup")}
            className="w-9 h-9 flex items-center justify-center text-[#4d515a] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>

        </div>
      </div>

      {/* Mobile Inline Search Bar Row */}
      {searchBarOpen && isMobile && (
        <div className="lg:hidden px-4 pb-3 w-full border-t border-slate-50 pt-2 bg-white animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
            <input 
              type="text"
              placeholder="Search tests or checkup packages..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-[#202124] placeholder:text-slate-400 focus:bg-white focus:border-[#006d77]/40 transition-all"
              autoFocus
            />
            <button 
              type="submit" 
              className="bg-[#006d77] text-white px-4 rounded-xl flex items-center justify-center active:scale-95 transition-all text-xs font-bold uppercase cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Location Search Dropdown panel */}
      {showLocMenu && isMobile && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top duration-150 text-left">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Location</span>
            <button onClick={() => setShowLocMenu(false)} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <button 
            onClick={handleLocationClick}
            className="w-full px-3 py-2 bg-[#006d77]/5 hover:bg-[#006d77]/10 text-[#006d77] font-bold text-xs rounded-xl flex items-center justify-center gap-2 mb-3 transition-all"
          >
            <span className="material-symbols-outlined text-base">my_location</span>
            Detect GPS Location
          </button>
          <form onSubmit={handlePincodeSearch} className="flex gap-1.5 items-center mb-3">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit PIN"
              value={pincodeInput}
              onChange={(e) => {
                setPincodeInput(e.target.value.replace(/\D/g, ""));
                if (pincodeError) setPincodeError("");
              }}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#006d77]/50 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-[#006d77] text-white px-3.5 py-2 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0 font-bold text-xs"
            >
              Set PIN
            </button>
          </form>
          {pincodeError && (
            <div className="text-[9px] text-red-500 font-bold mb-3 leading-none">
              ⚠️ {pincodeError}
            </div>
          )}
          <div className="flex gap-2">
            <button 
              onClick={() => { setUserLocation({ lat: 28.6139, lng: 77.2090, label: "Delhi NCR" }); setShowLocMenu(false); }}
              className="flex-1 py-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-center font-bold text-xs text-slate-700 rounded-lg"
            >
              Delhi NCR
            </button>
            <button 
              onClick={() => { setUserLocation({ lat: 28.4595, lng: 77.0266, label: "Gurgaon" }); setShowLocMenu(false); }}
              className="flex-1 py-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-center font-bold text-xs text-slate-700 rounded-lg"
            >
              Gurgaon
            </button>
          </div>
        </div>
      )}

      {/* ─── MOBILE NAVIGATION SIDEBAR DRAWER (React Portal to break out of z-50 parent stacking contexts) ─── */}
      {mobileDrawerOpen && createPortal(
        <>
          {/* Dark blurred background overlay */}
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
            style={{ zIndex: 999998 }}
          />
          
          {/* Slide-out Panel */}
          <div 
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[300px] bg-white h-full shadow-[5px_0_25px_rgba(0,0,0,0.15)] flex flex-col justify-between animate-in slide-in-from-left duration-300 text-left"
            style={{ zIndex: 999999 }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <span className="text-[#006d77] font-black text-lg tracking-tight">ChooseMyLab</span>
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {/* Drawer Links Navigation */}
              <div className="p-4 space-y-2 font-bold text-sm text-[#4d515a]">
                
                {/* Home shortcut */}
                <button
                  onClick={() => { setPage("home"); if (setActiveCategoryFilter) setActiveCategoryFilter("Home"); setMobileDrawerOpen(false); }}
                  className="w-full flex items-center gap-2 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-base text-slate-400">home</span>
                  <span>Home</span>
                </button>

                {/* Tests Accordion Link */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileActiveAccordion(mobileActiveAccordion === 'tests' ? null : 'tests')}
                    className="w-full flex items-center justify-between py-2.5 px-3 bg-slate-50/50 hover:bg-slate-50 transition-all outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-slate-400">science</span>
                      <span>Tests</span>
                    </div>
                    <span className={`material-symbols-outlined text-base transition-transform ${
                      mobileActiveAccordion === 'tests' ? 'rotate-180' : ''
                    }`}>keyboard_arrow_down</span>
                  </button>

                  {mobileActiveAccordion === 'tests' && (
                    <div className="bg-white pl-8 pr-3 py-1.5 space-y-1 border-t border-slate-50 animate-in fade-in duration-200">
                      {navMenu.tests.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleItemNavigation(item)}
                          className="w-full py-2 text-left text-xs font-bold text-slate-600 hover:text-[#006d77] block"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scans & Procedures Accordion Link */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileActiveAccordion(mobileActiveAccordion === 'scans' ? null : 'scans')}
                    className="w-full flex items-center justify-between py-2.5 px-3 bg-slate-50/50 hover:bg-slate-50 transition-all outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-slate-400">biotech</span>
                      <span>Scans &amp; Procedures</span>
                    </div>
                    <span className={`material-symbols-outlined text-base transition-transform ${
                      mobileActiveAccordion === 'scans' ? 'rotate-180' : ''
                    }`}>keyboard_arrow_down</span>
                  </button>

                  {mobileActiveAccordion === 'scans' && (
                    <div className="bg-white pl-8 pr-3 py-1.5 space-y-1 border-t border-slate-50 animate-in fade-in duration-200">
                      <button
                        onClick={() => { setPage("scans-landing"); setMobileDrawerOpen(false); }}
                        className="w-full py-2 text-left text-xs font-extrabold text-[#00535b] hover:text-[#006d77] block border-b border-slate-50"
                      >
                        All Scans &amp; Procedures
                      </button>
                      {(navMenu.scans || []).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleItemNavigation(item)}
                          className="w-full py-2 text-left text-xs font-bold text-slate-600 hover:text-[#006d77] block"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Packages Accordion Link */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setMobileActiveAccordion(mobileActiveAccordion === 'packages' ? null : 'packages')}
                    className="w-full flex items-center justify-between py-2.5 px-3 bg-slate-50/50 hover:bg-slate-50 transition-all outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-slate-400">health_and_safety</span>
                      <span>Packages</span>
                    </div>
                    <span className={`material-symbols-outlined text-base transition-transform ${
                      mobileActiveAccordion === 'packages' ? 'rotate-180' : ''
                    }`}>keyboard_arrow_down</span>
                  </button>

                  {mobileActiveAccordion === 'packages' && (
                    <div className="bg-white pl-8 pr-3 py-1.5 space-y-1 border-t border-slate-50 animate-in fade-in duration-200">
                      {navMenu.packages.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleItemNavigation(item)}
                          className="w-full py-2 text-left text-xs font-bold text-slate-600 hover:text-[#006d77] block"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Labs Direct link */}
                <button
                  onClick={() => { setPage("lab-listing"); setMobileDrawerOpen(false); }}
                  className="w-full flex items-center gap-2 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-base text-slate-400">labs</span>
                  <span>Labs</span>
                </button>

                {/* Compare Link */}
                <button
                  onClick={() => { setPage("package-compare"); setMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all text-[#00535b]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">swap_horiz</span>
                    <span>Compare Diagnostics</span>
                  </div>
                  <span className="bg-[#e7eeff] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Compare</span>
                </button>

              </div>
            </div>

            {/* Drawer bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
              {user ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">account_circle</span>
                    <span className="text-xs font-bold text-slate-700">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { setUser(null); setPage("home"); setMobileDrawerOpen(false); }}
                    className="text-xs font-black uppercase text-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setPage("signup"); setMobileDrawerOpen(false); }}
                  className="w-full py-2.5 bg-white border border-slate-200 text-[#006d77] font-bold text-xs rounded-xl text-center active:scale-95 transition-all cursor-pointer uppercase tracking-wider block"
                >
                  Login / Register
                </button>
              )}

              <button
                onClick={() => { setPage("package-listing"); if (setActiveCategoryFilter) setActiveCategoryFilter("Full Body Checkup"); setMobileDrawerOpen(false); }}
                className="w-full py-3 bg-[#006d77] hover:bg-[#0a3e87] text-white font-bold text-xs rounded-xl text-center active:scale-95 transition-all cursor-pointer uppercase tracking-wider block"
              >
                Book checkup Now
              </button>
            </div>
          </div>
        </>
        , document.body
      )}

    </header>
  );
}
