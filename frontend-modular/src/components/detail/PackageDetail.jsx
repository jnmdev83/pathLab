import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';

// Helper to safely parse JSONB columns
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

export function PackageDetail({
  selectedPackage,
  selectedBranch,
  setPage,
  setTest,
  setSelectedPackage,
  setSelectedBranch,
  user
}) {
  if (!selectedPackage) return null;

  const isMobile = useIsMobile();
  
  // Data States
  const [details, setDetails] = useState(null);
  const [includedTests, setIncludedTests] = useState([]);
  const [otherPackages, setOtherPackages] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  
  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // View states
  const [activeParamIndex, setActiveParamIndex] = useState(0);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});

  // 1. Fetch package branch details, tests, alternative packages, and competitors
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    
    const pkgId = selectedPackage.id;
    const brId = selectedBranch?.id || 'null';
    
    const detailsPromise = fetch(`${API_BASE_URL}/api/packages/${pkgId}/branches/${brId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load package details');
        return res.json();
      });

    const testsPromise = fetch(`${API_BASE_URL}/api/packages/${pkgId}/tests`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load subtests');
        return res.json();
      });

    const otherPackagesPromise = fetch(`${API_BASE_URL}/api/packages/${pkgId}/branches/${brId}/other-packages`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load alternative packages');
        return res.json();
      });

    const competitorsPromise = fetch(`${API_BASE_URL}/api/packages/${pkgId}/branches/${brId}/competitors`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load competitors');
        return res.json();
      });

    Promise.all([detailsPromise, testsPromise, otherPackagesPromise, competitorsPromise])
      .then(([detailsData, testsData, otherData, competitorsData]) => {
        setDetails(detailsData);
        setIncludedTests(testsData || []);
        setOtherPackages(otherData || []);
        setCompetitors(competitorsData || []);
        
        // If details branch differed (e.g. entered without branch and fallback triggered)
        if (detailsData && detailsData.branch_id !== selectedBranch?.id) {
          setSelectedBranch({
            id: detailsData.branch_id,
            branch_name: detailsData.branch_name,
            lab_id: detailsData.lab_id,
            lab_name: detailsData.lab_name
          });
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading package detail data.');
        setLoading(false);
      });
  }, [selectedPackage?.id, selectedBranch?.id]);

  const toggleTestExpand = (testId) => {
    setExpandedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleBooking = (targetOffer) => {
    // Disabled booking flow as requested
  };

  const handleCompetitorNavigate = (comp) => {
    console.log("handleCompetitorNavigate called with:", comp);
    if (!comp) return;

    const pkgId = comp.package_id || comp.id || selectedPackage?.id;
    const pkgName = comp.package_name || comp.name || selectedPackage?.name;

    // Use current branch/lab details if comp (e.g. from otherPackages) does not specify them
    const branchId = comp.branch_id || details?.branch_id || selectedBranch?.id;
    const branchName = comp.branch_name || details?.branch_name || selectedBranch?.branch_name;
    const labId = comp.lab_id || details?.lab_id || selectedBranch?.lab_id;
    const labName = comp.lab_name || details?.lab_name || selectedBranch?.lab_name;

    console.log("Navigating package state updates:", {
      pkg: { id: pkgId, name: pkgName },
      branch: { id: branchId, branch_name: branchName, lab_id: labId, lab_name: labName }
    });

    setSelectedPackage({ id: pkgId, name: pkgName });
    setSelectedBranch({
      id: branchId,
      branch_name: branchName,
      lab_id: labId,
      lab_name: labName
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-[#00535b]/20 border-t-[#00535b] animate-spin" />
          <p className="text-sm font-bold text-[#00535b] font-headline">Fetching premium clinical profile...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-[#ba1a1a] mb-2">error</span>
        <h4 className="text-base font-extrabold text-[#191c1d]">{error || 'Package details not found'}</h4>
        <p className="text-xs text-[#737785] mt-1">There was a problem loading this package detail. Please try again.</p>
        <button onClick={() => setPage('package-listing')} className="mt-5 px-6 py-2 bg-[#00535b] text-white text-xs font-bold rounded-xl shadow-sm">
          Back to Listings
        </button>
      </div>
    );
  }

  const whyBooked = parseJsonColumn(details.why_booked, [
    { title: "Early Disease Screening", body: "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur." },
    { title: "Comprehensive Organ Tracking", body: "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to assess metabolic speeds." }
  ]);

  const whatItMeasures = parseJsonColumn(details.what_it_measures, [
    { name: "Blood Health (CBC)", desc: "Checks for anemia, active infections, and baseline immunity markers." },
    { name: "Liver Health (LFT)", desc: "Assesses liver enzymes, bilirubin filtration, and protein synthesis." },
    { name: "Kidney Function (KFT)", desc: "Assesses waste creatinine levels, urea, and electrolyte ratios." }
  ]);

  const faqs = parseJsonColumn(details.faq, [
    { q: "How long does it take to receive the diagnostic reports?", a: "Reports are typically generated dynamically and sent via email or WhatsApp within 12 to 24 hours of collection." },
    { q: "Is fasting required for this medical package?", a: "Yes, an 8 to 12 hour overnight fasting is recommended for accurate glucose and lipid readings. Water is permitted." }
  ]);

  const logoStyle = getLabLogoStyle(details.lab_name);
  const savePct = details.original_price ? Math.round(((details.original_price - details.price) / details.original_price) * 100) : 40;

  // ──────────────────────────────────────────────────────────────────────────
  // DESKTOP / TABLET VIEWPORT (WEB LAYOUT)
  // ──────────────────────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen text-[#191c1d] pb-24 text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        
        {/* 1. BREADCRUMBS NAVIGATION */}
        <div className="max-w-[1280px] mx-auto px-8 py-5">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-[#737785] tracking-wider uppercase font-headline">
            <button onClick={() => setPage('home')} className="hover:text-[#00535b] transition-colors">Home</button>
            <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
            <button onClick={() => setPage('package-listing')} className="hover:text-[#00535b] transition-colors">Packages</button>
            <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
            <span className="text-[#00535b] font-black truncate max-w-[250px]">{details.package_name}</span>
          </nav>
        </div>

        {/* 2. DYNAMIC HERO SECTION */}
        <section className="max-w-[1280px] mx-auto px-8 mb-16">
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_4px_20px_rgba(11,87,208,0.04)] border border-[#c3c6d6]/20 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
            {/* Glowing Brand Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Left Content Block */}
            <div className="lg:col-span-7 p-10 lg:p-12 space-y-6 flex flex-col justify-center relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#a9ece5]/30 text-[#286d67] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider font-headline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Certified Lab
                </span>
                <span className="bg-[#00535b]/5 text-[#00535b] border border-[#00535b]/10 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider font-headline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                  Best Price
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#191c1d] font-headline tracking-tight leading-snug">
                {details.package_name}
              </h1>

              {/* Lab branding */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl w-fit">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${logoStyle.bg} ${logoStyle.text}`}>
                  {logoStyle.char}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#737785] block leading-none mb-1">Offered by</span>
                  <span className="text-sm font-black text-[#191c1d] leading-none">{details.lab_name}</span>
                </div>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#f57c00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-black text-[#191c1d]">{details.lab_rating}</span>
                  <span className="text-[10px] text-[#737785] font-bold">({details.lab_reviews} reviews)</span>
                </div>
              </div>

              {/* Param & time widgets */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#e1e3e4]/30 rounded-2xl p-4">
                  <span className="material-symbols-outlined text-[#00535b] text-3xl">biotech</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#737785] leading-none mb-1">Parameters</p>
                    <p className="font-extrabold text-sm text-[#191c1d] leading-none">{includedTests.length} Markers Mapped</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#e1e3e4]/30 rounded-2xl p-4">
                  <span className="material-symbols-outlined text-[#00535b] text-3xl">schedule</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#737785] leading-none mb-1">Reports in</p>
                    <p className="font-extrabold text-sm text-[#191c1d] leading-none">{details.reporting_time}</p>
                  </div>
                </div>
              </div>

              {/* Pricing controls */}
              <div className="pt-2 flex items-baseline gap-3.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] uppercase font-black text-[#737785] mr-1.5 self-center font-headline">Rate:</span>
                  <span className="text-3xl font-black text-[#00535b] font-headline">₹{details.price.toLocaleString('en-IN')}</span>
                  {details.original_price && (
                    <span className="text-sm line-through text-[#737785]">₹{details.original_price.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {savePct > 0 && (
                  <span className="bg-[#ffdad6] text-[#93000a] text-xs font-black px-2.5 py-1 rounded-md">
                    {savePct}% OFF
                  </span>
                )}
              </div>


            </div>

            {/* Right Graphic */}
            <div className="lg:col-span-5 relative w-full min-h-[400px]">
              <img 
                alt="A clinical laboratory" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1579684389782-64d84b5e9053?w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
            </div>
          </div>
        </section>

        {/* 3. DUAL COLUMN DETAILS SECTION */}
        <section className="max-w-[1280px] mx-auto px-8 flex flex-col lg:flex-row gap-10 items-start mb-20">
          {/* Left Column: Why essential & pre-test instruction */}
          <div className="flex-1 space-y-8 text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-4 font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00535b]">analytics</span>
                Why this health screening is essential
              </h2>
              <p className="text-sm md:text-base text-[#424654] leading-relaxed mb-6 font-medium">
                {details.package_description || "Modern lifestyles often mask underlying clinical changes. This curated profile assesses core bio-indicators to track your kidneys, liver, metabolic levels, and lipid statuses before symptom onset."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyBooked.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-lg leading-none shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <div>
                      <h4 className="font-bold text-xs text-[#191c1d] leading-none mb-1.5">{item.title}</h4>
                      <p className="text-[11px] text-[#424654] leading-relaxed font-semibold">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specimen and logistics split cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 bg-white border border-[#c3c6d6]/30 p-5 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-[#edf6f9] text-[#00535b] rounded-xl flex items-center justify-center text-xl shrink-0">🧪</div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#737785] block font-headline">Specimen Type</span>
                  <span className="text-xs font-black text-[#191c1d] mt-1 block">{details.samples_required || 'Blood & Urine Sample'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border border-[#c3c6d6]/30 p-5 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-[#edf6f9] text-[#00535b] rounded-xl flex items-center justify-center text-xl shrink-0">🏠</div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#737785] block font-headline">Logistics</span>
                  <span className="text-xs font-black text-[#191c1d] mt-1 block">Free Home Sample Visit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-test Instructions */}
          <div className="w-full lg:w-96 bg-amber-50/70 border border-amber-100 p-6 rounded-3xl shrink-0 text-left shadow-sm">
            <h3 className="font-headline font-black text-amber-950 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-800 text-xl font-bold">info</span>
              Pre-test Instructions
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed font-bold bg-white p-4 border border-amber-100 rounded-2xl shadow-sm">
              {details.preparations || "Requires overnight fasting of 8 to 12 hours. Drinking normal water is allowed during fasting. Avoid alcohol intake 24h prior."}
            </p>
          </div>
        </section>

        {/* 4. PARAMETER DETAIL INTERACTIVE MATRIX */}
        <section className="max-w-[1280px] mx-auto px-8 mb-20">
          <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-6 font-headline text-left flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00535b]">biotech</span>
            Included Dynamic Diagnostics ({includedTests.length} parameters)
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Parameters Checklist */}
            <div className="lg:col-span-7 space-y-2.5 max-h-[480px] overflow-y-auto pr-3 custom-scrollbar">
              {includedTests.map((t, idx) => {
                const isActive = activeParamIndex === idx;
                let badge = "🧪 Diagnostic";
                let badgeStyle = "bg-[#edf6f9] text-[#00535b] border-[#a9ece5]";
                
                const cat = (t.cat || '').toLowerCase();
                if (cat.includes('blood')) {
                  badge = "🩸 Blood";
                  badgeStyle = "bg-red-50 text-red-600 border-red-100";
                } else if (cat.includes('thyroid')) {
                  badge = "🦋 Thyroid";
                  badgeStyle = "bg-purple-50 text-purple-600 border-purple-100";
                }

                return (
                  <div
                    key={t.id}
                    onMouseEnter={() => setActiveParamIndex(idx)}
                    onClick={() => setActiveParamIndex(idx)}
                    className={`border rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? 'border-[#00535b] bg-[#00535b]/[0.03] shadow-sm translate-x-1' 
                        : 'border-[#c3c6d6]/40 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                        isActive ? 'bg-[#00535b] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className={`font-headline font-bold text-xs transition-colors ${isActive ? 'text-[#00535b]' : 'text-[#191c1d]'}`}>
                          {t.name}
                        </h4>
                        <span className={`inline-block border text-[8px] font-black px-1.5 py-0.5 rounded-md mt-1 font-headline uppercase ${badgeStyle}`}>
                          {badge}
                        </span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-sm font-bold transition-transform ${isActive ? 'text-[#00535b] translate-x-1' : 'text-slate-400'}`}>
                      chevron_right
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Significance panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-white to-slate-50/50 border border-[#00535b]/20 rounded-3xl p-6 shadow-md min-h-[300px] flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
              
              {(() => {
                const activeTest = includedTests[activeParamIndex] || includedTests[0];
                if (!activeTest) return null;
                
                return (
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#00535b] uppercase tracking-wider font-headline leading-none">
                          <span className="material-symbols-outlined text-base">analytics</span>
                          Parameter Bio-Insight
                        </div>
                      </div>

                      <h3 className="font-headline font-black text-[#191c1d] text-base leading-snug mb-3">
                        {activeTest.name}
                      </h3>

                      <div className="border-t border-slate-100 pt-4 mt-4">
                        <span className="text-[9px] font-black text-[#737785] uppercase tracking-wider block mb-2 font-headline leading-none">Clinical Description</span>
                        <p className="text-xs text-[#424654] leading-relaxed font-semibold">
                          {activeTest.description || "Diagnostic laboratory sub-test mapped to ensure overall biological assessment and metabolic indexing."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-4 text-[10px] text-emerald-700 font-bold flex items-center gap-2 bg-emerald-50/50 p-3.5 border border-emerald-100/60 rounded-2xl shadow-sm">
                      <span className="text-base leading-none">🔬</span>
                      <span>Assessed in robotic certified laboratories. PATHLAB certified precision auditing.</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* 5. "MORE FROM LAB" CAROUSEL */}
        {otherPackages.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-8 mb-20">
            <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-6 font-headline text-left">
              More Packages by {details.lab_name}
            </h2>
            
            <div className="flex overflow-x-auto gap-5 pb-4 custom-scrollbar select-none snap-x">
              {otherPackages.map((pkg, idx) => {
                const pkgSave = pkg.original_price ? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100) : 40;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCompetitorNavigate(pkg)}
                    className="min-w-[300px] max-w-[300px] bg-white border border-[#c3c6d6]/40 p-5 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-[190px] snap-center relative shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded text-[8px] font-black uppercase text-[#737785] tracking-wider leading-none">
                          {pkg.package_category || 'Health'}
                        </span>
                        <span className="material-symbols-outlined text-slate-400 text-sm font-bold select-none">bookmark</span>
                      </div>
                      <h4 className="font-headline font-black text-xs text-[#191c1d] truncate mb-1.5">{pkg.package_name}</h4>
                      <p className="text-[10px] text-[#737785] font-semibold line-clamp-2 leading-tight">{pkg.package_description || 'Assesses general biological parameters.'}</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                      <div>
                        <span className="text-[8px] text-[#737785] uppercase font-bold leading-none block mb-0.5">Price</span>
                        <span className="font-headline font-black text-sm text-[#00535b]">₹{pkg.price.toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompetitorNavigate(pkg);
                        }}
                        className="text-[10px] font-black text-[#00535b] border border-[#00535b]/20 hover:bg-[#00535b]/5 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                      >
                        View Offer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. COMPETITOR COMPARISONS GRID */}
        {competitors.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-8 mb-20 text-left">
            <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-2 font-headline">
              Compare with Similar Competitor Packages
            </h2>
            <p className="text-xs text-[#737785] font-semibold mb-6">Compare equivalent packages in {details.city} and inspect prices dynamically.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map((comp, idx) => {
                const compLogo = getLabLogoStyle(comp.lab_name);
                return (
                  <div
                    key={comp.offer_id || idx}
                    className="bg-white border border-[#c3c6d6]/40 p-6 rounded-[20px] shadow-sm flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${compLogo.bg} ${compLogo.text}`}>
                            {compLogo.char}
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#191c1d] block leading-none">{comp.lab_name}</span>
                            <div className="flex items-center gap-0.5 mt-1 text-[9px] font-bold text-[#737785] leading-none">
                              <span className="material-symbols-outlined text-[11px] text-[#f57c00]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-[#191c1d] font-black">{comp.lab_rating}</span>
                              <span>({comp.lab_reviews})</span>
                            </div>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider font-headline leading-none">
                          Verified
                        </span>
                      </div>

                      <h4 className="font-headline font-black text-xs text-[#191c1d] leading-snug mb-3">{comp.package_name}</h4>
                      
                      <div className="flex flex-col gap-1.5 text-[10px] text-[#424654] font-bold pt-2 border-t border-slate-50">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-[#00535b]">analytics</span> {comp.test_count} Markers Mapped</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs text-[#00535b]">schedule</span> Turnaround: {comp.reporting_time}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-50 pt-4 mt-4">
                      <div>
                        <span className="text-[8px] text-[#737785] block font-bold leading-none mb-0.5">Clinical Rate</span>
                        <span className="font-headline font-black text-base text-[#00535b]">₹{comp.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompetitorNavigate(comp);
                          }}
                          className="px-5 py-2 border border-[#c3c6d6] hover:bg-slate-50 text-[11px] font-black rounded-lg active:scale-95 transition-all text-[#424654]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. FAQs */}
        <section className="max-w-[768px] mx-auto px-8 mb-20 text-left">
          <h2 className="text-xl md:text-2xl font-black text-[#191c1d] mb-6 font-headline text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-[#c3c6d6]/40 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5 text-left outline-none font-headline font-bold text-xs text-[#191c1d] hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`material-symbols-outlined text-[#737785] text-lg transition-transform ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-[11px] text-[#424654] leading-relaxed border-t border-slate-50 font-medium bg-slate-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MOBILE / TOUCH VIEWPORT (TOUCH LAYOUT)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#191c1d] pb-32 text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* 1. STICKY TOP APP BAR */}
      <header className="fixed top-0 left-0 w-full z-50 h-14 bg-white/95 backdrop-blur-md flex items-center px-4 justify-between border-b border-[#c3c6d6]/10 shadow-[0px_4px_20px_rgba(11,87,208,0.03)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPage('package-listing')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-90 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-slate-700 text-xl font-bold">arrow_back</span>
          </button>
          <h1 className="font-headline font-black text-xs text-[#191c1d] truncate max-w-[200px]">Package Details</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-slate-50">
          <span className="material-symbols-outlined text-slate-500 text-lg">share</span>
        </button>
      </header>

      <main className="pt-14 pb-20">
        {/* 2. HERO BLOCK */}
        <section className="px-5 pt-6 pb-6 bg-white border-b border-[#c3c6d6]/10">
          <div className="flex flex-wrap gap-1.5 mb-3.5 select-none">
            <span className="bg-[#a9ece5]/30 text-[#286d67] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-headline flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Certified Lab
            </span>
            <span className="bg-[#00535b]/5 text-[#00535b] border border-[#00535b]/10 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-headline flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
              Best Price
            </span>
          </div>

          <h2 className="font-headline text-lg font-black text-primary leading-tight mb-2">
            {details.package_name}
          </h2>

          <p className="text-[11px] text-[#424654] font-semibold leading-relaxed mb-4">
            {details.package_description || "Dynamic clinical health profile assesses kidney, liver, metabolic levels, and cardiovascular lipid status."}
          </p>

          <div className="flex items-baseline gap-2.5 mb-6">
            <span className="text-xl font-black text-[#00535b] font-headline">₹{details.price.toLocaleString('en-IN')}</span>
            {details.original_price && (
              <span className="text-xs line-through text-slate-400">₹{details.original_price.toLocaleString('en-IN')}</span>
            )}
            {savePct > 0 && (
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded">
                {savePct}% OFF
              </span>
            )}
          </div>

          {/* Logistics widgets */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
            <div className="bg-[#f8f9fa] border border-[#e1e3e4]/30 p-3.5 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-xl">schedule</span>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Reports</p>
                <p className="font-black text-[11px] text-slate-800 leading-none">{details.reporting_time}</p>
              </div>
            </div>
            <div className="bg-[#f8f9fa] border border-[#e1e3e4]/30 p-3.5 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-xl">science</span>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Specimen</p>
                <p className="font-black text-[11px] text-slate-800 leading-none truncate max-w-[80px]">{details.samples_required || 'Blood & Urine'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CLINICAL WHY BOOKED & PREPARATION */}
        <section className="px-5 mt-6 space-y-4">
          <div className="bg-amber-50/70 border border-amber-100 p-4.5 rounded-2xl">
            <h3 className="font-headline text-xs font-black text-amber-950 mb-2 flex items-center gap-1.5 leading-none">
              <span className="material-symbols-outlined text-amber-800 text-base">info</span>
              Fasting Guidelines
            </h3>
            <p className="text-[10px] text-amber-900 leading-relaxed font-bold bg-white p-3 border border-amber-100 rounded-xl shadow-sm">
              {details.preparations || "Fasting of 8 to 12 hours required before collection. Water is allowed."}
            </p>
          </div>

          <div className="p-5 bg-white border border-[#c3c6d6]/10 rounded-2xl shadow-sm text-left">
            <h3 className="font-headline text-xs font-black text-slate-800 mb-3 leading-none flex items-center gap-1">
              <span>🩺</span> Why is this screen essential?
            </h3>
            <div className="space-y-3">
              {whyBooked.map((reason, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <span className="text-[10px] bg-slate-100 text-slate-500 rounded-lg w-5 h-5 flex items-center justify-center font-bold font-headline shrink-0">{idx + 1}</span>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800 leading-tight mb-0.5">{reason.title}</h4>
                    <p className="text-[9px] text-[#424654] font-semibold leading-relaxed leading-normal">{reason.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. HEALTH PARAMETERS ACCORDION */}
        <section className="px-5 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-headline text-sm font-black">Health Parameters</h3>
            <span className="text-[10px] font-black text-primary bg-[#00535b]/5 px-2.5 py-1 rounded border border-[#00535b]/10 font-headline leading-none">
              {includedTests.length} Tests Mapped
            </span>
          </div>

          <div className="space-y-2.5">
            {includedTests.map((t, idx) => {
              const isExpanded = !!expandedTests[t.id];
              return (
                <div 
                  key={t.id} 
                  className={`border rounded-xl transition-all duration-150 overflow-hidden shadow-sm ${
                    isExpanded ? 'border-primary bg-slate-50/20' : 'border-[#c3c6d6]/30 bg-white'
                  }`}
                >
                  <button 
                    onClick={() => toggleTestExpand(t.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#edf6f9] text-[#00535b] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base">analytics</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#191c1d] leading-none mb-1">{t.name}</p>
                        <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-wide uppercase font-headline">
                          {t.cat || 'Blood'}
                        </span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-[#737785] transition-transform duration-150 ${isExpanded ? 'rotate-180 text-[#00535b]' : ''}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-[10px] text-[#424654] border-t border-[#e1e3e4]/30 bg-white font-semibold leading-relaxed">
                      <div className="font-black uppercase tracking-wider text-[8px] text-slate-700 mb-1.5 font-headline">Clinical Significance</div>
                      {t.description || "Diagnostic pathology indicator evaluated as part of clinical baseline screening audits."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. CLINICAL STANDARDS */}
        <section className="px-5 mt-6">
          <div className="bg-[#00535b]/5 rounded-2xl p-5 border border-[#00535b]/10 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
            </div>
            <h4 className="font-headline text-xs font-black text-primary mb-1">NABL Accredited Quality</h4>
            <p className="text-[10px] text-[#424654] font-semibold leading-relaxed max-w-xs">
              Every pathology test is evaluated in certified labs under strict pathogenic and clinical audit parameters.
            </p>
          </div>
        </section>

        {/* 6. MORE FROM THIS LAB CAROUSEL (Mobile) */}
        {otherPackages.length > 0 && (
          <section className="mt-6 text-left">
            <h3 className="font-headline text-xs font-black px-5 mb-3.5">
              More from {details.lab_name}
            </h3>
            
            <div className="flex overflow-x-auto gap-3.5 px-5 pb-3 snap-x hide-scrollbar">
              {otherPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCompetitorNavigate(pkg)}
                  className="min-w-[240px] max-w-[240px] snap-center bg-white rounded-xl shadow-sm p-4 border border-[#c3c6d6]/30 flex flex-col justify-between h-[150px] relative"
                >
                  <div>
                    <span className="bg-slate-100 text-[#737785] text-[8px] font-black px-2.5 py-0.5 rounded leading-none uppercase font-headline">
                      {pkg.package_category || 'Health'}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 mt-2.5 truncate leading-none">{pkg.package_name}</h4>
                    <p className="text-[9px] text-[#737785] mt-1.5 font-semibold line-clamp-2 leading-tight">{pkg.package_description || 'Assesses vital bodily metrics.'}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 mt-2">
                    <p className="font-black text-xs text-primary">₹{pkg.price.toLocaleString('en-IN')}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompetitorNavigate(pkg);
                      }}
                      className="text-[8px] font-black text-[#00535b] border border-[#00535b]/25 px-2 py-1 rounded active:scale-95 transition-all"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. COMPETITORS CAROUSEL (Mobile) */}
        {competitors.length > 0 && (
          <section className="mt-6 text-left">
            <h3 className="font-headline text-xs font-black px-5 mb-3.5">
              Similar Competitor Packages
            </h3>

            <div className="flex overflow-x-auto gap-3.5 px-5 pb-3 snap-x hide-scrollbar">
              {competitors.map((comp, idx) => {
                const compStyle = getLabLogoStyle(comp.lab_name);
                return (
                  <div
                    key={comp.offer_id || idx}
                    className="min-w-[260px] max-w-[260px] snap-center bg-white rounded-xl shadow-sm p-4 border border-[#c3c6d6]/30 flex flex-col justify-between min-h-[170px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-[9px] ${compStyle.bg} ${compStyle.text}`}>
                            {compStyle.char}
                          </div>
                          <span className="text-[10px] font-black text-slate-800 leading-none">{comp.lab_name}</span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[7px] font-black uppercase font-headline leading-none">
                          Verified
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-xs text-slate-800 truncate mb-1 leading-none">{comp.package_name}</h4>
                      <p className="text-[9px] text-[#737785] font-semibold leading-none">{comp.test_count} Subtests • Report: {comp.reporting_time}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3">
                      <div>
                        <span className="text-[8px] text-[#737785] block font-bold leading-none mb-0.5">Rate Offered</span>
                        <span className="font-black text-xs text-[#00535b]">₹{comp.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompetitorNavigate(comp);
                          }}
                          className="px-4.5 py-2 border border-[#c3c6d6] text-[10px] font-black rounded active:scale-95 transition-all text-[#424654]"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 8. STICKY BOTTOM CTA */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between border-t border-[#c3c6d6]/10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] select-none">
        <div className="flex flex-col text-left">
          <p className="text-[9px] font-black uppercase tracking-wider text-[#737785] leading-none mb-1 font-headline">Clinical Price</p>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-primary leading-none">₹{details.price.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-[#006e2c] font-black bg-[#a9ece5]/10 px-1.5 py-0.5 rounded leading-none">Free Home Sample</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
