import React, { useState } from 'react';

export function WebLayout({
  categories,
  popular,
  faqs,
  partners,
  setPage,
  setSelectedPackage,
  user,
  setActiveCategoryFilter,
  setTestName
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      if (setTestName) {
        setTestName(searchQuery.trim());
      }
      setPage("lab-listing");
    }
  };

  const handleCategoryClick = (catName) => {
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(catName);
    }
    setPage("scans-listing");
  };

  const handleProcedureBook = (proc) => {
    if (setTestName) {
      setTestName(proc.name);
    }
    setPage("lab-listing");
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#121c2c] select-none font-headline">
      
      {/* ── 1. HERO SECTION ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#f9f9ff] via-[#edf6f9] to-[#a9ece5]/10 py-16 md:py-24 border-b border-[#bec8ca]/20">
        {/* Ambient background blur blobs */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#236863]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center text-left relative z-10">
          
          <div className="space-y-6">
            <div className="flex gap-3 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-[#a9ece5]/60 text-[#286d67] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
                NABL & CAP Certified
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#00535b]/10 text-[#00535b] text-xs font-black uppercase tracking-wider">
                Clinical Precision Imaging
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-[#121c2c] tracking-tight leading-[1.08] font-headline">
              Scans &amp; Procedures
            </h1>
            
            <p className="text-base md:text-lg text-[#3e494a] leading-relaxed max-w-xl">
              Find and compare high-resolution scans, preventative screenings, and heart diagnostic procedures from certified partner medical networks.
            </p>

            {/* Oversized Interactive Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={`relative max-w-xl transition-all duration-300 ${
                searchFocused ? 'scale-[1.02] shadow-md shadow-[#00535b]/5' : ''
              }`}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#6f797a] text-2xl">search</span>
              <input
                type="text"
                placeholder="Search for MRI, CT Scan, Colonoscopy, ECG..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#bec8ca] bg-white focus:ring-2 focus:ring-[#00535b] focus:border-transparent outline-none shadow-sm transition-all text-sm font-medium text-[#121c2c]"
              />
            </form>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => handleCategoryClick("Imaging")}
                className="bg-[#00535b] hover:bg-[#00393f] text-white text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#00535b]/25 transition-all active:scale-95 uppercase tracking-wide font-headline"
              >
                Explore Imaging
              </button>
              <button 
                onClick={() => handleCategoryClick("Cardiac Diagnostics")}
                className="bg-white border border-[#bec8ca] text-[#121c2c] hover:bg-[#edf6f9] text-sm font-bold px-8 py-4 rounded-xl transition-all font-headline"
              >
                Cardiac Centers
              </button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-[#bec8ca]/20 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3e494a]">
                <span className="material-symbols-outlined text-[#286d67] text-lg">home_health</span>
                <span>Pre-Procedure Prep Guides</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3e494a]">
                <span className="material-symbols-outlined text-[#286d67] text-lg">payments</span>
                <span>No Hidden Facility Fees</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="relative hidden md:block w-full">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#00535b]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <img 
              alt="State of the Art MRI Machine" 
              className="rounded-3xl shadow-2xl relative z-10 border border-white max-h-[380px] w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1AHPHolfWzcMoacGyGytt42WDYzytbCR24kIg7B5BSvVNbud5Xb9FwaQ9-KdLfHb-QcTGjBEEkl76MgntpA-FcKycqc9WFVXkUbugncuxgy9lJMWR9RUtq_H9AJgWQTXfmrsEzsR6zH376oaoWxfs5AEiD7sBySWigxlhWFSvcWxsM3zCQZH3A24FNFWhf1dp-eFMAi9IVSVq_fK9nKYSm-K5Vou9HPyuMOWN0usricg9y19PfL2gcAFJgr44rlrsjrjQH6d1tD0"
            />
            {/* Floating Trust Card */}
            <div className="absolute bottom-6 -left-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl z-20 border border-[#bec8ca]/20 flex items-center gap-3.5 transition-all hover:scale-105 select-none">
              <div className="w-10 h-10 rounded-full bg-[#a9ece5] flex items-center justify-center text-[#286d67] border border-[#a9ece5]/30">
                <span className="material-symbols-outlined text-base">verified</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-[#6f797a] leading-none mb-1">Accredited</p>
                <p className="font-headline text-sm font-black text-[#121c2c] leading-none">NABL & CAP Labs</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ── 2. BROWSE BY CATEGORY SECTION ── */}
      <section className="py-16 bg-white border-b border-[#bec8ca]/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#121c2c] font-headline tracking-tight">Explore by Category</h2>
            <p className="text-sm text-[#3e494a] mt-2 font-medium">Browse specialized diagnostic procedures and scans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              // Custom category highlights based on spec
              const isImaging = cat.name.includes("Imaging");
              const isEndo = cat.name.includes("Endoscopy");
              const bgClass = isImaging ? 'bg-[#a9ece5]/30 text-[#286d67]' : (isEndo ? 'bg-orange-50 text-orange-700' : 'bg-[#00535b]/10 text-[#00535b]');
              
              return (
                <div 
                  key={cat.id || idx} 
                  className="group p-8 rounded-2xl border border-[#bec8ca]/40 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="text-left">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${bgClass}`}>
                      <span className="material-symbols-outlined text-3xl font-bold">{cat.icon || 'biotech'}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#121c2c] mb-2">{cat.name}</h3>
                    <p className="text-xs text-[#6f797a] font-semibold mb-6 leading-relaxed">{cat.sub_label || cat.description}</p>
                    
                    <ul className="space-y-2.5 mb-8">
                      {(cat.tests || []).slice(0, 4).map((testName, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2 text-xs font-bold text-[#3e494a]">
                          <span className={`w-1.5 h-1.5 rounded-full ${isImaging ? 'bg-[#286d67]' : (isEndo ? 'bg-orange-500' : 'bg-[#00535b]')}`} />
                          {testName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full py-3.5 bg-[#00535b] hover:bg-[#00393f] text-white font-bold rounded-xl transition-colors active:scale-95 duration-100 uppercase text-xs tracking-wider"
                  >
                    Explore {cat.name.split(" ")[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. POPULAR PROCEDURES GRID ── */}
      <section className="py-16 bg-[#edf6f9]/40 border-b border-[#bec8ca]/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12 text-left">
            <div>
              <h2 className="text-3xl font-black text-[#121c2c] font-headline tracking-tight">Popular Procedures</h2>
              <p className="text-sm text-[#3e494a] mt-1.5 font-medium">Most commonly requested clinical diagnostic and imaging screenings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((proc, idx) => {
              const isChecked = selectedProcs.some(p => p.id === proc.id);
              return (
                <div 
                  key={proc.id || idx} 
                  className="bg-white border border-[#bec8ca]/40 rounded-2xl p-6 flex flex-col hover:shadow-xl transition-all duration-300 h-full relative text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-[#286d67] bg-[#a9ece5]/40 border border-[#a9ece5] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {proc.sub_category || 'Imaging'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#121c2c] mb-2 leading-snug">{proc.name}</h3>
                  
                  <div className="flex items-center gap-2 text-xs text-[#6f797a] font-semibold mb-6">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>{proc.rep || 'Same Day Reports'}</span>
                  </div>

                  <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-[#6f797a]">Starts from </span>
                      <span className="text-xl font-black text-[#00535b]">₹{proc.price}</span>
                    </div>

                    <button 
                      onClick={() => handleProcedureBook(proc)}
                      className="w-full py-3 bg-[#00535b] hover:bg-[#00393f] text-white font-black rounded-xl text-xs uppercase tracking-wider font-headline transition-colors active:scale-95 duration-100 shadow-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. WHY PATHOCLICK SECTION ── */}
      <section className="py-16 bg-white border-b border-[#bec8ca]/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#121c2c] font-headline tracking-tight">Why Choose ChooseMyLab</h2>
            <p className="text-sm text-[#3e494a] mt-2 font-medium">Delivering diagnostic transparency and clinical excellence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: 'compare', title: 'Compare Rates Side-by-Side', desc: 'Browse transparent pricing across multiple verified hospital networks and laboratories instantly.' },
              { icon: 'verified_user', title: 'Accredited Scans Only', desc: 'We only partner with NABL & CAP certified diagnostic imaging labs for guaranteed clinical accuracy.' },
              { icon: 'event_available', title: 'Frictionless Scheduling', desc: 'Secure your preferred scanning time slots online with automated booking confirmations.' },
              { icon: 'description', title: 'Preparation Guides', desc: 'Access comprehensive patient guidelines on how to prepare for your specific imaging procedure.' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-white border border-[#bec8ca]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-[#00535b]/5 border border-[#00535b]/10 flex items-center justify-center text-[#00535b] mb-4">
                  <span className="material-symbols-outlined text-3xl font-bold">{item.icon}</span>
                </div>
                <h4 className="text-base font-black text-[#121c2c] mb-2">{item.title}</h4>
                <p className="text-xs text-[#3e494a] leading-relaxed font-semibold opacity-95">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ SECTION ── */}
      <section className="py-16 bg-[#f9f9ff]">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#121c2c] font-headline tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div 
                  key={faq.id || index} 
                  className="bg-white border border-[#bec8ca]/40 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5 text-left outline-none font-headline font-bold text-sm text-[#121c2c] hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#6f797a] text-xl transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-[#3e494a] leading-relaxed border-t border-slate-100 bg-white font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
