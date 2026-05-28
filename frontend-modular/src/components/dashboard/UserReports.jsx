import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export function UserReports({ user, setPage }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/api/user/${user.id}/dashboard`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Error loading dashboard data:", err));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center font-body">
        <p className="text-on-surface-variant font-semibold mb-4">
          Please{" "}
          <button onClick={() => setPage("signup")} className="text-primary font-bold hover:underline">
            log in
          </button>{" "}
          to view your reports.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 font-body">
      <h1 className="font-headline text-[30px] font-extrabold text-on-surface mb-6 tracking-tight">
        My Reports
      </h1>

      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/20">
          <span className="text-xl">📄</span>
          <h2 className="font-headline font-bold text-lg text-on-surface">Lab Reports</h2>
        </div>

        {!data ? (
          <div className="text-center py-8 text-on-surface-variant/80 pulse-shimmer text-sm font-semibold">
            Retrieving clinical files...
          </div>
        ) : data.reports.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant/70 text-sm">
            No diagnostic reports available yet.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {data.reports.map((r) => (
              <div key={r.id} className="py-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{r.test_name}</h3>
                    <p className="text-xs text-on-surface-variant/70 mt-1 font-semibold">
                      {r.lab} · {r.date_generated?.slice(0, 10)}
                    </p>
                  </div>
                  <a
                    href={r.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold rounded-xl transition-all active:scale-95 text-center flex-shrink-0"
                  >
                    Download PDF
                  </a>
                </div>
                {r.result_summary && (
                  <div className="mt-3 text-xs leading-relaxed text-on-surface-variant bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold">
                    📝 Summary: {r.result_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
