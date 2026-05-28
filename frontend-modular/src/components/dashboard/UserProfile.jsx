import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';

export function UserProfile({ user, setPage, setUser }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center font-body">
        <p className="text-on-surface-variant font-semibold mb-4">
          Please{" "}
          <button onClick={() => setPage("signup")} className="text-primary font-bold hover:underline">
            log in
          </button>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

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
          setUser(d.user);
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
      color: "var(--primary)",
    },
    {
      title: "My Bookings",
      desc: "Track and reschedule your diagnostics",
      icon: "📋",
      page: "bookings-page",
      bg: "rgba(139, 92, 246, 0.07)",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="max-w-md mx-auto py-10 px-4 font-body">
      {/* Header section with Premium Blue Gradient and Glassmorphism */}
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-3xl p-6 md:p-8 mb-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -ml-12 -mb-12" />

        {/* Avatar badge */}
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-extrabold text-2xl mb-4 shadow-md font-headline">
          {initials || "?"}
        </div>

        <h2 className="font-headline font-bold text-xl tracking-tight leading-none mb-1">
          {name}
        </h2>
        <p className="text-xs text-white/70 font-semibold mb-3">
          {user.email}
        </p>
        {phone && (
          <div className="text-xs font-semibold flex items-center gap-1.5 opacity-90">
            <span>📞</span> {phone}
          </div>
        )}

        <div className="mt-4 bg-white/10 border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1">
          <span>✓</span> Verified Profile
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-secondary text-xs font-bold px-4 py-3 rounded-2xl mb-4 text-center">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Main Options / Edit Form */}
      {!editMode ? (
        <div className="space-y-4">
          {menuItems.map((item, index) => {
            const isHovered = hoveredIdx === index;
            return (
              <button
                key={index}
                onClick={() => setPage(item.page)}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`w-full bg-white border rounded-3xl p-5 flex items-center text-left transition-all duration-200 shadow-sm border-white ${
                  isHovered ? "border-primary/30 -translate-y-0.5 shadow-md" : "border-transparent"
                }`}
              >
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>

                <div className="ml-4 flex-1">
                  <h4 className="font-headline font-bold text-sm text-on-surface">{item.title}</h4>
                  <p className="text-[11px] text-on-surface-variant/75 mt-1 font-semibold">{item.desc}</p>
                </div>

                <span className="text-on-surface-variant/50 text-sm font-bold">→</span>
              </button>
            );
          })}

          {/* Edit Button */}
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-white border border-outline-variant/30 rounded-3xl p-5 flex items-center text-left hover:-translate-y-0.5 transition-all shadow-sm border-white"
          >
            <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
              👤
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-headline font-bold text-sm text-on-surface">Edit Profile</h4>
              <p className="text-[11px] text-on-surface-variant/75 mt-1 font-semibold">Change your account contact details</p>
            </div>
            <span className="text-on-surface-variant/50 text-sm font-bold">→</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50/30 border border-red-100 hover:border-red-200 rounded-3xl p-5 flex items-center text-left hover:-translate-y-0.5 transition-all shadow-sm text-error"
          >
            <div className="w-11 h-11 rounded-full bg-red-100/50 text-error flex items-center justify-center text-xl flex-shrink-0">
              🚪
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-headline font-bold text-sm">Logout</h4>
              <p className="text-[11px] text-red-500/80 mt-1 font-semibold">Securely sign out of your account</p>
            </div>
            <span className="text-error/70 text-sm font-bold">→</span>
          </button>
        </div>
      ) : (
        /* Edit Mode details card */
        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Edit Profile</h3>
          
          {err && (
            <div className="bg-red-50 border border-red-200 text-error text-xs font-semibold px-3 py-2 rounded-xl mb-4">
              ⚠ {err}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-1">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={saveProfile}
                disabled={saving}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button 
                onClick={() => setEditMode(false)}
                className="px-5 py-2 border border-outline-variant text-on-surface-variant/80 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
