import React from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { S, MapLink } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

export function BranchTests({ selectedBranch, branchTests, setBranchTests, setPage, setTest, user }) {
  const isMobile = useIsMobile();
  const [loadingTests, setLoadingTests] = React.useState(false);
  const branchId = selectedBranch?.branch_id || selectedBranch?.id || selectedBranch?.lab_branch_id;

  React.useEffect(() => {
    if (!selectedBranch) {
      setPage("lab-listing");
    }
  }, [selectedBranch, setPage]);

  React.useEffect(() => {
    if (!branchId || branchTests.length > 0 || !setBranchTests) return;

    setLoadingTests(true);
    fetch(`${API_BASE_URL}/api/branches/${branchId}/tests`)
      .then((res) => res.json())
      .then((data) => {
        setBranchTests(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Could not fetch tests for this branch:", err))
      .finally(() => setLoadingTests(false));
  }, [branchId, branchTests.length, setBranchTests]);

  if (!selectedBranch) {
    return null;
  }

  const firstTest = branchTests[0] || {};
  const branchProfile = {
    ...selectedBranch,
    lab_name: selectedBranch.lab_name || firstTest.lab_name || "Laboratory",
    branch_name: selectedBranch.branch_name || firstTest.branch_name || "Branch",
    address: selectedBranch.address || firstTest.address || "",
    city: selectedBranch.city || firstTest.city || "",
    phone: selectedBranch.phone || firstTest.branch_phone || selectedBranch.branch_phone,
    lab_id: selectedBranch.lab_id || firstTest.lab_id,
    branch_id: branchId,
    id: branchId,
    home_collection: selectedBranch.home_collection ?? firstTest.home_collection,
  };

  const grouped = branchTests.reduce((acc, row) => {
    const cat = row.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(row);
    return acc;
  }, {});

  const bookTest = (row) => {
    setTest({
      id: row.test_id,
      name: row.test_name,
      cat: row.category,
      price: row.price,
      rep: row.reporting_time,
      ok: row.is_available,
      lab: row.lab_name,
      lab_name: row.lab_name,
      lab_id: row.lab_id,
      lab_branch_id: row.lab_branch_id,
      branch_name: row.branch_name,
      address: row.address,
      loc: `${row.branch_name}, ${row.city}`,
      branch_phone: row.branch_phone,
      operating_hours: row.operating_hours,
      home_collection: row.home_collection,
      lab_test_branch_id: row.lab_test_branch_id,
    });
    user ? setPage("booking") : setPage("signup");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 font-body">
      {/* Header Profile */}
      <div className="mb-10 border-b border-outline-variant/20 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2 font-headline">
            <span onClick={() => setPage("home")} className="hover:text-primary cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="text-primary">Laboratory Details</span>
          </div>
          <h1 className="font-headline text-[32px] text-on-surface font-extrabold tracking-tight leading-tight mb-2">
            {branchProfile.lab_name}
          </h1>
          <div className="text-sm text-on-surface-variant/80 flex flex-col gap-1.5">
            <div className="font-semibold">{branchProfile.branch_name} Branch{branchProfile.address ? ` - ${branchProfile.address}` : ""}</div>
            <div className="opacity-75">{branchProfile.phone || "Phone unavailable"}</div>
          </div>
        </div>
        <div>
          <MapLink item={branchProfile} style={{ fontSize: "13px" }} />
        </div>
      </div>

      {loadingTests ? (
        <div className="text-center py-20 text-on-surface-variant/80 glass rounded-3xl">
          Loading lab details...
        </div>
      ) : branchTests.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant/80 glass rounded-3xl">
          No available tests at this branch yet.
        </div>
      ) : (
        Object.entries(grouped).map(([category, tests]) => (
          <div key={category} className="mb-10">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-6 capitalize px-2">
              {category}
            </h2>
            
            {isMobile ? (
              /* Mobile responsive cards stack */
              <div className="space-y-4">
                {tests.map((row) => (
                  <div key={row.lab_test_branch_id} className="bg-surface border border-outline-variant/30 rounded-3xl p-5 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-headline font-bold text-base text-on-surface leading-snug">{row.test_name}</h3>
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded mt-1.5">
                        Reports in {row.reporting_time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-primary/5 pt-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 block font-bold">Price</span>
                        <span className="text-primary font-bold text-xl">₹{row.price}</span>
                      </div>
                      <button 
                        onClick={() => bookTest(row)}
                        className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop grid table */
              <div className="bg-surface border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] bg-surface-container-low border-b border-outline-variant/20 px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 font-headline">
                  <div>Test Name</div>
                  <div>Accredited Lab</div>
                  <div>Report Time</div>
                  <div>Price</div>
                  <div className="text-right">Action</div>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {tests.map((row, idx) => (
                    <div 
                      key={row.lab_test_branch_id} 
                      className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] items-center px-8 py-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-headline font-bold text-sm text-on-surface">{row.test_name}</div>
                      <div className="text-sm font-semibold text-on-surface-variant">{row.lab_name}</div>
                      <div className="text-xs font-bold text-secondary">{row.reporting_time}</div>
                      <div className="text-primary font-bold text-base">₹{row.price}</div>
                      <div className="text-right">
                        <button 
                          onClick={() => bookTest(row)}
                          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
