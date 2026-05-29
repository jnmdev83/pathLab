import React, { useRef, useEffect } from 'react';

export function WebLayout({
  category,
  search,
  setSearch,
  maxPrice,
  setMaxPrice,
  bodyPart,
  setBodyPart,
  equipmentType,
  setEquipmentType,
  anesthesia,
  setAnesthesia,
  sort,
  setSort,
  currentPage,
  setCurrentPage,
  tests,
  totalCount,
  totalPages,
  filters,
  handleCategorySwitch,
  handleResetFilters,
  setPage,
  setTest,
  setTestName,
  setSelectedLab,
  loading,
  error,
}) {
  const sentinelRef = useRef(null);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || currentPage >= totalPages || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentPage, totalPages, loading, setCurrentPage]);
  const categoriesList = ['Imaging', 'Endoscopy & Screening', 'Cardiac Diagnostics'];

  const [selectedCompare, setSelectedCompare] = React.useState([]);

  const getAvatarBg = (labName) => {
    if (!labName) return 'bg-[#a9ece5]/30 text-[#00535b]';
    const colors = [
      'bg-[#a9ece5]/20 text-[#286d67]',
      'bg-pink-100 text-pink-700',
      'bg-blue-100 text-blue-700',
      'bg-orange-100 text-orange-700',
      'bg-purple-100 text-purple-700',
      'bg-emerald-100 text-emerald-700'
    ];
    const index = labName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleCompareToggle = (proc) => {
    if (selectedCompare.some(p => p.id === proc.id)) {
      setSelectedCompare(selectedCompare.filter(p => p.id !== proc.id));
    } else {
      if (selectedCompare.length >= 3) {
        alert("You can compare up to 3 scans at a time.");
        return;
      }
      setSelectedCompare([...selectedCompare, proc]);
    }
  };

  const handleCompareClick = () => {
    if (selectedCompare.length < 2) {
      alert("Please select at least 2 procedures to compare.");
      return;
    }
    if (setTestName) {
      setTestName(selectedCompare.map(p => p.name).join(" vs "));
    }
    setPage("lab-listing");
  };

  const handleBookNow = (t) => {
    if (setTestName) {
      setTestName(t.name);
    }
    setPage("lab-listing");
  };

  const handleViewDetails = (t) => {
    if (setTest) {
      setTest(t);
    }
    setPage("detail");
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#121c2c] py-8 font-headline">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* ── HERO SECTION ── */}
        <section className="mb-12 text-left">
          <div className="max-w-3xl">
            <span className="px-3.5 py-1 rounded-full bg-[#a9ece5]/60 text-[#286d67] text-xs font-black uppercase tracking-wider mb-3 inline-block">
              Clinical Quality Screenings
            </span>
            <h1 className="text-4xl font-black text-[#121c2c] tracking-tight mb-3">
              {category} Scans &amp; Procedures
            </h1>
            <p className="text-sm md:text-base text-[#3e494a] leading-relaxed">
              Compare turnaround times, NABL credentials, and starting prices across our premium partner laboratory networks. All results are certified under medical supervision.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex gap-2 p-1.5 bg-[#edf6f9] border border-[#bec8ca]/30 rounded-2xl w-fit">
            {categoriesList.map((catName) => {
              const isActive = category === catName;
              return (
                <button
                  key={catName}
                  onClick={() => handleCategorySwitch(catName)}
                  className={`px-6 py-3 rounded-xl font-bold text-xs transition-all uppercase tracking-wider ${
                    isActive 
                      ? "bg-white text-[#00535b] shadow-sm font-black" 
                      : "text-[#3e494a] hover:bg-[#edf6f9]/80 hover:text-[#00535b]"
                  }`}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 sticky top-28">
            <div className="bg-white p-6 rounded-3xl border border-[#bec8ca]/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#121c2c]">Filters</h2>
                <button 
                  onClick={handleResetFilters}
                  className="text-[#00535b] hover:text-[#00393f] text-xs font-bold hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Search Widget */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search test name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-[#bec8ca] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#00535b]/20 focus:bg-white focus:border-[#00535b] outline-none transition-all placeholder:text-[#6f797a]"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#00535b] text-base">search</span>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#121c2c] uppercase tracking-wider block">Price Range</label>
                <input 
                  type="range"
                  min="0"
                  max="8000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                  className="w-full h-1.5 bg-[#edf6f9] rounded-lg appearance-none cursor-pointer accent-[#00535b]"
                />
                <div className="flex justify-between text-[10px] font-bold text-[#6f797a] uppercase tracking-wider">
                  <span>₹0</span>
                  <span className="text-[#00535b]">Max: ₹{maxPrice}</span>
                </div>
              </div>

              {/* DYNAMIC SIDEBAR FILTER BLOCKS */}
              
              {/* 1. Body Part Filter (Imaging and Endoscopy) */}
              {filters.body_parts && filters.body_parts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#121c2c] uppercase tracking-wider block">Body Part</h3>
                  <select 
                    value={bodyPart}
                    onChange={(e) => { setBodyPart(e.target.value); setCurrentPage(1); }}
                    className="w-full h-11 px-3 bg-slate-50 border border-[#bec8ca] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#00535b]/20 focus:border-[#00535b] outline-none cursor-pointer"
                  >
                    <option value="All Body Parts">All Body Parts</option>
                    {filters.body_parts.map(bp => (
                      <option key={bp} value={bp}>{bp}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 2. Equipment / Machine Type Filter (Imaging and Cardiac) */}
              {filters.equipment_types && filters.equipment_types.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#121c2c] uppercase tracking-wider block">Modality / Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setEquipmentType(""); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all ${
                        equipmentType === ""
                          ? 'bg-[#00535b] border-[#00535b] text-white shadow-sm'
                          : 'border-[#bec8ca]/80 text-[#3e494a] hover:bg-[#edf6f9]'
                      }`}
                    >
                      All Types
                    </button>
                    {filters.equipment_types.map(eq => {
                      const isSelected = equipmentType === eq;
                      return (
                        <button
                          key={eq}
                          onClick={() => { setEquipmentType(eq); setCurrentPage(1); }}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'bg-[#00535b] border-[#00535b] text-white shadow-sm'
                              : 'border-[#bec8ca]/80 text-[#3e494a] hover:bg-[#edf6f9]'
                          }`}
                        >
                          {eq}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Anesthesia Option Filter (Endoscopy) */}
              {category.includes("Endoscopy") && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-black text-[#121c2c] uppercase tracking-wider block">Procedure Details</h3>
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <input 
                      type="checkbox"
                      checked={anesthesia}
                      onChange={(e) => { setAnesthesia(e.target.checked); setCurrentPage(1); }}
                      className="w-5 h-5 rounded border-[#bec8ca] text-[#00535b] focus:ring-[#00535b]/20 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#3e494a] group-hover:text-[#00535b] transition-colors">
                      Sedation / Anesthesia
                    </span>
                  </label>
                </div>
              )}

            </div>
          </aside>

          {/* Right Main Content Panel */}
          <div className="flex-grow w-full space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-3xl border border-[#bec8ca]/30 gap-4 text-left">
              <span className="text-xs font-black text-[#3e494a] uppercase tracking-wider">
                Showing {totalCount} {category} Scans
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#6f797a]">Sort by:</span>
                <select 
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="h-10 px-3 bg-[#edf6f9]/60 border-none rounded-xl text-xs font-bold focus:ring-0 cursor-pointer text-[#121c2c]"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Lowest Price">Lowest Price</option>
                  <option value="Reporting Time">Reporting Time</option>
                </select>
              </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
              <div className="bg-white rounded-3xl border border-[#bec8ca]/30 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-10 h-10 rounded-full border-4 border-[#00535b]/20 border-t-[#00535b] animate-spin mb-4" />
                <p className="text-xs font-black text-[#00535b] uppercase tracking-wider animate-pulse">Filtering diagnostic scans...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl border border-[#bec8ca]/30 p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-5xl mb-4">error</span>
                <p className="text-xs font-black text-[#6f797a] uppercase tracking-wider">{error}</p>
              </div>
            ) : tests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#bec8ca]/30 p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[#6f797a] text-5xl mb-4">search_off</span>
                <h3 className="text-sm font-black text-[#121c2c] mb-1">No matching scans found</h3>
                <p className="text-xs font-bold text-[#6f797a] max-w-sm leading-relaxed">
                  Try adjusting your search criteria, widening your budget range, or selecting another scan category tab above.
                </p>
              </div>
            ) : (
              /* Test Cards List (Horizontal revamps matching 2nd image layout) */
              <div className="flex flex-col gap-5">
                {tests.map((test) => {
                  const hasDiscount = test.discount_percent > 0;
                  const labChar = test.lab ? test.lab.charAt(0) : 'L';
                  const avatarBg = getAvatarBg(test.lab);
                  const rating = (4.2 + (test.id % 8) * 0.1).toFixed(1);
                  const reviews = (45 + (test.id * 89) % 250);
                  const distance = (1.2 + (test.id * 1.7) % 8.5).toFixed(2);
                  const isChecked = selectedCompare.some(p => p.id === test.id);

                  return (
                    <div 
                      key={test.id} 
                      className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col lg:flex-row justify-between items-stretch gap-6 relative text-left ${
                        isChecked 
                          ? 'border-[#00535b] ring-2 ring-[#00535b]/5 shadow-md' 
                          : 'border-[#bec8ca]/30 hover:border-[#00535b]/20 hover:shadow-lg'
                      }`}
                    >
                      {/* Left and Center Content Grid */}
                      <div className="flex-grow flex flex-col sm:flex-row gap-5 items-start">
                        
                        {/* Circle Avatar (Pink/Teal dynamic background) */}
                        <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-black text-base uppercase shadow-sm ${avatarBg}`}>
                          {labChar}
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2.5 text-left flex-grow">
                          {/* Lab & Rating row */}
                          <div className="flex flex-wrap items-center gap-3.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                              {test.lab || 'Certified Partner Lab'}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                              <span className="material-symbols-outlined text-orange-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-slate-700">{rating}</span>
                              <span>({reviews})</span>
                            </div>
                          </div>

                          {/* Scan Title Name */}
                          <h3 className="text-xl font-black text-[#121c2c] tracking-tight leading-snug">
                            {test.name}
                          </h3>

                          {/* Distance & Location */}
                          <div className="flex items-center gap-1.5 text-xs text-[#6f797a] font-bold">
                            <span className="material-symbols-outlined text-[#00535b] text-base">location_on</span>
                            <span>{distance} km away in Delhi</span>
                          </div>

                          {/* Bottom Badges row (Report Time, Center Visit, NABL) */}
                          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 border-t border-slate-50 mt-4">
                            <div className="flex items-center gap-1.5 text-xs text-[#3e494a] font-black">
                              <span className="material-symbols-outlined text-[#00535b] text-sm font-bold">schedule</span>
                              <span>Report in {test.rep || 'Same Day'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[#3e494a] font-black">
                              <span className="material-symbols-outlined text-[#00535b] text-sm font-bold">home_health</span>
                              <span>Center Visit Required</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[#3e494a] font-black">
                              <span className="material-symbols-outlined text-emerald-600 text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                              <span>NABL Accredited</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Right Section (Divider + Price + Actions) */}
                      <div className="flex flex-row lg:flex-col justify-between items-end lg:items-stretch pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 w-full lg:w-56 shrink-0 gap-4">
                        
                        {/* Price & Compare Top Bar */}
                        <div className="flex justify-between items-start w-full gap-2">
                          <div className="text-left">
                            <span className="block text-[9px] font-black text-[#6f797a] uppercase tracking-wider mb-0.5">Starting From</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-[#00535b]">₹{test.price}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 w-full mt-auto">
                          <button 
                            onClick={() => handleViewDetails(test)}
                            className="h-10 bg-[#00535b] hover:bg-[#00393f] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm shadow-[#00535b]/10 flex items-center justify-center w-full"
                          >
                            Compare Labs
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-2" />

            {/* Loading More Indicator */}
            {loading && currentPage > 1 && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                  Loading more scans…
                </div>
              </div>
            )}

            {currentPage >= totalPages && tests.length > 0 && !loading && (
              <p className="text-center text-slate-400 text-xs mt-8 py-4">
                — All {totalCount} scans shown —
              </p>
            )}

          </div>

        </div>
      </div>



    </div>
  );
}
