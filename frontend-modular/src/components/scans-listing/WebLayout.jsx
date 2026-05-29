import React from 'react';

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
  loading,
  error
}) {
  const categoriesList = ['Imaging', 'Endoscopy & Screening', 'Cardiac Diagnostics'];

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
              /* Test Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((test) => {
                  const hasDiscount = test.discount_percent > 0;
                  return (
                    <div 
                      key={test.id} 
                      className="bg-white rounded-3xl p-6 border border-[#bec8ca]/40 hover:border-[#00535b]/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            test.is_trending 
                              ? 'bg-[#a9ece5]/50 text-[#286d67]' 
                              : 'bg-[#00535b]/5 text-[#00535b]'
                          }`}>
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>{test.is_trending ? 'Top Booked' : 'NABL Accredited'}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-[#121c2c] mb-2 text-left">{test.name}</h3>
                        <p className="text-xs text-[#3e494a] leading-relaxed mb-4 text-left line-clamp-2">
                          {test.short_description || test.description || 'Premium clinical diagnostic scanning procedure.'}
                        </p>

                        <div className="flex items-center gap-4 mb-6 border-y border-slate-50 py-3 text-left">
                          <div className="flex items-center gap-1.5 text-xs text-[#3e494a] font-bold">
                            <span className="material-symbols-outlined text-[#00535b] text-base">schedule</span>
                            <span>{test.rep || 'Same Day'}</span>
                          </div>
                          {test.body_part && (
                            <div className="flex items-center gap-1.5 text-xs text-[#3e494a] font-bold">
                              <span className="material-symbols-outlined text-[#00535b] text-base">body_system</span>
                              <span>{test.body_part}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100/60">
                        <div className="flex items-end justify-between mb-5">
                          <div className="text-left">
                            <span className="block text-[10px] font-bold text-[#6f797a] uppercase tracking-wider mb-0.5">Starting from</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-[#00535b]">₹{test.price}</span>
                              {hasDiscount && (
                                <span className="text-xs line-through text-[#6f797a]">₹{test.original_price}</span>
                              )}
                            </div>
                          </div>
                          {hasDiscount && (
                            <span className="text-[10px] font-black text-[#286d67] bg-[#a9ece5]/30 px-2 py-0.5 rounded uppercase tracking-wider">
                              {test.discount_percent}% OFF
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleViewDetails(test)}
                            className="h-11 border border-[#bec8ca] hover:bg-[#edf6f9] text-[#121c2c] rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleBookNow(test)}
                            className="h-11 bg-[#00535b] hover:bg-[#00393f] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm shadow-[#00535b]/10"
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

            {/* Pagination Controls */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#bec8ca] text-[#3e494a] hover:bg-[#edf6f9] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                  <button 
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      currentPage === pNum
                        ? 'bg-[#00535b] text-white'
                        : 'border border-[#bec8ca]/60 text-[#3e494a] hover:bg-[#edf6f9]'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#bec8ca] text-[#3e494a] hover:bg-[#edf6f9] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
