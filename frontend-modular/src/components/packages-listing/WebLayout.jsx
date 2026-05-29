import React, { useState } from 'react';

// Maps lab name to modern brand color and visual icon placeholder
function getLabLogoStyle(labName = "") {
  const name = labName.toLowerCase();
  if (name.includes('apollo')) return { bg: 'bg-[#e0f4f1]', text: 'text-[#0e9f84]', char: 'A' };
  if (name.includes('lal')) return { bg: 'bg-[#fff3e0]', text: 'text-[#f57c00]', char: 'L' };
  if (name.includes('thyro')) return { bg: 'bg-[#fce4ec]', text: 'text-[#e91e63]', char: 'T' };
  if (name.includes('srl')) return { bg: 'bg-[#e8eaf6]', text: 'text-[#3949ab]', char: 'S' };
  if (name.includes('max')) return { bg: 'bg-[#fce4ec]', text: 'text-[#c62828]', char: 'M' };
  if (name.includes('ganesh')) return { bg: 'bg-[#e8f5e9]', text: 'text-[#388e3c]', char: 'G' };
  if (name.includes('health')) return { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', char: 'H' };
  if (name.includes('redcliffe')) return { bg: 'bg-[#fce4ec]', text: 'text-[#d32f2f]', char: 'R' };
  return { bg: 'bg-slate-100', text: 'text-slate-600', char: labName[0]?.toUpperCase() || 'L' };
}

export function WebLayout({
  activeCategory,
  metadata,
  offers,
  loadingOffers,
  filters,
  setFilters,
  sort,
  setSort,
  pageNum,
  setPageNum,
  totalOffers,
  hasMore,
  resetFilters,
  handleCategorySwitch,
  selectedCompare,
  setSelectedCompare,
  setPage,
  setSelectedPackage,
  setSelectedBranch,
  user,
  userLocation,
  requestGeolocation,
  setSelectedLab,
  setMultiCompareOpen
}) {
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const categoriesList = [
    { name: 'Full Body Checkup', label: 'Full Body Checkup', icon: 'health_and_safety' },
    { name: 'Cancer', label: 'Cancer Screening', icon: 'clinical_notes' },
    { name: 'Heart', label: 'Heart Screening', icon: 'favorite' },
    { name: 'Diabetes', label: 'Diabetes Monitoring', icon: 'bloodtype' },
    { name: 'Pregnancy', label: 'Women Wellness', icon: 'woman' },
    { name: 'Senior Citizen', label: 'Senior Citizen', icon: 'elderly' },
    { name: 'Thyroid', label: 'Thyroid Packages', icon: 'biotech' }
  ];

  // Filters Handler helpers
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFilters(prev => ({
      ...prev,
      maxPrice: value
    }));
    setPageNum(1);
  };

  const handleAccreditationChange = (type) => {
    setFilters(prev => ({
      ...prev,
      accreditations: {
        ...prev.accreditations,
        [type]: !prev.accreditations[type]
      }
    }));
    setPageNum(1);
  };

  const handleHomeCollectionToggle = () => {
    setFilters(prev => ({
      ...prev,
      homeCollection: !prev.homeCollection
    }));
    setPageNum(1);
  };

  const handleTierToggle = (tierName) => {
    setFilters(prev => ({
      ...prev,
      tier: prev.tier === tierName ? null : tierName
    }));
    setPageNum(1);
  };

  const handleCompareCheckbox = (offer) => {
    const isChecked = selectedCompare.some(item => item.id === offer.id);
    if (isChecked) {
      setSelectedCompare(prev => prev.filter(item => item.id !== offer.id));
    } else {
      if (selectedCompare.length >= 3) {
        alert("You can compare up to 3 packages at once.");
        return;
      }
      setSelectedCompare(prev => [...prev, offer]);
    }
  };

  const executeCompare = () => {
    if (selectedCompare.length === 0) return;
    setMultiCompareOpen(true);
  };

  const handleBookNow = (offer) => {
    setSelectedPackage({ id: offer.package_id, name: offer.package_name });
    setPage("package-compare");
  };

  const handleViewDetail = (offer) => {
    setSelectedPackage({ id: offer.package_id, name: offer.package_name });
    if (setSelectedBranch) {
      setSelectedBranch({ id: offer.branch_id, branch_name: offer.branch_name, lab_id: offer.lab_id, lab_name: offer.lab_name });
    }
    setPage("package-detail");
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#191c1d] pb-24" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ── 1. BREADCRUMBS & NAVIGATION HEADER ── */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <nav className="flex items-center gap-2 text-xs font-bold text-[#737785]">
          <span className="cursor-pointer hover:text-[#00535b]" onClick={() => setPage('home')}>Home</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="cursor-pointer hover:text-[#00535b]" onClick={() => setPage('package')}>Packages</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#191c1d] font-black">{metadata?.hero?.title || `${activeCategory} Packages`}</span>
        </nav>
      </div>

      {/* ── 2. DYNAMIC HERO COMPONENT ── */}
      <section className="max-w-7xl mx-auto px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#edeeef]/60 border border-[#c3c6d6]/30 p-8 lg:p-12 rounded-3xl relative overflow-hidden">
          {/* Glowing brand accents */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-6 text-left relative z-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#00535b] tracking-tight font-headline leading-tight">
              {metadata?.hero?.title}
            </h1>
            <p className="text-base text-[#424654] leading-relaxed max-w-xl">
              {metadata?.hero?.subtitle}
            </p>

            {/* Tags strip */}
            <div className="flex flex-wrap gap-2">
              {metadata?.hero?.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-[#c3c6d6] text-xs font-bold rounded-full text-[#424654]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Dyn Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-t border-b border-[#c3c6d6]/20">
              <div>
                <p className="text-2xl font-black text-[#00535b] leading-none mb-1">{metadata?.stats?.availablePackages}</p>
                <p className="text-[10px] uppercase font-bold text-[#737785]">Packages Available</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#00535b] leading-none mb-1">{metadata?.stats?.trustedLabs}</p>
                <p className="text-[10px] uppercase font-bold text-[#737785]">Trusted Labs</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#00535b] leading-none mb-1">₹{metadata?.stats?.startingPrice}</p>
                <p className="text-[10px] uppercase font-bold text-[#737785]">Starting Price</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#006e2c] leading-none mb-1">{metadata?.stats?.homeCollection}</p>
                <p className="text-[10px] uppercase font-bold text-[#737785]">Home Collection</p>
              </div>
            </div>

            {/* Read More Dropdown */}
            {metadata?.hero?.read_more && (
              <div className="space-y-3">
                <button 
                  onClick={() => setReadMoreOpen(!readMoreOpen)}
                  className="flex items-center gap-1.5 text-xs font-black text-[#00535b] hover:underline"
                >
                  <span>{readMoreOpen ? 'Hide Clinical Insights' : 'Read More About Diagnostics'}</span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform ${readMoreOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {readMoreOpen && (
                  <div className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#c3c6d6]/20 text-xs text-[#424654] leading-relaxed shadow-sm">
                    {metadata?.hero?.read_more}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right graphic */}
          <div className="lg:col-span-5 relative w-full h-[320px] rounded-2xl overflow-hidden shadow-md">
            <img 
              alt={metadata?.hero?.title} 
              className="w-full h-full object-cover" 
              src={metadata?.hero?.image_url || 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80'}
            />
            {/* Overlay Badges */}
            <div className="absolute bottom-4 left-4 grid grid-cols-1 gap-2">
              {metadata?.hero?.trust_badges?.map((badge, idx) => (
                <div key={idx} className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg border border-white/20 select-none">
                  <span className="material-symbols-outlined text-emerald-600 text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon || 'verified'}</span>
                  <span className="text-[11px] font-black text-[#191c1d] leading-none">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MAIN DUAL-COLUMN GRID AREA ── */}
      <section className="max-w-7xl mx-auto px-8 flex gap-8">
        
        {/* LEFT COLUMN: STICKY FILTERS SIDEBAR */}
        <aside className="w-72 shrink-0">
          <div className="sticky top-28 bg-white border border-[#c3c6d6]/30 p-6 rounded-2xl shadow-sm space-y-8 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            
            {/* Filter 1: Categories switches */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#737785] mb-4">Categories</h3>
              <div className="space-y-1">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button 
                      key={cat.name}
                      onClick={() => handleCategorySwitch(cat.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-[#00535b]/10 text-[#00535b] font-black shadow-sm' 
                          : 'hover:bg-[#f3f4f5] text-[#424654] font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className={`material-symbols-outlined text-base ${isActive ? 'text-[#00535b]' : 'text-[#737785]'}`}>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-sm font-bold opacity-60">chevron_right</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#737785]">Price Budget</h3>
                <span className="text-xs font-black text-[#00535b]">Max: {formatPrice(filters.maxPrice)}</span>
              </div>
              <input 
                type="range"
                min="300"
                max="25000"
                step="200"
                value={filters.maxPrice}
                onChange={handlePriceChange}
                className="w-full h-2 bg-[#e1e3e4] rounded-lg appearance-none cursor-pointer accent-[#00535b]"
              />
              <div className="flex justify-between mt-2 text-[10px] font-extrabold text-[#737785]">
                <span>₹300</span>
                <span>₹25,000+</span>
              </div>
            </div>

            {/* Filter 3: Lab Compliance Accreditations */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#737785] mb-4">Compliance & Acc</h3>
              <div className="space-y-3.5">
                {['NABL', 'CAP', 'ISO'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={filters.accreditations[type]}
                      onChange={() => handleAccreditationChange(type)}
                      className="w-5 h-5 rounded border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b] cursor-pointer"
                    />
                    <div className="text-xs font-bold text-[#424654]">
                      {type === 'NABL' && 'NABL Certified (Standard)'}
                      {type === 'CAP' && 'CAP Accredited (International)'}
                      {type === 'ISO' && 'ISO Registered (Safety)'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 4: Collection Toggle */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#737785] mb-3">Logistics</h3>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={filters.homeCollection}
                  onChange={handleHomeCollectionToggle}
                  className="w-5 h-5 rounded border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#424654]">Free Home Sample Collection</span>
              </label>
            </div>

            {/* Clear All */}
            <button 
              onClick={resetFilters}
              className="w-full py-3.5 border border-[#c3c6d6] text-xs font-black text-[#191c1d] rounded-xl hover:bg-[#edeeef] active:scale-95 transition-all"
            >
              Reset All Filters
            </button>

          </div>
        </aside>

        {/* RIGHT COLUMN: PACKAGE RESULTS LIST */}
        <div className="flex-1 space-y-8">
          
          {/* A. STANDARDIZED TIERS CARDS */}
          {metadata?.tiers && metadata.tiers.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#737785]">Standardized Screening Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {metadata.tiers.map((tier) => {
                  const isSelected = filters.tier === tier.tier_name;
                  return (
                    <div 
                      key={tier.id}
                      onClick={() => handleTierToggle(tier.tier_name)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none text-left flex flex-col justify-between h-[155px] ${
                        isSelected 
                          ? 'border-[#00535b] ring-4 ring-[#00535b]/10 bg-[#00535b]/5 shadow-md' 
                          : 'border-[#c3c6d6]/40 bg-white hover:border-[#00535b]/50 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <span className="material-symbols-outlined text-[#00535b] text-2xl mb-2">{tier.icon}</span>
                        <h4 className="font-extrabold text-xs text-[#191c1d]">{tier.tier_name}</h4>
                        <p className="text-[10px] text-[#737785] mt-0.5 line-clamp-2 leading-tight font-semibold">{tier.subtitle}</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <span className="text-[8px] uppercase font-bold text-[#737785] block leading-none">Starts at</span>
                          <span className="font-black text-sm text-[#00535b]">₹{tier.price}</span>
                        </div>
                        <span className="text-[9px] font-black text-[#00535b] uppercase tracking-wider underline">
                          {isSelected ? 'Selected' : 'Filter'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* B. LISTING HEADER BAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#c3c6d6]/20 p-4 rounded-2xl shadow-sm text-left">
            <div>
              <h2 className="text-base font-extrabold text-[#191c1d]">
                Showing {totalOffers} Dynamic {activeCategory} Packages
              </h2>
              <p className="text-xs text-[#737785] font-semibold">Verified clinical test profiles with real-time location metrics.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-xs font-extrabold text-[#737785]">Sort By:</label>
              <select 
                value={sort} 
                onChange={(e) => { setSort(e.target.value); setPageNum(1); }}
                className="text-xs font-bold border-[#c3c6d6] rounded-xl focus:ring-[#00535b] focus:border-[#00535b] py-2 px-3 bg-[#f8f9fa] cursor-pointer"
              >
                <option value="recommended">Popularity & Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="report_fastest">Report Turnaround Time</option>
              </select>
            </div>
          </div>

          {/* C. LAB PACKAGE CARDS LISTINGS */}
          <div className="space-y-5">
            {loadingOffers && pageNum === 1 ? (
              // Clinical loading shimmers
              [1, 2, 3].map((idx) => (
                <div key={idx} className="bg-white border border-[#c3c6d6]/20 p-6 rounded-2xl shadow-sm animate-pulse flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="w-48 h-5 bg-[#edeeef] rounded-md" />
                    <div className="w-16 h-5 bg-[#edeeef] rounded-md" />
                  </div>
                  <div className="w-full h-12 bg-[#edeeef] rounded-md" />
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="w-24 h-6 bg-[#edeeef] rounded-md" />
                    <div className="w-32 h-10 bg-[#edeeef] rounded-md" />
                  </div>
                </div>
              ))
            ) : offers.length === 0 ? (
              // Empty search state
              <div className="bg-white border border-[#c3c6d6]/20 p-12 rounded-2xl text-center shadow-sm">
                <span className="material-symbols-outlined text-[#737785] text-5xl mb-3">search_off</span>
                <h4 className="text-base font-extrabold text-[#191c1d]">No Diagnostic Offerings Found</h4>
                <p className="text-xs text-[#737785] mt-1 max-w-sm mx-auto font-semibold">
                  We couldnt find matching packages for this price range or accreditation filter. Try expanding your price budget or clearing filters.
                </p>
                <button 
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#00535b] text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              offers.map((offer) => {
                const isSelectedForCompare = selectedCompare.some(item => item.id === offer.id);
                const logo = getLabLogoStyle(offer.lab_name);
                
                return (
                  <div 
                    key={offer.id} 
                    className="bg-white border border-[#c3c6d6]/40 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 relative text-left"
                  >
                    {/* Compare Box */}
                    <div className="absolute top-6 right-6">
                      <label className="flex items-center gap-2 cursor-pointer group select-none">
                        <span className="text-[10px] font-bold text-[#737785] group-hover:text-[#00535b]">Compare</span>
                        <input 
                          type="checkbox"
                          checked={isSelectedForCompare}
                          onChange={() => handleCompareCheckbox(offer)}
                          className="w-5 h-5 rounded border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b] cursor-pointer"
                        />
                      </label>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6">
                      
                      {/* Left: Lab branding & Title */}
                      <div className="xl:w-64 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 ${logo.bg} ${logo.text} rounded-lg flex items-center justify-center font-black text-xs`}>
                            {logo.char}
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#191c1d] block leading-none">{offer.lab_name}</span>
                            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#737785]">
                              <span className="material-symbols-outlined text-[13px] text-[#f57c00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-[#191c1d]">{offer.lab_rating}</span>
                              <span>({offer.lab_reviews})</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-base font-extrabold text-[#191c1d] leading-snug tracking-tight font-headline">
                          {offer.package_name}
                        </h3>

                        {offer.distance_km && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#737785]">
                            <span className="material-symbols-outlined text-sm">distance</span>
                            <span>{offer.distance_km} km away in {offer.city}</span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Tests chips & Compliance indicators */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Subtests count and list */}
                        <div className="mb-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#737785] mb-2 leading-none">
                            Includes {offer.tests?.length || 0} Dynamic Parameters
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {offer.tests?.slice(0, 5).map((testName, i) => (
                              <span key={i} className="px-2 py-1 bg-[#edeeef]/70 text-[10px] font-bold text-[#424654] rounded-md">
                                {testName}
                              </span>
                            ))}
                            {offer.tests?.length > 5 && (
                              <span className="px-2.5 py-1 text-[10px] font-black text-[#00535b] bg-[#00535b]/5 rounded-md">
                                + {offer.tests.length - 5} More Parameters
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Logistics info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs text-[#737785] font-semibold">
                            <span className="material-symbols-outlined text-base">timer</span>
                            <span>Report in {offer.reporting_time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#737785] font-semibold">
                            <span className="material-symbols-outlined text-base text-[#006e2c]">house</span>
                            <span>Home Collection</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#737785] font-semibold">
                            <span className="material-symbols-outlined text-base text-[#00535b]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <span>
                              {offer.accreditations?.includes('CAP') ? 'CAP Accredited' : 'NABL Certified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: pricing & book controls */}
                      <div className="xl:w-48 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-[#c3c6d6]/20 pt-6 xl:pt-0 xl:pl-6">
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-[#00535b]">₹{offer.price}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button 
                            onClick={() => handleViewDetail(offer)}
                            className="w-full py-2.5 bg-[#00535b] hover:bg-[#00393f] text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow active:scale-95 transition-all uppercase tracking-wider font-headline"
                          >
                            View Detail
                          </button>
                          
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => handleBookNow(offer)}
                              className="flex-1 py-2.5 border border-[#00535b] text-[#00535b] hover:bg-[#00535b]/5 font-extrabold text-xs rounded-xl active:scale-95 transition-all uppercase tracking-wider"
                            >
                              Book Now
                            </button>
                            <button 
                              onClick={() => setSelectedLab({
                                lab_id: offer.lab_id,
                                lab_name: offer.lab_name,
                                packageName: offer.package_name,
                                price: offer.price,
                                bookFn: () => handleBookNow(offer)
                              })}
                              className="flex-1 py-2.5 border border-slate-200 text-[#424654] hover:bg-slate-50 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all uppercase"
                            >
                              <span className="material-symbols-outlined text-[14px]">biotech</span>
                              <span>View Lab</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* D. PAGINATION LOAD MORE */}
          {hasMore && (
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => setPageNum(prev => prev + 1)}
                className="px-8 py-4 border-2 border-[#00535b] text-[#00535b] font-black text-xs rounded-full hover:bg-[#00535b]/5 transition-all uppercase tracking-wider active:scale-95 font-headline"
              >
                Load More Dynamic Packages
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── 4. COMPARATIVE GUIDES & INFORMATION SECTION ── */}
      {metadata?.guides && metadata.guides.length > 0 && (
        <section className="bg-[#edeeef]/40 border-t border-b border-[#c3c6d6]/20 py-16 mt-20 text-left">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-2xl font-extrabold font-headline tracking-tight text-center mb-10">
              Understanding Tiers in {activeCategory} Screening
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {metadata.guides.map((guide) => (
                <div key={guide.id} className="bg-white p-6 rounded-2xl border border-[#c3c6d6]/20 shadow-sm flex flex-col justify-start text-left">
                  <div className="w-12 h-12 bg-[#00535b]/5 rounded-xl flex items-center justify-center text-[#00535b] mb-5">
                    <span className="material-symbols-outlined text-2xl font-bold">{guide.icon}</span>
                  </div>
                  <h4 className="font-extrabold text-sm mb-2 text-[#191c1d]">{guide.title}</h4>
                  <p className="text-xs text-[#424654] leading-relaxed font-semibold">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. FAQS ACCORDION SECTION ── */}
      {metadata?.faqs && metadata.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-8 py-20 text-left">
          <h2 className="text-2xl font-extrabold font-headline tracking-tight text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {metadata.faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white border border-[#c3c6d6]/40 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5 text-left outline-none font-headline font-bold text-sm text-[#191c1d] hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#737785] text-xl transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-[#424654] leading-relaxed border-t border-slate-100 bg-white font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. FLOATING COMPARE SYSTEM TRAY ── */}
      {selectedCompare.length >= 2 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up select-none">
          <div className="bg-[#00535b] shadow-2xl rounded-full py-4 px-6 md:px-8 flex items-center gap-6 md:gap-8 text-white border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {selectedCompare.map((item) => {
                  const logo = getLabLogoStyle(item.lab_name);
                  return (
                    <div 
                      key={item.id} 
                      className={`w-8 h-8 rounded-full bg-white border-2 border-[#00535b] flex items-center justify-center ${logo.text} text-[10px] font-black`}
                    >
                      {logo.char}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs font-black leading-none">{selectedCompare.length} Packages Selected</span>
            </div>
            
            <div className="h-8 w-px bg-white/20" />
            
            <div className="flex items-center gap-3">
              <button 
                onClick={executeCompare}
                className="bg-white text-[#00535b] hover:bg-[#edeeef] px-6 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-colors active:scale-95 duration-100 shadow-sm"
              >
                Compare Now
              </button>
              <button 
                onClick={() => setSelectedCompare([])}
                className="material-symbols-outlined text-white/70 hover:text-white cursor-pointer text-xl leading-none"
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
