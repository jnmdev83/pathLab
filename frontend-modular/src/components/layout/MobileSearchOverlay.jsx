import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function MobileSearchOverlay({ 
  isOpen, 
  onClose, 
  setPage, 
  setTestName, 
  setActiveCategoryFilter 
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTests = [
    { name: "Thyroid Profile", search: "Thyroid Profile (T3, T4, TSH)" },
    { name: "CBC (Blood Count)", search: "Complete Blood Count (CBC)" },
    { name: "Lipid Profile", search: "Lipid Profile" },
    { name: "Diabetes (HbA1c)", search: "HbA1c" },
    { name: "Kidney Test (KFT)", search: "Kidney Function" },
    { name: "Liver Test (LFT)", search: "Liver Function Test (LFT)" },
    { name: "Vitamin D3", search: "Vitamin D3 Checkup" },
    { name: "Vitamin B12", search: "Vitamin B12 Checkup" },
  ];

  const popularPackages = [
    { name: "Full Body Checkup", category: "Full Body Checkup" },
    { name: "Senior Citizen Wellness", category: "Senior Citizen" },
    { name: "Cardiac Risk Care", category: "Heart" },
    { name: "Women's Wellness", category: "Pregnancy" },
  ];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    if (setTestName) {
      setTestName(cleanQuery);
    }
    setPage("lab-listing");
    onClose();
  };

  const handleSuggestionClick = (searchVal) => {
    if (setTestName) {
      setTestName(searchVal);
    }
    setPage("lab-listing");
    onClose();
  };

  const handlePackageClick = (category) => {
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(category);
    }
    setPage("package-listing");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-250 font-body text-left">
      
      {/* ─── HEADER ROW ─── */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100/60 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[#0c4ca6] text-xl font-bold">search</span>
          <span className="text-[#0c4ca6] font-black text-lg tracking-tight font-headline">Search Diagnostics</span>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all outline-none"
        >
          <span className="material-symbols-outlined text-lg font-bold">close</span>
        </button>
      </div>

      {/* ─── SEARCH INPUT BLOCK ─── */}
      <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/30">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-slate-400 text-lg leading-none">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Packages, Scans or Blood Tests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#0c4ca6] focus:bg-white rounded-2xl pl-11 pr-11 py-3.5 text-xs font-bold outline-none text-[#202124] placeholder:text-slate-400/80 shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all duration-200"
          />
          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 text-slate-400 hover:text-slate-600 flex items-center justify-center p-1"
            >
              <span className="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          )}
        </form>
      </div>

      {/* ─── SUGGESTIONS CONTENT AREA ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        
        {/* Curated Tests Suggestions */}
        <div className="space-y-3">
          <h3 className="font-headline text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">biotech</span>
            <span>Popular Diagnostic Tests</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {popularTests.map((test, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(test.search)}
                className="bg-slate-50 hover:bg-[#0c4ca6]/5 text-slate-700 hover:text-[#0c4ca6] border border-slate-100 hover:border-[#0c4ca6]/20 px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition-all active:scale-95 text-left flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
                {test.name}
              </button>
            ))}
          </div>
        </div>

        {/* Curated Health Packages Suggestions */}
        <div className="space-y-3 pt-2">
          <h3 className="font-headline text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">health_and_safety</span>
            <span>Accredited Checkup Packages</span>
          </h3>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {popularPackages.map((pkg, index) => (
              <button
                key={index}
                onClick={() => handlePackageClick(pkg.category)}
                className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200/80 p-3.5 rounded-2xl transition-all active:scale-[0.98] text-left flex justify-between items-center group shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0c4ca6] border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-sm">package_2</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-700 group-hover:text-[#0c4ca6] transition-colors">{pkg.name}</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">{pkg.category} Category</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-[#0c4ca6] group-hover:translate-x-0.5 transition-all">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-4">
          <div className="bg-[#ecfdf5] border border-emerald-100 rounded-2xl p-4 flex gap-3 text-left">
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
            <div>
              <h4 className="text-[11px] font-black text-emerald-800 font-headline uppercase tracking-wider">NABL & CAP Certified</h4>
              <p className="text-[9.5px] text-emerald-600 mt-0.5 font-bold leading-normal">Search and book tests confidently from 100% accredited diagnostic partner branches in Delhi NCR.</p>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
