import React, { useRef, useEffect, useState } from 'react';
import { MobileSearchOverlay } from '../layout/MobileSearchOverlay';

const LAB_ICONS = ['biotech', 'science', 'medication', 'health_metrics', 'clinical_notes', 'fluid', 'labs', 'biotech'];

// ─── Mobile Top Pick strip card ───────────────────────────────────────────────
function TopPickStrip({ lab, badge, badgeClass, icon, onBook }) {
  if (!lab) return null;
  return (
    <div className="flex-shrink-0 w-44 bg-white p-4 rounded-2xl border border-outline-variant/20 shadow-[0px_2px_8px_rgba(11,87,208,0.06)] relative overflow-hidden">
      <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[9px] font-bold ${badgeClass}`}>
        {badge}
      </div>
      <p className="text-[10px] font-bold text-outline uppercase tracking-wider truncate mb-1 pr-10">{lab.lab_name}</p>
      <p className="font-headline font-bold text-[22px] text-on-surface leading-none mb-2">
        ₹{(lab.price || 0).toLocaleString('en-IN')}
      </p>
      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-3">
        <span className="material-symbols-outlined text-primary text-[14px]">{icon}</span>
        <span>{lab.reporting_time}</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-3">
        <span className="material-symbols-outlined text-yellow-500 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        <span>{lab.rating}</span>
      </div>
      <button
        onClick={() => onBook(lab)}
        className="w-full py-1.5 bg-primary text-on-primary rounded-lg text-[11px] font-bold active:scale-95 transition-all"
      >
        Book Now
      </button>
    </div>
  );
}

// ─── Mobile Lab Card ──────────────────────────────────────────────────────────
function MobileLabCard({ lab, index, onBook, onDetails }) {
  const icon = LAB_ICONS[index % LAB_ICONS.length];
  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0px_2px_12px_rgba(11,87,208,0.06)] border border-outline-variant/20">
      <div className="flex gap-3 items-start mb-4">
        <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-outline text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <h4 className="font-bold text-sm text-on-surface leading-snug">{lab.lab_name}</h4>
            {lab.is_verified && (
              <span className="bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded text-[9px] font-medium">NABL</span>
            )}
            {lab.rating >= 4.5 && (
              <span className="bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded text-[9px] font-bold">Top Rated</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-on-surface-variant">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-yellow-500 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {lab.rating}
            </span>
            {lab.home_collection && (
              <span className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-primary text-[13px]">home_health</span>
                Home Collection
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-outline text-[13px]">timer</span>
              {lab.reporting_time}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        <div>
          {lab.discount_percent > 0 && (
            <span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded text-[9px] font-bold block mb-0.5">
              {lab.discount_percent}% OFF
            </span>
          )}
          <span className="text-primary font-headline font-bold text-xl leading-none">
            ₹{(lab.price || 0).toLocaleString('en-IN')}
          </span>
          {lab.original_price && (
            <span className="text-[11px] text-outline line-through block">
              ₹{lab.original_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDetails(lab)}
            className="px-3 py-2 border border-outline-variant rounded-lg text-[11px] font-bold hover:bg-surface-container-low active:scale-95 transition-all"
          >
            Details
          </button>
          <button
            onClick={() => onBook(lab)}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-[11px] font-bold hover:shadow-md active:scale-95 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Bottom Sheet ──────────────────────────────────────────────────────
function FilterSheet({ filters, setFilters, onReset, onClose }) {
  const toggleTurnaround = (val) =>
    setFilters(prev => ({
      ...prev,
      turnaround: prev.turnaround.includes(val)
        ? prev.turnaround.filter(v => v !== val)
        : [...prev.turnaround, val],
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-[2rem] p-6 pb-10 shadow-2xl max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-lg text-on-surface">Filters</h3>
          <button onClick={onReset} className="text-xs text-primary font-bold hover:underline">Reset All</button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Price Range (₹)</label>
          <input
            type="range" min={0} max={5000} step={100}
            value={filters.maxPrice || 5000}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              setFilters(prev => ({ ...prev, maxPrice: v >= 5000 ? null : v }));
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[11px] text-outline font-medium mt-1">
            <span>₹0</span>
            <span>{filters.maxPrice ? `₹${filters.maxPrice.toLocaleString('en-IN')}` : '₹5000+'}</span>
          </div>
        </div>

        {/* Report Delivery */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Report Delivery</label>
          <div className="space-y-3">
            {[
              { value: '6',        label: 'Under 6 Hours' },
              { value: 'same_day', label: 'Same Day'      },
              { value: 'next_day', label: 'Next Day'      },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.turnaround.includes(opt.value)}
                  onChange={() => toggleTurnaround(opt.value)}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm text-on-surface">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Collection Type */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Collection Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[['home', 'Home'], ['lab', 'Lab Visit']].map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, collection: prev.collection === type ? null : type }))}
                className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  filters.collection === type
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface text-on-surface-variant border-outline-variant'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Certification */}
        <div className="mb-8">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-3">Certification</label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.nabl}
              onChange={() => setFilters(prev => ({ ...prev, nabl: !prev.nabl }))}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-sm text-on-surface">NABL Certified Only</span>
          </label>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm active:scale-95 transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

// ─── Main Mobile Layout ───────────────────────────────────────────────────────
export function MobileLayout({
  testMeta, topPicks, results, total, hasMore,
  loading, loadingMore,
  sort, setSort,
  filters, setFilters,
  loadMore, handleBook, handleDetails, resetFilters,
  setPage,
  setTestName,
  setActiveCategoryFilter,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sentinelRef = useRef(null);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: '150px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const hasTopPicks = topPicks && (topPicks.cheapest || topPicks.fastest || topPicks.best_rated);
  const activeFilterCount = [
    filters.maxPrice,
    filters.turnaround.length > 0,
    filters.collection,
    filters.nabl,
  ].filter(Boolean).length;

  return (
    <div className="bg-background min-h-screen pb-32">

      {/* Hero header */}
      <div className="px-4 pt-6 pb-3 bg-background">
        <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight leading-tight mb-1">
          {testMeta.name}
        </h1>
        <p className="text-sm text-on-surface-variant">
          {loading ? 'Finding the best labs…' : `${total} lab${total !== 1 ? 's' : ''} available near you`}
        </p>
      </div>

      {/* Top Picks horizontal strip */}
      {(hasTopPicks || loading) && (
        <div className="mb-4 pt-1">
          <div className="flex items-center gap-1.5 px-4 mb-3">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-headline font-semibold text-sm text-on-surface">Top Picks</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loading && !hasTopPicks ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-44 h-36 bg-white rounded-2xl border border-outline-variant/20 animate-pulse" />
              ))
            ) : (
              <>
                {topPicks?.cheapest   && <TopPickStrip lab={topPicks.cheapest}   badge="Cheapest"   badgeClass="bg-primary-container text-on-primary-container"   icon="schedule"  onBook={handleBook} />}
                {topPicks?.fastest    && <TopPickStrip lab={topPicks.fastest}    badge="Fastest"    badgeClass="bg-secondary-container text-on-secondary-container" icon="bolt"      onBook={handleBook} />}
                {topPicks?.best_rated && <TopPickStrip lab={topPicks.best_rated} badge="Best Rated" badgeClass="bg-tertiary-container text-on-tertiary-container"   icon="star"      onBook={handleBook} />}
              </>
            )}
          </div>
        </div>
      )}

      {/* Sort + Filter bar */}
      <div className="flex gap-2 px-4 mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-20 border-b border-outline-variant/10">
        <button
          onClick={() => setFilterOpen(true)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold border transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/40'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="flex-1 bg-white border border-outline-variant/30 rounded-full px-4 py-2 text-[12px] font-bold text-on-surface-variant focus:outline-none focus:border-primary/40"
        >
          <option value="popularity">Popularity</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Result count label */}
      <div className="px-4 mb-3">
        <span className="text-[12px] text-on-surface-variant font-medium">
          {loading ? 'Searching…' : `Showing ${results.length} of ${total} labs`}
        </span>
      </div>

      {/* Lab cards */}
      <div className="px-4 space-y-3">
        {loading && results.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant/20 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-surface-container rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-container rounded w-2/3" />
                  <div className="h-2.5 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : (
          results.map((lab, idx) => (
            <MobileLabCard
              key={`${lab.branch_id}-${idx}`}
              lab={lab}
              index={idx}
              onBook={handleBook}
              onDetails={handleDetails}
            />
          ))
        )}

        {results.length === 0 && !loading && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">search_off</span>
            <p className="text-sm font-semibold">No labs found.</p>
            <p className="text-xs mt-1 opacity-70">Try adjusting your filters.</p>
            <button onClick={resetFilters} className="mt-4 text-primary text-sm font-bold hover:underline">
              Reset Filters
            </button>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-2" />

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
              Loading more labs…
            </div>
          </div>
        )}

        {!hasMore && results.length > 0 && !loading && (
          <div className="text-center py-6 text-on-surface-variant/50 text-[12px]">
            — All {total} labs shown —
          </div>
        )}
      </div>

      {/* Filter bottom sheet */}
      {filterOpen && (
        <FilterSheet
          filters={filters}
          setFilters={setFilters}
          onReset={() => { resetFilters(); setFilterOpen(false); }}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* Redesigned Premium Mobile Capsule Bottom Navbar */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-full px-4 py-2.5 flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => setSearchOpen(true)} 
          className="flex flex-col items-center justify-center bg-[#0c4ca6] text-white rounded-2xl w-[88px] h-[58px] transition-all shadow-lg shadow-blue-600/15 active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">search</span>
          <span className="font-headline font-black text-[9px] uppercase tracking-wider mt-0.5">Search</span>
        </button>
        
        <button 
          onClick={() => setPage("package")} 
          className="flex flex-col items-center justify-center text-slate-500/80 hover:text-[#0c4ca6] transition-all w-[72px] h-[58px] rounded-2xl active:scale-90"
        >
          <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          <span className="font-headline font-extrabold text-[9px] uppercase tracking-wider mt-0.5">Compare</span>
        </button>
        
        <button 
          onClick={() => setPage("profile-page")} 
          className="flex flex-col items-center justify-center text-slate-500/80 hover:text-[#0c4ca6] transition-all w-[72px] h-[58px] rounded-2xl active:scale-90"
        >
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
          <span className="font-headline font-extrabold text-[9px] uppercase tracking-wider mt-0.5">Profile</span>
        </button>
      </nav>

      {/* WORKABLE SEARCH OVERLAY DRAWER */}
      <MobileSearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        setPage={setPage} 
        setTestName={setTestName} 
        setActiveCategoryFilter={setActiveCategoryFilter} 
      />
    </div>
  );
}
