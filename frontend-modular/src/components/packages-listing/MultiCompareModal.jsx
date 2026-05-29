import React, { useEffect } from 'react';

export function MultiCompareModal({ packages, onClose, onBook }) {
  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!packages || packages.length === 0) return null;

  // Gather all unique sub-test parameter names across all compared packages
  const uniqueParameters = Array.from(new Set(
    packages.flatMap(pkg => pkg.tests || [])
  )).sort((a, b) => a.localeCompare(b));

  // Determine the lowest price to highlight
  const prices = packages.map(pkg => pkg.price || 99999);
  const minPrice = Math.min(...prices);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/55 backdrop-blur-md select-none animate-fade-in text-left">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-[#c3c6d6]/20 relative overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#191c1d] tracking-tight font-headline">
              Diagnostics Package Comparison
            </h2>
            <p className="text-xs text-[#737785] mt-1 font-semibold">
              Comparing parameter coverages, certifications, and direct lab rates side-by-side.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#edeeef] hover:bg-slate-200 flex items-center justify-center text-[#737785] hover:text-[#191c1d] transition-colors"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>

        {/* Scrollable Comparison Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          
          <div className="w-full overflow-x-auto hide-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left font-black text-xs uppercase tracking-wider text-[#737785] border-b border-slate-100 w-1/4">
                    Comparison Matrix
                  </th>
                  {packages.map((pkg, idx) => (
                    <th key={pkg.id || idx} className="p-4 text-center border-b border-slate-100 w-1/4">
                      <span className="text-[10px] font-black uppercase text-[#00535b] bg-[#00535b]/5 px-2 py-0.5 rounded-full block mb-2 w-max mx-auto leading-none">
                        Option {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-[13px] md:text-sm text-[#191c1d] font-headline line-clamp-2 leading-tight">
                        {pkg.package_name}
                      </h4>
                      <p className="text-[11px] font-bold text-[#737785] mt-1 leading-none">{pkg.lab_name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. Price row */}
                <tr className="bg-slate-50/50">
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Clinical Rate
                  </td>
                  {packages.map((pkg, idx) => {
                    const isLowest = pkg.price === minPrice && packages.length > 1;
                    return (
                      <td key={pkg.id || idx} className="p-4 text-center border-b border-slate-100">
                        <span className="text-lg font-black text-[#00535b] font-headline block">
                          {formatPrice(pkg.price)}
                        </span>
                        {isLowest && (
                          <span className="inline-block text-[9px] font-black text-[#006e2c] bg-[#a9ece5]/20 px-2 py-0.5 rounded mt-1.5 leading-none">
                            Lowest Price
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Turnaround time */}
                <tr>
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Report Turnaround
                  </td>
                  {packages.map((pkg, idx) => (
                    <td key={pkg.id || idx} className="p-4 text-center text-xs font-bold text-[#424654] border-b border-slate-100">
                      Report in {pkg.reporting_time}
                    </td>
                  ))}
                </tr>

                {/* 3. Home collection */}
                <tr className="bg-slate-50/50">
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Home Collection
                  </td>
                  {packages.map((pkg, idx) => (
                    <td key={pkg.id || idx} className="p-4 text-center text-xs font-bold text-[#006e2c] border-b border-slate-100">
                      {pkg.home_collection ? '✓ Available (Free)' : '✗ Lab Visit Only'}
                    </td>
                  ))}
                </tr>

                {/* 4. Accreditation */}
                <tr>
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Accreditation
                  </td>
                  {packages.map((pkg, idx) => {
                    const accString = Array.isArray(pkg.accreditations) ? pkg.accreditations.join(', ') : 'NABL Certified';
                    return (
                      <td key={pkg.id || idx} className="p-4 text-center text-xs font-bold text-[#424654] border-b border-slate-100">
                        {accString}
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Subtest Parameters section header */}
                <tr className="bg-[#edeeef]/40 select-none">
                  <td colSpan={packages.length + 1} className="p-3 text-left font-black text-[10px] uppercase tracking-widest text-[#737785]">
                    Sub-Test Parameter Coverage Matrix ({uniqueParameters.length} Parameters)
                  </td>
                </tr>

                {/* 6. Parameters checklist rows */}
                {uniqueParameters.map((paramName, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-left text-xs font-bold text-[#424654] border-b border-slate-100 leading-tight">
                      {paramName}
                    </td>
                    {packages.map((pkg, idx) => {
                      const hasParam = Array.isArray(pkg.tests) && pkg.tests.includes(paramName);
                      return (
                        <td key={pkg.id || idx} className="p-4 text-center border-b border-slate-100 select-none">
                          {hasParam ? (
                            <div className="w-5 h-5 rounded-full bg-[#00535b]/10 border border-[#00535b]/20 flex items-center justify-center text-[#00535b] text-xs font-black mx-auto leading-none">
                              ✓
                            </div>
                          ) : (
                            <span className="text-slate-300 font-extrabold">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer (Action CTAs) */}
        <div className="p-4 md:p-6 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0 bg-slate-50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 md:px-6 md:py-3 border border-[#c3c6d6] text-[#191c1d] hover:bg-slate-100 font-bold text-xs rounded-xl active:scale-95 transition-all flex-shrink-0"
          >
            Close Comparison
          </button>
          
          {/* Quick Book First Option trigger */}
          <button 
            onClick={() => {
              onBook(packages[0]);
              onClose();
            }}
            className="px-5 py-2.5 md:px-8 md:py-3 bg-[#00535b] hover:bg-[#00393f] text-white font-black text-xs rounded-xl active:scale-95 transition-all uppercase tracking-wider font-headline truncate flex-shrink-0 max-w-[180px] md:max-w-none text-center"
          >
            <span className="hidden sm:inline">Book {packages[0]?.package_name}</span>
            <span className="sm:hidden">
              {packages[0]?.package_name?.length > 15 ? 'Book Option 1' : `Book ${packages[0]?.package_name}`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
