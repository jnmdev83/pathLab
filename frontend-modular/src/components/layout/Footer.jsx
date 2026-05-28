import React from 'react';

export function Footer({ page, setPage }) {
  // Don't show large footer on signup pages to keep auth clean
  const isAuthPage = page === "signup";
  if (isAuthPage) return null;

  return (
    <>
      <footer className="bg-white border-t border-slate-100 w-full py-8 px-4 md:px-6 font-body text-left relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
          
          {/* Column 1 (Left): IMPORTANT LINKS (Dual-column grid of links) */}
          <div className="flex-grow w-full md:w-auto text-left">
            <h5 className="font-headline font-black text-slate-800 text-[11px] tracking-wider uppercase mb-3">
              Important Links
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] md:text-xs">
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">About Us</a>
              <a onClick={() => setPage("blood")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Our Labs</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Media</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Contact Us</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Career</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Blog</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Editorial Policy</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Health Q&A</a>
              <a onClick={() => setPage("blood")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Lab Tests</a>
              <a onClick={() => setPage("blood")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Lab Test Price</a>
              <a onClick={() => setPage("package")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Money Back Policy</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Investors</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Query/Complaints</a>
              <a onClick={() => setPage("blood")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Scan Lab</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Our Corporate Clients</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">FAQ</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Rating & Reviews</a>
              <a onClick={() => setPage("home")} className="text-slate-500 font-semibold hover:text-[#00828a] transition-colors cursor-pointer">Become Business Partner</a>
            </div>
          </div>

          {/* Column 2 (Right): Stack of Follow Us and Logo & Gold Medal Seal */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left min-w-[260px] max-w-xs w-full lg:w-auto gap-4">
            {/* Follow Us */}
            <div className="w-full">
              <h5 className="font-headline font-black text-slate-800 text-[11px] tracking-wider uppercase mb-2 text-center lg:text-left">
                Follow Us
              </h5>
              <div className="flex gap-2 justify-center lg:justify-start">
                <a href="#" className="h-8 w-8 rounded-full bg-[#3b5998] hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-black hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-[#0077b5] hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-[#ff0000] hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.085-2.087-1.837-.492-9.2-.492-9.2-.492s-7.363 0-9.199.492c-1.015.272-1.813 1.071-2.085 2.087-.493 1.837-.493 5.67-.493 5.67s0 3.834.493 5.67c.272 1.015 1.07 1.813 2.085 2.086 1.836.492 9.199.492 9.199.492s7.363 0 9.2-.492c1.015-.273 1.813-1.07 2.085-2.086.493-1.836.493-5.67.493-5.67s0-3.833-.493-5.67zm-1.002 5.837l-9 5.2v-10.4l9 5.2z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-[#e1306c] hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Brand Logo & Gold Medal Seal */}
            <div className="w-full flex flex-col items-center lg:items-start mt-1">
              {/* ChooseMyLab Logo */}
              <div className="flex items-center gap-1.5 justify-center lg:justify-start mb-3 select-none">
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00a896]">
                  <path d="M12 8 C 8 4, 3 9, 7 15 L 17 25 L 27 15 C 31 9, 26 4, 22 8 L 17 13 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="17" cy="27" r="3.5" fill="currentColor" />
                  <path d="M17 23 L 17 25" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-xl font-black text-[#00828a] tracking-tight font-headline">
                  ChooseMyLab
                </span>
              </div>

              {/* Prestige Gold Seal Badge */}
              <div className="relative mb-1">
                <svg width="100" height="100" viewBox="0 0 150 150" className="mx-auto drop-shadow-md">
                  <defs>
                    {/* Gold Gradients */}
                    <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFF2B2" />
                      <stop offset="30%" stopColor="#D1A11F" />
                      <stop offset="70%" stopColor="#9C710E" />
                      <stop offset="100%" stopColor="#F5D061" />
                    </linearGradient>
                    <linearGradient id="gold-grad-ribbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F5D061" />
                      <stop offset="50%" stopColor="#B3860F" />
                      <stop offset="100%" stopColor="#8A6305" />
                    </linearGradient>
                    
                    {/* Curved Text Paths */}
                    <path id="arc-top" d="M 28 75 A 47 47 0 0 1 122 75" fill="none" />
                    <path id="arc-bottom" d="M 26 75 A 49 49 0 0 0 124 75" fill="none" />
                  </defs>

                  {/* Ribbon Tails hanging under badge */}
                  <path d="M 52 105 L 35 138 L 55 130 L 70 138 Z" fill="url(#gold-grad-ribbon)" />
                  <path d="M 98 105 L 115 138 L 95 130 L 80 138 Z" fill="url(#gold-grad-ribbon)" />

                  {/* Outer Gold Border Ring */}
                  <circle cx="75" cy="75" r="54" fill="url(#gold-grad)" />
                  <circle cx="75" cy="75" r="49" fill="#0c4f4d" stroke="url(#gold-grad)" strokeWidth="2" />
                  
                  {/* Curved Text along top path */}
                  <text fontSize="7" fontWeight="bold" fontFamily="sans-serif" fill="#FFF2B2">
                    <textPath href="#arc-top" startOffset="50%" textAnchor="middle">
                      TIMES HEALTH EXCELLENCE SURVEY 2026
                    </textPath>
                  </text>

                  {/* Inner Core Circle */}
                  <circle cx="75" cy="75" r="37" fill="#003534" stroke="url(#gold-grad)" strokeWidth="1.5" />
                  
                  {/* Center "No. 1" Text */}
                  <text x="75" y="68" fontSize="11" fontWeight="800" fontFamily="sans-serif" fill="#FFF2B2" textAnchor="middle">No.</text>
                  <text x="75" y="93" fontSize="28" fontWeight="950" fontFamily="sans-serif" fill="url(#gold-grad)" textAnchor="middle" letterSpacing="-1">1</text>
                  
                  {/* Gold Ribbon Banner arching at bottom */}
                  <path d="M 20 95 C 45 112, 105 112, 130 95 L 126 107 C 102 121, 48 121, 24 107 Z" fill="url(#gold-grad-ribbon)" stroke="url(#gold-grad)" strokeWidth="1" />
                  
                  {/* Text along bottom path */}
                  <text fontSize="8" fontWeight="900" fontFamily="sans-serif" fill="#1b1202">
                    <textPath href="#arc-bottom" startOffset="50%" textAnchor="middle">
                      DIAGNOSTICS SERVICE
                    </textPath>
                  </text>
                </svg>
              </div>
              <p className="text-[#00828a] font-bold text-[10px] uppercase tracking-widest text-center lg:text-left pl-0 lg:pl-7">
                in Delhi NCR
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Bottom Copyright bar */}
      <div className="bg-[#f8fafc] border-t border-slate-200/60 py-3 px-6 md:px-8 text-center text-[11px] text-slate-500 font-semibold relative z-10 w-full select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-1.5 md:gap-2.5">
          <span>2026 © ChooseMyLab.com</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <a href="#" className="hover:text-[#00828a] transition-colors">Terms & Conditions</a>
          <span className="hidden md:inline text-slate-300">|</span>
          <a href="#" className="hover:text-[#00828a] transition-colors">Privacy Policy</a>
          <span className="hidden md:inline text-slate-300">|</span>
          <a href="#" className="hover:text-[#00828a] transition-colors">Statutory Compliance</a>
          <span className="hidden md:inline text-slate-300">|</span>
          <a href="#" className="hover:text-[#00828a] transition-colors">Programs & Policies</a>
        </div>
      </div>

      {/* Floating WhatsApp Health Advisor Assist Widget (Desktop/Tablet) */}
      <div className="fixed bottom-6 left-6 z-50 hidden md:block group">
        <a 
          href="https://wa.me/911234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#075e54] hover:bg-[#128c7e] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
        >
          <div className="relative flex items-center justify-center">
            {/* Pulse effect waves */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25d366]/40 animate-ping opacity-75" />
            
            {/* WhatsApp Icon */}
            <div className="h-8 w-8 bg-[#25d366] rounded-full flex items-center justify-center text-white relative z-10 shadow-md">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979-1.864-1.865-4.343-2.89-6.984-2.895-5.439 0-9.865 4.425-9.867 9.874-.001 1.73.457 3.419 1.32 4.933l-.994 3.635 3.723-.976zm11.588-6.848c-.3-.15-1.774-.875-2.046-.975-.272-.1-.47-.15-.667.15-.198.3-.765.95-.937 1.15-.173.2-.345.225-.645.075-.3-.15-1.263-.465-2.407-1.485-.89-.794-1.775-1.775-1.665-2.075-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.667-1.605-.913-2.197-.24-.578-.48-.5-.667-.51-.173-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.106 3.217 5.1 4.512.713.309 1.27.494 1.704.632.714.227 1.36.195 1.872.118.571-.085 1.774-.725 2.02-1.425.247-.7.247-1.3.173-1.425-.074-.124-.272-.199-.572-.349z"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/60 block leading-none">Talk to our</span>
            <span className="text-[11px] font-bold text-white block mt-0.5 font-headline leading-none">Health Advisor</span>
          </div>
        </a>
      </div>

      {/* Floating WhatsApp Health Advisor Assist Widget (Mobile Device - Icon only at bottom-24 right-6) */}
      <div className="fixed bottom-24 right-6 z-50 md:hidden select-none">
        <a 
          href="https://wa.me/911234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative h-14 w-14 bg-[#25d366] hover:bg-[#128c7e] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Pulse effect wave */}
          <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-ping opacity-75" />
          
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="relative z-10">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.115-2.887-6.979-1.864-1.865-4.343-2.89-6.984-2.895-5.439 0-9.865 4.425-9.867 9.874-.001 1.73.457 3.419 1.32 4.933l-.994 3.635 3.723-.976zm11.588-6.848c-.3-.15-1.774-.875-2.046-.975-.272-.1-.47-.15-.667.15-.198.3-.765.95-.937 1.15-.173.2-.345.225-.645.075-.3-.15-1.263-.465-2.407-1.485-.89-.794-1.775-1.775-1.665-2.075-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.667-1.605-.913-2.197-.24-.578-.48-.5-.667-.51-.173-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.106 3.217 5.1 4.512.713.309 1.27.494 1.704.632.714.227 1.36.195 1.872.118.571-.085 1.774-.725 2.02-1.425.247-.7.247-1.3.173-1.425-.074-.124-.272-.199-.572-.349z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
