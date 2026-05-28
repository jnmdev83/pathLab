import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export function UserBookings({ user, setPage }) {
  const [data, setData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reschedDate, setReschedDate] = useState("");
  const [reschedSlot, setReschedSlot] = useState("");
  const [reschedDone, setReschedDone] = useState(false);
  const [reschedErr, setReschedErr] = useState("");

  const SLOTS = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const load = () => {
    if (!user) return;
    fetch(`${API_BASE_URL}/api/user/${user.id}/dashboard`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Error loading dashboard data:", err));
  };

  useEffect(load, [user]);

  const reschedule = () => {
    if (!reschedDate || !reschedSlot) {
      setReschedErr("Please pick a date and time.");
      return;
    }
    fetch(
      `${API_BASE_URL}/api/bookings/${selectedBooking.id}/reschedule`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_date: reschedDate,
          time_slot: reschedSlot,
        }),
      },
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setReschedDone(true);
          load();
          setTimeout(() => {
            setSelectedBooking(null);
            setReschedDone(false);
          }, 1800);
        } else setReschedErr(d.error || "Could not reschedule.");
      })
      .catch(() => setReschedErr("Server error."));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center font-body">
        <p className="text-on-surface-variant font-semibold mb-4">
          Please{" "}
          <button onClick={() => setPage("signup")} className="text-primary font-bold hover:underline">
            log in
          </button>{" "}
          to view your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 font-body">
      <h1 className="font-headline text-[30px] font-extrabold text-on-surface mb-6 tracking-tight">
        My Bookings
      </h1>

      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/20">
          <span className="text-xl">📋</span>
          <h2 className="font-headline font-bold text-lg text-on-surface">Appointment History</h2>
        </div>

        {!data ? (
          <div className="text-center py-8 text-on-surface-variant/80 pulse-shimmer text-sm font-semibold">
            Retrieving clinical bookings...
          </div>
        ) : data.bookings.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant/70 text-sm">
            No diagnostic bookings registered yet.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {data.bookings.map((b) => (
              <div key={b.id} className="py-4">
                <div
                  onClick={() => {
                    setSelectedBooking(selectedBooking?.id === b.id ? null : b);
                    setReschedDate("");
                    setReschedSlot("");
                    setReschedDone(false);
                    setReschedErr("");
                  }}
                  className="flex justify-between items-center cursor-pointer hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{b.test_name}</h3>
                    <p className="text-xs text-on-surface-variant/70 mt-1 font-semibold">
                      {b.lab} · {b.booking_date?.slice(0, 10)} · {b.time_slot}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">₹{b.price}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase ${
                      b.status === "completed" 
                        ? "bg-green-50 text-secondary" 
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-on-surface-variant/50">
                      {selectedBooking?.id === b.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expandable reschedule slot inputs */}
                {selectedBooking?.id === b.id && (
                  <div className="bg-slate-50 border border-outline-variant/20 rounded-2xl p-5 mt-4 space-y-4 animate-slide-up">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ["Test Requested", b.test_name],
                        ["Provider Lab", b.lab],
                        ["Patient Name", b.patient_name],
                        ["Phone Number", b.patient_phone],
                        ["Schedule Date", b.booking_date?.slice(0, 10)],
                        ["Time Slot", b.time_slot],
                        ["Session Status", b.status],
                        ["Amount", "₹" + b.price],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline">{k}</span>
                          <span className="text-xs font-bold text-on-surface block mt-0.5">{v}</span>
                        </div>
                      ))}
                    </div>

                    {b.status !== "completed" ? (
                      <div className="border-t border-outline-variant/20 pt-4 space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block font-headline">Reschedule Appointment</span>
                        
                        {reschedErr && (
                          <div className="bg-red-50 border border-red-200 text-error text-xs font-semibold px-3 py-2 rounded-xl">
                            ⚠ {reschedErr}
                          </div>
                        )}
                        {reschedDone && (
                          <div className="bg-green-50 border border-green-200 text-secondary text-xs font-semibold px-3 py-2 rounded-xl">
                            ✓ Appointment rescheduled successfully!
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 block mb-1">New Date</label>
                            <input
                              type="date"
                              value={reschedDate}
                              onChange={(e) => {
                                setReschedDate(e.target.value);
                                setReschedErr("");
                              }}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-xl outline-none text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 block mb-1">New Time Slot</label>
                            <select
                              value={reschedSlot}
                              onChange={(e) => {
                                setReschedSlot(e.target.value);
                                setReschedErr("");
                              }}
                              className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-xl outline-none text-xs font-semibold"
                            >
                              <option value="">Select time</option>
                              {SLOTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={reschedule}
                          className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
                        >
                          Confirm Reschedule
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-secondary font-bold font-headline border-t border-outline-variant/10 pt-4">
                        ✅ This appointment is completed and cannot be rescheduled.
                      </div>
                    )}
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
