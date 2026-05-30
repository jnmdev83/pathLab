import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';
import { MapLink } from '../../utils/reusables';
import { LabDetailPanel } from './LabDetailPanel';
import { LabCompareModal } from './LabCompareModal';

// Helper to safely parse JSONB database columns
const parseJsonColumn = (col, fallback) => {
  if (!col) return fallback;
  if (typeof col === 'string') {
    try {
      return JSON.parse(col);
    } catch (e) {
      return fallback;
    }
  }
  if (Array.isArray(col)) return col;
  return col;
};

// Maps name to premium clinical brand color representation
function getLabLogoStyle(labName = "") {
  const name = labName.toLowerCase();
  if (name.includes('apollo')) return { bg: '#e0f4f1', icon: '#0e9f84', text: 'A' };
  if (name.includes('lal')) return { bg: '#fff3e0', icon: '#f57c00', text: 'L' };
  if (name.includes('thyro')) return { bg: '#fce4ec', icon: '#e91e63', text: 'T' };
  if (name.includes('srl')) return { bg: '#e8eaf6', icon: '#3949ab', text: 'S' };
  if (name.includes('max')) return { bg: '#fce4ec', icon: '#c62828', text: 'M' };
  if (name.includes('ganesh')) return { bg: '#e8f5e9', icon: '#388e3c', text: 'G' };
  if (name.includes('health')) return { bg: '#e3f2fd', icon: '#1565c0', text: 'H' };
  if (name.includes('redcliffe')) return { bg: '#fce4ec', icon: '#d32f2f', text: 'R' };
  return { bg: '#e8eaf6', icon: '#3949ab', text: labName[0]?.toUpperCase() || 'L' };
}

export function Detail({ test, setPage, setTest, user }) {
  if (!test) return null;

  const isMobile = useIsMobile();
  const [testDetails, setTestDetails] = useState(null);
  const [labs, setLabs] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [sort, setSort] = useState('popularity');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const handleCompareToggle = (lab) => {
    if (selectedCompare.some(l => l.branch_id === lab.branch_id)) {
      setSelectedCompare(selectedCompare.filter(l => l.branch_id !== lab.branch_id));
    } else {
      if (selectedCompare.length >= 3) {
        alert("You can compare up to 3 labs at a time.");
        return;
      }
      setSelectedCompare([...selectedCompare, lab]);
    }
  };

  const [selectedLab, setSelectedLab] = useState(null); // { lab_id, lab_name, price, book }

  const [filters, setFilters] = useState({
    maxPrice: 5000,
    nabl: false,
    cap: false,
    homeCollection: true,
    turnaround: 'any'
  });

  // 1. Fetch complete clinical metadata on mount / test.id change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!test?.id) return;
    setLoadingDetails(true);
    fetch(`${API_BASE_URL}/api/tests/${test.id}`)
      .then(res => res.json())
      .then(data => {
        setTestDetails(data);
        setLoadingDetails(false);
      })
      .catch(err => {
        console.error("Error fetching test details:", err);
        setLoadingDetails(false);
      });
  }, [test?.id]);

  // 2. Fetch lab list and comparisons dynamically based on sorting/filtering
  useEffect(() => {
    if (!test?.id) return;
    setLoadingLabs(true);

    const params = new URLSearchParams();
    params.set('sort', sort);
    if (filters.maxPrice < 5000) params.set('max_price', filters.maxPrice);
    if (filters.homeCollection) params.set('collection', 'home');
    if (filters.nabl) params.set('nabl', 'true');
    if (filters.turnaround !== 'any') params.set('turnaround', filters.turnaround);

    fetch(`${API_BASE_URL}/api/tests/${test.id}/prices?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const results = data.results !== undefined ? data.results : data;
        setLabs(Array.isArray(results) ? results : []);
        setLoadingLabs(false);
      })
      .catch(err => {
        console.error("Error fetching lab prices:", err);
        setLoadingLabs(false);
      });
  }, [test?.id, sort, filters]);

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleBooking = (labRow) => {
    setTest({
      id: test.id,
      name: testDetails?.name || test.name,
      price: labRow.price,
      lab: labRow.lab_name,
      lab_id: labRow.lab_id,
      lab_branch_id: labRow.branch_id,
      address: labRow.address,
      city: labRow.city,
      home_collection: labRow.home_collection,
      reporting_time: labRow.reporting_time,
      is_pkg: false,
      ok: true
    });
    user ? setPage('booking') : setPage('signup');
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: 5000,
      nabl: false,
      cap: false,
      homeCollection: true,
      turnaround: 'any'
    });
    setSort('popularity');
  };

  const whyBooked = parseJsonColumn(testDetails?.why_booked, [
    { title: "Clinical Status Evaluation", body: "Tracks specific bio-markers to provide deep diagnostic visibility into target systems." },
    { title: "Accredited Health Screening", body: "Assessed under standardized NABL methodologies to evaluate baseline physiological indexes." }
  ]);

  const whatItMeasures = parseJsonColumn(testDetails?.what_it_measures, [
    { name: "Primary Parameter", desc: "Direct measurement of target clinical bio-markers in specimen.", strength: "100%" }
  ]);

  const faqs = parseJsonColumn(testDetails?.faq, [
    { q: "How long do reports take for this test?", a: "Usually within 12 to 24 hours of sample collection. You will receive digital reports on WhatsApp." },
    { q: "Is home collection available for this test?", a: "Yes, our certified phlebotomists can collect the sample directly from your home or office." }
  ]);

  const startPrice = labs.length > 0 ? Math.min(...labs.map(l => l.price)) : (test.price || 499);
  const originalPrice = Math.round(startPrice * 1.45);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-16" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-5">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#737785] tracking-wider uppercase font-headline">
          <button onClick={() => setPage('home')} className="hover:text-[#00535b] transition-colors">Home</button>
          <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
          <span className="text-[#191c1d]">{testDetails?.cat || test.cat || 'Diagnostics'}</span>
          <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
          <span className="text-[#00535b] font-black truncate max-w-[200px]">{testDetails?.name || test.name}</span>
        </nav>
      </section>

      {/* ── HERO BANNER SECTION ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#dae2ff] border-b border-[#e1e3e4] mb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-8">
          
          {/* Left Details Block */}
          <div className="flex-1 space-y-5 text-left">
            <div className="inline-flex items-center px-3 py-1 bg-[#a9ece5] text-[#286d67] rounded-full text-xs font-black uppercase tracking-wider font-headline">
              <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Top Recommended Screen
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-[#191c1d] tracking-tight leading-none font-headline">
              {testDetails?.name || test.name}
            </h1>
            
            <p className="text-base md:text-lg text-[#424654] leading-relaxed max-w-2xl">
              {testDetails?.description || "Comprehensive clinical screening to assess diagnostic markers and physiological system parameters. Essential for checking systemic wellness and hormone speeds."}
            </p>
            
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">schedule</span> Reports in {testDetails?.rep || test.rep || '12 Hours'}
              </span>
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">restaurant_menu</span> {testDetails?.preparations?.toLowerCase().includes('fasting') ? 'Fasting Required' : 'No Fasting Needed'}
              </span>
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">home</span> Home Collection Available
              </span>
            </div>
            
            <div className="pt-3 flex items-end gap-3.5">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#737785] block mb-1">Starting from</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black text-[#00535b] font-headline">₹{startPrice.toLocaleString('en-IN')}</span>
                  <span className="text-sm line-through text-[#737785]">₹{originalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-[#ffdad6] text-[#93000a] text-xs font-black rounded-lg mb-1">
                45% OFF
              </div>
            </div>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <a href="#compare-labs-section" className="bg-[#00535b] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#00393f] transition-colors text-sm shadow-md shadow-[#00535b]/25 text-center">
                Compare Labs &amp; Rates
              </a>
            </div>
          </div>

          {/* Right Aesthetic Lab Graphic */}
          <div className="hidden lg:block flex-1 relative w-full">
            <img 
              alt="Clinical laboratory setting" 
              className="rounded-3xl shadow-xl w-full h-[320px] object-cover border border-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1wD70q_cdxnlwPSnQQNacmgF9d9O1W-kVtyz96VS2-sXIRc-9IhOUWudl5s6yJlER8wf_x3zQH-t-aplL3MvUypXW7yPf-1Iujcv_NdnW9u-01aaIWRukr90fSBl7w6v2bBidgW_FHV3t47F31PhqF2W2qn2pFer9FSZp-uwSC1Fik-QCVREPtD_brDFmXUza7I6E3DlJSfGqpXZSRV_UmuFPDk9tdqxBgfYXXNZDsd-MAO-Foe1KjuvrpGXTmFjWaUSv8kdYrc4"
            />
            <div className="absolute -bottom-4 -left-4 bg-white p-5 rounded-2xl shadow-lg border border-[#e1e3e4] max-w-[250px] text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-8 h-8 bg-[#edf6f9] text-[#00535b] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                </span>
                <span className="font-extrabold text-sm text-[#191c1d] leading-none">NABL Certified Labs</span>
              </div>
              <p className="text-xs text-[#424654] leading-relaxed opacity-95">Only certified partner networks represent your clinical diagnostic audits.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── MAIN SYSTEM CARD SYSTEM GRID ───────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* 1. LEFT SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden xl:block xl:col-span-3 sticky top-20 space-y-6 text-left">
            <div className="bg-white border border-[#e1e3e4] p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-[#e1e3e4]/60">
                <h3 className="font-extrabold text-base text-[#191c1d]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Filters</h3>
                <button onClick={resetFilters} className="text-xs font-bold text-[#00535b] hover:underline">Clear All</button>
              </div>

              <div className="space-y-5">
                {/* Price range */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-xs text-[#424654]">Price Range</h4>
                    <span className="text-xs font-bold text-[#00535b]">₹{filters.maxPrice >= 5000 ? '5000+' : filters.maxPrice}</span>
                  </div>
                  <input 
                    type="range"
                    min={500}
                    max={5000}
                    step={100}
                    value={filters.maxPrice}
                    onChange={e => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))}
                    className="w-full h-1.5 bg-[#c3c6d6] rounded-lg appearance-none cursor-pointer accent-[#00535b]"
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-[#737785]">
                    <span>₹500</span>
                    <span>₹5000+</span>
                  </div>
                </div>

                {/* Accreditation */}
                <div>
                  <h4 className="font-bold text-xs text-[#424654] mb-2.5">Accreditation</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={filters.nabl}
                        onChange={() => setFilters(prev => ({ ...prev, nabl: !prev[nabl] }))}
                        className="rounded border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b]" 
                      />
                      <span className="text-xs font-semibold text-[#424654]">NABL Certified</span>
                    </label>
                  </div>
                </div>

                {/* Home collection */}
                <div>
                  <h4 className="font-bold text-xs text-[#424654] mb-2.5">Home Collection</h4>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={filters.homeCollection}
                      onChange={() => setFilters(prev => ({ ...prev, homeCollection: !prev.homeCollection }))}
                      className="rounded border-[#c3c6d6] text-[#00535b] focus:ring-[#00535b]" 
                    />
                    <span className="text-xs font-semibold text-[#424654]">Available</span>
                  </label>
                </div>

                {/* Turnaround Delivery */}
                <div>
                  <h4 className="font-bold text-xs text-[#424654] mb-2.5">Report Turnaround</h4>
                  <div className="space-y-2 text-xs text-[#424654]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="turnaround"
                        checked={filters.turnaround === 'any'}
                        onChange={() => setFilters(prev => ({ ...prev, turnaround: 'any' }))}
                        className="text-[#00535b] focus:ring-[#00535b]" 
                      />
                      <span className="font-semibold">Anytime</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="turnaround"
                        checked={filters.turnaround === '12'}
                        onChange={() => setFilters(prev => ({ ...prev, turnaround: '12' }))}
                        className="text-[#00535b] focus:ring-[#00535b]" 
                      />
                      <span className="font-semibold">Within 12 Hours</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="turnaround"
                        checked={filters.turnaround === '6'}
                        onChange={() => setFilters(prev => ({ ...prev, turnaround: '6' }))}
                        className="text-[#00535b] focus:ring-[#00535b]" 
                      />
                      <span className="font-semibold">Within 6 Hours</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Assistance card */}
            <div className="bg-[#00535b] text-white p-5 rounded-2xl shadow-sm text-left">
              <h4 className="font-black text-sm mb-1.5 uppercase font-headline">Need Assistance?</h4>
              <p className="text-xs opacity-90 leading-relaxed mb-4">Talk to our medical advisor for diagnostic guidance.</p>
              <a href="tel:1800-CHOICE" className="w-full py-2.5 bg-white text-[#00535b] rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs hover:bg-[#f3f4f5] transition-colors shadow-sm">
                <span className="material-symbols-outlined text-sm">phone</span> Call 1800-CHOICE
              </a>
            </div>
          </aside>

          {/* 2. MAIN CENTER CONTENT AREA */}
          <div className="xl:col-span-9 space-y-6 text-left">
            
            {/* Card 1: What this test measures */}
            <div className="bg-white border border-[#e1e3e4] p-6 md:p-8 rounded-3xl shadow-sm">
              <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-6 font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00535b]">analytics</span>
                What does this test measure?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingDetails ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
                  ))
                ) : (
                  whatItMeasures.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#f8f9fa] border border-[#e1e3e4]/30 rounded-xl">
                      <span className="font-bold text-[#00535b] text-sm block mb-1">{item.name}</span>
                      <p className="text-xs text-[#424654] leading-relaxed opacity-95">{item.desc}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Prep & Importance splits */}
              {!loadingDetails && (
                <div className="mt-8 pt-8 border-t border-[#e1e3e4] grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#191c1d] mb-3 flex items-center gap-2 font-headline">
                      <span className="material-symbols-outlined text-[#00535b] text-lg">info</span>
                      Clinical Importance
                    </h3>
                    <p className="text-xs md:text-sm text-[#424654] leading-relaxed">
                      {whyBooked[0]?.body || "Screening tracks active blood parameters, metabolic functions, or biological pathways to assess overall system conditions and metabolic speeds."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#191c1d] mb-3 flex items-center gap-2 font-headline">
                      <span className="material-symbols-outlined text-[#00535b] text-lg">warning</span>
                      Preparation Guidelines
                    </h3>
                    <p className="text-xs md:text-sm text-[#424654] leading-relaxed font-bold bg-amber-50 text-amber-900 border border-amber-100 p-3 rounded-xl">
                      {testDetails?.preparations || "Requires overnight fasting for 8 to 12 hours. Only water is permitted."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Compare Labs (Comparison List) */}
            <div id="compare-labs-section" className="scroll-mt-20">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-5">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#191c1d] font-headline">
                    Compare Labs offering {testDetails?.name || test.name}
                  </h2>
                  <p className="text-xs text-[#424654] mt-1 font-bold">
                    {loadingLabs ? 'Searching NABL networks…' : `${labs.length} certified laboratories matched for Shakarpur, Delhi.`}
                  </p>
                </div>
                
                {/* Desktop Sorting Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#edeeef] rounded-xl px-3 py-2 self-start md:self-end">
                  <span className="material-symbols-outlined text-[#424654] text-base select-none">sort</span>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="bg-transparent border-none text-xs text-[#00535b] font-bold focus:ring-0 outline-none p-0 pr-6 cursor-pointer select-none"
                  >
                    <option value="popularity">Sort by: Recommended</option>
                    <option value="rating">Sort by: Rating (High → Low)</option>
                    <option value="price_asc">Sort by: Price (Low → High)</option>
                    <option value="price_desc">Sort by: Price (High → Low)</option>
                  </select>
                </div>
              </div>

              {/* Mobile quick filters */}
              {isMobile && (
                <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar select-none">
                  <div className="flex items-center gap-1 bg-white border border-[#c3c6d6] rounded-full px-3.5 py-2 shrink-0">
                    <span className="material-symbols-outlined text-[#424654] text-sm">sort</span>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-[#00535b] focus:ring-0 outline-none p-0 pr-6 cursor-pointer"
                    >
                      <option value="popularity">Recommended</option>
                      <option value="rating">Rating (High to Low)</option>
                      <option value="price_asc">Price: Low → High</option>
                      <option value="price_desc">Price: High → Low</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, nabl: !prev.nabl }))}
                    className={`px-4 py-2 border rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${filters.nabl ? 'bg-[#00535b] text-white border-[#00535b]' : 'bg-white text-[#424654] border-[#c3c6d6]'}`}
                  >
                    Accredited (NABL)
                  </button>
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, homeCollection: !prev.homeCollection }))}
                    className={`px-4 py-2 border rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${filters.homeCollection ? 'bg-[#00535b] text-white border-[#00535b]' : 'bg-white text-[#424654] border-[#c3c6d6]'}`}
                  >
                    Home Collection
                  </button>
                </div>
              )}

              {/* Lab List Grid */}
              <div className="space-y-4">
                {loadingLabs ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 h-36 animate-pulse" />
                  ))
                ) : labs.length === 0 ? (
                  <div className="bg-white border border-[#e1e3e4] rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-[#737785]">search_off</span>
                    <h4 className="font-extrabold text-sm text-[#191c1d]">No partner labs found</h4>
                    <p className="text-xs text-[#424654]">Try clearing or shifting your filters to see more results.</p>
                    <button onClick={resetFilters} className="text-xs font-bold text-[#00535b] underline">Reset Filters</button>
                  </div>
                ) : (
                  labs.map((lab, idx) => {
                    return (
                        <div 
                          key={`${lab.branch_id}-${idx}`}
                          className="bg-white p-6 rounded-2xl shadow-[0px_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-[#00535b]/20 hover:shadow-lg transition-all duration-300 relative group cursor-default"
                        >
                          {/* Lab icon */}
                          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#00535b] text-2xl">science</span>
                          </div>

                          {/* Info block */}
                          <div className="flex-grow flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-extrabold text-[#121c2c] text-[15px] leading-none">{lab.lab_name}</h4>
                              {lab.booking_count > 2500 && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">Most Booked</span>
                              )}
                              {lab.rating >= 4.5 && (
                                <span className="bg-sky-50 text-sky-700 border border-sky-100/50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">Recommended</span>
                              )}
                              <span className="bg-[#e7eeff] text-[#00535b] border border-[#e7eeff] px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                {lab.is_verified ? 'CAP • NABL' : 'NABL'}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#4d515a]">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-orange-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-[#121c2c]">{lab.rating || '4.5'}</span>
                                <span className="text-[#737785] font-normal">({lab.booking_count || 1200})</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[#00535b] text-base">home_health</span>
                                <span>{lab.home_collection ? 'Free Home Collection' : 'Lab Visit Only'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[#00535b] text-base">timer</span>
                                <span>{lab.reporting_time} Delivery</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[#00535b] text-base">location_on</span>
                                <span>{lab.branch_name}, Gurgaon</span>
                              </span>
                            </div>
                          </div>

                          {/* Price + action buttons */}
                          <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto text-right">
                            <div className="text-right flex flex-col items-end">
                              <span className="text-slate-400 text-[9px] font-black uppercase tracking-wider block mb-0.5">
                                Rate Offered
                              </span>
                              <span className="font-headline text-2xl font-black text-[#00535b] leading-none">
                                ₹ {lab.price}
                              </span>
                            </div>

                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-[#4d515a] hover:text-[#00535b] transition-colors pr-1 select-none">
                              <input
                                type="checkbox"
                                checked={selectedCompare.some(item => item.branch_id === lab.branch_id)}
                                onChange={() => handleCompareToggle(lab)}
                                className="w-4 h-4 rounded border-slate-300 text-[#00535b] focus:ring-[#00535b]/20 cursor-pointer animate-in fade-in"
                              />
                              Compare
                            </label>

                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                onClick={() => setSelectedLab({ lab_id: lab.lab_id, lab_name: lab.lab_name, price: lab.price, bookFn: () => handleBooking(lab) })}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[11px] border border-[#00535b]/20 text-[#00535b] hover:bg-[#e8f0fe] hover:border-[#00535b]/40 transition-all duration-150 active:scale-95 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">biotech</span>
                                View Lab
                              </button>
                              <button 
                                onClick={() => handleBooking(lab)}
                                className="px-5 py-2 bg-[#00535b] hover:bg-[#00393f] text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-sm shadow-[#00535b]/10"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Card 3: Frequently Asked Questions */}
            {!loadingDetails && (
              <div className="bg-white border border-[#e1e3e4] p-6 md:p-8 rounded-3xl shadow-sm">
                <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-6 font-headline text-center">Frequently Asked Questions</h2>
                
                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = expandedFaqIndex === index;
                    return (
                      <div 
                        key={index} 
                        className="bg-[#f8f9fa] border border-[#e1e3e4]/50 rounded-2xl overflow-hidden transition-all duration-150"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-5 py-4 flex justify-between items-center text-left outline-none font-headline font-bold text-sm text-[#191c1d]"
                        >
                          <span>{faq.q}</span>
                          <span className={`material-symbols-outlined text-[#737785] text-lg transition-transform ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <p className="px-5 pb-5 text-xs md:text-sm text-[#424654] leading-relaxed opacity-95 pt-1 border-t border-[#e1e3e4]/20 mt-1 bg-white">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ── LAB DETAIL PANEL ──────────────────────────────────────────────── */}
      {selectedLab && (
        <LabDetailPanel
          labId={selectedLab.lab_id}
          labName={selectedLab.lab_name}
          testName={testDetails?.name || test.name}
          testPrice={selectedLab.price}
          onClose={() => setSelectedLab(null)}
          onBook={selectedLab.bookFn}
        />
      )}
      {/* ── LAB COMPARE MODAL ──────────────────────────────────────────────── */}
      {compareModalOpen && (
        <LabCompareModal 
          labs={selectedCompare}
          onClose={() => setCompareModalOpen(false)}
          onBook={(lab) => {
            setCompareModalOpen(false);
            handleBooking(lab);
          }}
        />
      )}

      {/* ── Bottom Floating Comparison Tray ── */}
      {selectedCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#00535b] text-white py-4 px-6 md:px-8 rounded-full shadow-2xl flex items-center gap-6 border border-white/10 max-w-lg w-full justify-between animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-white text-[#00535b] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              {selectedCompare.length}
            </span>
            <span className="text-xs font-bold truncate max-w-[180px] md:max-w-xs text-left text-white">
              {selectedCompare.map(l => l.lab_name).join(", ")}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setSelectedCompare([])}
              className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors px-2 py-1"
            >
              Clear
            </button>
            <button 
              onClick={() => setCompareModalOpen(true)}
              disabled={selectedCompare.length < 2}
              className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-colors duration-150 shadow-sm ${
                selectedCompare.length >= 2 
                  ? 'bg-white text-[#00535b] hover:bg-slate-100 active:scale-95' 
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
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
