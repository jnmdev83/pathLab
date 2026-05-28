import React from 'react';
import { getDistanceKm, compareNearby } from '../../utils/reusables';

export function WebLayout({
  title,
  rows,
  cat,
  sort,
  setSort,
  pageIdx,
  setPageIdx,
  totalPages,
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
  const pageSize = 10;
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 font-body">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-10 flex justify-between items-end border-b border-outline-variant/20 pb-6">
        <div>
          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2 font-headline">
            <span onClick={() => setPage("home")} className="hover:text-primary cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="text-primary">{title}</span>
          </div>
          <h1 className="font-headline text-[36px] text-on-surface font-extrabold tracking-tight leading-none mb-2">
            {title}
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            {rows.length} clinically validated {isPackage ? "preventive packages" : "diagnostic tests"} available near you.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant/60 font-semibold font-headline">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-surface border border-outline-variant rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="name">Alphabetical (A-Z)</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="loc">Nearby First</option>
            <option value="rating">Popularity</option>
          </select>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="bg-surface border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        {/* Table Headers */}
        <div className="grid grid-cols-[3fr_1.2fr_2fr] bg-surface-container-low border-b border-outline-variant/20 px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 font-headline">
          <div>Test Details</div>
          <div>Availability</div>
          <div className="text-right">Price & Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant/10">
          {rows.map((t, idx) => (
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
              className="grid grid-cols-[3fr_1.2fr_2fr] items-center px-8 py-6 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
            >
              {/* Test Name & Badge */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-xl flex-shrink-0">
                  {isPackage ? '📦' : '🧪'}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface leading-snug">
                    {t.name}
                  </h3>
                  {isPackage && t.testCount > 0 && (
                    <span className="inline-block bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-md mt-1">
                      {t.testCount} Tests Included
                    </span>
                  )}
                </div>
              </div>

              {/* Lab counts & Distances */}
              <div>
                <span className="font-bold text-sm text-on-surface block">
                  {t.count} Lab{t.count !== 1 ? "s" : ""} Available
                </span>
                {!isPackage && Number.isFinite(t.nearestDistance) && (
                  <span className="text-xs text-primary font-semibold block mt-0.5">
                    nearest {t.nearestDistance < 1
                      ? `${Math.round(t.nearestDistance * 1000)} m away`
                      : `${t.nearestDistance.toFixed(1)} km away`}
                  </span>
                )}
              </div>

              {/* Price & Actions buttons */}
              <div className="flex items-center justify-between gap-6 pl-6 text-right">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 block font-bold">Starting at</span>
                  <span className="text-primary font-bold text-2xl">₹{t.minPrice}</span>
                </div>

                <div className="flex items-center gap-3">
                  {isPackage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageSelectForCompare(t);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-150 ${
                        selectedPackagesForCompare.some(p => p.id === t.id)
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50"
                      }`}
                    >
                      {selectedPackagesForCompare.some(p => p.id === t.id) ? 'Selected' : '⚖ Compare'}
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
                    className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                  >
                    {isPackage ? 'View Details' : 'View Labs →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 border-t border-outline-variant/20 pt-6 font-headline">
          <span className="text-xs font-semibold text-on-surface-variant/70">
            Showing {(pageIdx - 1) * pageSize + 1}–{Math.min(pageIdx * pageSize, rows.length * totalPages)} of {rows.length * totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPageIdx(Math.max(1, pageIdx - 1))}
              disabled={pageIdx === 1}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-bold text-sm text-on-surface-variant"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPageIdx(n)}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl text-sm font-bold transition-all ${
                  n === pageIdx
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-slate-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPageIdx(Math.min(totalPages, pageIdx + 1))}
              disabled={pageIdx === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-bold text-sm text-on-surface-variant"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* COMPARATIVE STICKY TOP COMPARE PANEL */}
      {isPackage && selectedPackagesForCompare.length > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-4 shadow-2xl flex items-center gap-6 z-40 w-[90%] max-w-3xl justify-between animate-bounce-short">
          <div className="flex items-center gap-4 overflow-hidden flex-1">
            <span className="bg-primary text-on-primary font-bold text-xs px-3 py-1.5 rounded-xl">
              ⚖ {selectedPackagesForCompare.length} Selected
            </span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {selectedPackagesForCompare.map(pkg => (
                <span key={pkg.id} className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold text-on-surface flex items-center gap-2 whitespace-nowrap">
                  {pkg.name}
                  <button onClick={() => handlePackageSelectForCompare(pkg)} className="text-error font-extrabold text-xs">✕</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={selectedPackagesForCompare.length < 2}
              onClick={startPackageComparison}
              className={`px-6 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                selectedPackagesForCompare.length >= 2 ? "bg-primary hover:bg-primary-container" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Compare Packages
            </button>
            <button onClick={() => setSelectedPackagesForCompare([])} className="text-xs text-on-surface-variant hover:text-error font-semibold px-2 py-1">Reset</button>
          </div>
        </div>
      )}

      {/* COMPARISON MATRIX MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-white sticky top-0">
              <div>
                <h2 className="font-headline font-bold text-2xl text-on-surface">ChooseMyLab Comparison Matrix</h2>
                <p className="text-xs text-on-surface-variant mt-1">Comparing test parameters side-by-side.</p>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-on-surface-variant font-bold hover:bg-slate-200 transition-colors">✕</button>
            </div>

            {/* Content Table */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {isLoadingCompare ? (
                <div className="text-center py-20 font-semibold text-primary animate-pulse">
                  ⚡ Retrieving parameter comparisons...
                </div>
              ) : (
                <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
                  <thead>
                    <tr className="bg-slate-100 border-b border-outline-variant/20">
                      <th className="text-left p-4 font-headline text-xs font-bold text-on-surface-variant/75 uppercase tracking-wider">Test Parameter</th>
                      {selectedPackagesForCompare.map(pkg => (
                        <th key={pkg.id} className="text-center p-4 font-headline text-xs font-bold text-on-surface uppercase tracking-wider border-l border-outline-variant/20">
                          {pkg.name}
                          <div className="text-primary font-extrabold text-sm mt-1">₹{pkg.price}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {getUniqueTests().map((test, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-semibold text-sm text-on-surface">
                          {test.name}
                        </td>
                        {comparedPackagesTests.map((testsList, idx) => (
                          <td key={idx} className="p-4 text-center border-l border-outline-variant/20">
                            {packageHasTest(testsList, test.name) ? (
                              <span className="material-symbols-outlined text-secondary text-xl font-bold">check_circle</span>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
