import React, { useState, useEffect } from 'react';
import { S } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';

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
    fetch(`${API_BASE_URL}/api/user/${user.id}/dashboard`)
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
    fetch(`${API_BASE_URL}/api/user/${user.id}/dashboard`)
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
  const [hoveredIdx, setHoveredIdx] = useState(null);

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
    fetch(`${API_BASE_URL}/api/user/${user.id}`, {
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

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const menuItems = [
    {
      title: "My Reports",
      desc: "View your generated medical lab results",
      icon: "📄",
      page: "reports-page",
      bg: "rgba(37, 99, 235, 0.07)",
      color: "var(--lime)",
    },
    {
      title: "My Bookings",
      desc: "Track and reschedule your diagnostics",
      icon: "📋",
      page: "bookings-page",
      bg: "rgba(139, 92, 246, 0.07)",
      color: "#8b5cf6",
    },
    {
      title: "Personal Information",
      desc: "Edit your account and contact details",
      icon: "👤",
      action: () => setEditMode(true),
      bg: "rgba(20, 184, 166, 0.07)",
      color: "#14b8a6",
    },
  ];

  return (
    <div className="fu" style={{ maxWidth: 480, margin: "0 auto", padding: "0 10px" }}>
      {/* Header section with Premium Blue Gradient and Glassmorphism */}
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          borderRadius: 20,
          padding: "28px 24px",
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background abstract shapes */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
          }}
        />

        {/* Initials avatar with glass borders */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(255, 255, 255, 0.25)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 26,
            fontFamily: "var(--fb)",
            marginBottom: 16,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {initials || "?"}
        </div>

        <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>
          {name}
        </div>
        <div style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: 12, fontFamily: "var(--fm)", marginTop: 4 }}>
          {user.email}
        </div>
        {phone && (
          <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <span>📞</span> {phone}
          </div>
        )}

        <div
          style={{
            marginTop: 14,
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            fontSize: 10,
            fontFamily: "var(--fm)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 99,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>✓</span> Verified Profile
        </div>
      </div>

      {saved && (
        <div
          style={{
            background: "rgba(34,197,94,.1)",
            border: "1px solid rgba(34,197,94,.3)",
            color: "#16a34a",
            ...S.mono,
            fontSize: 13,
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Main Options / Edit Form */}
      {!editMode ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {menuItems.map((item, index) => {
            const isHovered = hoveredIdx === index;
            return (
              <button
                key={index}
                onClick={item.action ? item.action : () => setPage(item.page)}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--text)",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isHovered ? "0 8px 24px rgba(0, 0, 0, 0.04)" : "none",
                  transform: isHovered ? "translateY(-2px)" : "none",
                  borderColor: isHovered ? "var(--lime)" : "var(--border)",
                }}
              >
                {/* Modern Circular Icon Badging */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                    transition: "transform 0.25s",
                    transform: isHovered ? "scale(1.08)" : "none",
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ marginLeft: 16, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{item.title}</div>
                  <div style={{ ...S.muted, fontSize: 11, fontWeight: 400, marginTop: 2 }}>{item.desc}</div>
                </div>

                <span
                  style={{
                    fontSize: 16,
                    color: isHovered ? "var(--lime)" : "var(--muted)",
                    transition: "transform 0.2s",
                    transform: isHovered ? "translateX(4px)" : "none",
                  }}
                >
                  →
                </span>
              </button>
            );
          })}

          {/* Premium styled Logout Card */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredIdx("logout")}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              border: "1px dashed rgba(239, 68, 68, 0.25)",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              color: "var(--danger)",
              textAlign: "left",
              width: "100%",
              transition: "all 0.25s",
              marginTop: 10,
              borderColor: hoveredIdx === "logout" ? "var(--danger)" : "rgba(239, 68, 68, 0.25)",
              background: hoveredIdx === "logout" ? "rgba(239, 68, 68, 0.06)" : "rgba(239, 68, 68, 0.03)",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.08)",
                color: "var(--danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🚪
            </div>
            <div style={{ marginLeft: 16, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Logout</div>
              <div style={{ color: "rgba(239, 68, 68, 0.6)", fontSize: 11, fontWeight: 400, marginTop: 2 }}>Securely sign out of your account</div>
            </div>
            <span style={{ fontSize: 16, opacity: hoveredIdx === "logout" ? 1 : 0.6 }}>→</span>
          </button>
        </div>
      ) : (
        <DashCard title="Edit Personal Information" icon="👤">
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

          {/* Email */}
          <div style={{ padding: "12px 0" }}>
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
              🔒 {user.email} (read-only)
            </div>
          </div>

          {/* Name */}
          <div style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
            <div
              style={{
                ...S.muted,
                ...S.mono,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 8,
              }}
            >
              Full Name
            </div>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErr("");
              }}
              placeholder="Your full name"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
            <div
              style={{
                ...S.muted,
                ...S.mono,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 8,
              }}
            >
              Phone Number
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErr("");
              }}
              placeholder="10-digit mobile"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              className="bl"
              onClick={saveProfile}
              disabled={saving}
              style={{ flex: 1, padding: 12, fontSize: 13 }}
            >
              {saving ? "Saving…" : "Save Changes →"}
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setErr("");
              }}
              style={{
                padding: "12px 20px",
                background: "none",
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "var(--fb)",
                fontSize: 13,
                color: "var(--text)",
              }}
            >
              Cancel
            </button>
          </div>
        </DashCard>
      )}
    </div>
  );
}

