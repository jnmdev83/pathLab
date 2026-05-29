import React, { useEffect } from 'react';

export function LabCompareModal({ labs, onClose, onBook }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!labs || labs.length === 0) return null;

  // Determine lowest price among compared labs to highlight it
  const prices = labs.map(lab => lab.price || 99999);
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
              Laboratory Comparison Matrix
            </h2>
            <p className="text-xs text-[#737785] mt-1 font-semibold">
              Comparing direct clinical rates, certified credentials, turnaround times, and patient feedback.
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
                    Lab Matrix
                  </th>
                  {labs.map((lab, idx) => (
                    <th key={`${lab.branch_id}-${idx}`} className="p-4 text-center border-b border-slate-100 w-1/4">
                      <span className="text-[10px] font-black uppercase text-[#00535b] bg-[#00535b]/5 px-2 py-0.5 rounded-full block mb-2 w-max mx-auto leading-none">
                        Clinic Option {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-[13px] md:text-sm text-[#191c1d] font-headline line-clamp-2 leading-tight">
                        {lab.lab_name}
                      </h4>
                      <p className="text-[10px] font-bold text-[#737785] mt-1 leading-none">{lab.branch_name}</p>
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
                  {labs.map((lab, idx) => {
                    const isLowest = lab.price === minPrice && labs.length > 1;
                    return (
                      <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center border-b border-slate-100">
                        <span className="text-lg font-black text-[#00535b] font-headline block">
                          {formatPrice(lab.price)}
                        </span>
                        {isLowest && (
                          <span className="inline-block text-[9px] font-black text-[#006e2c] bg-[#a9ece5]/30 px-2 py-0.5 rounded mt-1.5 leading-none">
                            Lowest Price
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Rating & Feedback */}
                <tr>
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Patient Rating
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center border-b border-slate-100">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#424654]">
                        <span className="material-symbols-outlined text-[14px] text-[#f59e0b]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>{lab.rating || '4.5'}</span>
                        <span className="text-[#737785] text-[10px]">({lab.booking_count || 1200})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Turnaround time */}
                <tr className="bg-slate-50/50">
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Report Turnaround
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center text-xs font-bold text-[#424654] border-b border-slate-100">
                      {lab.reporting_time}
                    </td>
                  ))}
                </tr>

                {/* 4. Home collection */}
                <tr>
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Home Collection
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center text-xs font-bold text-[#006e2c] border-b border-slate-100">
                      {lab.home_collection ? '✓ Available (Free)' : '✗ Lab Visit Only'}
                    </td>
                  ))}
                </tr>

                {/* 5. Accreditation */}
                <tr className="bg-slate-50/50">
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Accreditation
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center text-xs font-bold text-[#424654] border-b border-slate-100">
                      {lab.is_verified ? 'CAP, NABL Accredited' : 'NABL Certified'}
                    </td>
                  ))}
                </tr>

                {/* 6. Address Location */}
                <tr>
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d] border-b border-slate-100">
                    Lab Address
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center text-[10px] font-semibold text-[#737785] border-b border-slate-100 leading-tight">
                      {lab.address}, {lab.city}
                    </td>
                  ))}
                </tr>

                {/* 7. Action Row */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 text-left font-bold text-xs text-[#191c1d]">
                    Booking Selection
                  </td>
                  {labs.map((lab, idx) => (
                    <td key={`${lab.branch_id}-${idx}`} className="p-4 text-center">
                      <button
                        onClick={() => onBook(lab)}
                        className="w-full py-2 bg-[#00535b] hover:bg-[#00393f] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                      >
                        Book Test
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
