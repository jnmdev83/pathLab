import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';
import { MapLink } from '../../utils/reusables';

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

export function PackageCompare({ 
  selectedPackage, 
  setSelectedPackage, 
  setPage, 
  setTest, 
  user 
}) {
  const isMobile = useIsMobile();
  
  // Local state for selecting packages
  const [allPackagesList, setAllPackagesList] = useState([]);
  const [loadingAllPackages, setLoadingAllPackages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("All");

  const [pkgDetails, setPkgDetails] = useState(null);
  const [labs, setLabs] = useState([]);
  const [includedTests, setIncludedTests] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);
  
  const [sort, setSort] = useState('low');
  const [activeParamIndex, setActiveParamIndex] = useState(0);
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  // Fetch seeded packages if selectedPackage?.id is missing
  useEffect(() => {
    if (selectedPackage?.id) return;
    setLoadingAllPackages(true);
    fetch(`${API_BASE_URL}/api/packages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllPackagesList(data);
        }
        setLoadingAllPackages(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setLoadingAllPackages(false);
      });
  }, [selectedPackage?.id]);

  // 1. Fetch complete package metadata on mount
  useEffect(() => {
    if (!selectedPackage?.id) {
      setPkgDetails(null);
      return;
    }
    setLoadingDetails(true);
    fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}`)
      .then(res => res.json())
      .then(data => {
        setPkgDetails(data);
        setLoadingDetails(false);
      })
      .catch(err => {
        console.error("Error fetching package details:", err);
        setLoadingDetails(false);
      });
  }, [selectedPackage?.id]);

  // 2. Fetch lab comparison rates
  useEffect(() => {
    if (!selectedPackage?.id) {
      setLabs([]);
      return;
    }
    setLoadingLabs(true);
    fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}/comparison`)
      .then(res => res.json())
      .then(data => {
        setLabs(data);
        setLoadingLabs(false);
      })
      .catch(err => {
        console.error("Error fetching package comparisons:", err);
        setLoadingLabs(false);
      });
  }, [selectedPackage?.id]);

  // 3. Fetch subtests included in this package
  useEffect(() => {
    if (!selectedPackage?.id) {
      setIncludedTests([]);
      return;
    }
    setLoadingTests(true);
    fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}/tests`)
      .then(res => res.json())
      .then(data => {
        setIncludedTests(data);
        setLoadingTests(false);
      })
      .catch(err => {
        console.error("Error fetching package tests:", err);
        setLoadingTests(false);
      });
  }, [selectedPackage?.id]);

  const toggleTestExpand = (testId) => {
    setExpandedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleBooking = (labRow) => {
    const mockTest = {
      id: `pkg-${labRow.id}`,
      name: pkgDetails?.name || selectedPackage.name,
      price: labRow.price,
      lab: labRow.lab_name,
      loc: `${labRow.branch_name}, ${labRow.city}`,
      lab_branch_id: labRow.lab_branch_id,
      cat: 'package',
      ok: true
    };
    setTest(mockTest);
    user ? setPage("booking") : setPage("signup");
  };

  const sortedLabs = [...labs].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  const whyBooked = parseJsonColumn(pkgDetails?.why_booked, [
    { title: "Early Disease Screening", body: "Identifies early warning signs of chronic conditions like high cholesterol, diabetes, and hormonal fluctuations before symptoms occur." },
    { title: "Comprehensive Organ Tracking", body: "Monitors the performance of vital organs like your Kidneys, Liver, and Thyroid to ensure optimal systemic metabolism." },
    { title: "Active Health Auditing", body: "Provides a benchmark assessment of your current health status to review life safety, lifestyle, and dietary patterns." }
  ]);

  const whatItMeasures = parseJsonColumn(pkgDetails?.what_it_measures, [
    { name: "Blood Health (CBC & ESR)", desc: "Checks for anemia, infections, and basic immunity markers.", strength: "100%" },
    { name: "Liver health (LFT)", desc: "Assesses enzymes, protein metabolism, and waste filtration.", strength: "95%" },
    { name: "Kidney Function (KFT)", desc: "Checks filtration efficiency, uric acid, and urea levels.", strength: "90%" },
    { name: "Heart Risk (Lipid Profile)", desc: "Screens cholesterol levels and cardiovascular health.", strength: "85%" }
  ]);

  const faqs = parseJsonColumn(pkgDetails?.faq, [
    { q: "How long does it take to get the package results?", a: "Digital reports are typically delivered via WhatsApp and email within 12 to 24 hours of sample collection." },
    { q: "Is fasting mandatory for this package?", a: "Yes, an 8 to 12 hour overnight fast is highly recommended for accurate results, especially for blood sugar and lipid profiles. You can drink plain water." },
    { q: "Is home collection free for this package?", a: "Yes, free home sample collection is available for all premium diagnostic packages." }
  ]);

  const startPrice = labs.length > 0 ? Math.min(...labs.map(l => l.price)) : 899;
  const originalPrice = Math.round(startPrice * 1.45);

  if (!selectedPackage?.id) {
    const filteredPackages = allPackagesList.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (pkg.category || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const pkgCat = (pkg.category || "").toLowerCase();
      let matchesCategory = false;
      if (selectedCategoryTab === "All") {
        matchesCategory = true;
      } else if (selectedCategoryTab === "Women Health") {
        matchesCategory = pkgCat.includes("women") || pkgCat.includes("female") || pkgCat.includes("pregnancy");
      } else {
        matchesCategory = pkgCat.includes(selectedCategoryTab.toLowerCase());
      }
      return matchesSearch && matchesCategory;
    });

    const categories = ["All", "Full Body Checkup", "Diabetes", "Heart", "Thyroid", "Women Health"];

    return (
      <div className="min-h-screen bg-[#f8f9fa] pb-16 text-left" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {/* Breadcrumbs */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-5">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-[#737785] tracking-wider uppercase font-headline">
            <button onClick={() => setPage('home')} className="hover:text-[#00535b] transition-colors">Home</button>
            <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
            <span className="text-[#00535b] font-black">Compare Packages</span>
          </nav>
        </section>

        {/* Hero Card Banner */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-4">
          <div className="bg-gradient-to-br from-[#006d77] to-[#236863] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg mb-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-flex items-center px-3 py-1 bg-[#a9ece5]/20 text-[#a9ece5] border border-[#a9ece5]/30 rounded-full text-xs font-black uppercase tracking-wider font-headline">
                <span className="material-symbols-outlined text-[14px] mr-1">compare_arrows</span>
                Side-by-Side Lab Rates
              </span>
              <h1 className="text-2xl md:text-4xl font-black font-headline tracking-tight leading-tight">
                Select a Package to Compare Rates
              </h1>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-xl">
                Choose a diagnostic screening package below. We will retrieve active pathologists rates, parameters coverages, and turnarounds side-by-side across all NABL-certified labs in your region.
              </p>
            </div>
          </div>

          {/* Filters & Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-[#e1e3e4] p-4 rounded-2xl shadow-sm">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
              {categories.map((tab) => {
                const isActive = selectedCategoryTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategoryTab(tab)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap outline-none ${
                      isActive 
                        ? "bg-[#00535b] text-white shadow-sm shadow-[#00535b]/15" 
                        : "bg-slate-50 border border-[#e1e3e4] text-[#424654] hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative max-w-md w-full flex-shrink-0">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages by name or category..."
                className="w-full pl-10 pr-4 py-2 border border-[#c3c6d6] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00535b] bg-slate-50 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Package Bento Grid */}
          {loadingAllPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-3xl p-6 h-48 border border-slate-100 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-12 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto shadow-sm">
              <span className="text-5xl">🔬</span>
              <h3 className="font-headline font-black text-lg text-[#191c1d]">No packages found</h3>
              <p className="text-xs text-[#424654] leading-relaxed">
                We couldn't find any medical packages matching your search criteria. Try clearing filters or typing a different query.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategoryTab("All"); }}
                className="px-6 py-2.5 bg-[#00535b] hover:bg-[#00393f] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm font-headline"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => {
                const startPriceVal = pkg.min_price || 899;
                const originalPriceVal = Math.round(startPriceVal * 1.45);
                
                return (
                  <div 
                    key={pkg.id} 
                    className="bg-white border border-[#e1e3e4]/80 hover:border-[#00535b]/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden text-left"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Category & Badges */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-[#00535b] bg-[#00535b]/5 px-2.5 py-1 rounded-full leading-none border border-[#00535b]/10">
                          {pkg.category || 'General Health'}
                        </span>
                        <span className="text-[10px] font-bold text-[#737785] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#00535b]">science</span>
                          {pkg.test_count || 0} Parameters
                        </span>
                      </div>

                      {/* Package Name & Desc */}
                      <div className="space-y-1">
                        <h3 className="font-headline font-black text-base text-[#191c1d] group-hover:text-[#00535b] transition-colors leading-tight">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-[#424654] leading-relaxed line-clamp-2 opacity-90">
                          {pkg.description || "Comprehensive pathology assessment, certified by qualified pathologists, utilizing home collections."}
                        </p>
                      </div>

                      {/* Info Pills */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-semibold text-[#424654] bg-slate-50 px-2 py-0.5 rounded border border-[#e1e3e4]/30">
                          🏠 Free Collection
                        </span>
                        <span className="text-[10px] font-semibold text-[#006e2c] bg-[#a9ece5]/10 px-2 py-0.5 rounded border border-[#a9ece5]/20">
                          🏥 {pkg.lab_count || 0} Labs Offered
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="mt-6 pt-4 border-t border-[#e1e3e4]/60 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-black text-[#737785] tracking-wider block mb-0.5">Rates From</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-[#191c1d] font-headline">₹{startPriceVal.toLocaleString('en-IN')}</span>
                          <span className="text-xs line-through text-[#737785]">₹{originalPriceVal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPackage({ id: pkg.id, name: pkg.name });
                        }}
                        className="px-4 py-2 bg-[#00535b] hover:bg-[#00393f] group-hover:bg-[#00393f] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm shadow-[#00535b]/10 flex items-center gap-1.5 uppercase font-headline"
                      >
                        Compare Rates
                        <span className="material-symbols-outlined text-xs leading-none">arrow_forward</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-16" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-5 flex justify-between items-center flex-wrap gap-3">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#737785] tracking-wider uppercase font-headline">
          <button onClick={() => setPage('home')} className="hover:text-[#00535b] transition-colors">Home</button>
          <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
          <button onClick={() => setSelectedPackage(null)} className="hover:text-[#00535b] transition-colors">Compare</button>
          <span className="material-symbols-outlined text-[16px] text-[#c3c6d6]">chevron_right</span>
          <span className="text-[#00535b] font-black truncate max-w-[200px]">{pkgDetails?.name || selectedPackage.name}</span>
        </nav>

        <button
          onClick={() => setSelectedPackage(null)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-[#c3c6d6] text-[#424654] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>Select Different Package</span>
        </button>
      </section>

      {/* ── HERO BANNER SECTION ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#dae2ff] border-b border-[#e1e3e4] mb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-8">
          
          {/* Left Details Block */}
          <div className="flex-1 space-y-5 text-left">
            <div className="inline-flex items-center px-3 py-1 bg-[#a9ece5] text-[#286d67] rounded-full text-xs font-black uppercase tracking-wider font-headline">
              <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Premium Health Package
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-[#191c1d] tracking-tight leading-none font-headline">
              {pkgDetails?.name || selectedPackage.name}
            </h1>
            
            <p className="text-base md:text-lg text-[#424654] leading-relaxed max-w-2xl">
              {pkgDetails?.description || "This comprehensive full-body checkup is customized to evaluate key health parameters of your body. Curated by clinical diagnostic experts to audit systemic organ function."}
            </p>
            
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">analytics</span> {includedTests.length} Diagnostics Mapped
              </span>
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">restaurant_menu</span> Fasting Required (8-12h)
              </span>
              <span className="px-3.5 py-1.5 bg-white border border-[#c3c6d6] rounded-full text-xs font-bold text-[#424654] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00535b] text-sm">home</span> Free Home Collection
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
              <a href="#available-labs-section" className="bg-[#00535b] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#00393f] transition-colors text-sm shadow-md shadow-[#00535b]/25 text-center">
                Compare {labs.length} Certified Labs
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
              <p className="text-xs text-[#424654] leading-relaxed opacity-95">Every partner laboratory utilizes certified pathologist audits.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── PORTAL CONTENT SYSTEM GRID ────────────────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CLINICAL PORTFOLIO ================= */}
          <div className="xl:col-span-8 space-y-6 text-left order-2 xl:order-1">
            
            {/* Specimen Type & Fasting Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e1e3e4] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-[#edf6f9] text-[#00535b] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🧪</div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#737785] block font-headline">Specimen Type</span>
                  <span className="text-sm font-bold text-[#191c1d] mt-0.5 block">{pkgDetails?.samples_required || 'Blood & Urine Specimen'}</span>
                </div>
              </div>

              <div className="bg-white border border-[#e1e3e4] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-[#edf6f9] text-[#00535b] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#737785] block font-headline">Fasting Guidelines</span>
                  <span className="text-sm font-bold text-[#191c1d] mt-0.5 block leading-tight">{pkgDetails?.preparations || 'Requires overnight fasting for 8 to 12 hours'}</span>
                </div>
              </div>
            </div>

            {/* Why Booked Reasons list */}
            <div className="bg-white border border-[#e1e3e4] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🔍</span>
                <h3 className="font-headline font-black text-lg md:text-xl text-[#191c1d]">Why is this package booked?</h3>
              </div>
              
              <div className="space-y-4">
                {whyBooked.map((reason, idx) => (
                  <div key={idx} className="flex gap-4 bg-[#f8f9fa] border border-[#e1e3e4]/40 p-4 rounded-2xl">
                    <div className="bg-white text-[#00535b] border border-[#e1e3e4] rounded-xl w-9 h-9 flex items-center justify-center font-bold text-xs flex-shrink-0 font-headline shadow-sm">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-[#191c1d] mb-1">{reason.title}</h4>
                      <p className="text-[#424654] text-xs leading-relaxed opacity-95">{reason.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organ coverages progress lines */}
            <div className="bg-white border border-[#e1e3e4] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="font-headline font-black text-lg md:text-xl text-[#191c1d]">Organ System Coverages</h3>
              </div>
              <p className="text-[#424654] text-xs md:text-sm leading-relaxed mb-6">
                Tracks bio-indicators across vital physiological parameters to guarantee comprehensive health tracking:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatItMeasures.map((cat, idx) => {
                  const strengthPct = cat.strength || "100%";
                  return (
                    <div key={idx} className="p-4 bg-[#f8f9fa] border border-[#e1e3e4]/30 rounded-2xl flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-[#191c1d] leading-tight">{cat.name}</span>
                        <span className="text-[9px] font-bold text-[#00535b] bg-[#00535b]/5 border border-[#00535b]/10 px-2 py-0.5 rounded font-headline uppercase">
                          {strengthPct} Mapped
                        </span>
                      </div>
                      
                      <p className="text-[#424654] text-xs leading-relaxed mb-4 opacity-90">{cat.desc}</p>
                      
                      <div className="w-full h-1.5 bg-[#c3c6d6]/40 rounded-full overflow-hidden">
                        <div style={{ width: strengthPct }} className="h-full bg-gradient-to-r from-[#00535b] to-[#00393f] rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive subtests inclusions list */}
            <div className="bg-white border border-[#e1e3e4] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline font-black text-lg md:text-xl text-[#191c1d]">Included Diagnostics</h3>
                  <p className="text-xs text-[#424654] mt-1">
                    {isMobile ? "Tap a parameter to read clinical information." : "Hover or click a parameter on the left to read clinical details on the right."}
                  </p>
                </div>
                <span className="bg-[#00535b]/5 text-[#00535b] text-[10px] font-bold px-3 py-1.5 rounded-full font-headline border border-[#00535b]/15">
                  {includedTests.length} Parameters
                </span>
              </div>

              {loadingTests ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : includedTests.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#424654]">
                  No active sub-tests mapped to this package.
                </div>
              ) : isMobile ? (
                <div className="space-y-3">
                  {includedTests.map((t) => {
                    const isExpanded = !!expandedTests[t.id];
                    let catLabel = "🧪 Diagnostic";
                    let catBg = "bg-[#00535b]/5 border-[#00535b]/15 text-[#00535b]";
                    
                    const category = (t.cat || '').toLowerCase();
                    if (category.includes("blood")) {
                      catLabel = "🩸 Blood Specimen";
                      catBg = "bg-red-50 border-red-100 text-red-600";
                    } else if (category.includes("cardiac") || category.includes("heart")) {
                      catLabel = "❤️ Cardiology";
                      catBg = "bg-pink-50 border-pink-100 text-pink-600";
                    }

                    return (
                      <div 
                        key={t.id} 
                        className={`border rounded-2xl transition-all duration-150 cursor-pointer overflow-hidden ${
                          isExpanded ? 'border-[#00535b] bg-[#00535b]/[0.01]' : 'border-[#e1e3e4]/60 bg-white'
                        }`}
                        onClick={() => toggleTestExpand(t.id)}
                      >
                        <div className="p-4 flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-2 flex-1">
                            <span className="font-headline font-bold text-sm text-[#191c1d] leading-tight">{t.name}</span>
                            <div>
                              <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-md font-headline uppercase tracking-wide ${catBg}`}>
                                {catLabel}
                              </span>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined text-[#737785] transition-transform duration-150 ${isExpanded ? 'rotate-180 text-[#00535b]' : ''}`}>
                            keyboard_arrow_down
                          </span>
                        </div>
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 text-xs text-[#424654] border-t border-[#e1e3e4]/10 bg-white leading-relaxed">
                            <div className="font-bold uppercase tracking-wider text-[9px] text-[#191c1d] mb-1 font-headline">Clinical Significance</div>
                            {t.description || "Diagnostic laboratory test included as part of this health screening package."}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start">
                  
                  {/* Left parameter items */}
                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                    {includedTests.map((t, index) => {
                      const isActive = activeParamIndex === index;
                      let catLabel = "🧪 Diagnostic";
                      let catBg = "bg-[#00535b]/5 border-[#00535b]/15 text-[#00535b]";
                      
                      const category = (t.cat || '').toLowerCase();
                      if (category.includes("blood")) {
                        catLabel = "🩸 Blood";
                      } else if (category.includes("cardiac") || category.includes("heart")) {
                        catLabel = "❤️ Cardiac";
                        catBg = "bg-pink-50 border-pink-100 text-pink-600";
                      }

                      return (
                        <div
                          key={t.id}
                          onMouseEnter={() => setActiveParamIndex(index)}
                          onClick={() => setActiveParamIndex(index)}
                          className={`border rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 ${
                            isActive 
                              ? "border-[#00535b] bg-[#00535b]/[0.03] shadow-sm translate-x-1" 
                              : "border-[#e1e3e4]/60 bg-white hover:bg-slate-50/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 ${
                              isActive ? "bg-[#00535b] text-white" : "bg-slate-100 text-[#424654]"
                            }`}>
                              {index + 1}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className={`font-bold text-sm transition-colors duration-200 ${
                                isActive ? "text-[#00535b]" : "text-[#191c1d]"
                              }`}>
                                {t.name}
                              </span>
                              <div>
                                <span className={`inline-block border text-[8px] font-bold px-1.5 py-0.5 rounded font-headline uppercase tracking-wide ${catBg}`}>
                                  {catLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${
                            isActive ? "text-[#00535b] translate-x-1 font-bold" : "text-[#737785]/60"
                          }`}>
                            chevron_right
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right parameter details */}
                  <div className="sticky top-24 bg-gradient-to-br from-white to-slate-50 border border-[#00535b]/20 rounded-3xl p-6 shadow-md min-h-[300px] flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
                    
                    {(() => {
                      const activeTest = includedTests[activeParamIndex] || includedTests[0];
                      if (!activeTest) return null;
                      
                      let activeCatLabel = "🧪 Diagnostic";
                      let activeCatBg = "bg-[#00535b]/5 border-[#00535b]/15 text-[#00535b]";
                      const category = (activeTest.cat || '').toLowerCase();
                      if (category.includes("blood")) {
                        activeCatLabel = "🩸 Blood Specimen";
                      } else if (category.includes("cardiac") || category.includes("heart")) {
                        activeCatLabel = "❤️ Cardiology";
                        activeCatBg = "bg-pink-50 border-pink-100 text-pink-600";
                      }

                      return (
                        <>
                          <div className="relative z-10">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#00535b] uppercase tracking-wider font-headline">
                                <span className="material-symbols-outlined text-base">analytics</span>
                                Parameter Info
                              </div>
                              <span className={`inline-block border text-[8px] font-bold px-2 py-0.5 rounded font-headline uppercase tracking-wide ${activeCatBg}`}>
                                {activeCatLabel}
                              </span>
                            </div>
                            
                            <h4 className="font-headline font-extrabold text-base text-[#191c1d] leading-tight mb-4">
                              {activeTest.name}
                            </h4>
                            
                            <div className="border-t border-[#e1e3e4]/60 pt-4">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#737785] block font-headline mb-2">Clinical Significance</span>
                              <p className="text-[#424654] text-xs leading-relaxed opacity-95">
                                {activeTest.description || "Diagnostic laboratory test included as part of this health screening package."}
                              </p>
                            </div>
                          </div>
                          
                          <div className="relative z-10 mt-8 pt-4 border-t border-[#e1e3e4]/60 flex items-center gap-3 text-[11px] text-[#006e2c] font-bold font-headline bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                            <span className="text-lg">🔬</span>
                            <span>Standardized screening metric. Assessed under NABL certification.</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                </div>
              )}
            </div>

            {/* Dynamic FAQs Accordion */}
            {!loadingDetails && (
              <div className="bg-white border border-[#e1e3e4] p-6 md:p-8 rounded-3xl shadow-sm mt-6">
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

          {/* ================= RIGHT COLUMN: AVAILABLE LABORATORIES ================= */}
          <div id="available-labs-section" className="xl:col-span-4 space-y-4 text-left scroll-mt-20 order-1 xl:order-2">
            <div className="flex items-end justify-between px-1">
              <h3 className="font-headline text-lg font-black text-[#191c1d]">Partner Laboratories</h3>
              <span className="text-xs text-[#737785] font-bold">
                ({labs.length} rates loaded)
              </span>
            </div>

            {loadingLabs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 h-36 animate-pulse" />
              ))
            ) : labs.length === 0 ? (
              <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-8 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-4xl">🏥</span>
                <h4 className="font-headline font-bold text-sm text-[#191c1d]">No labs available</h4>
                <p className="text-xs text-[#424654] leading-relaxed max-w-xs">
                  There are currently no laboratories offering this clinical package in your selected region.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedLabs.map((l, idx) => {
                  const style = getLabLogoStyle(l.lab_name);
                  const originalPrice = l.original_price || Math.round(l.price * 1.45);
                  const savePct = Math.round(((originalPrice - l.price) / originalPrice) * 100);
                  
                  return (
                    <div 
                      key={`${l.id}-${idx}`}
                      className="bg-white border-2 border-transparent hover:border-[#00535b]/40 rounded-3xl p-5 shadow-sm transition-all duration-200 relative overflow-hidden"
                      style={{ boxShadow: '0px 4px 20px rgba(11, 87, 208, 0.04)' }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00535b]" />

                      {/* Lab Identity */}
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
                            style={{ background: style.bg }}
                          >
                            <span 
                              className="material-symbols-outlined text-2xl"
                              style={{ color: style.icon, fontVariationSettings: "'FILL' 1" }}
                            >
                              science
                            </span>
                          </div>
                          <div>
                            <div className="font-headline font-black text-sm text-[#191c1d] leading-tight">{l.lab_name}</div>
                            <div className="text-xs text-[#737785] mt-1 flex items-center gap-1 font-semibold">
                              <span>📍</span>
                              <span className="truncate max-w-[150px]">{l.branch_name}, {l.city}</span>
                            </div>
                          </div>
                        </div>

                        <span className="bg-[#00535b]/5 text-[#00535b] border border-[#00535b]/10 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-headline flex-shrink-0">
                          ✓ Certified
                        </span>
                      </div>

                      {/* Lab features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="text-[10px] font-bold text-[#424654] bg-[#f8f9fa] border border-[#e1e3e4]/60 px-2 py-0.5 rounded-md">
                          ⏱️ Report: {l.reporting_time}
                        </span>
                        {l.home_collection && (
                          <span className="text-[10px] font-bold text-[#006e2c] bg-[#a9ece5]/20 border border-[#a9ece5]/45 px-2 py-0.5 rounded-md">
                            🏠 Free Collection
                          </span>
                        )}
                      </div>

                      {/* Rates & Booking */}
                      <div className="flex justify-between items-center bg-[#f8f9fa] border border-[#e1e3e4]/40 p-3 rounded-2xl">
                        <div>
                          <div className="text-[10px] font-bold text-[#737785] line-through">₹{originalPrice}</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-xl font-extrabold text-[#191c1d] font-headline">₹{l.price}</span>
                            <span className="text-[10px] text-[#006e2c] font-black">{savePct}% OFF</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleBooking(l)}
                          className="px-4 py-2 bg-[#00535b] hover:bg-[#00393f] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm font-headline uppercase"
                        >
                          Book Package
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
