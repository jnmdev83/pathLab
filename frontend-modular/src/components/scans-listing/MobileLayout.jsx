import React, { useState } from 'react';

export function MobileLayout({
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
  loading,
  error
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const categoriesList = ['Imaging', 'Endoscopy & Screening', 'Cardiac Diagnostics'];

  const [selectedCompare, setSelectedCompare] = useState([]);

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

  // Count active filters for badge
  const activeFiltersCount = 
    (search ? 1 : 0) + 
    (maxPrice < 5000 ? 1 : 0) + 
    (bodyPart !== "All Body Parts" ? 1 : 0) + 
    (equipmentType ? 1 : 0) + 
    (anesthesia ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#121c2c] font-headline pb-24 text-left">
      
      {/* ── STICKY MOBILE TOP BAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#bec8ca]/20 px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => setPage("scans-landing")}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer outline-none"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-sm font-black text-[#121c2c] leading-tight">
            Scans &amp; Procedures
          </h1>
          <span className="text-[10px] font-bold text-[#6f797a] uppercase tracking-wider">
            {category} Listing
          </span>
        </div>
      </header>

      {/* ── STICKY HORIZONTAL CATEGORY SCROLL BAR ── */}
      <div className="sticky top-[61px] z-30 bg-white border-b border-[#bec8ca]/10 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none select-none">
        {categoriesList.map((catName) => {
          const isActive = category === catName;
          return (
            <button
              key={catName}
              onClick={() => handleCategorySwitch(catName)}
              className={`px-4 py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isActive 
                  ? "bg-[#00535b] text-white shadow-sm shadow-[#00535b]/15" 
                  : "bg-[#edf6f9] text-[#3e494a] hover:bg-[#edf6f9]/80"
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      <main className="px-4 py-4 space-y-4">
        
        {/* Results Banner & Sort Row */}
        <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-[#bec8ca]/20 shadow-[0_4px_10px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-[#3e494a] uppercase tracking-wider">
            {totalCount} Results
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#6f797a]">Sort:</span>
            <select 
              value={sort}
              onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
              className="h-8 pl-2 pr-6 bg-[#edf6f9]/60 border-none rounded-lg text-[10px] font-black focus:ring-0 cursor-pointer text-[#121c2c] py-0 outline-none"
            >
              <option value="Popularity">Popularity</option>
              <option value="Lowest Price">Lowest Price</option>
              <option value="Reporting Time">Time</option>
            </select>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#bec8ca]/20 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 rounded-full border-3 border-[#00535b]/20 border-t-[#00535b] animate-spin mb-3" />
            <p className="text-[10px] font-black text-[#00535b] uppercase tracking-wider animate-pulse">Filtering scans...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-[#bec8ca]/20 p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-red-600 text-4xl mb-3">error</span>
            <p className="text-[10px] font-black text-[#6f797a] uppercase tracking-wider">{error}</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#bec8ca]/20 p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#6f797a] text-4xl mb-3">search_off</span>
            <h3 className="text-xs font-black text-[#121c2c] mb-1">No scans match filters</h3>
            <p className="text-[10px] font-bold text-[#6f797a] leading-relaxed max-w-[240px] mx-auto">
              Try updating search tags, adjusting budget limits, or clearing active filters.
            </p>
          </div>
        ) : (
          /* CARD LIST FOR MOBILE */
          <div className="space-y-4">
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
                  className={`bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between gap-4 text-left ${
                    isChecked 
                      ? 'border-[#00535b] ring-2 ring-[#00535b]/10 shadow-md' 
                      : 'border-[#bec8ca]/30 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Top Row: Lab Avatar & Name & Rating + Compare */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-xs uppercase shadow-sm ${avatarBg}`}>
                          {labChar}
                        </div>
                        <div className="text-left">
                          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">
                            {test.lab || 'Partner Lab'}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold leading-none">
                            <span className="material-symbols-outlined text-orange-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-slate-700">{rating}</span>
                            <span>({reviews})</span>
                          </div>
                        </div>
                      </div>

                      {/* Compare Checkbox */}
                      <label className="flex items-center gap-1 cursor-pointer select-none mt-0.5">
                        <span className="text-[9px] font-black text-[#6f797a] uppercase tracking-wider">Compare</span>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCompareToggle(test)}
                          className="w-4 h-4 rounded border-[#bec8ca] text-[#00535b] focus:ring-[#00535b]/15"
                        />
                      </label>
                    </div>

                    {/* Scan test name */}
                    <h3 className="text-sm font-black text-[#121c2c] mt-3 leading-tight text-left">{test.name}</h3>

                    {/* Location/Distance */}
                    <div className="flex items-center gap-1 text-[10px] text-[#6f797a] font-bold mt-1 text-left">
                      <span className="material-symbols-outlined text-[#00535b] text-sm">location_on</span>
                      <span>{distance} km away in Delhi</span>
                    </div>

                    {/* Compact clinical details badges */}
                    <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-slate-50 pt-2.5 mt-3">
                      <div className="flex items-center gap-1 text-[10px] text-[#3e494a] font-black">
                        <span className="material-symbols-outlined text-[#00535b] text-xs font-bold">schedule</span>
                        <span>Report in {test.rep || 'Same Day'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#3e494a] font-black">
                        <span className="material-symbols-outlined text-[#00535b] text-xs font-bold">home_health</span>
                        <span>Center Visit Required</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#3e494a] font-black">
                        <span className="material-symbols-outlined text-emerald-600 text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span>NABL Accredited</span>
                      </div>
                    </div>

                  </div>

                  {/* Pricing and split Actions */}
                  <div className="border-t border-slate-100/60 pt-3 mt-1">
                    <div className="flex items-center justify-between mb-3.5">
                      <div>
                        <span className="block text-[8px] font-bold text-[#6f797a] uppercase tracking-wider">Starting From</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-[#00535b]">₹{test.price}</span>
                          {hasDiscount && (
                            <span className="text-[10px] line-through text-[#6f797a]">₹{test.original_price}</span>
                          )}
                        </div>
                      </div>
                      {hasDiscount && (
                        <span className="text-[8px] font-black text-[#286d67] bg-[#a9ece5]/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {test.discount_percent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <button 
                        onClick={() => handleViewDetails(test)}
                        className="h-9.5 bg-[#00535b] hover:bg-[#00393f] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                      >
                        View Detail
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleBookNow(test)}
                          className="h-9 border border-[#00535b] text-[#00535b] rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                        >
                          Book Now
                        </button>
                        <button 
                          onClick={() => handleBookNow(test)}
                          className="h-9 border border-[#bec8ca] text-[#3e494a] rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">labs</span>
                          <span>View Lab</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#bec8ca] text-[#3e494a] hover:bg-[#edf6f9] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
              <button 
                key={pNum}
                onClick={() => setCurrentPage(pNum)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                  currentPage === pNum
                    ? 'bg-[#00535b] text-white'
                    : 'border border-[#bec8ca]/60 text-[#3e494a]'
                }`}
              >
                {pNum}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#bec8ca] text-[#3e494a] hover:bg-[#edf6f9] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}

      </main>

      {/* ── FLOATING FILTER FAB BUTTON ── */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 select-none">
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#00535b] text-white px-5 py-3.5 rounded-full shadow-xl shadow-[#00535b]/20 active:scale-95 transition-all font-black text-xs uppercase tracking-wider cursor-pointer border border-[#a9ece5]/20"
        >
          <span className="material-symbols-outlined text-lg leading-none">filter_list</span>
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#a9ece5] text-[#00535b] font-black w-4.5 h-4.5 rounded-full text-[9px] flex items-center justify-center leading-none">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── SLIDE-UP FILTER DRAWER OVERLAY ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in"
          />
          
          {/* Drawer Sheet */}
          <div 
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[2.5rem] border-t border-[#bec8ca]/30 z-50 flex flex-col shadow-2xl animate-slide-up overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 flex-shrink-0">
              <div>
                <h2 className="text-base font-black text-[#121c2c]">Filters</h2>
                <p className="text-[10px] font-bold text-[#6f797a] uppercase tracking-wider mt-0.5">Customize your scan listing</p>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow text-left">
              
              {/* Search input Widget */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#121c2c] uppercase tracking-wider block">Search Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search scanning test..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-[#bec8ca] rounded-xl text-xs font-semibold focus:bg-white focus:border-[#00535b] outline-none transition-all placeholder:text-[#6f797a]"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#00535b] text-base">search</span>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#121c2c] uppercase tracking-wider block">Maximum Price</label>
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
              
              {/* 1. Body Part Filter */}
              {filters.body_parts && filters.body_parts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#121c2c] uppercase tracking-wider block">Body Part Area</label>
                  <select 
                    value={bodyPart}
                    onChange={(e) => { setBodyPart(e.target.value); setCurrentPage(1); }}
                    className="w-full h-11 px-3 bg-slate-50 border border-[#bec8ca] rounded-xl text-xs font-semibold focus:border-[#00535b] outline-none cursor-pointer"
                  >
                    <option value="All Body Parts">All Body Parts</option>
                    {filters.body_parts.map(bp => (
                      <option key={bp} value={bp}>{bp}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 2. Equipment / Machine Type Filter */}
              {filters.equipment_types && filters.equipment_types.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#121c2c] uppercase tracking-wider block font-headline">Machine Type / Technology</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setEquipmentType(""); setCurrentPage(1); }}
                      className={`px-3 py-2 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        equipmentType === ""
                          ? 'bg-[#00535b] border-[#00535b] text-white shadow-sm'
                          : 'border-[#bec8ca]/80 text-[#3e494a] bg-slate-50'
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
                          className={`px-3 py-2 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#00535b] border-[#00535b] text-white shadow-sm'
                              : 'border-[#bec8ca]/80 text-[#3e494a] bg-slate-50'
                          }`}
                        >
                          {eq}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Anesthesia Option Filter */}
              {category.includes("Endoscopy") && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <label className="text-[10px] font-black text-[#121c2c] uppercase tracking-wider block">Special Procedure Prep</label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={anesthesia}
                      onChange={(e) => { setAnesthesia(e.target.checked); setCurrentPage(1); }}
                      className="w-5 h-5 rounded border-[#bec8ca] text-[#00535b] focus:ring-[#00535b]/20 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#3e494a]">
                      Requires Sedation / Anesthesia
                    </span>
                  </label>
                </div>
              )}

            </div>

            {/* Bottom Actions Drawer Bar */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 flex-shrink-0">
              <button 
                onClick={() => { handleResetFilters(); setDrawerOpen(false); }}
                className="h-12 border border-[#bec8ca] hover:bg-slate-100 text-[#121c2c] rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
              >
                Reset All
              </button>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="h-12 bg-[#00535b] text-white rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Mobile Floating Comparison Bar ── */}
      {selectedCompare.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-40 bg-[#00535b] text-white py-3.5 px-4 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#00535b] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {selectedCompare.length}
            </span>
            <span className="text-[10px] font-bold truncate max-w-[130px] text-left">
              {selectedCompare.map(p => p.name).join(", ")}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setSelectedCompare([])}
              className="text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors px-1"
            >
              Clear
            </button>
            <button 
              onClick={handleCompareClick}
              disabled={selectedCompare.length < 2}
              className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-colors duration-150 ${
                selectedCompare.length >= 2 
                  ? 'bg-white text-[#00535b] active:scale-95' 
                  : 'bg-white/25 text-white/50 cursor-not-allowed'
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
