import React, { useState } from 'react';

// ─── Category-specific metadata (icons & quick tags only, all use site blue) ─
const CATEGORY_META = {
  heart:     { icon: 'favorite',       desc: 'Heart-related tests help assess cholesterol levels, cardiac risk, and cardiovascular health. Regular monitoring is essential for early detection and prevention.', tags: ['Cholesterol Check', 'ECG', 'Cardiac Risk', 'Preventive Screening'] },
  cancer:    { icon: 'shield',         desc: 'Cancer screening tests detect tumour markers, abnormal cells, and genetic mutations early. Early detection significantly improves treatment outcomes.', tags: ['PSA Test', 'CA-125', 'Tumour Markers', 'Genetic Screening'] },
  thyroid:   { icon: 'bubble_chart',   desc: 'Thyroid tests evaluate T3, T4, and TSH levels to identify hypo or hyperthyroidism. Essential for managing metabolism, weight, and energy levels.', tags: ['TSH Test', 'T3 / T4', 'Thyroid Profile', 'Anti-TPO'] },
  diabetes:  { icon: 'water_drop',     desc: 'Diabetes diagnostics track blood glucose and HbA1c levels for early detection and ongoing management of Type 1 and Type 2 diabetes.', tags: ['HbA1c', 'Fasting Sugar', 'PPBS', 'Insulin Test'] },
  pregnancy: { icon: 'pregnant_woman', desc: 'Prenatal and maternal health panels monitor foetal development, hormonal shifts, and pregnancy-related risks throughout each trimester.', tags: ['HCG Test', 'Dual Marker', 'OGTT', 'Maternal Health'] },
  allergy:   { icon: 'coronavirus',    desc: 'Allergy and intolerance panels identify IgE-mediated responses, food sensitivities, and environmental triggers affecting your daily quality of life.', tags: ['IgE Total', 'Food Panel', 'Respiratory', 'Skin Allergy'] },
  hormone:   { icon: 'bolt',           desc: 'Hormone panel tests measure testosterone, estrogen, prolactin, FSH, and LH to assess fertility, hormonal balance, and endocrine health.', tags: ['Testosterone', 'Prolactin', 'FSH / LH', 'DHEA-S'] },
  dna:       { icon: 'dna',            desc: 'DNA and genetic tests uncover hereditary disease risks, carrier status, and personalised wellness insights based on your unique genetic profile.', tags: ['Carrier Status', 'BRCA Gene', 'Wellness DNA', 'Hereditary Risk'] },
};

function getCategoryMeta(name = '') {
  const k = name.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, val] of Object.entries(CATEGORY_META)) {
    if (k.includes(key)) return val;
  }
  return { icon: 'science', desc: `Explore diagnostic tests under ${name} care. Compare prices across certified NABL labs and book with free home collection.`, tags: ['Blood Tests', 'Health Panel', 'Screening', 'Home Collection'] };
}

function getTestIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('lipid') || n.includes('cardiac') || n.includes('heart') || n.includes('cholesterol')) return 'favorite';
  if (n.includes('psa') || n.includes('pap') || n.includes('cancer') || n.includes('ca 125')) return 'shield';
  if (n.includes('thyroid') || n.includes('tsh') || n.includes('t3') || n.includes('t4')) return 'bubble_chart';
  if (n.includes('sugar') || n.includes('glucose') || n.includes('hba1c') || n.includes('fasting') || n.includes('prandial')) return 'water_drop';
  if (n.includes('pregnancy') || n.includes('hcg') || n.includes('maternal') || n.includes('dual marker')) return 'pregnant_woman';
  if (n.includes('allergy') || n.includes('ige') || n.includes('intolerance') || n.includes('food')) return 'coronavirus';
  if (n.includes('testosterone') || n.includes('prolactin') || n.includes('hormone')) return 'bolt';
  if (n.includes('dna') || n.includes('genetic') || n.includes('carrier')) return 'dna';
  if (n.includes('ecg') || n.includes('electrocardiogram')) return 'monitor_heart';
  if (n.includes('vitamin')) return 'sunny';
  if (n.includes('kidney') || n.includes('creatinine') || n.includes('kft')) return 'water';
  if (n.includes('liver') || n.includes('lft') || n.includes('sgpt')) return 'biotech';
  if (n.includes('cbc') || n.includes('blood count') || n.includes('hemoglobin')) return 'bloodtype';
  if (n.includes('vitamin b') || n.includes('b12')) return 'pill';
  if (n.includes('bone') || n.includes('calcium')) return 'accessibility_new';
  if (n.includes('ultrasound') || n.includes('scan') || n.includes('mri')) return 'radar';
  return 'science';
}

// Related categories to show at the bottom
const RELATED_CATEGORIES = [
  { name: 'Diabetes Care', tag: 'HbA1c, Fasting Sugar...', icon: 'water_drop' },
  { name: 'Thyroid Check', tag: 'TSH, T3, T4 profiles...', icon: 'bubble_chart' },
  { name: 'Cancer Screening', tag: 'Tumor Markers, Biopsy...', icon: 'shield' },
  { name: 'Pregnancy Panel', tag: 'HCG, Dual Marker...', icon: 'pregnant_woman' },
  { name: 'Hormone Profile', tag: 'Testosterone, FSH, LH...', icon: 'bolt' },
  { name: 'Allergy Test', tag: 'IgE Panel, Food Allergy...', icon: 'coronavirus' },
];

// FAQ data per category
function getFAQs(categoryName) {
  return [
    { q: `Who should get tested for ${categoryName} conditions?`, a: `Anyone with a family history, lifestyle risk factors, or symptoms related to ${categoryName} health should consider regular screening. Your doctor can advise on frequency based on age and risk profile.` },
    { q: `What are the most common ${categoryName} tests?`, a: `Common tests include profile panels, individual marker tests, and comprehensive health packages. These are selected based on symptoms, age, and doctor recommendations.` },
    { q: `How often should I test for ${categoryName} health?`, a: `Most guidelines recommend annual screening for adults at standard risk. High-risk individuals may require tests every 3–6 months as advised by a physician.` },
    { q: `Is home sample collection available?`, a: `Yes, all listed labs on ChooseMyLab offer free home sample collection. A certified phlebotomist visits your home at your chosen time slot.` },
  ];
}

// ─── Skeleton Card (list view) ───────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#f1f3f4] rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="w-2/3 h-4 bg-[#f1f3f4] rounded" />
          <div className="w-full h-3 bg-[#f8f9fa] rounded" />
          <div className="flex gap-3">
            <div className="w-20 h-3 bg-[#f1f3f4] rounded-full" />
            <div className="w-20 h-3 bg-[#f1f3f4] rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="w-16 h-6 bg-[#f1f3f4] rounded" />
          <div className="w-28 h-9 bg-[#f1f3f4] rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Test Row Card (list layout like the reference) ──────────────────────────
function TestCard({ item, onDetails, index }) {
  const [expanded, setExpanded] = useState(false);
  const iconName = getTestIcon(item.name);
  const originalPrice = Math.round(item.price * 1.45);

  return (
    <div
      className="bg-white rounded-2xl border border-[#e8eaed] hover:border-[#00535b]/30 hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span
              className="material-symbols-outlined text-[#00535b] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {iconName}
            </span>
          </div>

          {/* Name + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-[#1f2937] text-sm leading-snug">{item.name}</h3>
              {/* NABL badge */}
              <span className="text-[9px] font-black text-[#00535b] border border-[#00535b]/30 bg-[#e8f0fe] px-1.5 py-0.5 rounded tracking-wide uppercase">
                NABL
              </span>
              {item.is_pkg && (
                <span className="text-[9px] font-black text-[#b45309] border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Package
                </span>
              )}
            </div>

            <p className="text-xs text-[#6b7280] leading-relaxed mb-2.5 line-clamp-2">
              {item.description || 'Comprehensive clinical screening under NABL certified laboratory network for accurate diagnostic results.'}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6b7280]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00535b]">schedule</span>
                {item.rep || '24 hrs'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00535b]">home</span>
                Home
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                4.{5 + (index % 4)} ({(index % 6 + 3)}k+)
              </span>
            </div>

            {/* Expandable view details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-0.5 mt-2 text-[11px] font-bold text-[#00535b] hover:underline"
            >
              View Details
              <span className="material-symbols-outlined text-sm transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
                keyboard_arrow_down
              </span>
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-[#f1f3f4] text-xs text-[#6b7280] leading-relaxed space-y-1.5">
                <p>✔ Accredited under NABL certification standards</p>
                <p>✔ Digital reports delivered within {item.rep || '24 hours'}</p>
                <p>✔ Free home sample collection available</p>
                {item.preparations && <p>⚠ Preparation: {item.preparations}</p>}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col items-end gap-2.5 flex-shrink-0 ml-2">
            <div className="text-right">
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
                className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#00535b] hover:bg-[#0842a0] text-white transition-colors shadow-sm"
              >
                Labs &amp; Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e8eaed] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#f8f9fa] transition-colors"
      >
        <span className="text-sm font-semibold text-[#1f2937] pr-4">{q}</span>
        <span
          className="material-symbols-outlined text-[#6b7280] flex-shrink-0 text-xl transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
          keyboard_arrow_down
        </span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-[#f8f9fa] border-t border-[#e8eaed]">
          <p className="text-sm text-[#4b5563] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main WebLayout Export ───────────────────────────────────────────────────
export function WebLayout({
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const meta = getCategoryMeta(categoryName);
  const faqs = getFAQs(categoryName);
  const visibleItems = displayTests.slice(0, visibleCount);
  const remaining = displayTests.length - visibleCount;

  // Quick filter pill state
  const [activeQuickTag, setActiveQuickTag] = useState(null);

  const handleQuickTag = (tag) => {
    if (activeQuickTag === tag) {
      setActiveQuickTag(null);
      setFilters(prev => ({ ...prev, searchQuery: '' }));
    } else {
      setActiveQuickTag(tag);
      setFilters(prev => ({ ...prev, searchQuery: tag }));
    }
  };

  // Checkbox-style filter helpers
  const toggleType = (val) => {
    if (filters.type === val) setFilters(prev => ({ ...prev, type: 'all' }));
    else setFilters(prev => ({ ...prev, type: val }));
  };
  const toggleTurnaround = (val) => {
    if (filters.turnaround === val) setFilters(prev => ({ ...prev, turnaround: 'all' }));
    else setFilters(prev => ({ ...prev, turnaround: val }));
  };
  const togglePrep = (val) => {
    if (filters.preparation === val) setFilters(prev => ({ ...prev, preparation: 'all' }));
    else setFilters(prev => ({ ...prev, preparation: val }));
  };

  return (
    <div
      className="min-h-screen text-left"
      style={{ background: '#f8f9fa', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-white to-[#f0f4f9] border-b border-[#e8eaed]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#6b7280] mb-5 font-medium">
            <button onClick={() => setPage('home')} className="hover:text-[#00535b] transition-colors">Home</button>
            <span className="material-symbols-outlined text-sm text-[#d1d5db]">chevron_right</span>
            <span className="text-[#1f2937] font-semibold">{categoryName} Care</span>
          </nav>

          {/* Spacious Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center text-left">
            
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-[#00535b] text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {categoryMeta?.icon || meta.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-black text-[#1f2937] tracking-tight leading-none">
                      {categoryName} Care
                    </h1>
                    {(categoryMeta?.medically_reviewed ?? true) && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#286d67] bg-[#e8f8ed] px-2.5 py-0.5 rounded-full border border-[#286d67]/20">
                        <span className="material-symbols-outlined text-sm text-[#286d67]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Medically Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Body Text */}
              <div className="text-sm text-[#4b5563] leading-relaxed max-w-2xl text-left">
                <p className="inline">
                  {descriptionExpanded 
                    ? (categoryMeta?.long_description || categoryMeta?.description || meta.desc)
                    : (categoryMeta?.description || meta.desc)
                  }
                </p>
                
                {(categoryMeta?.long_description) && (
                  <button
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="inline-flex items-center gap-0.5 ml-2 text-[11px] font-bold text-[#00535b] hover:underline whitespace-nowrap focus:outline-none"
                  >
                    {descriptionExpanded ? 'Read Less' : 'Read More'}
                    <span 
                      className="material-symbols-outlined text-xs transition-transform duration-200"
                      style={{ transform: descriptionExpanded ? 'rotate(180deg)' : 'none' }}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic minimal stats bento card */}
            <div className="bg-white border border-[#e8eaed] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] space-y-3.5 w-full lg:w-auto text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] block">Reliability Stats</span>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { icon: 'biotech', label: categoryMeta?.stats_labs || '128+ certified labs', bg: 'bg-[#e8f0fe]', color: 'text-[#00535b]' },
                  { icon: 'group', label: categoryMeta?.stats_bookings || '10k+ monthly bookings', bg: 'bg-[#e8f0fe]', color: 'text-[#00535b]' },
                  { icon: 'star', label: categoryMeta?.stats_patients || 'Trusted by 56k+ patients', bg: 'bg-[#fff4e5]', color: 'text-[#b45309]', fill: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 bg-[#f8f9fa] rounded-xl border border-[#f1f3f4]">
                    <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                      <span
                        className={`material-symbols-outlined text-base ${s.color}`}
                        style={{ fontVariationSettings: s.fill ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {s.icon}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#374151]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── HORIZONTAL QUICK FILTER BAR ─────────────────────────────── */}
        <div className="border-t border-[#e8eaed] bg-white">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-3 flex items-center gap-3 overflow-x-auto hide-scrollbar">
            {[
              { label: 'Home Collection', field: 'homeCollection' },
              { label: 'Under ₹999',      field: 'under999' },
              { label: 'Most Booked',     field: 'mostBooked' },
              { label: 'Fast Reports',    field: 'fastReports' },
              { label: 'Fasting Required',field: 'fasting' },
            ].map((pill) => {
              const active = (() => {
                if (pill.field === 'under999') return filters.maxPrice <= 999;
                if (pill.field === 'fastReports') return filters.turnaround === '12';
                if (pill.field === 'fasting') return filters.preparation === 'fasting';
                return false;
              })();
              return (
                <button
                  key={pill.field}
                  onClick={() => {
                    if (pill.field === 'under999') {
                      setFilters(prev => ({ ...prev, maxPrice: active ? 15000 : 999 }));
                    } else if (pill.field === 'fastReports') {
                      setFilters(prev => ({ ...prev, turnaround: active ? 'all' : '12' }));
                    } else if (pill.field === 'fasting') {
                      setFilters(prev => ({ ...prev, preparation: active ? 'all' : 'fasting' }));
                    }
                  }}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all"
                  style={{
                    background: active ? '#00535b' : '#f8f9fa',
                    color: active ? '#ffffff' : '#374151',
                    borderColor: active ? '#00535b' : '#d1d5db',
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">

          {/* ── LEFT SIDEBAR FILTERS ────────────────────────────────────── */}
          <aside className="sticky top-24">
            <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f3f4]">
                <span className="font-bold text-sm text-[#1f2937]">Filters</span>
                <button
                  onClick={resetFilters}
                  className="text-[12px] font-bold text-[#00535b] hover:underline"
                >
                  Reset All
                </button>
              </div>

              <div className="divide-y divide-[#f1f3f4]">
                {/* Search Name Input */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-2.5">Search Name</p>
                  <div className="flex items-center gap-2 bg-[#f8f9fa] border border-[#e8eaed] rounded-xl px-3 py-2.5 focus-within:border-[#00535b] focus-within:bg-white transition-all">
                    <span className="material-symbols-outlined text-[#9ca3af] text-sm">search</span>
                    <input
                      type="text"
                      placeholder="Type test name/keyword..."
                      value={filters.searchQuery}
                      onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                      className="bg-transparent border-none outline-none text-xs font-semibold text-[#1f2937] placeholder:text-[#9ca3af] w-full"
                    />
                    {filters.searchQuery && (
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                        className="text-[#9ca3af] hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Health Categories Checklist */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Health Categories</p>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {Array.from(new Set(items.map(x => x.category_name))).filter(Boolean).sort().map(catName => {
                      const count = items.filter(x => (x.category_name || '') === catName).length;
                      const isChecked = (filters.categories || []).includes(catName);
                      return (
                        <label key={catName} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setFilters(prev => {
                                  const current = prev.categories || [];
                                  const updated = current.includes(catName)
                                    ? current.filter(c => c !== catName)
                                    : [...current, catName];
                                  return { ...prev, categories: updated };
                                });
                              }}
                              className="w-4 h-4 rounded border-[#d1d5db] text-[#00535b] cursor-pointer"
                              style={{ accentColor: '#00535b' }}
                            />
                            <span className="text-sm text-[#374151] font-medium group-hover:text-[#00535b] transition-colors">
                              {catName}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Test Type */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Test Type</p>
                  <div className="space-y-2.5">
                    {[
                      { value: 'diagnostic', label: 'Individual Tests' },
                      { value: 'package',    label: 'Health Packages' },
                    ].map(opt => (
                      <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.type === opt.value}
                          onChange={() => toggleType(opt.value)}
                          className="w-4 h-4 rounded border-[#d1d5db] text-[#00535b] cursor-pointer"
                          style={{ accentColor: '#00535b' }}
                        />
                        <span className="text-sm text-[#374151] font-medium group-hover:text-[#00535b] transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="px-5 py-4">
                  <div className="flex justify-between mb-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af]">Price Range</p>
                    <span className="text-[11px] font-bold text-[#00535b]">
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
                      accentColor: '#00535b',
                      background: `linear-gradient(to right, #00535b ${(filters.maxPrice / 15000) * 100}%, #e9ecef ${(filters.maxPrice / 15000) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-1.5 text-[10px] text-[#9ca3af] font-semibold">
                    <span>₹0</span><span>₹5,000+</span>
                  </div>
                </div>

                {/* Service Availability */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Service Availability</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Home Collection', icon: 'home' },
                      { label: 'Available Today',  icon: 'event_available' },
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[#d1d5db] cursor-pointer"
                          style={{ accentColor: '#00535b' }}
                        />
                        <span className="text-sm text-[#374151] font-medium group-hover:text-[#00535b] transition-colors flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#9ca3af]">{opt.icon}</span>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Report Time */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Report Time</p>
                  <div className="space-y-2.5">
                    {[
                      { value: '24', label: 'Same Day (24h)' },
                      { value: '12', label: 'Fast (4–6h)' },
                    ].map(opt => (
                      <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.turnaround === opt.value}
                          onChange={() => toggleTurnaround(opt.value)}
                          className="w-4 h-4 rounded border-[#d1d5db] cursor-pointer"
                          style={{ accentColor: '#00535b' }}
                        />
                        <span className="text-sm text-[#374151] font-medium group-hover:text-[#00535b] transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preparation */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#9ca3af] mb-3">Preparation</p>
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.preparation === 'fasting'}
                        onChange={() => togglePrep('fasting')}
                        className="w-4 h-4 rounded border-[#d1d5db] cursor-pointer"
                        style={{ accentColor: '#00535b' }}
                      />
                      <span className="text-sm text-[#374151] font-medium group-hover:text-[#00535b] transition-colors">
                        Fasting Required
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT CONTENT ─────────────────────────────────────────── */}
          <section className="space-y-6 min-w-0">

            {/* ── FEATURED TESTS (top 4 items) ──────────────────────── */}
            {!loadingItems && displayTests.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-[#1f2937] mb-4">Featured Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  {displayTests.slice(0, 4).map((item, idx) => {
                    const iconName = getTestIcon(item.name);
                    const originalPrice = Math.round(item.price * 1.45);
                    return (
                      <div
                        key={`featured-${item.id}-${idx}`}
                        className="bg-white border-2 border-[#00535b]/20 rounded-2xl p-5 hover:border-[#00535b]/50 hover:shadow-md transition-all duration-200 relative"
                      >
                        {/* Featured label */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#00535b] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{iconName}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-black text-[#00535b] border border-[#00535b]/30 bg-[#e8f0fe] px-1.5 py-0.5 rounded tracking-wide uppercase">NABL</span>
                        </div>
                        <h3 className="font-bold text-[#1f2937] text-sm mb-1 leading-snug">{item.name}</h3>
                        <p className="text-xs text-[#6b7280] mb-3 line-clamp-2 leading-relaxed">
                          {item.description || 'Premium clinical diagnostic under certified NABL laboratory network.'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#6b7280] mb-4">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#00535b]">schedule</span>
                            {item.rep || '24 hrs'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#00535b]">home</span>
                            Home
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            4.{5 + idx}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#f1f3f4]">
                          <div>
                            <span className="text-xl font-black text-[#1f2937]">₹{item.price.toLocaleString('en-IN')}</span>
                            <span className="text-[11px] text-[#9ca3af] line-through ml-2">₹{originalPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <button
                            onClick={() => handleDetails(item)}
                            className="px-4 py-2 rounded-full text-[11px] font-bold bg-[#00535b] hover:bg-[#0842a0] text-white transition-colors shadow-sm"
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

            {/* ── ALL TESTS LIST ──────────────────────────────────────── */}
            <div>
              {/* Section header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#1f2937]">All Tests</h2>
                  {!loadingItems && (
                    <span className="text-[11px] font-semibold text-[#6b7280] bg-[#f1f3f4] px-2.5 py-0.5 rounded-full border border-[#e8eaed]">
                      Showing {Math.min(visibleCount, displayTests.length)} of {displayTests.length} tests
                    </span>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#9ca3af]">Sort by:</span>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="text-[12px] font-bold text-[#1f2937] border border-[#e8eaed] rounded-lg px-3 py-1.5 bg-white outline-none focus:border-[#00535b] cursor-pointer"
                  >
                    <option value="popularity">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Test list */}
              {loadingItems ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : displayTests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e8eaed] p-14 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#d1d5db] block mb-3">search_off</span>
                  <h3 className="font-bold text-[#1f2937] mb-2">No tests match your filters</h3>
                  <p className="text-sm text-[#6b7280] mb-5">Try adjusting your filter settings or clearing all filters.</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#00535b] text-white hover:bg-[#0842a0] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleItems.map((item, idx) => (
                    <TestCard
                      key={`${item.id}-${item.is_pkg}-${idx}`}
                      item={item}
                      onDetails={handleDetails}
                      index={idx}
                    />
                  ))}

                  {/* Load more */}
                  {remaining > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 8)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold border-2 border-[#00535b]/30 text-[#00535b] hover:bg-[#e8f0fe] hover:border-[#00535b] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                        Load more tests ({remaining} remaining)
                      </button>
                    </div>
                  )}

                  {remaining === 0 && displayTests.length > 0 && (
                    <div className="text-center py-4 text-[11px] font-semibold text-[#9ca3af]">
                      ✓ All {displayTests.length} tests shown
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── FAQ SECTION ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-7">
              <h2 className="text-xl font-black text-[#1f2937] mb-1.5">
                Understanding {categoryName} Health
              </h2>
              <p className="text-sm text-[#6b7280] mb-6">
                Quick answers to common questions about {categoryName.toLowerCase()} diagnostics.
              </p>
              <div className="space-y-3">
                {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
              </div>
            </div>

            {/* ── RELATED CATEGORIES ────────────────────────────────── */}
            <div>
              <h2 className="text-base font-bold text-[#1f2937] mb-1">
                Still not sure? Browse other categories
              </h2>
              <p className="text-sm text-[#6b7280] mb-4">
                Explore related diagnostic categories that may match your health needs.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {RELATED_CATEGORIES.filter(c => !c.name.toLowerCase().includes(categoryName.toLowerCase().split(' ')[0])).slice(0, 6).map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setPage('home')}
                    className="bg-white border border-[#e8eaed] hover:border-[#00535b]/30 hover:shadow-sm rounded-xl p-3.5 flex items-center gap-3 text-left transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00535b] transition-colors">
                      <span
                        className="material-symbols-outlined text-lg text-[#00535b] group-hover:text-white transition-colors"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#1f2937] leading-snug truncate group-hover:text-[#00535b] transition-colors">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-[#9ca3af] truncate">{cat.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
