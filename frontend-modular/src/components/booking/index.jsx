import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';

export function Booking({ test, user, setPage, userLocation }) {
  const [pName, setPName] = useState(user?.name || "");
  const [pPhone, setPPhone] = useState(user?.phone || "");
  const [date, setDate] = useState(""); // YYYY-MM-DD format
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks visible month/year
  
  const today = new Date();
  const viewYear = currentDate.getFullYear();
  const viewMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  // Helper: Format date to standard string YYYY-MM-DD
  const formatDateString = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Helper: Check if date is in the past
  const isPastDate = (cellYear, cellMonth, cellDay) => {
    const cellDate = new Date(cellYear, cellMonth, cellDay);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < todayZero;
  };

  // Deterministic Mock Real-time Availability generator based on date string
  const getDateAvailability = (dateStr) => {
    if (!dateStr) return { totalSlots: 0, status: "Fully Booked", color: "red", label: "0 slots left", dot: "bg-red-500" };
    
    // Hash date string to get consistent mock availability values
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed += dateStr.charCodeAt(i) * (i + 1);
    }
    
    const slots = (seed % 10) + 1; // 1 to 10 slots
    
    // Make weekends have less slots
    const dayOfWeek = new Date(dateStr).getDay();
    const adjustedSlots = (dayOfWeek === 0 || dayOfWeek === 6) ? Math.max(0, slots - 4) : slots;

    if (adjustedSlots === 0) {
      return { totalSlots: 0, status: "Fully Booked", color: "red", label: "Fully Booked", dot: "bg-red-500" };
    } else if (adjustedSlots <= 3) {
      return { totalSlots: adjustedSlots, status: "Limited", color: "amber", label: `${adjustedSlots} left`, dot: "bg-amber-500 animate-pulse" };
    } else {
      return { totalSlots: adjustedSlots, status: "Available", color: "green", label: "Available", dot: "bg-emerald-500" };
    }
  };

  // Deterministic Mock Time Slot availability based on Date & Slot string
  const getTimeSlotAvailability = (dateStr, slotStr) => {
    if (!dateStr) return { status: "Available", disabled: false, text: "Available", badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    
    let seed = 0;
    const combined = dateStr + slotStr;
    for (let i = 0; i < combined.length; i++) {
      seed += combined.charCodeAt(i) * (i + 1);
    }
    
    const state = seed % 5;
    if (state === 0) {
      return { status: "Fully Booked", disabled: true, text: "Fully Booked", badgeClass: "bg-slate-100 text-slate-400 border border-slate-200" };
    } else if (state === 1) {
      return { status: "Fast Filling", disabled: false, text: "Fast Filling", badgeClass: "bg-amber-50 text-amber-600 border border-amber-200 animate-pulse" };
    } else if (state === 2) {
      return { status: "1 Slot Left", disabled: false, text: "Only 1 Slot Left!", badgeClass: "bg-rose-50 text-rose-600 border border-rose-100 font-bold" };
    } else {
      return { status: "Available", disabled: false, text: "Available", badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
    }
  };

  // Generate monthly calendar grid cells
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInViewMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDayIndex = getFirstDayOfMonth(viewMonth, viewYear);

  const prevMonthIndex = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthIndex, prevYear);

  const calendarCells = [];

  // Trailing days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      dayNum: daysInPrevMonth - i,
      month: prevMonthIndex,
      year: prevYear,
      isCurrentMonth: false
    });
  }

  // Days in current month
  for (let i = 1; i <= daysInViewMonth; i++) {
    calendarCells.push({
      dayNum: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true
    });
  }

  // Leading days from next month to keep a balanced 6-row grid
  const remainingCells = 42 - calendarCells.length;
  const nextMonthIndex = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      dayNum: i,
      month: nextMonthIndex,
      year: nextYear,
      isCurrentMonth: false
    });
  }

  // Shift Calendar Month handler
  const handleMonthShift = (direction) => {
    if (direction === "prev") {
      // Don't shift back into past months
      const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
      const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
      if (prevMonthDate >= minDate) {
        setCurrentDate(prevMonthDate);
      }
    } else {
      const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
      setCurrentDate(nextMonthDate);
    }
  };

  function submit() {
    if (!pName || !pPhone || !date || !slot) {
      alert("Please fill all required fields, select a Date, and pick a Time Slot!");
      return;
    }

    setLoading(true);
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
        setLoading(false);
        if (data.success) {
          setDone(true);
        } else {
          alert("Booking failed: " + data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("Could not connect to the database server.");
      });
  }

  if (!test) return null;

  if (done) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-xl font-body relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
        
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold border border-emerald-100">
          ✓
        </div>
        
        <h2 className="font-headline text-2xl font-black text-on-surface mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-on-surface-variant/80 mb-6 leading-relaxed">
          Your diagnostic appointment has been successfully registered. Our collection team will reach out to you shortly.
        </p>

        <div className="divide-y divide-outline-variant/10 border-t border-b border-outline-variant/20 py-4 mb-6">
          {[
            ["Test Requested", test.name],
            ["Accredited Lab", test.lab_name || test.lab],
            ["Branch Address", test.branch_name || test.address || test.loc],
            ["Appointment Date", new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
            ["Collection Slot", slot],
            ["Amount Paid", "₹" + test.price],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start py-2.5 text-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 font-headline mt-0.5">
                {k}
              </span>
              <span className="font-extrabold text-on-surface text-right truncate max-w-[200px] leading-tight">{v}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPage("home")}
          className="w-full py-4 bg-primary hover:bg-[#0a3e87] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 font-body">
      {/* Booking Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:justify-between md:items-center relative overflow-hidden shadow-lg mb-6">
        <div className="absolute top-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-900/30 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 font-headline block">
            Clinical Laboratory Booking
          </span>
          <h2 className="font-headline text-2xl font-black tracking-tight">{test.name}</h2>
          <p className="text-xs text-white/80 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm leading-none text-emerald-400">verified</span>
            {test.lab_name || test.lab} {test.branch_name ? `(${test.branch_name} Branch)` : ""}
          </p>
        </div>
        <div className="text-white font-black text-3xl mt-4 md:mt-0 border-t md:border-t-0 border-white/10 pt-4 md:pt-0 relative z-10 flex flex-col md:items-end">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/60 font-headline mb-0.5">Total Payable</span>
          <span>₹{test.price}</span>
        </div>
      </div>

      {/* Main Form + Premium Calendar Scheduler Grid */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl p-5 md:p-8 shadow-sm">
        <div className="space-y-8">
          
          {/* Patient Details Form Section */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-primary font-bold">1.</span> Patient Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-wider block mb-2 font-headline">
                  Patient Full Name *
                </label>
                <input
                  placeholder="E.g. Divyansh Gahlot"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-semibold focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-wider block mb-2 font-headline">
                  Patient Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={pPhone}
                  onChange={(e) => setPPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-semibold focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Interactive Scheduler Section */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-primary font-bold">2.</span> Choose Date & Time Slot
            </h3>
            
            {/* Desktop side-by-side or mobile stacked scheduler grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Premium Monthly Calendar Component */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200/50 rounded-3xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500 leading-none">
                    {monthNames[viewMonth]} {viewYear}
                  </h4>
                  <div className="flex gap-1">
                    <button 
                      type="button"
                      onClick={() => handleMonthShift("prev")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                      disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
                    >
                      <span className="material-symbols-outlined text-sm block leading-none">chevron_left</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleMonthShift("next")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm block leading-none">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-[10px] font-bold uppercase text-slate-400 py-1 font-headline">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, idx) => {
                    const formatted = formatDateString(cell.year, cell.month, cell.dayNum);
                    const isSelected = date === formatted;
                    const isPast = isPastDate(cell.year, cell.month, cell.dayNum);
                    const availability = getDateAvailability(formatted);
                    const isFullyBooked = availability.totalSlots === 0;

                    let dayStyle = "bg-white hover:bg-slate-100 border border-slate-100 cursor-pointer text-slate-700 active:scale-95";
                    if (!cell.isCurrentMonth) {
                      dayStyle = "bg-slate-100/50 hover:bg-slate-100 border border-transparent cursor-pointer text-slate-400";
                    }
                    if (isPast) {
                      dayStyle = "text-slate-300 opacity-40 pointer-events-none border-transparent bg-transparent";
                    } else if (isFullyBooked) {
                      dayStyle = "bg-red-50/20 text-slate-400 opacity-60 line-through border-red-50/40 cursor-not-allowed pointer-events-none";
                    } else if (isSelected) {
                      dayStyle = "bg-primary text-white hover:bg-primary border-primary shadow-md shadow-primary/20 scale-105 font-bold z-10";
                    }

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (!isPast && !isFullyBooked) {
                            setDate(formatted);
                            setSlot(""); // Clear previous slot on date change
                          }
                        }}
                        className={`aspect-square rounded-2xl flex flex-col justify-center items-center relative transition-all duration-150 select-none ${dayStyle}`}
                      >
                        <span className="text-xs font-headline font-semibold">{cell.dayNum}</span>
                        {!isPast && !isFullyBooked && (
                          <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : availability.dot}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Picker Component */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-5 min-h-[295px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500 leading-none">
                        Collection Slots
                      </h4>
                      {date && (
                        <span className="text-[10px] font-black uppercase text-[#0c4ca6] leading-none bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-headline">
                          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {!date ? (
                      <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-white">
                        <span className="material-symbols-outlined text-3xl text-slate-300">calendar_today</span>
                        <span className="text-xs font-bold font-headline leading-tight">Please select a date on the calendar first</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                        {SLOTS.map((s) => {
                          const slotAvailability = getTimeSlotAvailability(date, s);
                          const isSlotSelected = slot === s;
                          const disabled = slotAvailability.disabled;

                          let cardStyle = "bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 cursor-pointer active:scale-95";
                          if (disabled) {
                            cardStyle = "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50";
                          } else if (isSlotSelected) {
                            cardStyle = "bg-[#0c4ca6] hover:bg-[#0c4ca6] border-[#0c4ca6] text-white shadow-md shadow-blue-500/10 scale-[1.02]";
                          }

                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                if (!disabled) setSlot(s);
                              }}
                              disabled={disabled}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none ${cardStyle}`}
                            >
                              <span className="text-xs font-bold font-headline leading-none">{s}</span>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md font-headline leading-none ${isSlotSelected ? 'bg-white/20 text-white border border-white/10' : slotAvailability.badgeClass}`}>
                                {slotAvailability.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {date && (
                    <div className="border-t border-slate-200/50 pt-3 mt-3 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0" />
                      <div className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Availability is dynamic. Select a date to view current active time capacities.
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2.5">
            <label className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-wider block font-headline">
              Collection Notes (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Special instructions, gate codes, medical requests, or symptoms description..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-semibold focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Confirm Booking CTA */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-[#0a3e87] text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm mt-4 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="animate-spin text-sm leading-none">⏳</span>
                <span>Booking in progress...</span>
              </>
            ) : (
              <span>Confirm Appointment Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
