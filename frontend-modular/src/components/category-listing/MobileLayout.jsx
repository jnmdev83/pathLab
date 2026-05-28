import React, { useState, useEffect, useRef } from 'react';

// ─── Category-specific metadata ───────────────────────────────────────────────
const CATEGORY_META = {
  heart:     { icon: 'favorite',       desc: 'Cardiac & cardiovascular diagnostic tests', tags: ['Cholesterol', 'ECG', 'Cardiac Risk', 'Prevention'] },
  cancer:    { icon: 'shield',         desc: 'Tumour markers, genetic screening & early detection', tags: ['PSA Test', 'CA-125', 'Tumour Markers', 'Genetic'] },
  thyroid:   { icon: 'bubble_chart',   desc: 'Thyroid hormone profiles & metabolic screening', tags: ['TSH', 'T3 / T4', 'Anti-TPO', 'Profile'] },
  diabetes:  { icon: 'water_drop',     desc: 'Blood glucose, HbA1c & insulin monitoring tests', tags: ['HbA1c', 'Fasting Sugar', 'PPBS', 'Insulin'] },
  pregnancy: { icon: 'pregnant_woman', desc: 'Prenatal, maternal & foetal health diagnostics', tags: ['HCG Test', 'Dual Marker', 'OGTT', 'Prenatal'] },
  allergy:   { icon: 'coronavirus',    desc: 'IgE panels, food & environmental allergy tests', tags: ['IgE Total', 'Food Panel', 'Respiratory', 'Skin'] },
  hormone:   { icon: 'bolt',           desc: 'Testosterone, FSH, LH & endocrine health panels', tags: ['Testosterone', 'Prolactin', 'FSH / LH', 'DHEA-S'] },
  dna:       { icon: 'dna',            desc: 'Genetic risk panels, carrier tests & DNA wellness', tags: ['BRCA Gene', 'Carrier', 'DNA Wellness', 'Hereditary'] },
};

function getCategoryMeta(name = '') {
  const k = name.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, val] of Object.entries(CATEGORY_META)) {
    if (k.includes(key)) return val;
  }
  return { icon: 'science', desc: `Explore ${name} diagnostic tests across certified NABL labs`, tags: ['Blood Tests', 'Health Panel', 'Screening', 'Home Collection'] };
}

function getTestIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('lipid') || n.includes('cardiac') || n.includes('heart') || n.includes('cholesterol')) return 'favorite';
  if (n.includes('psa') || n.includes('pap') || n.includes('cancer') || n.includes('ca 125')) return 'shield';
  if (n.includes('thyroid') || n.includes('tsh') || n.includes('t3') || n.includes('t4')) return 'bubble_chart';
  if (n.includes('sugar') || n.includes('glucose') || n.includes('hba1c') || n.includes('fasting') || n.includes('prandial')) return 'water_drop';
  if (n.includes('pregnancy') || n.includes('hcg') || n.includes('maternal') || n.includes('dual marker')) return 'pregnant_woman';
  if (n.includes('allergy') || n.includes('ige') || n.includes('intolerance')) return 'coronavirus';
  if (n.includes('testosterone') || n.includes('prolactin') || n.includes('hormone')) return 'bolt';
  if (n.includes('dna') || n.includes('genetic') || n.includes('carrier')) return 'dna';
  if (n.includes('ecg') || n.includes('electrocardiogram')) return 'monitor_heart';
  if (n.includes('vitamin')) return 'sunny';
  if (n.includes('kidney') || n.includes('kft')) return 'water';
  if (n.includes('liver') || n.includes('lft') || n.includes('sgpt')) return 'biotech';
  if (n.includes('cbc') || n.includes('blood count')) return 'bloodtype';
  if (n.includes('ultrasound') || n.includes('scan')) return 'radar';
  return 'science';
}

// ─── Mobile Filter Bottom Sheet ───────────────────────────────────────────────
function FilterSheet({ filters, setFilters, onClose, onReset }) {
  const toggleType = (val) => {
    setFilters(prev => ({ ...prev, type: prev.type === val ? 'all' : val }));
  };
  const toggleTurnaround = (val) => {
    setFilters(prev => ({ ...prev, turnaround: prev.turnaround === val ? 'all' : val }));
  };
  const togglePrep = (val) => {
    setFilters(prev => ({ ...prev, preparation: prev.preparation === val ? 'all' : val }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-2xl overflow-hidden"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#e8eaed] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f3f4]">
          <span className="font-bold text-sm text-[#1f2937]">Filters</span>
          <div className="flex items-center gap-3">
            <button onClick={onReset} className="text-[12px] font-bold text-[#0b57d0]">Reset All</button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#f1f3f4] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm text-[#6b7280]">close</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto divide-y divide-[#f1f3f4]" style={{ maxHeight: 'calc(85vh - 100px)' }}>
          {/* Test Type */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Test Type</p>
            <div className="space-y-3">
              {[
                { value: 'diagnostic', label: 'Individual Tests' },
                { value: 'package', label: 'Health Packages' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type === opt.value}
                    onChange={() => toggleType(opt.value)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#0b57d0' }}
                  />
                  <span className="text-sm text-[#374151] font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="px-5 py-4">
            <div className="flex justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af]">Max Price</p>
              <span className="text-[11px] font-bold text-[#0b57d0]">
                ₹{filters.maxPrice >= 15000 ? '15,000+' : filters.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={15000}
              step={100}
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: '#0b57d0',
                background: `linear-gradient(to right, #0b57d0 ${(filters.maxPrice / 15000) * 100}%, #e9ecef ${(filters.maxPrice / 15000) * 100}%)`
              }}
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-[#9ca3af] font-semibold">
              <span>₹0</span><span>₹15,000+</span>
            </div>
          </div>

          {/* Report Time */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Report Time</p>
            <div className="space-y-3">
              {[
                { value: '24', label: 'Same Day (24h)' },
                { value: '12', label: 'Fast (4–6h)' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.turnaround === opt.value}
                    onChange={() => toggleTurnaround(opt.value)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#0b57d0' }}
                  />
                  <span className="text-sm text-[#374151] font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preparation */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Preparation</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.preparation === 'fasting'}
                onChange={() => togglePrep('fasting')}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#0b57d0' }}
              />
              <span className="text-sm text-[#374151] font-medium">Fasting Required</span>
            </label>
          </div>

          {/* Apply button */}
          <div className="px-5 py-4">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#0b57d0] hover:bg-[#0842a0] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Sort Sheet ────────────────────────────────────────────────────────
function SortSheet({ currentSort, setSort, onClose }) {
  const options = [
    { value: 'popularity', label: 'Recommended' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#e8eaed] rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f3f4]">
          <span className="font-bold text-sm text-[#1f2937]">Sort By</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#f1f3f4] flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-[#6b7280]">close</span>
          </button>
        </div>
        <div className="px-5 pb-6 pt-2 space-y-1">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setSort(opt.value); onClose(); }}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors"
              style={{ background: currentSort === opt.value ? '#e8f0fe' : 'transparent' }}
            >
              <span className={`text-sm font-semibold ${currentSort === opt.value ? 'text-[#0b57d0]' : 'text-[#374151]'}`}>
                {opt.label}
              </span>
              {currentSort === opt.value && (
                <span className="material-symbols-outlined text-[#0b57d0] text-lg">check</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Test Card ─────────────────────────────────────────────────────────
function MobileTestCard({ item, onDetails, index }) {
  const [expanded, setExpanded] = useState(false);
  const iconName = getTestIcon(item.name);
  const originalPrice = Math.round(item.price * 1.45);

  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden transition-all duration-200">
      <div className="p-4">
        {/* Top row: icon + name + badge */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-[#0b57d0] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {iconName}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <h3 className="text-sm font-bold text-[#1f2937] leading-snug">{item.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-[#0b57d0] bg-[#e8f0fe] border border-[#0b57d0]/20 px-1.5 py-0.5 rounded uppercase tracking-wide">NABL</span>
              {item.is_pkg && (
                <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wide">Package</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-[#6b7280] leading-relaxed mb-3 line-clamp-2">
          {item.description || 'Comprehensive clinical screening under NABL certified laboratory network.'}
        </p>

        {/* Meta pills */}
        <div className="flex items-center gap-2.5 text-[11px] text-[#6b7280] mb-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#0b57d0]">schedule</span>
            {item.rep || '24 hrs'}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#0b57d0]">home</span>
            Home
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            4.{5 + (index % 4)} ({(index % 6 + 3)}k+)
          </span>
        </div>

        {/* View Details toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-0.5 text-[12px] font-bold text-[#0b57d0] mb-3"
        >
          View Details
          <span
            className="material-symbols-outlined text-sm transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            keyboard_arrow_down
          </span>
        </button>

        {expanded && (
          <div className="bg-[#f8f9fa] rounded-xl p-3 mb-3 text-[12px] text-[#4b5563] space-y-1.5 border border-[#e8eaed]">
            <p>✔ NABL accredited laboratory network</p>
            <p>✔ Reports in {item.rep || '24 hours'}</p>
            <p>✔ Free home sample collection</p>
            {item.preparations && <p>⚠ {item.preparations}</p>}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f1f3f4]">
          <div>
            <div className="text-xl font-black text-[#1f2937] leading-none">
              ₹{item.price.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#9ca3af] line-through leading-none mt-0.5">
              ₹{originalPrice.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <button
              onClick={() => onDetails(item)}
              className="px-3.5 py-2 rounded-full text-[11px] font-bold bg-[#0b57d0] text-white transition-colors"
            >
              Labs &amp; Prices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main MobileLayout Export ─────────────────────────────────────────────────
export function MobileLayout({
  categoryName,
  items,
  displayTests,
  loadingItems,
  categoryMeta,
  sort,
  setSort,
  filters,
  setFilters,
  handleBook,
  handleDetails,
  resetFilters,
  setPage,
  userLocation,
  visibleCount,
  setVisibleCount,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const sentinelRef = useRef(null);
  const meta = getCategoryMeta(categoryName);

  const locationText = (() => {
    if (!userLocation?.label) return 'Delhi NCR';
    return userLocation.label
      .replace('Delhi Pincode 110092 (Shakarpur)', 'Delhi')
      .replace('Delhi Pincode 110092', 'Delhi')
      .split(',')[0].trim();
  })();

  const activeFilterCount = [
    filters.maxPrice < 15000,
    filters.type !== 'all',
    filters.searchQuery.trim().length > 0,
    filters.turnaround !== 'all',
    filters.preparation !== 'all',
  ].filter(Boolean).length;

  // Infinite scroll
  useEffect(() => {
    if (loadingItems || visibleCount >= displayTests.length) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisibleCount(prev => prev + 8), 400);
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadingItems, visibleCount, displayTests.length, setVisibleCount]);

  const visibleItems = displayTests.slice(0, visibleCount);

  return (
    <div
      className="min-h-screen pb-24 text-left"
      style={{ background: '#f8f9fa', fontFamily: 'Atkinson Hyperlegible Next, sans-serif' }}
    >
      {/* ── STICKY TOP BAR ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 bg-white border-b border-[#e8eaed] px-4 flex items-center justify-between"
        style={{ height: 52 }}
      >
        <button onClick={() => setPage('home')} className="flex items-center gap-1.5 text-[#6b7280]">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#e8f0fe] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#0b57d0] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              {meta.icon}
            </span>
          </div>
          <span className="text-sm font-bold text-[#1f2937]">{categoryName} Care</span>
        </div>

        <button className="relative p-1">
          <span className="material-symbols-outlined text-[#6b7280] text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
      </header>

      {/* ── HERO / CATEGORY HEADER ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-white to-[#f8f9fa] border-b border-[#e8eaed] px-4 pt-4 pb-4 text-left">
        {/* Location & Reviewed Badge */}
        <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
          <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
            <span className="material-symbols-outlined text-sm text-[#0b57d0]">location_on</span>
            <span className="font-semibold">{locationText}</span>
          </div>
          {(categoryMeta?.medically_reviewed ?? true) && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-[#00722f] bg-[#e8f8ed] px-2 py-0.5 rounded-full border border-[#00722f]/20">
              <span className="material-symbols-outlined text-xs text-[#00722f]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Medically Reviewed
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#0b57d0] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              {categoryMeta?.icon || meta.icon}
            </span>
          </div>
          <h1 className="text-xl font-black text-[#1f2937] leading-none">{categoryName} Care</h1>
        </div>

        {/* Expandable description */}
        <div className="text-[12px] text-[#4b5563] leading-relaxed mb-3.5 text-left">
          <p className="inline">
            {descriptionExpanded 
              ? (categoryMeta?.long_description || categoryMeta?.description || meta.desc)
              : (categoryMeta?.description || meta.desc)
            }
          </p>
          {(categoryMeta?.long_description) && (
            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              className="inline-flex items-center gap-0.5 ml-1.5 text-[10px] font-bold text-[#0b57d0] hover:underline whitespace-nowrap focus:outline-none"
            >
              {descriptionExpanded ? 'Less' : 'More'}
              <span 
                className="material-symbols-outlined text-xs transition-transform duration-200"
                style={{ transform: descriptionExpanded ? 'rotate(180deg)' : 'none' }}
              >
                keyboard_arrow_down
              </span>
            </button>
          )}
        </div>

        {/* Stats Grid - minimal 3-col bento grid */}
        <div className="grid grid-cols-3 gap-2 text-[10px] text-[#4b5563] mb-0">
          {[
            { icon: 'biotech', label: categoryMeta?.stats_labs ? categoryMeta.stats_labs.split(' ')[0] + ' labs' : '128+ labs' },
            { icon: 'group', label: categoryMeta?.stats_bookings ? categoryMeta.stats_bookings.split(' ')[0] + ' bookings' : '10k+ bookings' },
            { icon: 'star', label: categoryMeta?.stats_patients ? categoryMeta.stats_patients.split(' ')[2] + ' patients' : '56k+ patients', fill: true },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center p-2 bg-white border border-[#e8eaed] rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.01)] text-center">
              <span className="material-symbols-outlined text-sm text-[#0b57d0] mb-0.5" style={{ fontVariationSettings: s.fill ? "'FILL' 1" : "'FILL' 0" }}>{s.icon}</span>
              <span className="font-extrabold text-[#374151] leading-tight text-[9px]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HORIZONTAL QUICK FILTER BAR ──────────────────────────────────── */}
      <div className="bg-white border-b border-[#e8eaed]">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar">
          {[
            { label: 'Home Collection', field: 'home' },
            { label: 'Under ₹999', field: 'under999' },
            { label: 'Most Booked', field: 'popular' },
            { label: 'Fast Reports', field: 'fast' },
            { label: 'Fasting', field: 'fasting' },
          ].map(pill => {
            const active = (() => {
              if (pill.field === 'under999') return filters.maxPrice <= 999;
              if (pill.field === 'fast') return filters.turnaround === '12';
              if (pill.field === 'fasting') return filters.preparation === 'fasting';
              return false;
            })();
            return (
              <button
                key={pill.field}
                onClick={() => {
                  if (pill.field === 'under999') setFilters(prev => ({ ...prev, maxPrice: active ? 15000 : 999 }));
                  else if (pill.field === 'fast') setFilters(prev => ({ ...prev, turnaround: active ? 'all' : '12' }));
                  else if (pill.field === 'fasting') setFilters(prev => ({ ...prev, preparation: active ? 'all' : 'fasting' }));
                }}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all"
                style={{
                  background: active ? '#0b57d0' : '#f8f9fa',
                  color: active ? '#ffffff' : '#374151',
                  borderColor: active ? '#0b57d0' : '#d1d5db',
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-white border border-[#e8eaed] rounded-xl px-3 py-2.5 focus-within:border-[#0b57d0] transition-all">
          <span className="material-symbols-outlined text-[#9ca3af] text-lg">search</span>
          <input
            type="text"
            placeholder="Search tests within this category..."
            value={filters.searchQuery}
            onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="bg-transparent border-none outline-none text-[12px] font-medium text-[#1f2937] placeholder:text-[#9ca3af] w-full"
          />
          {filters.searchQuery && (
            <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>
              <span className="material-symbols-outlined text-sm text-[#9ca3af]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── FILTER + SORT PILLS ────────────────────────────────────────── */}
      <div className="flex gap-3 px-4 py-2">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] font-semibold transition-all"
          style={{
            background: activeFilterCount > 0 ? '#0b57d0' : '#ffffff',
            borderColor: activeFilterCount > 0 ? '#0b57d0' : '#d1d5db',
            color: activeFilterCount > 0 ? '#ffffff' : '#374151',
          }}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>

        <button
          onClick={() => setSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#d1d5db] text-[12px] font-semibold text-[#374151] bg-white transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">swap_vert</span>
          {sort === 'popularity' ? 'Recommended' : sort === 'price_asc' ? 'Low Price' : 'High Price'}
        </button>
      </div>
      
      {/* ── FEATURED TESTS ─────────────────────────────────────────────── */}
      {!loadingItems && displayTests.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[12px] font-bold text-[#1f2937] px-4 mb-2.5 uppercase tracking-wider text-left">Featured Tests</h2>
          <div className="flex gap-3 overflow-x-auto snap-x hide-scrollbar px-4 pb-2">
            {displayTests.slice(0, 4).map((item, idx) => {
              const iconName = getTestIcon(item.name);
              const originalPrice = Math.round(item.price * 1.45);
              return (
                <div
                  key={`featured-mobile-${item.id}-${idx}`}
                  className="w-[260px] flex-shrink-0 snap-start bg-white border border-[#0b57d0]/25 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#0b57d0] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {iconName}
                      </span>
                    </div>
                    <span className="text-[8px] font-black text-[#0b57d0] bg-[#e8f0fe] border border-[#0b57d0]/20 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      NABL
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-[#1f2937] text-xs mb-1 line-clamp-1 text-left">{item.name}</h3>
                  <p className="text-[10px] text-[#6b7280] mb-2 line-clamp-2 leading-normal text-left">
                    {item.description || 'Premium clinical diagnostic under certified NABL laboratory network.'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[10px] text-[#6b7280] mb-3">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-[#0b57d0]">schedule</span>
                      {item.rep || '24 hrs'}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-[#0b57d0]">home</span>
                      Home
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.{5 + idx}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#f1f3f4]">
                    <div className="text-left">
                      <div className="text-sm font-black text-[#1f2937] leading-none">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] text-[#9ca3af] line-through leading-none mt-0.5">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDetails(item)}
                      className="px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-[#0b57d0] text-white shadow-sm"
                    >
                      Labs &amp; Prices
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RESULTS COUNT ──────────────────────────────────────────────── */}
      {!loadingItems && (
        <div className="px-4 py-2">
          <span className="text-[12px] font-semibold text-[#6b7280]">
            {displayTests.length > 0
              ? `Showing ${Math.min(visibleCount, displayTests.length)} of ${displayTests.length} tests`
              : 'No tests match your filters'}
          </span>
        </div>
      )}

      {/* ── TEST LIST ────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4 space-y-3">
        {loadingItems ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e8eaed] p-4 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-[#f1f3f4] rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-[#f1f3f4] rounded" />
                  <div className="w-1/3 h-3 bg-[#f1f3f4] rounded" />
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="w-full h-3 bg-[#f8f9fa] rounded" />
                <div className="w-5/6 h-3 bg-[#f8f9fa] rounded" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#f1f3f4]">
                <div className="w-16 h-6 bg-[#f1f3f4] rounded" />
                <div className="w-24 h-9 bg-[#f1f3f4] rounded-full" />
              </div>
            </div>
          ))
        ) : displayTests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e8eaed] p-10 text-center mt-2">
            <span className="material-symbols-outlined text-5xl text-[#d1d5db] block mb-3">search_off</span>
            <p className="font-bold text-[#1f2937] mb-1 text-sm">No tests found</p>
            <p className="text-[12px] text-[#6b7280] mb-4">Try adjusting your filter settings</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#0b57d0] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          visibleItems.map((item, idx) => (
            <MobileTestCard
              key={`${item.id}-${item.is_pkg}-${idx}`}
              item={item}
              onDetails={handleDetails}
              index={idx}
            />
          ))
        )}
      </div>

      {/* ── INFINITE SCROLL SENTINEL ─────────────────────────────────────── */}
      {!loadingItems && displayTests.length > 0 && (
        <div className="pb-6 text-center">
          {visibleCount < displayTests.length ? (
            <div className="flex flex-col items-center gap-2" ref={sentinelRef}>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0b57d0]">
                <span className="w-4 h-4 rounded-full border-2 border-[#0b57d0] border-t-transparent animate-spin" />
                Loading more tests...
              </div>
            </div>
          ) : (
            <span className="text-[11px] font-semibold text-[#9ca3af] bg-white px-4 py-1.5 rounded-full border border-[#e8eaed]">
              All {displayTests.length} tests shown
            </span>
          )}
          <div id="scroll-sentinel" style={{ height: 8 }} />
        </div>
      )}

      {/* ── MODALS ───────────────────────────────────────────────────────── */}
      {filterOpen && (
        <FilterSheet
          filters={filters}
          setFilters={setFilters}
          onReset={() => { resetFilters(); setFilterOpen(false); }}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {sortOpen && (
        <SortSheet
          currentSort={sort}
          setSort={setSort}
          onClose={() => setSortOpen(false)}
        />
      )}

      {/* ── FIXED BOTTOM NAV ─────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8eaed] flex justify-around items-center"
        style={{ height: 60, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={() => setPage('home')}
          className="flex flex-col items-center justify-center py-1.5 px-4 rounded-full"
          style={{ background: '#e8f0fe' }}
        >
          <span className="material-symbols-outlined text-[20px] text-[#0b57d0]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          <span className="text-[9px] font-black mt-0.5 text-[#0b57d0]">Search</span>
        </button>
        <button onClick={() => setPage('package')} className="flex flex-col items-center justify-center py-1.5 px-4">
          <span className="material-symbols-outlined text-[22px] text-[#9ca3af]">compare_arrows</span>
          <span className="text-[9px] font-black mt-0.5 text-[#9ca3af]">Compare</span>
        </button>
        <button onClick={() => setPage('profile-page')} className="flex flex-col items-center justify-center py-1.5 px-4">
          <span className="material-symbols-outlined text-[22px] text-[#9ca3af]">account_circle</span>
          <span className="text-[9px] font-black mt-0.5 text-[#9ca3af]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
