import React, { useRef, useEffect } from 'react';

const LAB_ICONS = ['biotech', 'science', 'medication', 'health_metrics', 'clinical_notes', 'fluid', 'labs', 'biotech'];

// ─── Top Pick Card (Cheapest / Fastest / Best Rated bento grid) ───────────────
function TopPickCard({ lab, badge, badgeClass, highlight, isFastest, onBook }) {
  if (!lab) {
    return (
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 flex items-center justify-center text-on-surface-variant/40 text-sm min-h-[220px]">
        No data available
      </div>
    );
  }
  const bookingStr = lab.booking_count >= 1000
    ? `${(lab.booking_count / 1000).toFixed(1)}k`
    : String(lab.booking_count);

  return (
    <div className={`relative bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(11,87,208,0.05)] ${highlight ? 'border-2 border-primary/20' : 'border border-outline-variant/30'} hover:-translate-y-1 transition-all duration-300 overflow-hidden group`}>
      {/* Corner badge */}
      <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[11px] font-bold ${badgeClass}`}>
        {badge}
      </div>

      <div className="mb-4 pt-2">
        <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">{lab.lab_name}</span>
        <h3 className="font-headline text-[28px] font-bold text-on-surface leading-none">
          ₹{(lab.price || 0).toLocaleString('en-IN')}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-primary text-xl">
            {isFastest ? 'bolt' : 'schedule'}
          </span>
          {isFastest
            ? <strong className="text-secondary">Report in {lab.reporting_time}</strong>
            : <span>Report in {lab.reporting_time}</span>
          }
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span>{lab.rating} ({bookingStr} bookings)</span>
        </div>
      </div>

      <button
        onClick={() => onBook(lab)}
        className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:shadow-md transition-all active:scale-95"
      >
        Book Now
      </button>
    </div>
  );
}

// ─── Single lab result row card ───────────────────────────────────────────────
function LabCard({ lab, index, onBook, onDetails }) {
  const icon = LAB_ICONS[index % LAB_ICONS.length];
  const bookingStr = lab.booking_count >= 1000
    ? `${(lab.booking_count / 1000).toFixed(1)}k`
    : String(lab.booking_count);

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(11,87,208,0.05)] border border-outline-variant/20 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-primary/30 transition-all group cursor-default">

      {/* Lab icon */}
      <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-outline text-3xl">{icon}</span>
      </div>

      {/* Info block */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h4 className="font-bold text-sm text-on-surface">{lab.lab_name}</h4>
          {lab.booking_count > 2500 && (
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase">Most Booked</span>
          )}
          {lab.rating >= 4.5 && lab.booking_count > 800 && (
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase">Recommended</span>
          )}
          {lab.is_verified && (
            <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-medium">NABL</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-yellow-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {lab.rating} {lab.booking_count > 0 && <span className="text-xs opacity-70">({bookingStr})</span>}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-base">home_health</span>
            {lab.home_collection ? 'Free Home Collection' : 'Lab Visit Only'}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-outline text-base">timer</span>
            {lab.reporting_time} Delivery
          </span>
          {lab.city && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-outline text-base">location_on</span>
              {lab.city}
            </span>
          )}
        </div>
      </div>

      {/* Price + action buttons */}
      <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
        <div className="text-right">
          {lab.discount_percent > 0 && (
            <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold block mb-1">
              {lab.discount_percent}% OFF
            </span>
          )}
          {!lab.test_id && (
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
              Starting at
            </span>
          )}
          <span className="font-headline text-[26px] font-bold text-primary leading-none">
            ₹ {(lab.price || 0).toLocaleString('en-IN')}
          </span>
          {lab.original_price && (
            <span className="text-xs text-outline line-through block">
              ₹ {lab.original_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => onDetails(lab)}
            className="flex-1 md:flex-none md:px-4 py-2 border border-outline-variant rounded-lg text-[12px] font-bold hover:bg-surface-container-low active:scale-95 transition-all"
          >
            Details
          </button>
          <button
            onClick={() => onBook(lab)}
            className="flex-1 md:flex-none md:px-6 py-2 bg-primary text-on-primary rounded-lg text-[12px] font-bold hover:shadow-md active:scale-95 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/20 animate-pulse">
      <div className="flex gap-6">
        <div className="w-16 h-16 bg-surface-container rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-surface-container rounded w-1/3" />
          <div className="h-3 bg-surface-container rounded w-1/2" />
          <div className="h-3 bg-surface-container rounded w-2/5" />
        </div>
        <div className="space-y-2 shrink-0">
          <div className="h-7 bg-surface-container rounded w-24" />
          <div className="h-8 bg-surface-container rounded w-28" />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Filters ──────────────────────────────────────────────────────────
function FilterSidebar({ filters, setFilters, resetFilters }) {
  const toggleTurnaround = (val) =>
    setFilters(prev => ({
      ...prev,
      turnaround: prev.turnaround.includes(val)
        ? prev.turnaround.filter(v => v !== val)
        : [...prev.turnaround, val],
    }));

  return (
    <div className="bg-surface-container-low p-6 rounded-xl sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-on-surface text-sm">Filters</h3>
        <button onClick={resetFilters} className="text-[11px] text-primary hover:underline font-bold">Reset</button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <label className="text-[11px] font-bold text-on-surface-variant block mb-4 uppercase tracking-wider">Price Range (₹)</label>
        <input
          type="range" min={0} max={5000} step={100}
          value={filters.maxPrice || 5000}
          onChange={e => {
            const v = parseInt(e.target.value, 10);
            setFilters(prev => ({ ...prev, maxPrice: v >= 5000 ? null : v }));
          }}
          className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-2 text-[11px] text-outline font-medium">
          <span>₹0</span>
          <span>{filters.maxPrice ? `₹${filters.maxPrice.toLocaleString('en-IN')}` : '₹5000+'}</span>
        </div>
      </div>

      {/* Report Delivery */}
      <div className="mb-8">
        <label className="text-[11px] font-bold text-on-surface-variant block mb-4 uppercase tracking-wider">Report Delivery</label>
        <div className="space-y-3">
          {[
            { value: '6',        label: 'Under 6 Hours' },
            { value: 'same_day', label: 'Same Day'      },
            { value: 'next_day', label: 'Next Day'      },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.turnaround.includes(opt.value)}
                onChange={() => toggleTurnaround(opt.value)}
                className="w-5 h-5 rounded border-outline-variant accent-primary focus:ring-primary"
              />
              <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Collection Type */}
      <div className="mb-8">
        <label className="text-[11px] font-bold text-on-surface-variant block mb-4 uppercase tracking-wider">Collection Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[['home', 'Home'], ['lab', 'Lab Visit']].map(([type, label]) => (
            <button
              key={type}
              onClick={() => setFilters(prev => ({ ...prev, collection: prev.collection === type ? null : type }))}
              className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                filters.collection === type
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Certification */}
      <div>
        <label className="text-[11px] font-bold text-on-surface-variant block mb-4 uppercase tracking-wider">Certification</label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.nabl}
            onChange={() => setFilters(prev => ({ ...prev, nabl: !prev.nabl }))}
            className="w-5 h-5 rounded border-outline-variant accent-primary"
          />
          <span className="text-sm text-on-surface group-hover:text-primary transition-colors">NABL Certified</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group mt-3">
          <input type="checkbox" disabled className="w-5 h-5 rounded border-outline-variant opacity-40" />
          <span className="text-sm text-on-surface-variant opacity-40">ISO Accredited</span>
        </label>
      </div>
    </div>
  );
}

export function WebLayout({
  testMeta, topPicks, results, total, hasMore,
  loading, loadingMore,
  sort, setSort,
  filters, setFilters,
  loadMore, handleBook, handleDetails, resetFilters,
  setPage,
}) {
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

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-8">
          <span onClick={() => setPage('home')} className="hover:text-primary cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="text-primary">{testMeta.name}</span>
        </nav>

        {/* Hero */}
        <section className="mb-12">
          <h1 className="font-headline text-[40px] font-bold text-on-surface mb-3 tracking-tight leading-tight">
            Compare {testMeta.name} Across {testMeta.total_labs || (loading ? '…' : results.length)} Labs
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {testMeta.short_description || testMeta.description || 'Compare prices, report delivery time, ratings, and home sample collection for the most accurate diagnostic choices.'}
          </p>
        </section>

        {/* Top Picks Bento */}
        {(hasTopPicks || loading) && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-[28px] font-semibold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                Top Picks
              </h2>
              <span className="text-sm text-primary font-semibold">Updated just now</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {loading && !hasTopPicks ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-outline-variant/20 animate-pulse min-h-[220px]">
                    <div className="h-3 bg-surface-container rounded w-1/2 mb-3" />
                    <div className="h-8 bg-surface-container rounded w-2/3 mb-6" />
                    <div className="space-y-2 mb-6">
                      <div className="h-3 bg-surface-container rounded w-3/4" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                    <div className="h-10 bg-surface-container rounded-xl" />
                  </div>
                ))
              ) : (
                <>
                  <TopPickCard lab={topPicks?.cheapest}   badge="Cheapest Option"  badgeClass="bg-primary-container text-on-primary-container"  onBook={handleBook} />
                  <TopPickCard lab={topPicks?.fastest}    badge="Fastest Report"   badgeClass="bg-secondary-container text-on-secondary-container" highlight isFastest onBook={handleBook} />
                  <TopPickCard lab={topPicks?.best_rated} badge="Best Rated"       badgeClass="bg-tertiary-container text-on-tertiary-container"  onBook={handleBook} />
                </>
              )}
            </div>
          </section>
        )}

        {/* Main: Sidebar + Results */}
        <section className="flex gap-8">

          {/* Sticky Sidebar */}
          <aside className="w-72 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
          </aside>

          {/* Results Column */}
          <div className="flex-1 min-w-0">

            {/* Result count + Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-on-surface-variant font-medium">
                {loading ? 'Searching labs…' : `Showing ${total} matching lab${total !== 1 ? 's' : ''}`}
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="bg-transparent border-none text-sm text-primary font-bold focus:ring-0 cursor-pointer"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price_asc">Sort by: Price (Low → High)</option>
                <option value="price_desc">Sort by: Price (High → Low)</option>
                <option value="rating">Sort by: Rating</option>
                <option value="distance">Sort by: Distance</option>
              </select>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {loading && results.length === 0
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                : results.map((lab, idx) => (
                    <LabCard
                      key={`${lab.branch_id}-${idx}`}
                      lab={lab}
                      index={idx}
                      onBook={handleBook}
                      onDetails={handleDetails}
                    />
                  ))
              }

              {results.length === 0 && !loading && (
                <div className="text-center py-24 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl block mb-4 opacity-30">search_off</span>
                  <p className="font-semibold">No labs match your filters.</p>
                  <p className="text-sm mt-1">Try adjusting price range or removing a filter.</p>
                  <button onClick={resetFilters} className="mt-4 text-primary text-sm font-bold hover:underline">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-2" />

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                  Loading more results…
                </div>
              </div>
            )}

            {!hasMore && results.length > 0 && !loading && (
              <p className="text-center text-on-surface-variant/50 text-xs mt-8 py-4">
                — All {total} labs shown —
              </p>
            )}
          </div>
        </section>

        {/* Trust / Assurance Section */}
        <section className="mt-20 bg-primary-container/10 p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-[28px] font-semibold text-primary mb-4">ChooseMyLab Assurance</h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Every lab on our platform is strictly verified for quality and turnaround time. We handle your samples with care through certified clinical professionals.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-sm w-32 text-center">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[11px] font-bold text-on-surface">Certified Labs</span>
            </div>
            <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-sm w-32 text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">payments</span>
              <span className="text-[11px] font-bold text-on-surface">Best Prices</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
