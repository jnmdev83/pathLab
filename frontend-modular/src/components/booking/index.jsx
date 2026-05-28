import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';

export function Booking({ test, user, setPage, userLocation }) {
  const [pName, setPName] = useState(user?.name || "");
  const [pPhone, setPPhone] = useState(user?.phone || "");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

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

  function submit() {
    if (!pName || !pPhone || !date || !slot) {
      alert("Please fill all required fields!");
      return;
    }

    fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user ? user.id : null,
        test_id: test.id,
        lab_branch_id: test.lab_branch_id || null,
        patient_name: pName,
        patient_phone: pPhone,
        booking_date: date,
        time_slot: slot,
        user_latitude: userLocation?.lat ?? null,
        user_longitude: userLocation?.lng ?? null,
        user_location: userLocation?.label ?? "",
        notes: notes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDone(true);
        } else {
          alert("Booking failed: " + data.error);
        }
      })
      .catch(() => alert("Could not connect to the database server."));
  }

  if (!test) return null;

  if (done) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-xl font-body relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary-fixed" />
        
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
          ✓
        </div>
        
        <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-on-surface-variant/80 mb-6 leading-relaxed">
          Your appointment has been registered. ChooseMyLab diagnostic staff will reach out to you shortly.
        </p>

        <div className="divide-y divide-outline-variant/10 border-t border-b border-outline-variant/20 py-4 mb-6">
          {[
            ["Test Name", test.name],
            ["Accredited Lab", test.lab_name || test.lab],
            ["Branch Location", test.branch_name || test.address || test.loc],
            ["Schedule Date", date],
            ["Time Slot", slot],
            ["Price Paid", "₹" + test.price],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-2.5 text-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 font-headline">
                {k}
              </span>
              <span className="font-bold text-on-surface text-right truncate max-w-[200px]">{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPage("home")}
          className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-6 font-body">
      {/* Booking Header Card */}
      <div className="bg-surface border border-outline-variant/30 border-b-0 rounded-t-3xl p-6 flex justify-between items-center border-white">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 font-headline block mb-1">
            Diagnostic Booking
          </span>
          <h2 className="font-headline text-xl font-bold text-on-surface">{test.name}</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            {test.lab_name || test.lab} {test.branch_name ? `(${test.branch_name} Branch)` : ""}
          </p>
        </div>
        <div className="text-primary font-bold text-2xl">
          ₹{test.price}
        </div>
      </div>

      {/* Patient Entry Form */}
      <div className="bg-white border border-outline-variant/30 rounded-b-3xl p-6 md:p-8 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider block mb-2 font-headline">
                Patient Name *
              </label>
              <input
                placeholder="Full name"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider block mb-2 font-headline">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                value={pPhone}
                onChange={(e) => setPPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider block mb-2 font-headline">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider block mb-2 font-headline">
                Time Slot *
              </label>
              <select 
                value={slot} 
                onChange={(e) => setSlot(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold cursor-pointer"
              >
                <option value="">Select time</option>
                {SLOTS.map((s) => {
                  let isAvailable = true;
                  if (date && test.name.includes("Full Body Health Checkup")) {
                    const d = new Date(date);
                    if (d.getMonth() === 4 && d.getDate() === 16 && s === "12:00 PM") {
                      isAvailable = false;
                    }
                  }
                  if (date && new Date(date).getDay() === 0 && s === "10:00 AM") {
                    isAvailable = false;
                  }

                  return (
                    <option key={s} value={s} disabled={!isAvailable}>
                      {s} {isAvailable ? "" : "- Fully Booked"}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider block mb-2 font-headline">
              Notes (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Special instructions or medical requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold resize-none"
            />
          </div>

          <button
            onClick={submit}
            className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/25 active:scale-95 transition-all text-sm mt-4"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
