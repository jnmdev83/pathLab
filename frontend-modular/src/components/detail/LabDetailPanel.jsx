import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../../config';

// ─── Accreditation chip colour map ──────────────────────────────────────────
const ACCRED_COLORS = {
  'NABL':     { bg: '#e8f5e9', text: '#1b5e20', border: '#a5d6a7' },
  'ISO 15189':{ bg: '#e3f2fd', text: '#0d47a1', border: '#90caf9' },
  'CAP':      { bg: '#fce4ec', text: '#880e4f', border: '#f48fb1' },
  'JCI':      { bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  'ISO 9001': { bg: '#f3e5f5', text: '#4a148c', border: '#ce93d8' },
  'NABH':     { bg: '#e0f7fa', text: '#006064', border: '#80deea' },
  'ILAC':     { bg: '#e8eaf6', text: '#1a237e', border: '#9fa8da' },
};

// ─── Lab type badge ──────────────────────────────────────────────────────────
const LAB_TYPE_LABEL = {
  pathology:        { icon: 'biotech',         label: 'Pathology Lab' },
  radiology:        { icon: 'radar',           label: 'Imaging Centre' },
  'multi-specialty':{ icon: 'local_hospital',  label: 'Multi-Specialty' },
};

// ─── Logo colour per name ─────────────────────────────────────────────────────
function getLabAccentColor(labName = '') {
  const n = labName.toLowerCase();
  if (n.includes('apollo'))    return { bg: '#e0f4f1', accent: '#0e9f84' };
  if (n.includes('lal'))       return { bg: '#fff3e0', accent: '#f57c00' };
  if (n.includes('thyro'))     return { bg: '#fce4ec', accent: '#e91e63' };
  if (n.includes('srl'))       return { bg: '#e8eaf6', accent: '#3949ab' };
  if (n.includes('max'))       return { bg: '#fce4ec', accent: '#c62828' };
  if (n.includes('ganesh'))    return { bg: '#e8f5e9', accent: '#388e3c' };
  if (n.includes('health'))    return { bg: '#e3f2fd', accent: '#1565c0' };
  if (n.includes('redcliffe')) return { bg: '#fce4ec', accent: '#d32f2f' };
  if (n.includes('indira'))    return { bg: '#f3e5f5', accent: '#7b1fa2' };
  if (n.includes('dang'))      return { bg: '#fff8e1', accent: '#f9a825' };
  if (n.includes('mahajan'))   return { bg: '#e8f5e9', accent: '#2e7d32' };
  if (n.includes('pathkind'))  return { bg: '#e0f2f1', accent: '#00796b' };
  return { bg: '#e8eaf6', accent: '#3949ab' };
}

// ─── Full-Screen Image Lightbox ───────────────────────────────────────────────
function ImageLightbox({ images, startIndex, onClose }) {
  const [active, setActive] = useState(startIndex || 0);
  const [lightVisible, setLightVisible] = useState(false);
  const touchStartX = useRef(null);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setLightVisible(true), 15);
    return () => clearTimeout(t);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightVisible(false);
    setTimeout(onClose, 220);
  }, [onClose]);

  // ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeLightbox]);

  // Mobile back button / history.back() intercept
  useEffect(() => {
    // Push a dummy history state so back button triggers popstate
    window.history.pushState({ lightbox: true }, '');
    const handler = (e) => {
      // If state popped is not lightbox (user pressed back), close
      if (!e.state?.lightbox) closeLightbox();
    };
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      // Clean up the dummy state if lightbox closes normally
      if (window.history.state?.lightbox) {
        window.history.back();
      }
    };
  }, [closeLightbox]);

  // Touch swipe on mobile
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setActive(p => (p + 1) % images.length);
      else        setActive(p => (p - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  const prev = () => setActive(p => (p - 1 + images.length) % images.length);
  const next = () => setActive(p => (p + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: lightVisible ? 'rgba(0,0,0,0.96)' : 'rgba(0,0,0,0)',
        transition: 'background 0.22s ease',
      }}
      onClick={closeLightbox}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
        onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
      >
        <span className="material-symbols-outlined text-white text-xl">close</span>
      </button>

      {/* ESC hint */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-bold tracking-widest uppercase select-none hidden sm:block"
        style={{ opacity: lightVisible ? 1 : 0, transition: 'opacity 0.3s ease 0.2s' }}
      >
        Press ESC to close
      </div>

      {/* Image */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-16"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          opacity: lightVisible ? 1 : 0,
          transform: lightVisible ? 'scale(1)' : 'scale(0.94)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        <img
          key={active}
          src={images[active]}
          alt={`Lab facility ${active + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
          style={{ animation: 'fadeIn 0.2s ease' }}
          draggable={false}
        />
      </div>

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <span className="material-symbols-outlined text-white text-xl">chevron_left</span>
          </button>
          <button
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <span className="material-symbols-outlined text-white text-xl">chevron_right</span>
          </button>
        </>
      )}

      {/* Counter + dots */}
      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2">
        <div className="text-white/60 text-xs font-bold">{active + 1} / {images.length}</div>
        {images.length > 1 && (
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === active ? '#fff' : 'rgba(255,255,255,0.35)',
                  transform: i === active ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ─── Thumbnail Gallery (clickable to open lightbox) ───────────────────────────
function ImageGallery({ images, onImageClick }) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return null;

  const handleClick = (e) => {
    // Ignore clicks on navigation arrows / dots
    if (e.target.closest('button')) return;
    onImageClick(active);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-5 cursor-zoom-in"
      style={{ height: 180 }}
      onClick={handleClick}
    >
      <img
        src={images[active]}
        alt="Lab facility"
        className="w-full h-full object-cover transition-all duration-500"
        style={{ filter: 'brightness(0.90)' }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.40) 0%, transparent 55%)' }}
      />

      {/* Expand icon hint */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
        <span className="material-symbols-outlined text-white text-sm">open_in_full</span>
      </div>

      {/* Photo count badge */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
          <span className="material-symbols-outlined text-[11px]">photo_library</span>
          {images.length}
        </div>
      )}

      {/* Dot nav */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: i === active ? '#fff' : 'rgba(255,255,255,0.45)',
                transform: i === active ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}

      {/* Arrow nav */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setActive(p => (p - 1 + images.length) % images.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-[#1f2937]">chevron_left</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActive(p => (p + 1) % images.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-[#1f2937]">chevron_right</span>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main LabDetailPanel Component ────────────────────────────────────────────
export function LabDetailPanel({ labId, labName, onClose, onBook, testName, testPrice }) {
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [visible, setVisible]       = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null); // null = closed
  const panelRef = useRef(null);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Fetch profile
  useEffect(() => {
    if (!labId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/labs/${labId}/profile`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => { setError('Could not load lab details'); setLoading(false); });
  }, [labId]);

  // ESC closes the panel itself (only when lightbox is NOT open)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && lightboxIdx === null) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx]);

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) handleClose(); };
  const handleClose = () => { setVisible(false); setTimeout(onClose, 280); };

  const accent      = getLabAccentColor(labName || profile?.lab_name || '');
  const labTypeInfo = LAB_TYPE_LABEL[profile?.lab_type] || LAB_TYPE_LABEL.pathology;

  return (
    <>
      {/* ── Lightbox (rendered outside the panel, full z-index) ── */}
      {lightboxIdx !== null && profile?.images?.length > 0 && (
        <ImageLightbox
          images={profile.images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      {/* ── Panel backdrop ── */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{
          background: visible ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0)',
          transition: 'background 0.28s ease',
          backdropFilter: 'blur(3px)',
        }}
        onClick={handleBackdrop}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          className="relative w-full sm:w-[520px] overflow-y-auto hide-scrollbar bg-white rounded-t-3xl sm:rounded-3xl"
          style={{
            maxHeight: '92vh',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.97)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.30s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Handle bar (mobile) ── */}
          <div className="flex sm:hidden justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-[#e0e0e0] rounded-full" />
          </div>

          {/* ── Header bar ── */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f1f3f4] sticky top-0 bg-white z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af]">Lab Profile</span>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-[#6b7280]">close</span>
            </button>
          </div>

          {/* ── Content ── */}
          <div className="px-5 py-4">

            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-44 bg-[#f1f3f4] rounded-2xl" />
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#f1f3f4] rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#f1f3f4] rounded w-3/4" />
                    <div className="h-3 bg-[#f8f9fa] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-[#f1f3f4] rounded w-full" />
                <div className="h-3 bg-[#f8f9fa] rounded w-5/6" />
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-[#f1f3f4] rounded-xl" />)}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-[#d1d5db] block mb-3">error</span>
                <p className="text-sm text-[#6b7280]">{error}</p>
                <button onClick={handleClose} className="mt-4 text-xs font-bold text-[#00535b] underline">Close</button>
              </div>
            ) : (
              <>
                {/* Clickable Image Gallery */}
                <ImageGallery
                  images={profile.images}
                  onImageClick={(idx) => setLightboxIdx(idx)}
                />

                {/* Lab identity block */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div
                    className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex-shrink-0 flex items-center justify-center font-black shadow-sm border border-white"
                    style={{ background: accent.bg, color: accent.accent, fontSize: 20, fontFamily: 'sans-serif' }}
                  >
                    {profile.lab_name?.[0]?.toUpperCase() || 'L'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-[#1f2937] leading-snug mb-0.5">{profile.lab_name}</h2>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed">{profile.tagline}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[11px] font-black text-[#1f2937]">{profile.rating}</span>
                      <span className="text-[10px] text-[#9ca3af]">({(profile.review_count).toLocaleString('en-IN')} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.established_year && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#374151] bg-[#f8f9fa] border border-[#e8eaed] px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[10px] text-[#00535b]">calendar_today</span>
                      Est. {profile.established_year}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#374151] bg-[#f8f9fa] border border-[#e8eaed] px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[10px] text-[#00535b]">{labTypeInfo.icon}</span>
                    {labTypeInfo.label}
                  </span>
                  {profile.is_verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#286d67] bg-[#e8f8ed] border border-[#286d67]/20 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Verified
                    </span>
                  )}
                </div>

                {/* Accreditations */}
                {profile.accreditations?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af] mb-1.5">Accreditations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.accreditations.map(acc => {
                        const c = ACCRED_COLORS[acc] || { bg: '#f1f3f4', text: '#374151', border: '#e8eaed' };
                        return (
                          <span
                            key={acc}
                            className="text-[10px] font-black px-2.5 py-0.5 rounded-lg border"
                            style={{ background: c.bg, color: c.text, borderColor: c.border }}
                          >
                            {acc}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: 'corporate_fare', label: `${profile.total_branches?.toLocaleString('en-IN')}+`, sub: 'Branches' },
                    { icon: 'science',        label: `${profile.tests_offered?.toLocaleString('en-IN')}+`,  sub: 'Tests' },
                    { icon: 'schedule',       label: `${profile.report_time_hours}h`,                        sub: 'Avg Reports' },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#f8f9fa] border border-[#e8eaed] rounded-xl p-2.5 text-center">
                      <span className="material-symbols-outlined text-[#00535b] text-base mb-0.5 block" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      <div className="text-xs font-black text-[#1f2937] leading-none">{s.label}</div>
                      <div className="text-[9px] text-[#9ca3af] font-semibold mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Home collection badge */}
                {profile.home_collection && (
                  <div className="flex items-center gap-2 bg-[#e8f0fe] border border-[#00535b]/15 rounded-xl px-3 py-2 mb-4">
                    <span className="material-symbols-outlined text-[#00535b] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                    <div>
                      <div className="text-[11px] font-black text-[#00535b]">Free Home Collection</div>
                      <div className="text-[10px] text-[#4b5563]">Certified phlebotomist visits your home</div>
                    </div>
                  </div>
                )}

                {/* About */}
                <div className="mb-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af] mb-1.5">About This Lab</p>
                  <p className="text-[12px] text-[#4b5563] leading-relaxed">{profile.about}</p>
                </div>

                {/* Speciality tags */}
                {profile.speciality_tags?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#9ca3af] mb-1.5">Specialities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.speciality_tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold text-[#374151] bg-white border border-[#e8eaed] px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA: Book test — smaller button */}
                {onBook && (
                  <button
                    onClick={() => { onBook(); handleClose(); }}
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-[#00535b] hover:bg-[#0842a0] text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">calendar_add_on</span>
                    Book {testName ? `${testName} at this lab` : 'Test at This Lab'}
                    {testPrice && <span className="font-bold opacity-75 ml-1">· ₹{testPrice}</span>}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
