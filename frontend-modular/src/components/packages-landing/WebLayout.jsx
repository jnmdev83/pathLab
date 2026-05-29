import React, { useState } from 'react';

export function WebLayout({
  categories,
  popular,
  faqs,
  partners,
  setPage,
  setSelectedPackage,
  setActiveCategoryFilter,
  user
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      if (setActiveCategoryFilter) {
        setActiveCategoryFilter("Home");
      }
      setPage("package-listing");
    }
  };

  const handleCategoryClick = (catName) => {
    if (setActiveCategoryFilter) {
      // Map to system filter keys
      let filter = catName;
      if (catName.includes("Heart")) filter = "Heart";
      else if (catName.includes("Diabetes")) filter = "Diabetes";
      else if (catName.includes("Women") || catName.includes("Female")) filter = "Pregnancy";
      else if (catName.includes("Thyroid")) filter = "Thyroid";
      else if (catName.includes("Senior")) filter = "Senior Citizen";
      else if (catName.includes("Full Body")) filter = "Full Body Checkup";
      
      setActiveCategoryFilter(filter);
    }
    setPage("package-listing");
  };

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  // Get color configuration based on reference design
  const getCategoryColorStyles = (theme) => {
    switch (theme) {
      case 'primary':
        return { bg: 'bg-[#00535b]/10', text: 'text-[#00535b]', border: 'hover:border-[#00535b]' };
      case 'error':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'hover:border-red-500' };
      case 'secondary':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'hover:border-emerald-500' };
      case 'tertiary':
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'hover:border-indigo-500' };
      case 'surface-highest':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'hover:border-purple-500' };
      case 'surface-dim':
        return { bg: 'bg-[#edf6f9]', text: 'text-[#00535b]', border: 'hover:border-[#00535b]' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'hover:border-slate-400' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f9ff] via-[#f9f9ff] to-[#edf6f9] py-16 md:py-24 border-b border-[#c3c6d6]/20">
        {/* Immersive mesh blobs */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#00535b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center text-left relative z-10">
          
          <div className="space-y-6">
            <div className="flex gap-3.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100/60 text-[#006c49] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
                NABL Certified
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#00535b]/10 text-[#00535b] text-xs font-black uppercase tracking-wider">
                Compare Over 500+ Labs
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight leading-[1.08] font-headline">
              Compare Health Checkup Packages Across Top Labs
            </h1>
            
            <p className="text-base md:text-lg text-[#424654] leading-relaxed max-w-xl">
              Compare preventive health checkups from trusted clinical networks. Find the best price, exact parameter coverage, and free home sample collection options.
            </p>

            {/* Interactive Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={`relative max-w-xl transition-all duration-300 ${
                searchFocused ? 'scale-[1.02] shadow-md shadow-[#00535b]/5' : ''
              }`}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737785] text-xl">search</span>
              <input
                type="text"
                placeholder="Search package (Full Body, Thyroid, Heart, Kidney...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#c3c6d6] bg-white focus:ring-2 focus:ring-[#00535b] focus:border-transparent outline-none shadow-sm transition-all text-sm font-medium text-[#0b1c30]"
              />
            </form>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => handleCategoryClick("Full Body")}
                className="bg-[#00535b] hover:bg-[#00393f] text-white text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#00535b]/25 transition-all active:scale-95 uppercase tracking-wide font-headline"
              >
                Explore Packages
              </button>
              <button 
                onClick={() => setPage("package-listing")}
                className="bg-white border border-[#c3c6d6] text-[#0b1c30] hover:bg-[#edf6f9] text-sm font-bold px-8 py-4 rounded-xl transition-all font-headline"
              >
                Compare Labs
              </button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-[#c3c6d6]/20 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#424654]">
                <span className="material-symbols-outlined text-emerald-600 text-lg">house</span>
                <span>Home Sample Collection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#424654]">
                <span className="material-symbols-outlined text-emerald-600 text-lg">payments</span>
                <span>Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="relative hidden md:block w-full">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#00535b]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <img 
              alt="Comparison Diagnostic Dashboard" 
              className="rounded-3xl shadow-2xl relative z-10 border border-white max-h-[380px] w-full object-cover"
              src="/diagnostic_dashboard.png"
            />
            {/* Floating Data Card */}
            <div className="absolute bottom-6 -left-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl z-20 border border-[#c3c6d6]/20 flex items-center gap-3.5 transition-all hover:scale-105 select-none">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <span className="material-symbols-outlined text-base">trending_down</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-[#737785] leading-none mb-1">Avg. Savings</p>
                <p className="font-headline text-lg font-black text-[#0b1c30] leading-none">Up to 45%</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. BROWSE BY CATEGORY BENTO GRID ── */}
      <section className="py-16 bg-white border-b border-[#c3c6d6]/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0b1c30] font-headline tracking-tight">Browse by Category</h2>
            <p className="text-sm text-[#424654] mt-2 font-medium">Specialized diagnostic screenings curated for your health targets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const colors = getCategoryColorStyles(cat.color_theme);
              return (
                <div 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group p-6 rounded-2xl border border-[#c3c6d6]/40 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between ${colors.border}`}
                >
                  <div className="text-left">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${colors.bg} ${colors.text}`}>
                      <span className="material-symbols-outlined text-3xl font-bold">{cat.icon}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#0b1c30] mb-1 group-hover:text-[#00535b] transition-colors">{cat.name}</h3>
                    <p className="text-xs text-[#737785] font-semibold">{cat.sub_label}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-xs font-bold">
                    <span className="text-[#00535b] bg-[#00535b]/5 px-2.5 py-1 rounded-md">Starts @ ₹{cat.starts_price}</span>
                    <span className="text-[#737785]">{cat.labs_count} Certified Labs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. WHY TRUST CHOOSEMYLAB ── */}
      <section className="py-16 bg-[#edf6f9]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0b1c30] font-headline tracking-tight">Why People Trust ChooseMyLab</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: 'sell', title: 'Real Prices', desc: 'Exclusive negotiated rates directly from partner networks. Absolute transparency, no hidden charges.' },
              { icon: 'checklist_rtl', title: 'Test Coverage', desc: 'Audit and compare exact biological parameters included in each wellness package side-by-side.' },
              { icon: 'verified_user', title: 'Certified Labs', desc: 'We only partner with NABL and CAP accredited laboratory networks for 100% diagnostic accuracy.' },
              { icon: 'distance', title: 'Home Collection', desc: 'Book collection slots online and certified phlebotomists will visit your home at your convenience.' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-white border border-[#c3c6d6]/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-[#00535b]/5 border border-[#00535b]/10 flex items-center justify-center text-[#00535b] mb-4">
                  <span className="material-symbols-outlined text-3xl font-bold">{item.icon}</span>
                </div>
                <h4 className="text-base font-black text-[#0b1c30] mb-2">{item.title}</h4>
                <p className="text-xs text-[#424654] leading-relaxed font-semibold opacity-95">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. POPULAR PACKAGES CAROUSEL GRID ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12 text-left">
            <div>
              <h2 className="text-3xl font-black text-[#0b1c30] font-headline tracking-tight">Most Popular Packages</h2>
              <p className="text-sm text-[#424654] mt-1.5 font-medium">Handpicked packages selected based on active clinical screening volumes</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setPage("package-listing")}
                className="px-4 py-2 text-xs font-black text-[#00535b] bg-[#00535b]/5 rounded-xl border border-[#00535b]/15 hover:bg-[#00535b]/10 transition-colors uppercase tracking-wider font-headline"
              >
                View All Packages
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((pkg) => {
              const original = pkg.original_price || Math.round(pkg.price * 1.45);
              const isPremiumStyle = pkg.is_premium;

              return (
                <div 
                  key={pkg.id} 
                  className={`bg-white border rounded-2xl p-6 flex flex-col hover:shadow-xl transition-all duration-300 h-full relative text-left ${
                    isPremiumStyle 
                      ? 'border-[#00535b] ring-2 ring-[#00535b]/20 shadow-md' 
                      : 'border-[#c3c6d6]/40'
                  }`}
                >
                  {/* Premium Badge Tag */}
                  {isPremiumStyle && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00535b] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider font-headline">
                      Most Comprehensive
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider leading-none">
                      {pkg.savings_badge || 'Best Value'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0b1c30] mb-2 leading-snug">{pkg.name}</h3>
                  <p className="text-xs text-[#737785] font-semibold mb-6 leading-relaxed flex-grow">
                    {pkg.tests_included_summary}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-baseline gap-2 border-t border-slate-100 pt-4">
                      <span className="text-2xl font-black text-[#0b1c30]">₹{pkg.price}</span>
                      <span className="text-xs line-through text-[#737785]">₹{original}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#424654]">
                      <span className="material-symbols-outlined text-[#00535b] text-lg">science</span>
                      <span>Available in {pkg.labs_count || 12} labs</span>
                    </div>

                    <button 
                      onClick={() => {
                        if (pkg.package_id) {
                          setSelectedPackage({ id: pkg.package_id, name: pkg.name });
                          setPage("package-compare");
                        } else {
                          setPage("package-listing");
                        }
                      }}
                      className="w-full py-3 bg-[#00535b] hover:bg-[#00393f] text-white font-black rounded-xl text-xs uppercase tracking-wider font-headline transition-colors active:scale-95 duration-100 shadow-sm"
                    >
                      Compare Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="py-16 bg-[#edf6f9]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#0b1c30] font-headline tracking-tight">How It Works</h2>
            <p className="text-sm text-[#424654] mt-2 font-medium">Three simple steps to certified health management</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between gap-12 max-w-5xl mx-auto">
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-[#c3c6d6]/60 z-0" />
            
            {[
              { num: 1, title: 'Choose Package', body: 'Browse through a comprehensive catalogue of preventive packages matching your targets.' },
              { num: 2, title: 'Compare Labs', body: 'Compare rates, ratings, branch distances, and NABL certifications across partner networks.' },
              { num: 3, title: 'Book & Relax', body: 'Book a certified phlebotomist visit to collect your sample at home. Access reports on WhatsApp in 24 hours.' }
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center max-w-xs mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#00535b] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#00535b]/20 mb-6 border-4 border-white">
                  {step.num}
                </div>
                <h4 className="text-base font-black text-[#0b1c30] mb-2">{step.title}</h4>
                <p className="text-xs text-[#424654] leading-relaxed font-semibold opacity-95">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TRUSTED LABS LOGO STRIP ── */}
      <section className="py-12 bg-white border-y border-[#c3c6d6]/20">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#737785] mb-8">Trusted Laboratory Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {partners.map((partner) => (
              <span key={partner.id} className="text-lg font-black text-[#0b1c30] hover:text-[#00535b] transition-colors cursor-default">
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ SECTION ── */}
      <section className="py-16 bg-[#f8f9ff]">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0b1c30] font-headline tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white border border-[#c3c6d6]/40 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5 text-left outline-none font-headline font-bold text-sm text-[#0b1c30] hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className={`material-symbols-outlined text-[#737785] text-xl transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#00535b]' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-[#424654] leading-relaxed border-t border-slate-100 bg-white font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section className="py-16 max-w-7xl mx-auto px-8">
        <div className="bg-[#00535b] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl shadow-[#00535b]/15">
          {/* Glass mesh design */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight font-headline">Ready to Compare?</h2>
            <p className="text-sm md:text-base text-[#9becf7] max-w-2xl mx-auto font-medium">
              Join thousands of smart patients saving on their diagnostic checkups. Get started by exploring our dynamic packages catalog or running a location search.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => handleCategoryClick("Full Body")}
                className="bg-white text-[#00535b] hover:bg-[#edf6f9] px-10 py-4 rounded-xl text-xs font-black uppercase tracking-wider font-headline shadow-xl transition-all active:scale-95"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => setPage("package-listing")}
                className="border border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-wider font-headline backdrop-blur-sm transition-all"
              >
                View All Labs
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
