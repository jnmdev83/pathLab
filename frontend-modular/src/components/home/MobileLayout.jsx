import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../utils/data';
import { API_BASE_URL } from '../../config';

export function MobileLayout({ 
  setPage, 
  setTestName,
  setSelectedBranch, 
  setBranchTests, 
  userLocation, 
  requestGeolocation,
  setSelectedPackage,
  allTests = [],
  setTest,
  setActiveCategoryFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packageIndex, setPackageIndex] = useState(0);
  const [testPageIndex, setTestPageIndex] = useState(0);

  // Swipe Touch Gesture Handlers for Mobile Screens
  const [pkgTouchStart, setPkgTouchStart] = useState(0);
  const [pkgTouchEnd, setPkgTouchEnd] = useState(0);
  const [testTouchStart, setTestTouchStart] = useState(0);
  const [testTouchEnd, setTestTouchEnd] = useState(0);

  const handlePkgTouchStart = (e) => {
    setPkgTouchStart(e.targetTouches[0].clientX);
  };
  const handlePkgTouchMove = (e) => {
    setPkgTouchEnd(e.targetTouches[0].clientX);
  };
  const handlePkgTouchEnd = () => {
    if (!pkgTouchStart || !pkgTouchEnd) return;
    const distance = pkgTouchStart - pkgTouchEnd;
    if (distance > 50) {
      setPackageIndex(prev => Math.min(prev + 1, getPopularPackages().length - 1));
    } else if (distance < -50) {
      setPackageIndex(prev => Math.max(prev - 1, 0));
    }
    setPkgTouchStart(0);
    setPkgTouchEnd(0);
  };

  const handleTestTouchStart = (e) => {
    setTestTouchStart(e.targetTouches[0].clientX);
  };
  const handleTestTouchMove = (e) => {
    setTestTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTestTouchEnd = () => {
    if (!testTouchStart || !testTouchEnd) return;
    const distance = testTouchStart - testTouchEnd;
    if (distance > 50) {
      setTestPageIndex(prev => Math.min(prev + 1, Math.ceil(getPopularTests().length / 3) - 1));
    } else if (distance < -50) {
      setTestPageIndex(prev => Math.max(prev - 1, 0));
    }
    setTestTouchStart(0);
    setTestTouchEnd(0);
  };

  const getPopularPackages = () => {
    const popularPkgs = [
      {
        key: "health",
        icon: "health_metrics",
        iconColor: "text-blue-500 bg-blue-50/80 border-blue-100",
        bulletPoints: ["85 Parameters Included", "CBC, LFT, KFT Profile", "Lipid & Thyroid Profile"],
        fallback: { name: "Full Body Checkup", price: 899, originalPrice: 1299 }
      },
      {
        key: "cardiac",
        icon: "favorite",
        iconColor: "text-red-500 bg-red-50/80 border-red-100",
        bulletPoints: ["HS-CRP & Lipid Profile", "Troponin & ECG", "Blood Sugar Fasting"],
        fallback: { name: "Cardiac Screening", price: 1800, originalPrice: 2499 }
      },
      {
        key: "diabetic",
        icon: "opacity",
        iconColor: "text-orange-500 bg-orange-50/80 border-orange-100",
        bulletPoints: ["HbA1c Monitoring", "Average Blood Glucose", "Urine Microalbumin"],
        fallback: { name: "Diabetes Care", price: 599, originalPrice: 999 }
      },
      {
        key: "cancer",
        icon: "person",
        iconColor: "text-green-500 bg-green-50/80 border-green-100",
        bulletPoints: ["PCOS Panel Included", "Bone Mineral Health", "Iron Deficiency Test"],
        fallback: { name: "Women's Wellness", price: 1499, originalPrice: 1999 }
      },
      {
        key: "thyroid",
        icon: "health_metrics",
        iconColor: "text-purple-500 bg-purple-50/80 border-purple-100",
        bulletPoints: ["TSH & Thyroid Profile", "Free T3 & Free T4", "Metabolic Speed Check"],
        fallback: { name: "Thyroid Checkup Panel", price: 349, originalPrice: 599 }
      },
      {
        key: "active",
        icon: "fitness_center",
        iconColor: "text-indigo-500 bg-indigo-50/80 border-indigo-100",
        bulletPoints: ["Liver & Kidney Checks", "Blood Sugar Fasting", "Cholesterol Audit"],
        fallback: { name: "Active Health Screening", price: 1499, originalPrice: 2199 }
      },
      {
        key: "senior",
        icon: "elderly",
        iconColor: "text-teal-500 bg-teal-50/80 border-teal-100",
        bulletPoints: ["Bone Density & Calcium", "Uric Acid & Renal", "Artery Condition Audit"],
        fallback: { name: "Senior Citizen Wellness", price: 1800, originalPrice: 2499 }
      },
      {
        key: "genetic",
        icon: "dna",
        iconColor: "text-amber-500 bg-amber-50/80 border-amber-100",
        bulletPoints: ["Personalized DNA Insights", "Hereditary Risk Markers", "Diet & Fitness Info"],
        fallback: { name: "Genetic Wellness Panel", price: 6999, originalPrice: 9999 }
      }
    ];

    return popularPkgs.map(p => {
      const match = packages.find(pkg => (pkg.name || pkg.package_name || "").toLowerCase().includes(p.key));
      return match ? {
        id: match.id || match.package_id,
        name: match.name || match.package_name,
        price: match.price,
        originalPrice: Math.floor(match.price * 1.5),
        icon: p.icon,
        iconColor: p.iconColor,
        bulletPoints: p.bulletPoints
      } : {
        id: Math.floor(Math.random() * 1000) + 200,
        ...p.fallback,
        icon: p.icon,
        iconColor: p.iconColor,
        bulletPoints: p.bulletPoints
      };
    });
  };

  const getPopularTests = () => {
    const popularNames = [
      { key: "cbc", fallback: { name: "Complete Blood Count (CBC)", price: 150, rep: "12 Hours", cat: "blood" } },
      { key: "sugar", fallback: { name: "HbA1c (Diabetes)", price: 100, rep: "12 Hours", cat: "blood" } },
      { key: "lipid", fallback: { name: "Lipid Profile", price: 400, rep: "12 Hours", cat: "blood" } },
      { key: "lft", fallback: { name: "Liver Function Test (LFT)", price: 350, rep: "12 Hours", cat: "blood" } },
      { key: "tsh", fallback: { name: "Thyroid Profile (T3, T4, TSH)", price: 200, rep: "12 Hours", cat: "blood" } },
      { key: "urine", fallback: { name: "Urine Routine", price: 150, rep: "12 Hours", cat: "blood" } },
      { key: "calcium", fallback: { name: "Calcium Test (Bone Health)", price: 250, rep: "12 Hours", cat: "blood" } },
      { key: "renal", fallback: { name: "Kidney Function (RFT)", price: 300, rep: "12 Hours", cat: "blood" } },
      { key: "vitamin d", fallback: { name: "Vitamin D3 Checkup", price: 699, rep: "24 Hours", cat: "blood" } },
      { key: "vitamin b12", fallback: { name: "Vitamin B12 Checkup", price: 499, rep: "24 Hours", cat: "blood" } },
      { key: "iron", fallback: { name: "Iron Studies Panel", price: 550, rep: "12 Hours", cat: "blood" } },
      { key: "cardiac", fallback: { name: "Cardiac Risk Biomarkers", price: 1299, rep: "24 Hours", cat: "blood" } }
    ];

    return popularNames.map(p => {
      const match = allTests.find(t => t.name.toLowerCase().includes(p.key));
      return match ? {
        id: match.id,
        name: match.name,
        price: match.price,
        rep: match.rep || "12 Hours",
        cat: match.cat || "blood",
        description: match.description
      } : {
        id: Math.floor(Math.random() * 1000) + 100,
        ...p.fallback
      };
    });
  };

  // Mobile Carousel & Callback States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const carouselSlides = [
    {
      badge: "⭐ PRESTIGE PLATINUM AUDITING",
      title: "ULTIMATE EXECUTIVE SCREENING",
      tagline: "Comprehensive full body checks curated for executive wellness.",
      totalTests: "320 Mapped",
      price: "7999",
      mockPackage: { id: 1, name: "Full Body Health Checkup (64 Tests)", price: 899 },
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3pN88HIjziN8XMIL3cEovAbKrWnGK9ncgJQN5NOA0Tv5nn7yzyQlc0NRaOtmjinMIEuNoon1fYuxu_-dFfbtP3DLngXNlo87tesl6RKyffbxIDPAsp2jx0DKTJSTtpWcK0XFQ0ammaItqSTRsn15EBGUMSeeok0qIh2byzSSQ7nCZOTh02rvS-mLB3h6EEqFl2MO3VYNRtSGX6Sv1xfUaST20XwCW6XEf8fmFLlaPVskCALmwomyDAKG58IHZ8YTvjQGD8hOOtwo",
      bgColor: "from-[#ecfdf5] via-[#f0fdfa] to-[#ccfbf1]",
      textColor: "text-[#065f46]",
      titleColor: "text-[#064e3b]",
      taglineColor: "text-[#047857]",
      badgeStyle: "bg-emerald-100 border border-emerald-300 text-emerald-800",
      line1Color: "border-l-emerald-600",
      line1Text: "text-emerald-700",
      line2Color: "border-l-teal-600",
      line2Text: "text-teal-700",
      btnClass: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md",
      glowOverlay: "bg-emerald-500/10"
    },
    {
      badge: "⚡ PREMIUM ACTIVE AUDITING",
      title: "FULL BODY ACTIVE HEALTH AUDIT",
      tagline: "Uncover hidden clinical risks and track 84 biomarkers.",
      totalTests: "84 Biomarkers",
      price: "1499",
      mockPackage: { id: 1, name: "Full Body Health Checkup (64 Tests)", price: 899 },
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQu5pIuR0Ldjv4YKmjU4VYMp5SMtFx7hezaEpiQjxu7ZMsit_H-cJMpHXSf6kxWuO6I_ph85TssJR8VEOU2h8ECBs1G2A_cLAPRNFda6k8YCCWGGOzOls28EfP-5Lu0YPy1-IZVJNvsSEnSEsLzNLLOUnRNjkjbjN9v3to7rrUnHHcGVVxRwY3a-Ga34zGCDsl3An2Lt8X61C0rYaQssRtN0S-QhVaFRXscG_o_5KBWpyOYxBUVlrERlZLiU3fM3eejAw4H_uAk64",
      bgColor: "from-[#eff6ff] via-[#f0f9ff] to-[#e0f2fe]",
      textColor: "text-[#1e40af]",
      titleColor: "text-[#1e3a8a]",
      taglineColor: "text-[#1d4ed8]",
      badgeStyle: "bg-blue-100 border border-blue-300 text-blue-800",
      line1Color: "border-l-blue-600",
      line1Text: "text-blue-700",
      line2Color: "border-l-indigo-600",
      line2Text: "text-indigo-700",
      btnClass: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
      glowOverlay: "bg-blue-500/10"
    },
    {
      badge: "👴 CARING GERIATRIC CARE",
      title: "PREMIUM SENIOR CITIZEN PANEL",
      tagline: "Tracks bone density, kidneys, and geriatric risks.",
      totalTests: "68 Markers",
      price: "2199",
      mockPackage: { id: 2, name: "Senior Citizen Package", price: 1800 },
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGtb-_r_RM-FsnGSBH-b-OXmhyYF-dQ_Mzq8pNWbkT3AwYtekvUYB26GmXLkuiTVW5NEHUTmnpuEt1kxxtZfLKQLlJeRTNxHmwRPE_FkEF5DL1z2_bAVUz8h7uSn_X6KMMrwGUVi3nr2dChj7xBzPTCbXRb6XGxNVSLZ5cdI2Qd644tmV_WhoTxzOKYHgqV15UC_Gd3n_t74CC86HXn0LkSQiNka6GdnWgszezgV9lMJ-TAMVwDTB8tdru8r7SZtgLsD2miRIZ7P4",
      bgColor: "from-[#fffbeb] via-[#fffbeb] to-[#fef3c7]",
      textColor: "text-[#92400e]",
      titleColor: "text-[#78350f]",
      taglineColor: "text-[#b45309]",
      badgeStyle: "bg-amber-100 border border-amber-300 text-amber-800",
      line1Color: "border-l-amber-600",
      line1Text: "text-amber-700",
      line2Color: "border-l-orange-600",
      line2Text: "text-orange-700",
      btnClass: "bg-amber-600 text-white hover:bg-amber-700 shadow-md",
      glowOverlay: "bg-amber-500/10"
    }
  ];

  // Swipe Touch Gesture Handlers for Mobile Hero Carousel
  const [heroTouchStart, setHeroTouchStart] = useState(0);
  const [heroTouchEnd, setHeroTouchEnd] = useState(0);

  const handleHeroTouchStart = (e) => {
    setHeroTouchStart(e.targetTouches[0].clientX);
  };
  const handleHeroTouchMove = (e) => {
    setHeroTouchEnd(e.targetTouches[0].clientX);
  };
  const handleHeroTouchEnd = () => {
    if (!heroTouchStart || !heroTouchEnd) return;
    const distance = heroTouchStart - heroTouchEnd;
    if (distance > 50) {
      setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
    } else if (distance < -50) {
      setCurrentSlide(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }
    setHeroTouchStart(0);
    setHeroTouchEnd(0);
  };

  // Auto cycle slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);



  const handleCarouselBook = (mockPkg) => {
    const actualPkg = packages.find(p => p.name.toLowerCase().includes("senior") && mockPkg.name.toLowerCase().includes("senior")) ||
                      packages.find(p => p.name.toLowerCase().includes("full body") && mockPkg.name.toLowerCase().includes("full body")) ||
                      packages[0] || mockPkg;
    handleBookPackage(actualPkg);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (callbackPhone.length === 10 && /^\d+$/.test(callbackPhone)) {
      setCallbackSuccess(true);
      setCallbackPhone('');
      setTimeout(() => setCallbackSuccess(false), 5000);
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  // Fetch Packages
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPackages(data.slice(0, 2)); // Show top 2 packages
        }
      })
      .catch((err) => console.error("Error fetching packages:", err))
      .finally(() => setLoadingPackages(false));
  }, []);

  // Fetch Nearby Labs
  useEffect(() => {
    setLoadingLabs(true);
    const lat = userLocation?.lat || 28.6314;
    const lng = userLocation?.lng || 77.2789;
    fetch(`${API_BASE_URL}/api/labs/nearby?lat=${lat}&lng=${lng}&radius=15`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLabs(data.slice(0, 3)); // Show top 3 labs
        } else {
          // Fallback to fetching city labs if nearby is empty
          fetch(`${API_BASE_URL}/api/labs/city?city=Delhi`)
            .then((res) => res.json())
            .then((cityData) => {
              if (Array.isArray(cityData)) {
                setLabs(cityData.slice(0, 3));
              }
            });
        }
      })
      .catch((err) => console.error("Error fetching labs:", err))
      .finally(() => setLoadingLabs(false));
  }, [userLocation]);

  const handleBookPackage = (pkg) => {
    if (setSelectedPackage) {
      setSelectedPackage(pkg);
      setPage("package-compare");
    } else {
      setPage("package");
    }
  };

  const fetchTestsAtBranch = (branch) => {
    fetch(`${API_BASE_URL}/api/branches/${branch.branch_id || branch.id}/tests`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedBranch(branch);
        setBranchTests(Array.isArray(data) ? data : []);
        setPage("branch-tests");
      })
      .catch((err) => console.error("Could not fetch tests for this branch:", err));
  };

  return (
    <div className="mesh-gradient min-h-screen text-on-surface font-body pb-24 selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 
        Duplicate Header removed to resolve double header bug on mobile. 
        Main navbar top bar serves as the unified navigation header.
      */}

      <main className="max-w-md mx-auto px-4 overflow-x-hidden pt-2">
        
        {/* ── MOBILE REVAMPED CAROUSEL HERO SECTION (Tuned with small font and text) ── */}
        <section className="mt-4 mb-8">
          <div 
            onTouchStart={handleHeroTouchStart}
            onTouchMove={handleHeroTouchMove}
            onTouchEnd={handleHeroTouchEnd}
            className={`w-full rounded-[1.8rem] bg-gradient-to-br ${carouselSlides[currentSlide].bgColor} p-5 relative overflow-hidden shadow-lg h-[330px] flex flex-col justify-between transition-all duration-500 ease-in-out border border-slate-200/60`}
          >
            
            {/* Dynamic Backdrop Glow matching each active slide */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] -z-0 opacity-70 transition-all duration-500 ${carouselSlides[currentSlide].glowOverlay}`} />

            {/* Top row badge and stats */}
            <div className="space-y-2.5 z-10 text-left">
              <span className={`inline-block border text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-headline shadow-sm transition-all duration-300 ${carouselSlides[currentSlide].badgeStyle}`}>
                {carouselSlides[currentSlide].badge}
              </span>
              
              <h1 className={`font-headline text-[17px] font-black ${carouselSlides[currentSlide].titleColor} leading-tight uppercase tracking-tight`}>
                {carouselSlides[currentSlide].title}
              </h1>
              
              <p className={`${carouselSlides[currentSlide].taglineColor} text-[10px] leading-relaxed font-body font-medium`}>
                {carouselSlides[currentSlide].tagline}
              </p>
            </div>

            {/* Middle row info: parameters and price aligned with a vertical border */}
            <div className="flex items-center justify-start gap-8 py-3 border-y border-slate-200/60 my-3 z-10">
              <div className={`flex items-center gap-2 border-l border-sky-600 pl-2 h-7`}>
                <div>
                  <span className="text-[7.5px] uppercase font-bold tracking-wider text-sky-700 block font-headline">Coverage</span>
                  <span className="text-[11px] font-black font-headline text-slate-800 leading-none mt-0.5">{carouselSlides[currentSlide].totalTests}</span>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 border-l border-emerald-600 pl-2 h-7`}>
                <div>
                  <span className="text-[7.5px] uppercase font-bold tracking-wider text-emerald-700 block font-headline">Price</span>
                  <span className="text-[12px] font-black font-headline text-slate-800 leading-none mt-0.5">₹{carouselSlides[currentSlide].price}</span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div className="pt-2">
              <button 
                onClick={() => handleCarouselBook(carouselSlides[currentSlide].mockPackage)}
                className={`w-full ${carouselSlides[currentSlide].btnClass} py-2.5 rounded-full font-black text-[10px] font-headline transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center uppercase tracking-wider cursor-pointer`}
              >
                Book Now
                <span className="material-symbols-outlined text-xs ml-1 font-black">arrow_forward</span>
              </button>
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? "w-4 bg-primary" : "w-1.5 bg-outline-variant/60"
                }`}
              />
            ))}
          </div>

          {/* Standalone Search Bar below Mobile Hero Carousel */}
          <div className="mt-4 px-1">
            <div className="flex items-center bg-white p-1 rounded-full shadow-md border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
              <span className="material-symbols-outlined pl-3 text-slate-500 text-[16px] flex items-center justify-center">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setTestName(searchQuery.trim());
                    setPage("lab-listing");
                  }
                }}
                className="flex-grow pl-2 pr-2 py-2 bg-transparent text-[10px] text-slate-800 placeholder:text-slate-400 font-body outline-none border-none"
                placeholder="Search packages, scans or blood tests..." 
                type="text"
              />
              <button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    setTestName(searchQuery.trim());
                    setPage("lab-listing");
                  }
                }}
                className="bg-primary hover:bg-primary-container text-white px-4 py-1.5 rounded-full font-black text-[9px] font-headline transition-all duration-150 active:scale-95 uppercase tracking-wider cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Quick Categories (Rescaled for premium compact feel) */}
        <section className="mb-8">
          <h2 className="font-headline font-bold text-on-surface mb-2 px-1 uppercase tracking-wider text-[10px] opacity-60">
            Categories
          </h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => {
                  if (setActiveCategoryFilter) {
                    const targetName = cat.name === "Diabetic" ? "Diabetes" : (cat.name === "Cancer Care" ? "Cancer" : cat.name);
                    setActiveCategoryFilter(targetName);
                  }
                  setPage(cat.page === "package" && cat.name === "Full Body Check" ? "package" : "category-listing");
                }}
                className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl glass-dark flex items-center justify-center group-active:scale-95 transition-transform shadow-sm hover:border-primary/30 border border-transparent">
                  <span className="text-xl">{cat.icon}</span>
                </div>
                <span className="font-semibold text-on-surface text-[10px]">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10 bg-white/40 -mx-4 px-5 py-8 rounded-[2rem] shadow-inner border border-white/30">
          <h2 className="font-headline text-lg text-on-surface mb-4 text-center tracking-tight font-bold">Three simple steps</h2>
          
          <div className="space-y-6 relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-primary/10"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline shadow-md font-bold text-xs">1</div>
              <div>
                <h4 className="font-headline text-sm text-on-surface mb-0.5 font-bold">Search</h4>
                <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed">
                  Browse our comprehensive list of clinically validated tests.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-headline shadow-md border border-primary/10 font-bold text-xs">2</div>
              <div>
                <h4 className="font-headline text-sm text-on-surface mb-0.5 font-bold">Compare</h4>
                <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed">
                  Instantly see prices, ratings, and locations to make the right choice.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary font-headline shadow-md font-bold text-xs">3</div>
              <div>
                <h4 className="font-headline text-sm text-on-surface mb-0.5 font-bold">Book</h4>
                <p className="text-xs text-on-surface-variant opacity-80 leading-relaxed">
                  Securely book your slot and receive results on your profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compact Advisor Callback Widget (Tuned sizing) */}
        <section className="mb-8">
          <div className="bg-[#00722f] text-white p-4 rounded-2xl border border-white/10 shadow-[0_12px_30px_rgba(0,114,47,0.1)] space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl animate-bounce">📞</span>
              <div className="text-left">
                <h4 className="font-headline font-bold text-xs leading-tight">Get a Callback from our Health Advisor</h4>
                <p className="text-white/70 text-[9px] mt-0.5">Receive expert guidance from our pathologists.</p>
              </div>
            </div>

            <form onSubmit={handleCallbackSubmit} className="flex gap-2">
              <input 
                value={callbackPhone}
                onChange={(e) => setCallbackPhone(e.target.value)}
                maxLength={10}
                className="flex-grow px-3 py-2 bg-white text-on-surface placeholder:text-on-surface-variant/40 rounded-lg border-none outline-none text-[10px] font-bold font-body"
                placeholder="Enter 10 digit number" 
                type="tel"
                required
              />
              <button 
                type="submit"
                className="bg-[#ba1a1a] hover:bg-[#a01616] text-white px-3.5 py-2 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-all active:scale-95 font-headline cursor-pointer shrink-0"
              >
                Call Back
              </button>
            </form>

            {callbackSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold font-body p-2 rounded-lg flex items-center gap-1 animate-in fade-in">
                <span className="material-symbols-outlined text-[10px] leading-none">check_circle</span>
                Callback requested! We will call you within 15 minutes.
              </div>
            )}
          </div>
        </section>

        {/* Revamped Popular Health Packages for Mobile with Sliding Chevron Controls */}
        <section className="mb-10 text-left">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[8px] uppercase font-extrabold tracking-wider text-green-600 font-headline bg-green-50 border border-green-200 px-2.5 py-1 rounded-full inline-flex items-center gap-0.5 mb-2">
                <span className="material-symbols-outlined text-[10px] fill-current">verified</span> NABL Certified
              </span>
              <h2 className="font-headline text-lg font-black text-slate-800 tracking-tight leading-none">
                Popular Health Packages
              </h2>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-normal">
                Designed for every health goal. Transparent pricing, no hidden costs.
              </p>
            </div>
            
            {/* Carousel navigation arrows */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button 
                onClick={() => setPackageIndex(prev => Math.max(prev - 1, 0))}
                disabled={packageIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none border ${
                  packageIndex === 0 
                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200 cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button 
                onClick={() => setPackageIndex(prev => Math.min(prev + 1, getPopularPackages().length - 1))}
                disabled={packageIndex >= getPopularPackages().length - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none shadow-sm ${
                  packageIndex >= getPopularPackages().length - 1
                    ? "bg-slate-50 text-slate-300 shadow-none cursor-not-allowed border border-slate-100" 
                    : "bg-primary text-white hover:bg-primary-container cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            onTouchStart={handlePkgTouchStart}
            onTouchMove={handlePkgTouchMove}
            onTouchEnd={handlePkgTouchEnd}
            className="transition-all duration-300 select-none"
          >
            {loadingPackages ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 pulse-shimmer h-[340px] shadow-sm" />
            ) : (
              (() => {
                const pkg = getPopularPackages()[packageIndex];
                if (!pkg) return null;
                return (
                  <div key={pkg.id} className="bg-white border border-slate-100 hover:border-primary/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[340px] relative group animate-in fade-in slide-in-from-right-3">
                    <div>
                      {/* Dynamic Icon */}
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl border inline-flex ${pkg.iconColor} shadow-sm`}>
                          <span className="material-symbols-outlined text-xl">{pkg.icon}</span>
                        </div>
                        <span className="bg-primary/5 text-primary text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Top Selling</span>
                      </div>

                      <h4 className="font-headline text-base font-black text-slate-800 leading-snug tracking-tight mt-4 group-hover:text-primary transition-colors">
                        {pkg.name}
                      </h4>

                      {/* Mapped checklists */}
                      <ul className="space-y-1.5 mt-4">
                        {pkg.bulletPoints.map((bp, idx) => (
                          <li key={idx} className="text-[11px] text-slate-600 font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500 text-sm leading-none">check_circle</span>
                            <span className="opacity-95">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {/* Price block */}
                      <div className="flex items-baseline gap-2 mt-5">
                        <span className="text-primary font-headline text-xl font-black">₹{pkg.price}</span>
                        <span className="text-slate-400 text-[10px] font-semibold line-through">₹{pkg.originalPrice}</span>
                      </div>

                      <button 
                        onClick={() => handleBookPackage({ id: pkg.id, name: pkg.name, price: pkg.price })}
                        className="bg-[#F1F3F6] hover:bg-primary hover:text-white text-slate-700 text-xs font-black py-2.5 rounded-xl transition-all duration-200 font-headline text-center cursor-pointer w-full mt-3 active:scale-95 shadow-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </section>

        {/* Popular Individual Tests with Sliding Chevron Pagination */}
        <section className="mb-10 text-left border-t border-slate-100 pt-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="font-headline text-base font-black text-slate-800 tracking-tight leading-none">
                Popular Individual Tests
              </h2>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Specific screenings for targeted precision.
              </p>
            </div>
            
            {/* Tests Navigation Arrows */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button 
                onClick={() => setTestPageIndex(prev => Math.max(prev - 1, 0))}
                disabled={testPageIndex === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none border ${
                  testPageIndex === 0 
                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200 cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button 
                onClick={() => setTestPageIndex(prev => Math.min(prev + 1, Math.ceil(getPopularTests().length / 3) - 1))}
                disabled={testPageIndex >= Math.ceil(getPopularTests().length / 3) - 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none shadow-sm ${
                  testPageIndex >= Math.ceil(getPopularTests().length / 3) - 1
                    ? "bg-slate-50 text-slate-300 shadow-none cursor-not-allowed border border-slate-100" 
                    : "bg-primary text-white hover:bg-primary-container cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            onTouchStart={handleTestTouchStart}
            onTouchMove={handleTestTouchMove}
            onTouchEnd={handleTestTouchEnd}
            className="space-y-3 transition-all duration-300 select-none"
          >
            {getPopularTests().slice(testPageIndex * 3, testPageIndex * 3 + 3).map((test, idx) => (
              <div 
                key={`${test.id}-${idx}`}
                onClick={() => {
                  if (setTest) {
                    setTest(test);
                    setPage("detail");
                  } else {
                    setPage("blood");
                  }
                }}
                className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer group animate-in fade-in slide-in-from-right-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-50 text-primary border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-base leading-none">biotech</span>
                  </div>
                  <div className="text-left">
                    <h5 className="font-headline text-[12px] font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                      {test.name}
                    </h5>
                    <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 mt-0.5 leading-none">
                      <span className="material-symbols-outlined text-[10px] leading-none">schedule</span> {test.rep} TAT
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[11px] font-black text-slate-800 font-headline">₹{test.price}</span>
                  <span className="h-4.5 w-4.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-transparent flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-[10px] leading-none">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <button 
              onClick={() => setPage("blood")}
              className="bg-gradient-to-r from-primary/5 to-blue-600/5 hover:from-primary hover:to-blue-600 border border-primary/20 hover:border-transparent text-primary hover:text-white text-[11px] font-black px-7 py-3 rounded-full inline-flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/25 active:scale-95 cursor-pointer group"
            >
              <span>View All 500+ Tests</span>
              <span className="material-symbols-outlined text-xs leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">open_in_new</span>
            </button>
          </div>
        </section>

        {/* Small & Compact Can't Decide Banner (Doctor Chat Button Hidden for now) */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-5 relative overflow-hidden shadow-md text-left flex flex-row items-center justify-between gap-4">
            {/* Glowing blobs inside card */}
            <div className="absolute top-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-blue-900/40 rounded-full blur-2xl" />

            <div className="w-3/5 relative z-10 space-y-1.5">
              <h3 className="font-headline text-[11.5px] font-black leading-tight text-white tracking-tight">
                Can't decide which package is right for you?
              </h3>
              <p className="text-white/80 text-[8.5px] font-medium leading-relaxed font-body">
                Our experts help you choose the best diagnostic path for your symptoms.
              </p>
              
              <div className="pt-0.5">
                <a 
                  href="tel:1800123456"
                  className="bg-white hover:bg-slate-100 text-blue-700 text-[9px] font-black px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 duration-150 cursor-pointer uppercase tracking-wider font-headline inline-block text-center"
                >
                  Free Consult
                </a>
              </div>
            </div>

            {/* Compact Doctor Image Overlay for Mobile */}
            <div className="w-2/5 flex justify-end relative z-10">
              <img 
                className="max-h-[90px] object-contain rounded-xl border border-white/10 shadow-md" 
                alt="Friendly doctor consulting" 
                src="/doctor.png"
              />
            </div>
          </div>
        </section>

        {/* Verified Laboratories (Rescaled to look small & neat) */}
        <section className="mb-10">
          <h2 className="font-headline font-bold text-on-surface mb-3 px-1 uppercase tracking-wider text-[10px] opacity-60">
            Verified Laboratories
          </h2>
          
          <div className="space-y-4">
            {loadingLabs ? (
              <div className="glass p-4 rounded-2xl glow-soft pulse-shimmer h-32 flex items-center justify-center">
                <span className="text-on-surface-variant text-xs">Locating accredited labs...</span>
              </div>
            ) : labs.length === 0 ? (
              <div className="glass p-5 rounded-2xl text-center text-xs text-on-surface-variant">
                No nearby laboratories found.
              </div>
            ) : (
              labs.map((lab) => (
                <div key={lab.branch_id || lab.id} className="glass p-4 rounded-2xl glow-soft relative group transition-all duration-300 border border-white/50 active:translate-y-0.5">
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center shadow-inner text-primary">
                      <span className="material-symbols-outlined text-2xl">local_hospital</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-headline text-sm text-on-surface font-bold leading-tight">
                          {lab.lab_name}
                        </h3>
                        <span className="material-symbols-outlined text-secondary text-xs fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant/85">
                        <span className="material-symbols-outlined text-xs text-[#FFB800]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="text-[10px] font-semibold">
                          4.8 (Verified NABL)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-primary/5 pt-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-on-surface-variant font-bold text-[9px] uppercase tracking-wide opacity-60 mb-0.5">
                        Turnaround
                      </span>
                      <div className="flex items-center gap-1 font-bold text-on-surface text-[12px]">
                        <span className="material-symbols-outlined text-primary text-[15px]">schedule</span>
                        {lab.turnaround_hours || "24"} Hours
                      </div>
                    </div>
                    
                    <div className="flex flex-col text-right">
                      <span className="text-on-surface-variant font-bold text-[9px] uppercase tracking-wide opacity-60 mb-0.5">
                        Accreditation
                      </span>
                      <span className="font-bold text-secondary text-[12px]">
                        NABL ISO
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => fetchTestsAtBranch(lab)}
                    className="w-full glass-dark text-primary py-2.5 rounded-xl font-bold border border-primary/10 hover:bg-primary hover:text-on-primary transition-all active:scale-95 text-xs"
                  >
                    View Lab Details
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Why Us Section */}
        <section className="mb-10">
          <h2 className="font-headline text-base text-on-surface mb-4 text-center font-bold">Your Health, Our Priority</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl glass-dark">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-[12px]">NABL Certified Only</h4>
                <p className="text-on-surface-variant text-[10px]">All partners follow strict clinical guidelines.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl glass-dark">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                <span className="material-symbols-outlined text-xl">payments</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-[12px]">Best Price Guarantee</h4>
                <p className="text-on-surface-variant text-[10px]">Found it cheaper? We'll match the price.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl glass-dark">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-xl">encrypted</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-[12px]">Secure & Private Data</h4>
                <p className="text-on-surface-variant text-[10px]">Your health data is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </section>



        {/* Trust Image Section */}
        <section className="mb-10">
          <div className="rounded-2xl overflow-hidden aspect-[16/10] mb-4 shadow-xl relative">
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
            <img 
              className="w-full h-full object-cover" 
              alt="Futuristic clinical lab" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQu5pIuR0Ldjv4YKmjU4VYMp5SMtFx7hezaEpiQjxu7ZMsit_H-cJMpHXSf6kxWuO6I_ph85TssJR8VEOU2h8ECBs1G2A_cLAPRNFda6k8YCCWGGOzOls28EfP-5Lu0YPy1-IZVJNvsSEnSEsLzNLLOUnRNjkjbjN9v3to7rrUnHHcGVVxRwY3a-Ga34zGCDsl3An2Lt8X61C0rYaQssRtN0S-QhVaFRXscG_o_5KBWpyOYxBUVlrERlZLiU3fM3eejAw4H_uAk64"
            />
          </div>
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="flex -space-x-1.5">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-500"></div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] text-white font-bold">+500</div>
            </div>
            <p className="text-on-surface-variant text-[10px] opacity-80">
              Trusted by over 500+ NABL accredited laboratories nationwide.
            </p>
          </div>
        </section>
      </main>

      {/* Mobile Glass Bottom Nav Bar */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center px-4 py-3 glass rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setPage("home")} 
          className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-2xl px-6 py-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Search</span>
        </button>
        <button 
          onClick={() => setPage("package")} 
          className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all p-3 rounded-2xl active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Compare</span>
        </button>
        <button 
          onClick={() => setPage("profile-page")} 
          className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all p-3 rounded-2xl active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
          <span className="font-bold text-[10px] uppercase mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
