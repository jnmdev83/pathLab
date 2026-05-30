import React, { useState } from 'react';

export function MobileLayout({
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
    <div className="min-h-screen bg-[#f9f9ff] text-[#121c2c] pb-28 relative select-none font-headline">
      
      {/* ── HERO BANNER ── */}
      <section className="px-4 pt-6 pb-8 bg-gradient-to-b from-[#edf6f9] to-[#f9f9ff] text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-black tracking-tight leading-snug font-headline">
            Compare Health Checkup Scans Across Top Labs
          </h1>
          
          <p className="text-xs text-[#3e494a] leading-relaxed font-semibold">
            Find and compare scans, diagnostic screenings, and heart diagnostic procedures from trusted providers.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6f797a] text-lg">medical_services</span>
            <input
              type="text"
              placeholder="Search for MRI, CT Scan, ECG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#bec8ca] bg-white focus:ring-2 focus:ring-[#00535b] outline-none shadow-sm text-xs font-semibold text-[#121c2c]"
            />
          </form>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="px-4 py-8 space-y-4 text-left">
        <h2 className="text-lg font-black tracking-tight text-[#121c2c]">Explore by Category</h2>
        
        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const isImaging = cat.name.includes("Imaging");
            const isEndo = cat.name.includes("Endoscopy");
            const iconBg = isImaging ? 'bg-[#a9ece5]/30 text-[#286d67]' : (isEndo ? 'bg-orange-50 text-orange-700' : 'bg-[#00535b]/10 text-[#00535b]');
            
            return (
              <div 
                key={cat.id || idx}
                className="bg-white rounded-2xl p-5 border border-[#bec8ca]/30 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
                    <span className="material-symbols-outlined text-2xl font-bold">{cat.icon || 'biotech'}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#121c2c] mb-1">{cat.name}</h3>
                    <p className="text-[11px] text-[#6f797a] font-semibold leading-relaxed mb-3">
                      {cat.sub_label || cat.description}
                    </p>
                    
                    <ul className="space-y-1.5 text-[11px] font-bold text-[#3e494a] mb-4">
                      {(cat.tests || []).slice(0, 3).map((testName, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                          {testName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="w-full py-3 bg-[#00535b] text-white font-black rounded-xl text-xs uppercase tracking-wider"
                >
                  Explore {cat.name.split(" ")[0]}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR PROCEDURES ── */}
      <section className="bg-[#edf6f9]/50 py-8 px-4 text-left">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#121c2c]">Popular Procedures</h2>
            <p className="text-[11px] text-[#6f797a] font-semibold mt-0.5">Most booked diagnostic scans this week</p>
          </div>
        </div>

        <div className="space-y-4">
          {popular.map((proc, idx) => {
            return (
              <div 
                key={proc.id || idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#bec8ca]/30 relative overflow-hidden transition-all duration-200"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00535b] opacity-0 transition-opacity" />
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-black text-[#121c2c] leading-tight mb-0.5">{proc.name}</h4>
                    <span className="text-[9px] font-black text-[#286d67] uppercase tracking-wider bg-[#a9ece5]/30 px-2 py-0.5 rounded">
                      {proc.sub_category || 'Imaging'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#6f797a] font-semibold mb-4">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{proc.rep || 'Same Day Reports'}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-[#6f797a]">
                    Starts @ <span className="text-base font-black text-[#00535b]">₹{proc.price}</span>
                  </div>
                  <button 
                    onClick={() => handleProcedureBook(proc)}
                    className="px-4 py-2 bg-[#a9ece5] text-[#286d67] font-black rounded-lg text-[10px] uppercase tracking-wider"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WHY TRUST US ── */}
      <section className="px-4 py-8 text-left space-y-6 bg-white border-b border-[#bec8ca]/20">
        <h2 className="text-lg font-black tracking-tight text-[#121c2c] text-center">Why Choose Us?</h2>
        
        <div className="space-y-6">
          {[
            { icon: 'verified', bg: 'bg-[#a9ece5]/30 text-[#286d67]', title: 'NABL & CAP Certified Labs', desc: 'We only partner with labs that maintain the highest global accuracy standards.' },
            { icon: 'payments', bg: 'bg-[#00535b]/10 text-[#00535b]', title: 'Best Price Guarantee', desc: 'Transparent pricing with no hidden costs. Save up to 40% on diagnostic scans.' },
            { icon: 'clinical_notes', bg: 'bg-orange-50 text-orange-700', title: 'Expert Report Summary', desc: 'Receive a simplified summary of your medical reports from our in-house experts.' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${item.bg}`}>
                <span className="material-symbols-outlined text-xl font-bold">{item.icon}</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#121c2c] mb-0.5">{item.title}</h4>
                <p className="text-[11px] text-[#6f797a] font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="px-4 py-8 bg-[#f9f9ff] text-left">
        <h2 className="text-lg font-black tracking-tight text-[#121c2c] mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaqIndex === index;
            return (
              <div 
                key={faq.id || index} 
                className="bg-white border border-[#bec8ca]/30 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left outline-none font-headline font-bold text-xs text-[#121c2c] hover:bg-slate-50 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className={`material-symbols-outlined text-[#6f797a] text-lg transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-[10px] text-[#3e494a] leading-relaxed border-t border-slate-100 bg-white font-medium">
                    {faq.answer}
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
