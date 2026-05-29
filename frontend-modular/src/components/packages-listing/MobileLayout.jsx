import React, { useState, useRef, useEffect } from 'react';

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

export function MobileLayout({
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
  const sentinelRef = useRef(null);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingOffers) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPageNum(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingOffers, setPageNum]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const categoriesList = [
    { name: 'Full Body Checkup', label: 'Full Body' },
    { name: 'Cancer', label: 'Cancer' },
    { name: 'Heart', label: 'Heart' },
    { name: 'Diabetes', label: 'Diabetes' },
    { name: 'Pregnancy', label: 'Women' },
    { name: 'Senior Citizen', label: 'Senior' },
    { name: 'Thyroid', label: 'Thyroid' }
  ];

  // Filters Handler helpers
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

  const handlePriceRangeSelect = (maxVal) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: maxVal
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
      if (selectedCompare.length >= 2) {
        alert("You can compare up to 2 packages on mobile.");
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
    <div className="bg-[#f8f9fa] min-h-screen text-[#191c1d] pb-32" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ── 1. HERO HEADER BLOCK ── */}
      <header className="px-5 pt-6 pb-4 text-left">
        <h1 className="font-headline text-2xl font-black text-[#191c1d] mb-1.5">
          {metadata?.hero?.title || `${activeCategory} Packages`}
        </h1>
        <p className="text-xs text-[#424654] opacity-80 leading-relaxed max-w-md mb-5">
          {metadata?.hero?.subtitle}
        </p>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#edeeef]/50 p-3.5 rounded-2xl flex flex-col items-center text-center gap-1 shadow-sm border border-[#c3c6d6]/20">
            <div className="w-8 h-8 bg-[#00535b]/10 rounded-full flex items-center justify-center text-[#00535b]">
              <span className="material-symbols-outlined text-base">clinical_notes</span>
            </div>
            <span className="text-[10px] font-black text-[#191c1d]">{metadata?.stats?.availablePackages} Packages</span>
          </div>
          <div className="bg-[#edeeef]/50 p-3.5 rounded-2xl flex flex-col items-center text-center gap-1 shadow-sm border border-[#c3c6d6]/20">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#006e2c]">
              <span className="material-symbols-outlined text-base">verified_user</span>
            </div>
            <span className="text-[10px] font-black text-[#191c1d]">{metadata?.stats?.trustedLabs} Labs Partner</span>
          </div>
        </div>
      </header>

      {/* ── 2. STANDARDIZED TIERS SNAP SLIDER CAROUSEL ── */}
      {metadata?.tiers && metadata.tiers.length > 0 && (
        <section className="mb-6 text-left">
          <div className="px-5 flex justify-between items-center mb-3">
            <h2 className="font-headline text-sm font-extrabold text-[#191c1d]">Standardized Tiers</h2>
            <span className="text-[10px] font-black text-[#00535b] uppercase tracking-wider">Select to Filter</span>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-5 snap-x">
            {metadata.tiers.map((tier) => {
              const isSelected = filters.tier === tier.tier_name;
              return (
                <div 
                  key={tier.id}
                  onClick={() => handleTierToggle(tier.tier_name)}
                  className={`min-w-[220px] max-w-[220px] snap-center bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between h-[140px] ${
                    isSelected 
                      ? 'border-[#00535b] ring-4 ring-[#00535b]/10 bg-[#00535b]/5 shadow-md' 
                      : 'border-[#c3c6d6]/20 shadow-[0px_4px_20px_rgba(11,87,208,0.03)]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="bg-[#edeeef] text-[#737785] text-[9px] font-extrabold px-2 py-0.5 rounded-full leading-none">
                        {tier.tier_name}
                      </span>
                      <span className="material-symbols-outlined text-[#00535b] text-lg leading-none">{tier.icon}</span>
                    </div>
                    <p className="text-[9px] text-[#737785] mt-2 font-semibold line-clamp-2 leading-snug">{tier.subtitle}</p>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-slate-50 pt-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[8px] text-[#737785]">Starts</span>
                      <span className="text-xs font-black text-[#00535b]">₹{tier.price}</span>
                    </div>
                    <button 
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#00535b] text-white' : 'text-[#00535b] bg-[#00535b]/5'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Pick'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 3. STICKY FILTER DRAWER TRIGGER & QUICK PILLS ── */}
      <div className="sticky top-16 z-40 bg-[#f8f9fa] px-5 py-3.5 flex gap-2 overflow-x-auto hide-scrollbar border-b border-[#c3c6d6]/10 select-none shadow-sm">
        <button 
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-1.5 bg-[#edeeef] px-4 py-2 rounded-full text-[11px] font-black text-[#191c1d] shrink-0 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-sm font-bold leading-none">tune</span>
          <span>Filters</span>
        </button>

        {/* Categories sliding pills */}
        {categoriesList.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button 
              key={cat.name}
              onClick={() => handleCategorySwitch(cat.name)}
              className={`px-4 py-2 rounded-full text-[11px] font-black whitespace-nowrap shrink-0 transition-all ${
                isActive 
                  ? 'bg-[#00535b] text-white shadow-sm shadow-[#00535b]/25' 
                  : 'bg-[#edeeef] text-[#424654] font-semibold hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── 4. OFFERS LISTINGS ── */}
      <section className="px-5 mt-5 space-y-4">
        {loadingOffers && pageNum === 1 ? (
          // Mobil loading skeleton
          [1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white border border-[#c3c6d6]/10 p-5 rounded-2xl shadow-sm animate-pulse flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-slate-100 rounded" />
                <div className="w-8 h-4 bg-slate-100 rounded" />
              </div>
              <div className="w-full h-8 bg-slate-100 rounded" />
              <div className="flex justify-between pt-3 border-t border-slate-50">
                <div className="w-16 h-5 bg-slate-100 rounded" />
                <div className="w-20 h-8 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : offers.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-[#c3c6d6]/10 text-center shadow-sm">
            <span className="material-symbols-outlined text-[#737785] text-4xl mb-2">search_off</span>
            <p className="text-xs font-black text-[#191c1d]">No diagnostic packages found.</p>
            <p className="text-[10px] text-[#737785] mt-0.5 max-w-xs mx-auto font-semibold">Try opening your filters to clear price checks or accreditations.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 bg-[#00535b] text-white text-[10px] font-black px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          offers.map((offer) => {
            const isCompareSelected = selectedCompare.some(item => item.id === offer.id);
            const logo = getLabLogoStyle(offer.lab_name);
            
            return (
              <div 
                key={offer.id} 
                className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(11,87,208,0.03)] border border-[#c3c6d6]/10 relative text-left"
              >
                {/* Lab Info */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2.5 items-center">
                    <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center font-black text-xs ${logo.bg} ${logo.text}`}>
                      {logo.char}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#191c1d] leading-none mb-1">{offer.lab_name}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#737785] leading-none">
                        <span className="material-symbols-outlined text-[12px] text-[#f57c00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[#191c1d]">{offer.lab_rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compare toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span className="text-[9px] font-bold text-[#737785]">Compare</span>
                    <input 
                      type="checkbox"
                      checked={isCompareSelected}
                      onChange={() => handleCompareCheckbox(offer)}
                      className="w-5 h-5 rounded-lg border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b] cursor-pointer"
                    />
                  </label>
                </div>

                <h3 className="font-headline text-sm font-extrabold text-[#191c1d] mb-2 leading-tight">
                  {offer.package_name}
                </h3>

                {/* Subtests included parameter chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {offer.tests?.slice(0, 3).map((testName, i) => (
                    <span key={i} className="bg-[#edeeef] text-[#424654] text-[9px] font-bold px-2 py-0.5 rounded leading-none">
                      {testName}
                    </span>
                  ))}
                  {offer.tests?.length > 3 && (
                    <span className="bg-[#00535b]/5 text-[#00535b] text-[9px] font-black px-2 py-0.5 rounded leading-none">
                      +{offer.tests.length - 3} More
                    </span>
                  )}
                </div>

                {/* Logistics */}
                <div className="flex gap-4 text-[10px] text-[#737785] font-semibold mb-4 leading-none">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> {offer.reporting_time}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-[#006e2c]">house</span> Home</span>
                  {offer.distance_km && (
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">distance</span> {offer.distance_km} km</span>
                  )}
                </div>

                {/* Price and actions bar */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col text-left">
                      <span className="block text-[8px] font-black text-[#737785] uppercase tracking-wider mb-0.5 leading-none">Starting From</span>
                      <span className="text-base font-extrabold text-[#191c1d] leading-none">₹{offer.price}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedLab({
                        lab_id: offer.lab_id,
                        lab_name: offer.lab_name,
                        packageName: offer.package_name,
                        price: offer.price,
                        bookFn: null
                      })}
                      className="px-4 py-2 border border-slate-200 text-[#424654] font-black text-[10px] rounded-xl flex items-center justify-center gap-1 active:bg-slate-50 transition-all uppercase"
                    >
                      <span className="material-symbols-outlined text-[14px]">biotech</span>
                      <span>View Lab</span>
                    </button>
                  </div>
                  
                  <div className="w-full">
                    <button 
                      onClick={() => handleViewDetail(offer)}
                      className="w-full py-2.5 bg-[#00535b] hover:bg-[#00393f] text-white font-black text-xs rounded-xl active:scale-95 transition-all uppercase tracking-wide font-headline"
                    >
                      Compare Labs
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-2" />

      {/* Loading More Indicator */}
      {loadingOffers && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
            Loading more packages…
          </div>
        </div>
      )}

      {!hasMore && offers.length > 0 && (
        <p className="text-center text-slate-400 text-xs mt-8 py-4">
          — All {totalOffers} packages shown —
        </p>
      )}

      {/* ── 5. COMPARE INSIGHTS MOBILE GUIDE ── */}
      {metadata?.guides && metadata.guides.length > 0 && (
        <section className="mt-8 px-5 text-left">
          <div className="bg-[#a9ece5]/5 rounded-2xl p-5 border border-[#a9ece5]/10 shadow-sm">
            <h3 className="font-headline text-xs font-black mb-4 flex items-center gap-1.5 text-[#006e2c]">
              <span className="material-symbols-outlined text-base">info</span>
              <span>Comparison Guide</span>
            </h3>
            <div className="space-y-4">
              {metadata.guides.map((guide) => (
                <div key={guide.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#006e2c]/5 flex items-center justify-center text-[#006e2c] shrink-0">
                    <span className="material-symbols-outlined text-sm font-bold">{guide.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#191c1d] leading-none mb-1">{guide.title}</h4>
                    <p className="text-[10px] text-[#424654] font-semibold leading-relaxed">{guide.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. MOBILE FAQS ── */}
      {metadata?.faqs && metadata.faqs.length > 0 && (
        <section className="mt-8 px-5 text-left">
          <h2 className="font-headline text-sm font-extrabold text-[#191c1d] mb-4">Common Questions</h2>
          <div className="space-y-2">
            {metadata.faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <details 
                  key={faq.id} 
                  open={isOpen}
                  onClick={(e) => { e.preventDefault(); toggleFaq(index); }}
                  className="group bg-white rounded-xl border border-[#c3c6d6]/20 overflow-hidden shadow-sm"
                >
                  <summary className="flex justify-between items-center p-4 cursor-pointer list-none outline-none">
                    <span className="text-xs font-bold text-[#191c1d] pr-4">{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#737785] text-base transition-transform ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                      expand_more
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-[10px] text-[#424654] font-semibold leading-relaxed border-t border-slate-50 bg-white">
                    {faq.answer}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 7. STICKY BOTTOM COMPARE CTA SYSTEM ── */}
      {selectedCompare.length >= 2 && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg px-5 py-4 shadow-[0px_-4px_20px_rgba(11,87,208,0.05)] border-t border-[#c3c6d6]/10 select-none">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="flex -space-x-2">
              {selectedCompare.map((item) => {
                const logo = getLabLogoStyle(item.lab_name);
                return (
                  <div 
                    key={item.id} 
                    className={`w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black ${logo.text}`}
                  >
                    {logo.char}
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={executeCompare}
              className="flex-1 py-3.5 bg-[#00535b] hover:bg-[#00393f] text-white rounded-xl font-headline font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Compare Selected ({selectedCompare.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 8. BOTTOM SHEET FILTER DRAWER (SLIDEOVER) ── */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end select-none animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterDrawerOpen(false)} />
          
          {/* Content sheet */}
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[2rem] p-6 shadow-2xl relative z-10 animate-slide-up text-left">
            <div className="w-12 h-1 bg-[#edeeef] rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-lg font-black">Filter & Sort</h3>
              <button 
                onClick={() => { resetFilters(); setFilterDrawerOpen(false); }}
                className="text-xs font-black text-[#00535b] uppercase tracking-wider"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Price Ranges buttons */}
              <div>
                <h4 className="text-xs font-extrabold text-[#737785] uppercase tracking-wider mb-3">Price Budget</h4>
                <div className="flex gap-2">
                  {[
                    { label: 'Under ₹1,500', val: 1500 },
                    { label: 'Under ₹3,000', val: 3000 },
                    { label: 'Under ₹6,000', val: 6000 },
                    { label: 'Any Price', val: 25000 }
                  ].map((btn) => {
                    const isPicked = filters.maxPrice === btn.val;
                    return (
                      <button 
                        key={btn.val}
                        onClick={() => handlePriceRangeSelect(btn.val)}
                        className={`flex-1 py-3 text-[10px] font-black rounded-xl border transition-all text-center ${
                          isPicked 
                            ? 'bg-[#00535b] text-white border-transparent shadow-sm' 
                            : 'border-[#c3c6d6] text-[#424654] hover:bg-slate-50'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lab Accreditation */}
              <div>
                <h4 className="text-xs font-extrabold text-[#737785] uppercase tracking-wider mb-3">Lab Accreditation</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['NABL', 'CAP', 'ISO'].map((type) => {
                    const checked = filters.accreditations[type];
                    return (
                      <button 
                        key={type}
                        onClick={() => handleAccreditationChange(type)}
                        className={`py-3 text-[10px] font-black rounded-xl border transition-all text-center ${
                          checked 
                            ? 'bg-[#00535b]/10 text-[#00535b] border-[#00535b]' 
                            : 'border-[#c3c6d6]/60 text-[#424654] hover:bg-slate-50'
                        }`}
                      >
                        {type === 'NABL' && 'NABL Certified'}
                        {type === 'CAP' && 'CAP Accredited'}
                        {type === 'ISO' && 'ISO Registered'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logistics */}
              <div>
                <h4 className="text-xs font-extrabold text-[#737785] uppercase tracking-wider mb-2">Logistics</h4>
                <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-[#f8f9fa] rounded-xl">
                  <input 
                    type="checkbox"
                    checked={filters.homeCollection}
                    onChange={handleHomeCollectionToggle}
                    className="w-5 h-5 rounded-lg border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b] cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-[#424654]">Include Free Home Sample Collection</span>
                </label>
              </div>
            </div>

            <button 
              onClick={() => setFilterDrawerOpen(false)}
              className="w-full mt-8 py-4 bg-[#00535b] hover:bg-[#00393f] text-white rounded-2xl font-headline font-black text-sm uppercase tracking-wider shadow-md active:scale-[0.98] transition-transform"
            >
              Apply Filter Adjustments
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
