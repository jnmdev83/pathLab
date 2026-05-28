import React from 'react';

export function MobileLayout({
  title,
  rows,
  cat,
  sort,
  setSort,
  isPackage,
  setSelectedPackage,
  setPage,
  setTestName,
  selectedPackagesForCompare,
  handlePackageSelectForCompare,
  startPackageComparison,
  isCompareModalOpen,
  setIsCompareModalOpen,
  isLoadingCompare,
  comparedPackagesTests,
  getUniqueTests,
  packageHasTest,
  setSelectedPackagesForCompare
}) {
  return (
    <div className="mesh-gradient min-h-screen text-on-surface font-body pb-28 selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Header */}
      <header className="glass sticky top-0 z-40 transition-all duration-300 border-b border-white/40">
        <div className="flex justify-between items-center h-20 px-4 w-full max-w-7xl mx-auto">
          <div onClick={() => setPage("home")} className="text-headline-md font-headline font-extrabold text-primary tracking-tight text-xl cursor-pointer">
            ChooseMyLab
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Delhi</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 overflow-x-hidden pt-6">
        {/* Title */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              {title}
            </h1>
            <span className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest block mt-0.5">
              {rows.length} test options near you
            </span>
          </div>
          
          {/* Mobile Sort Trigger */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/70 border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="name">Sort (A-Z)</option>
            <option value="low">Price: Low</option>
            <option value="high">Price: High</option>
            <option value="loc">Nearby</option>
          </select>
        </div>

        {/* Listings Stack */}
        <div className="space-y-4">
          {rows.map((t) => (
            <div
              key={t.name}
              onClick={() => {
                if (isPackage) {
                  setSelectedPackage(t);
                  setPage("package-compare");
                } else {
                  setTestName(t.name);
                  setPage("lab-listing");
                }
              }}
              className="glass p-5 rounded-3xl glow-soft border border-white/50 relative active:scale-[0.99] transition-transform duration-100"
            >
              <div className="flex gap-3 items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl flex-shrink-0">
                  {isPackage ? '📦' : '🧪'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-base text-on-surface leading-snug break-words">
                    {t.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                      {t.count} Labs Available
                    </span>
                    {!isPackage && Number.isFinite(t.nearestDistance) && (
                      <span className="bg-secondary/5 text-secondary text-[10px] font-bold px-2 py-0.5 rounded">
                        {t.nearestDistance < 1
                          ? `${Math.round(t.nearestDistance * 1000)} m away`
                          : `${t.nearestDistance.toFixed(1)} km`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Divider */}
              <div className="flex justify-between items-center border-t border-primary/5 pt-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/60 block font-bold">Starting at</span>
                  <span className="text-primary font-bold text-xl">₹{t.minPrice}</span>
                </div>

                <div className="flex gap-2">
                  {isPackage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageSelectForCompare(t);
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-150 ${
                        selectedPackagesForCompare.some(p => p.id === t.id)
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-white/40 text-on-surface-variant border-outline-variant/30"
                      }`}
                    >
                      Compare
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPackage) {
                        setSelectedPackage(t);
                        setPage("package-compare");
                      } else {
                        setTestName(t.name);
                        setPage("lab-listing");
                      }
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MOBILE COMPARE STICKY DRAWER */}
      {isPackage && selectedPackagesForCompare.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-4 shadow-2xl flex items-center justify-between animate-bounce-short">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="bg-primary text-on-primary font-bold text-xs px-2.5 py-1 rounded-xl">
              ⚖ {selectedPackagesForCompare.length}
            </span>
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
              {selectedPackagesForCompare.map(pkg => (
                <span key={pkg.id} className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-semibold text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                  {pkg.name}
                  <button onClick={() => handlePackageSelectForCompare(pkg)} className="text-error font-bold">✕</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={selectedPackagesForCompare.length < 2}
              onClick={startPackageComparison}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                selectedPackagesForCompare.length >= 2 ? "bg-primary" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Compare
            </button>
            <button onClick={() => setSelectedPackagesForCompare([])} className="text-xs text-on-surface-variant hover:text-error px-1">✕</button>
          </div>
        </div>
      )}

      {/* MOBILE MATRIX MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end justify-center">
          <div className="bg-white border-t border-outline-variant/30 rounded-t-[2.5rem] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-white sticky top-0">
              <div>
                <h2 className="font-headline font-bold text-xl text-on-surface">Package Matrix</h2>
                <p className="text-xs text-on-surface-variant">Compare parameters side-by-side.</p>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold hover:bg-slate-200 transition-colors">✕</button>
            </div>

            {/* Matrix list */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 pb-12">
              {isLoadingCompare ? (
                <div className="text-center py-20 font-bold text-primary animate-pulse">
                  ⚡ Fetching inclusions...
                </div>
              ) : (
                <div className="space-y-4">
                  {getUniqueTests().map((test, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                      <h4 className="font-bold text-sm text-on-surface mb-3">{test.name}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {comparedPackagesTests.map((testsList, idx) => {
                          const pkg = selectedPackagesForCompare[idx];
                          const hasIt = packageHasTest(testsList, test.name);
                          return (
                            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center flex flex-col justify-between items-center h-20">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/75 truncate w-full">{pkg.name}</span>
                              {hasIt ? (
                                <span className="material-symbols-outlined text-secondary text-base font-bold">check_circle</span>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Glass Bottom Nav */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center px-4 py-3 glass rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40">
        <button onClick={() => setPage("home")} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all p-3 rounded-2xl">
          <span className="material-symbols-outlined text-[24px]">search</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Search</span>
        </button>
        <button onClick={() => setPage("package")} className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-2xl px-6 py-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
          <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Compare</span>
        </button>
        <button onClick={() => setPage("profile-page")} className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all p-3 rounded-2xl">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
