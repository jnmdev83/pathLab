import React, { useState, useEffect } from 'react';
import { S } from '../../utils/reusables';

// USER DASHBOARD PAGES
export function DashCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--border)",
        borderRadius: 12,
        padding: 24,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 14,
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ ...S.serif, fontSize: 20 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

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
    fetch(`http://localhost:5000/api/user/${user.id}/dashboard`)
      .then((r) => r.json())
      .then((d) => setData(d));
  };
  useEffect(load, [user]);

  const reschedule = () => {
    if (!reschedDate || !reschedSlot) {
      setReschedErr("Please pick a date and time.");
      return;
    }
    fetch(
      `http://localhost:5000/api/bookings/${selectedBooking.id}/reschedule`,
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

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>
          Please{" "}
          <button
            onClick={() => setPage("signup")}
            style={{
              border: "none",
              background: "none",
              color: "var(--lime)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            log in
          </button>{" "}
          to view your bookings.
        </p>
      </div>
    );

  return (
    <div className="fu" style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ ...S.serif, fontSize: 30, marginBottom: 20 }}>
        My Bookings
      </h1>
      <DashCard title="Appointment History" icon="📋">
        {!data ? (
          <div style={{ ...S.muted, fontSize: 13 }}>Loading…</div>
        ) : data.bookings.length === 0 ? (
          <div style={{ ...S.muted, fontSize: 13 }}>No bookings yet.</div>
        ) : (
          data.bookings.map((b) => (
            <div key={b.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedBooking(selectedBooking?.id === b.id ? null : b);
                  setReschedDate("");
                  setReschedSlot("");
                  setReschedDone(false);
                  setReschedErr("");
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {b.test_name}
                  </div>
                  <div
                    style={{
                      ...S.muted,
                      ...S.mono,
                      fontSize: 11,
                      marginTop: 3,
                    }}
                  >
                    {b.lab} · {b.booking_date?.slice(0, 10)} · {b.time_slot}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ ...S.mono, fontWeight: 600, ...S.lime }}>
                    ₹{b.price}
                  </span>
                  <span
                    style={{
                      ...S.pill,
                      background:
                        b.status === "completed"
                          ? "rgba(34,197,94,.12)"
                          : "rgba(245,158,11,.12)",
                      color: b.status === "completed" ? "#16a34a" : "#d97706",
                      fontSize: 10,
                      padding: "3px 10px",
                    }}
                  >
                    {b.status}
                  </span>
                  <span style={{ ...S.muted, fontSize: 12 }}>
                    {selectedBooking?.id === b.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expandable Detail + Reschedule Panel */}
              {selectedBooking?.id === b.id && (
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 20,
                    margin: "10px 0 6px",
                    animation: "fadeIn .15s",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    {[
                      ["Test Name", b.test_name],
                      ["Lab / Clinic", b.lab],
                      ["Patient Name", b.patient_name],
                      ["Phone", b.patient_phone],
                      ["Date", b.booking_date?.slice(0, 10)],
                      ["Time Slot", b.time_slot],
                      ["Status", b.status],
                      ["Amount", "₹" + b.price],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div
                          style={{
                            ...S.muted,
                            ...S.mono,
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: ".07em",
                            marginBottom: 2,
                          }}
                        >
                          {k}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {b.status !== "completed" && (
                    <>
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          paddingTop: 16,
                          marginTop: 4,
                        }}
                      >
                        <div
                          style={{
                            ...S.muted,
                            ...S.mono,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: ".07em",
                            marginBottom: 12,
                            fontWeight: 700,
                          }}
                        >
                          Reschedule Appointment
                        </div>
                        {reschedErr && (
                          <div
                            style={{
                              color: "var(--danger)",
                              ...S.mono,
                              fontSize: 12,
                              marginBottom: 10,
                            }}
                          >
                            ⚠ {reschedErr}
                          </div>
                        )}
                        {reschedDone && (
                          <div
                            style={{
                              color: "#16a34a",
                              ...S.mono,
                              fontSize: 12,
                              marginBottom: 10,
                            }}
                          >
                            ✓ Rescheduled successfully!
                          </div>
                        )}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                            marginBottom: 14,
                          }}
                        >
                          <div>
                            <label>New Date</label>
                            <input
                              type="date"
                              value={reschedDate}
                              onChange={(e) => {
                                setReschedDate(e.target.value);
                                setReschedErr("");
                              }}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div>
                            <label>New Time Slot</label>
                            <select
                              value={reschedSlot}
                              onChange={(e) => {
                                setReschedSlot(e.target.value);
                                setReschedErr("");
                              }}
                            >
                              <option value="">Select time</option>
                              {SLOTS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          className="bl"
                          onClick={reschedule}
                          style={{ padding: "9px 22px", fontSize: 13 }}
                        >
                          Confirm Reschedule →
                        </button>
                      </div>
                    </>
                  )}
                  {b.status === "completed" && (
                    <div
                      style={{
                        ...S.muted,
                        fontSize: 12,
                        marginTop: 8,
                        fontStyle: "italic",
                      }}
                    >
                      ✅ This appointment is completed and cannot be
                      rescheduled.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </DashCard>
    </div>
  );
}

export function UserReports({ user, setPage }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/user/${user.id}/dashboard`)
      .then((r) => r.json())
      .then((d) => setData(d));
  }, [user]);

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>
          Please{" "}
          <button
            onClick={() => setPage("signup")}
            style={{
              border: "none",
              background: "none",
              color: "var(--lime)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            log in
          </button>{" "}
          to view your reports.
        </p>
      </div>
    );

  return (
    <div className="fu" style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ ...S.serif, fontSize: 30, marginBottom: 20 }}>My Reports</h1>
      <DashCard title="Lab Reports" icon="📄">
        {!data ? (
          <div style={{ ...S.muted, fontSize: 13 }}>Loading…</div>
        ) : data.reports.length === 0 ? (
          <div style={{ ...S.muted, fontSize: 13 }}>
            No reports available yet.
          </div>
        ) : (
          data.reports.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "14px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {r.test_name}
                  </div>
                  <div
                    style={{
                      ...S.muted,
                      ...S.mono,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {r.lab} · {r.date_generated?.slice(0, 10)}
                  </div>
                </div>
                <a
                  href={r.report_url}
                  style={{
                    ...S.pill,
                    background: "rgba(37,99,235,.1)",
                    color: "var(--lime)",
                    fontSize: 10,
                    padding: "4px 10px",
                    textDecoration: "none",
                  }}
                >
                  Download PDF
                </a>
              </div>
              {r.result_summary && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    ...S.muted,
                    lineHeight: 1.6,
                    background: "var(--surface)",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  📝 {r.result_summary}
                </div>
              )}
            </div>
          ))
        )}
      </DashCard>
    </div>
  );
}

export function UserProfile({ user, setPage, setUser }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>
          Please{" "}
          <button
            onClick={() => setPage("signup")}
            style={{
              border: "none",
              background: "none",
              color: "var(--lime)",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            log in
          </button>{" "}
          to view your profile.
        </p>
      </div>
    );

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = () => {
    if (!name.trim()) {
      setErr("Name cannot be empty.");
      return;
    }
    setSaving(true);
    setErr("");
    fetch(`http://localhost:5000/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
    })
      .then((r) => r.json())
      .then((d) => {
        setSaving(false);
        if (d.success) {
          setUser(d.user); // Update app-level user state + localStorage
          setSaved(true);
          setEditMode(false);
          setTimeout(() => setSaved(false), 3000);
        } else setErr(d.error || "Update failed.");
      })
      .catch(() => {
        setSaving(false);
        setErr("Server error.");
      });
  };

  return (
    <div className="fu" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ ...S.serif, fontSize: 30, marginBottom: 20 }}>
        Personal Information
      </h1>

      {saved && (
        <div
          style={{
            background: "rgba(34,197,94,.1)",
            border: "1px solid rgba(34,197,94,.3)",
            color: "#16a34a",
            ...S.mono,
            fontSize: 13,
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          ✓ Profile updated successfully!
        </div>
      )}

      <DashCard title="Profile" icon="👤">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: "var(--lime)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 22,
                fontFamily: "var(--fb)",
              }}
            >
              {initials || "?"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{name}</div>
              <div
                style={{ ...S.muted, ...S.mono, fontSize: 12, marginTop: 2 }}
              >
                Verified Patient Account
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditMode((e) => !e);
              setErr("");
              setSaved(false);
            }}
            style={{
              background: "none",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: "var(--fb)",
              fontSize: 12,
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            {editMode ? "Cancel" : "✏ Edit"}
          </button>
        </div>

        {err && (
          <div
            style={{
              color: "var(--danger)",
              ...S.mono,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            ⚠ {err}
          </div>
        )}

        {/* Email (read-only always) */}
        <div
          style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 4,
            }}
          >
            Email Address
          </div>
          <div style={{ fontWeight: 500, fontSize: 13, ...S.muted }}>
            🔒 {user.email}{" "}
            <span style={{ fontSize: 10 }}>(cannot be changed)</span>
          </div>
        </div>

        {/* Name */}
        <div
          style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 4,
            }}
          >
            Full Name
          </div>
          {editMode ? (
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErr("");
              }}
              placeholder="Your full name"
            />
          ) : (
            <div style={{ fontWeight: 500, fontSize: 13 }}>{name}</div>
          )}
        </div>

        {/* Phone */}
        <div
          style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 4,
            }}
          >
            Phone Number
          </div>
          {editMode ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErr("");
              }}
              placeholder="10-digit mobile"
            />
          ) : (
            <div style={{ fontWeight: 500, fontSize: 13 }}>
              {phone || <span style={S.muted}>Not provided</span>}
            </div>
          )}
        </div>

        {editMode && (
          <button
            className="bl"
            onClick={saveProfile}
            disabled={saving}
            style={{ width: "100%", padding: 12, marginTop: 16, fontSize: 14 }}
          >
            {saving ? "Saving…" : "Save Changes →"}
          </button>
        )}
      </DashCard>
    </div>
  );
}

