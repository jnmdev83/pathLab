import React, { useState } from 'react';
import { S } from '../../utils/reusables';

// BOOKING PAGE
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

    fetch("http://localhost:5000/api/bookings", {
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
      <div
        className="fu"
        style={{
          maxWidth: 460,
          margin: "48px auto",
          background: "var(--card)",
          border: "1.5px solid var(--lime)",
          padding: 36,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--lime)",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          ✓
        </div>
        <h2 style={{ ...S.serif, fontSize: 26, marginBottom: 6 }}>
          Booking Received!
        </h2>
        <p
          style={{
            ...S.muted,
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.65,
          }}
        >
          Our team will call you shortly to confirm your appointment.
        </p>
        {[
          ["Test", test.name],
          ["Lab", test.lab_name || test.lab],
          ["Branch", test.branch_name || test.address || test.loc],
          ["Date", date],
          ["Time", slot],
          ["Price", "₹" + test.price],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
              fontSize: 13,
            }}
          >
            <span
              style={{
                ...S.muted,
                ...S.mono,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              {k}
            </span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <button
          className="bl"
          onClick={() => setPage("home")}
          style={{ width: "100%", padding: 12, marginTop: 22 }}
        >
          Back to Home →
        </button>
      </div>
    );
  }

  return (
    <div className="fu" style={{ maxWidth: 580, margin: "0 auto" }}>
      {/* Header bar */}
      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderBottom: "none",
          padding: "14px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 3,
            }}
          >
            Booking
          </div>
          <div style={{ ...S.serif, fontSize: 19 }}>{test.name}</div>
          <div style={{ ...S.muted, fontSize: 12, marginTop: 4 }}>
            {test.lab_name || test.lab} {test.branch_name ? `- ${test.branch_name} Branch` : ""}
          </div>
          {test.address && (
            <div style={{ ...S.muted, ...S.mono, fontSize: 11, marginTop: 4 }}>
              {test.address}
            </div>
          )}
        </div>
        <div style={{ ...S.mono, fontSize: 24, ...S.lime, fontWeight: 500 }}>
          ₹{test.price}
        </div>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          padding: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label>Patient Name *</label>
              <input
                placeholder="Full name"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
              />
            </div>
            <div>
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                value={pPhone}
                onChange={(e) => setPPhone(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label>Time Slot *</label>
              <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                <option value="">Select time</option>
                {SLOTS.map((s) => {
                  // Dummy availability logic:
                  // If it's May 16th and the user is trying to book the "Full Body Health Checkup", disable 12:00 PM
                  let isAvailable = true;
                  if (date && test.name.includes("Full Body Health Checkup")) {
                    const d = new Date(date);
                    if (
                      d.getMonth() === 4 &&
                      d.getDate() === 16 &&
                      s === "12:00 PM"
                    ) {
                      isAvailable = false;
                    }
                  }

                  // Also add a random dummy "unavailable" slot to show the feature everywhere
                  if (
                    date &&
                    new Date(date).getDay() === 0 &&
                    s === "10:00 AM"
                  ) {
                    isAvailable = false; // 10 AM on Sundays is always full
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
            <label>Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="Special instructions…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>
          <button
            className="bl"
            onClick={submit}
            style={{ padding: 13, fontSize: 14, width: "100%" }}
          >
            Confirm Booking →
          </button>
        </div>
      </div>
    </div>
  );
}

