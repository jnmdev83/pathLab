import React, { useState, useEffect, useRef } from 'react';

export function MobileLayout({
  categories,
  popular,
  faqs,
  setPage,
  setSelectedPackage,
  setActiveCategoryFilter,
  user
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [stickyVisible, setStickyVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll handler to hide/show sticky bottom CTA drawer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> hide CTA
          setStickyVisible(false);
        } else {
          // Scrolling up -> show CTA
          setStickyVisible(true);
        }
      } else {
        setStickyVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      if (setActiveCategoryFilter) {
        setActiveCategoryFilter("Home");
      }
      setPage("package-listing");
    }
  };

  const handleCategoryClick = (catName) => {
    if (setActiveCategoryFilter) {
      let filter = catName;
      if (catName.includes("Heart")) filter = "Heart";
      else if (catName.includes("Diabetes")) filter = "Diabetes";
      else if (catName.includes("Women") || catName.includes("Female")) filter = "Pregnancy";
      else if (catName.includes("Thyroid")) filter = "Thyroid";
      else if (catName.includes("Senior")) filter = "Senior Citizen";
      else if (catName.includes("Full Body")) filter = "Full Body Checkup";
      
      setActiveCategoryFilter(filter);
    }
    setPage("package-listing");
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  // Get color configuration based on reference design
  const getCategoryColorStyles = (theme) => {
    switch (theme) {
      case 'primary':
        return { bg: 'bg-[#0b57d0]/10', text: 'text-[#0b57d0]' };
      case 'error':
        return { bg: 'bg-red-50', text: 'text-red-600' };
      case 'secondary':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'tertiary':
        return { bg: 'bg-indigo-50', text: 'text-indigo-600' };
      case 'surface-highest':
        return { bg: 'bg-purple-50', text: 'text-purple-600' };
      case 'surface-dim':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] pb-24 relative select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── HERO BANNER ── */}
      <section className="px-4 pt-6 pb-8 bg-gradient-to-b from-[#eff4ff] to-[#f8f9ff] text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-black tracking-tight leading-snug font-headline">
            Compare Health Checkup Packages Across Top Labs
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737785] text-lg">medical_services</span>
            <input
              type="text"
              placeholder="Search tests or health concerns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#c3c6d6] focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/20 bg-white transition-all outline-none text-xs font-semibold text-[#0b1c30]"
            />
          </form>

          <div className="flex flex-col gap-2.5 mt-2">
            <button 
              onClick={() => handleCategoryClick("Full Body")}
              className="w-full bg-[#0b57d0] text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider font-headline active:scale-[0.98] transition-all shadow-sm"
            >
              Explore All Packages
            </button>
            <button 
              onClick={() => setPage("package-listing")}
              className="w-full bg-white border border-[#c3c6d6] text-[#0b1c30] py-4 rounded-xl text-xs font-black uppercase tracking-wider font-headline active:scale-[0.98] transition-all"
            >
              Find Nearby Labs
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 opacity-60 text-[10px] font-bold text-[#737785] uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span>NABL Accredited</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <span>Secure Data</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span>1M+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="px-4 py-6 text-left">
        <h2 className="text-base font-black font-headline mb-4 uppercase tracking-wider text-[#737785]">Categories</h2>
        <div className="grid grid-cols-2 gap-3.5">
          {categories.slice(0, 4).map((cat) => {
            const colors = getCategoryColorStyles(cat.color_theme);
            return (
              <div 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2.5 border border-[#c3c6d6]/30 active:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors.bg} ${colors.text}`}>
                  <span className="material-symbols-outlined text-2xl font-bold">{cat.icon}</span>
                </div>
                <span className="text-xs font-black text-[#0b1c30] text-center font-headline">{cat.name.replace(" Checkup", "").replace(" Monitoring", "").replace(" Screening", "")}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR PACKAGES SNAP SLIDER ── */}
      <section className="py-6 text-left">
        <div className="px-4 flex justify-between items-end mb-4">
          <h2 className="text-base font-black font-headline uppercase tracking-wider text-[#737785]">Popular Packages</h2>
          <button 
            onClick={() => setPage("package-listing")}
            className="text-[#0b57d0] font-black text-xs uppercase tracking-wider font-headline"
          >
            View All
          </button>
        </div>

        {/* Snap scroll horiz container */}
        <div className="flex overflow-x-auto px-4 gap-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {popular.map((pkg) => {
            const original = pkg.original_price || Math.round(pkg.price * 1.45);
            return (
              <div 
                key={pkg.id} 
                className="snap-center shrink-0 w-[275px] bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-32 bg-slate-100 overflow-hidden relative">
                  <img 
                    alt={pkg.name} 
                    className="w-full h-full object-cover" 
                    src={pkg.image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"}
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pkg.savings_badge || 'Best Value'}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-[#0b57d0] text-[10px] font-black uppercase tracking-wider font-headline">
                    <span className="material-symbols-outlined text-xs">lab_research</span> 
                    {pkg.lab_name || 'Metropolis Labs'}
                  </div>
                  
                  <h3 className="font-headline font-black text-[#0b1c30] text-sm leading-snug">{pkg.name}</h3>
                  <p className="text-[10px] text-[#737785] font-semibold leading-relaxed leading-none truncate">{pkg.tests_included_summary}</p>
                  
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-black text-[#0b1c30]">₹{pkg.price}</span>
                    <span className="text-xs line-through text-[#737785]">₹{original}</span>
                  </div>

                  <button 
                    onClick={() => {
                      if (pkg.package_id) {
                        setSelectedPackage({ id: pkg.package_id, name: pkg.name });
                        setPage("package-compare");
                      } else {
                        setPage("package-listing");
                      }
                    }}
                    className="w-full mt-2 py-2.5 border border-[#0b57d0]/30 text-[#0b57d0] hover:bg-[#0b57d0]/5 rounded-xl text-xs font-black uppercase tracking-wider font-headline active:scale-95 transition-all"
                  >
                    Compare Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS VERTICAL STEPS ── */}
      <section className="px-4 py-6 bg-slate-50 border-y border-[#c3c6d6]/20 text-left">
        <h2 className="text-base font-black font-headline uppercase tracking-wider text-[#737785] mb-6">How It Works</h2>
        <div className="relative pl-8 space-y-6">
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 border-l border-dashed border-[#c3c6d6]" />
          
          {[
            { num: 1, title: 'Select Package', body: 'Browse through curated health packages matching your diagnostic requirements.' },
            { num: 2, title: 'Compare & Book', body: 'Compare rates and transparency indices. Book a home collection visit in 2 minutes.' },
            { num: 3, title: 'Get Results', body: 'Access digital reports on WhatsApp or ChooseMyLab dashboard in 24 hours.' }
          ].map((step) => (
            <div key={step.num} className="relative flex gap-4 text-left">
              <div className="absolute -left-8 z-10 w-8 h-8 rounded-full bg-[#0b57d0] text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-sm leading-none pt-0.5">
                {step.num}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide font-headline">{step.title}</h4>
                <p className="text-[10px] text-[#424654] font-semibold leading-relaxed opacity-95">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ COLLAPSIBLE SECTION ── */}
      <section className="px-4 py-6 text-left">
        <h2 className="text-base font-black font-headline uppercase tracking-wider text-[#737785] mb-4">FAQs</h2>
        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaqIndex === index;
            return (
              <div 
                key={faq.id}
                className="bg-white border border-[#c3c6d6]/40 rounded-xl overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left outline-none font-headline font-bold text-xs text-[#0b1c30]"
                >
                  <span className="pr-4 leading-tight">{faq.question}</span>
                  <span className={`material-symbols-outlined text-[#737785] text-lg transition-transform ${isOpen ? 'rotate-180 text-[#0b57d0]' : ''}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-[10px] text-[#424654] leading-relaxed border-t border-slate-100 bg-white font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 9. STICKY BOTTOM EXPLORE CTA ── */}
      <div 
        className={`fixed bottom-4 left-0 w-full px-4 z-40 transition-transform duration-300 ${
          stickyVisible ? 'translate-y-0' : 'translate-y-[150%]'
        }`}
        id="sticky-cta"
      >
        <button 
          onClick={() => handleCategoryClick("Full Body")}
          className="w-full bg-[#0b57d0] hover:bg-[#0041a2] text-white py-4 rounded-full font-black text-xs uppercase tracking-wider font-headline shadow-lg flex items-center justify-center gap-1.5 active:scale-95 duration-100"
        >
          <span className="material-symbols-outlined text-base">explore</span>
          Explore Packages
        </button>
      </div>

    </div>
  );
}
