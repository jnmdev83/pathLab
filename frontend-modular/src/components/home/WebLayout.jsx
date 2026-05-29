import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export function WebLayout({ 
  setPage, 
  setTestName,
  setSelectedBranch, 
  setBranchTests, 
  userLocation, 
  requestGeolocation,
  setSelectedPackage,
  user,
  allTests = [],
  setTest,
  setActiveCategoryFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Delhi');
  const [packages, setPackages] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packageIndex, setPackageIndex] = useState(0);
  const [testPageIndex, setTestPageIndex] = useState(0);

  // Swipe Touch Gesture Handlers for Desktop/Touch Hybrid screens
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
      setPackageIndex(prev => Math.min(prev + 1, getPopularPackages().length - 4));
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
      setTestPageIndex(prev => Math.min(prev + 1, Math.ceil(getPopularTests().length / 6) - 1));
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
        iconColor: "text-[#00535b] bg-[#edf6f9]/80 border-[#a9ece5]",
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

    return popularPkgs.map((p, index) => {
      const match = packages.find(pkg => (pkg.name || pkg.package_name || "").toLowerCase().includes(p.key));
      const fallbackPkg = packages.length > 0 ? packages[index % packages.length] : null;
      return match ? {
        id: match.id || match.package_id,
        name: match.name || match.package_name,
        price: match.price || match.min_price || p.fallback.price,
        originalPrice: Math.floor((match.price || match.min_price || p.fallback.price) * 1.5),
        icon: p.icon,
        iconColor: p.iconColor,
        bulletPoints: p.bulletPoints
      } : {
        id: fallbackPkg ? (fallbackPkg.id || fallbackPkg.package_id) : (Math.floor(Math.random() * 1000) + 200),
        name: fallbackPkg ? (fallbackPkg.name || fallbackPkg.package_name) : p.fallback.name,
        price: fallbackPkg ? (fallbackPkg.price || fallbackPkg.min_price || p.fallback.price) : p.fallback.price,
        originalPrice: fallbackPkg ? Math.floor((fallbackPkg.price || fallbackPkg.min_price || p.fallback.price) * 1.5) : p.fallback.originalPrice,
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

  // Auto-playing Carousel State and Configuration
  const [currentSlide, setCurrentSlide] = useState(0);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Build carousel slides dynamically — once packages load, each slide resolves
  // to the best-matching real package via searchKeys (checked in priority order).
  const carouselSlides = [
    {
      badge: "⭐ PRESTIGE PLATINUM AUDITING",
      title: "ULTIMATE EXECUTIVE HEALTH SCREENING PANEL",
      tagline: "Comprehensive full body checks curated for executives and premium preventative wellness.",
      totalTests: "320 Mapped Parameters",
      price: "7999",
      packageId: 132,
      searchKeys: ["executive", "120 tests", "platinum"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3pN88HIjziN8XMIL3cEovAbKrWnGK9ncgJQN5NOA0Tv5nn7yzyQlc0NRaOtmjinMIEuNoon1fYuxu_-dFfbtP3DLngXNlo87tesl6RKyffbxIDPAsp2jx0DKTJSTtpWcK0XFQ0ammaItqSTRsn15EBGUMSeeok0qIh2byzSSQ7nCZOTh02rvS-mLB3h6EEqFl2MO3VYNRtSGX6Sv1xfUaST20XwCW6XEf8fmFLlaPVskCALmwomyDAKG58IHZ8YTvjQGD8hOOtwo",
      bgColor: "from-[#ecfdf5] via-[#f0fdfa] to-[#ccfbf1]",
      textColor: "text-[#065f46]",
      taglineColor: "text-[#047857]",
      titleColor: "text-[#064e3b]",
      titleGradient: "from-[#064e3b] via-[#047857] to-[#0f172a]",
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
      title: "FULL BODY ACTIVE HEALTH CHECKUP",
      tagline: "Uncover hidden clinical risks and screen vital markers for comprehensive preventative care.",
      totalTests: "84 Vital Biomarkers",
      price: "1499",
      packageId: 131,
      searchKeys: ["advanced", "85 tests", "full body"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQu5pIuR0Ldjv4YKmjU4VYMp5SMtFx7hezaEpiQjxu7ZMsit_H-cJMpHXSf6kxWuO6I_ph85TssJR8VEOU2h8ECBs1G2A_cLAPRNFda6k8YCCWGGOzOls28EfP-5Lu0YPy1-IZVJNvsSEnSEsLzNLLOUnRNjkjbjN9v3to7rrUnHHcGVVxRwY3a-Ga34zGCDsl3An2Lt8X61C0rYaQssRtN0S-QhVaFRXscG_o_5KBWpyOYxBUVlrERlZLiU3fM3eejAw4H_uAk64",
      bgColor: "from-[#eff6ff] via-[#f0f9ff] to-[#e0f2fe]",
      textColor: "text-[#1e40af]",
      taglineColor: "text-[#1d4ed8]",
      titleColor: "text-[#1e3a8a]",
      titleGradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#0f172a]",
      badgeStyle: "bg-[#a9ece5] border border-[#236863]/30 text-[#286d67]",
      line1Color: "border-l-[#00535b]",
      line1Text: "text-[#236863]",
      line2Color: "border-l-indigo-600",
      line2Text: "text-indigo-700",
      btnClass: "bg-[#00535b] text-white hover:bg-[#236863] shadow-md",
      glowOverlay: "bg-[#edf6f9]0/10"
    },
    {
      badge: "👴 CARING GERIATRIC EXCELLENCE",
      title: "PREMIUM SENIOR CITIZEN WELLNESS PANEL",
      tagline: "Specifically mapped for older adults to track bone strength, renal clearances, and artery health.",
      totalTests: "68 Geriatric Markers",
      price: "2199",
      packageId: 2,
      searchKeys: ["senior", "citizen", "geriatric"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGtb-_r_RM-FsnGSBH-b-OXmhyYF-dQ_Mzq8pNWbkT3AwYtekvUYB26GmXLkuiTVW5NEHUTmnpuEt1kxxtZfLKQLlJeRTNxHmwRPE_FkEF5DL1z2_bAVUz8h7uSn_X6KMMrwGUVi3nr2dChj7xBzPTCbXRb6XGxNVSLZ5cdI2Qd644tmV_WhoTxzOKYHgqV15UC_Gd3n_t74CC86HXn0LkSQiNka6GdnWgszezgV9lMJ-TAMVwDTB8tdru8r7SZtgLsD2miRIZ7P4",
      bgColor: "from-[#fffbeb] via-[#fffbeb] to-[#fef3c7]",
      textColor: "text-[#92400e]",
      taglineColor: "text-[#b45309]",
      titleColor: "text-[#78350f]",
      titleGradient: "from-[#78350f] via-[#b45309] to-[#0f172a]",
      badgeStyle: "bg-amber-100 border border-amber-300 text-amber-800",
      line1Color: "border-l-amber-600",
      line1Text: "text-amber-700",
      line2Color: "border-l-orange-600",
      line2Text: "text-orange-700",
      btnClass: "bg-amber-600 text-white hover:bg-amber-700 shadow-md",
      glowOverlay: "bg-amber-500/10"
    }
  ];

  // Swipe Touch Gesture Handlers for Web/Tablet Hero Carousel
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

  const handleCarouselBook = (slide) => {
    // 1. Try exact packageId match first (most reliable)
    let matched = null;
    if (slide.packageId) {
      matched = packages.find(p => (p.id || p.package_id) === slide.packageId);
    }
    // 2. Fallback: try searchKeys in priority order
    if (!matched) {
      const keys = slide.searchKeys || [];
      for (const key of keys) {
        matched = packages.find(p => (p.name || p.package_name || "").toLowerCase().includes(key));
        if (matched) break;
      }
    }
    // 3. Last resort: first package or package listing
    const target = matched || packages[0];
    if (target) {
      handleBookPackage(target);
    } else {
      setPage("package-listing");
    }
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
          setPackages(data);
        }
      })
      .catch((err) => console.error("Error fetching packages:", err))
      .finally(() => setLoadingPackages(false));
  }, []);

  // Fetch Labs
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

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setTestName(searchQuery.trim());
      setPage("lab-listing");
    }
  };

  const handleBookPackage = (pkg) => {
    if (setSelectedPackage) {
      setSelectedPackage({ id: pkg.id || pkg.package_id, name: pkg.name || pkg.package_name });
      if (setSelectedBranch) {
        setSelectedBranch(null); // Clear previous branch to trigger lowest price fallback in package detail
      }
      setPage("package-detail");
    } else {
      setPage("package-listing");
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

  const labImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAngHQ8OEzvVUcA3ShYgCCr9Gky5SJ6Vmuy-LZ5lpfXvNN9BKxYhmnb2MtLkxQ6LqWzPV4LDWg_h-lyLqfhqrYiV8ukmsAJfHexBAuCEZ79VgVEkLsaCMyGlikZsLI0pMRC7elQ24VIhpRq5NZBRDs13jakTVhTwknP8c1uz5HSWNidMsaCDxksc6b4JQXwLGWeyw9XWXI9nf6SXNA_H27I5gEiHkfMmo2H7cgTPHpx2l99LNWfg_8ea28OgSiDYBHJEC6cVYfmfs8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDLiBmrj7mt46LEnFHeRVlYhGMgPMU-9yneTdsIGF1hUC3cXup_KkNy5uIc2a-VyQRdwILMYNe625Y9QAAZNzeXBDXmjjnFX89AZASnTLYT-JCsU8B0VW_yFzbHkCKJb6pdy2463naV5GulcAzWWi0rctpcmFsT0B20fd0afWBhe97dUu1m4TjadOZnLPyjwd0VHlH2sr5LKg00zLgIJ0Dmka15biZ8IBPWIsN1kQUA4RVZpTWtoOBh5GJqP-ZU-z1klaQGE3n4Vf0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAGtb-_r_RM-FsnGSBH-b-OXmhyYF-dQ_Mzq8pNWbkT3AwYtekvUYB26GmXLkuiTVW5NEHUTmnpuEt1kxxtZfLKQLlJeRTNxHmwRPE_FkEF5DL1z2_bAVUz8h7uSn_X6KMMrwGUVi3nr2dChj7xBzPTCbXRb6XGxNVSLZ5cdI2Qd644tmV_WhoTxzOKYHgqV15UC_Gd3n_t74CC86HXn0LkSQiNka6GdnWgszezgV9lMJ-TAMVwDTB8tdru8r7SZtgLsD2miRIZ7P4"
  ];

  return (
    <div className="mesh-gradient text-on-surface font-body min-h-screen">
      <main>
        {/* ── REVAMPED CAROUSEL HERO SECTION ── */}
        <section className="pt-8 pb-4 px-6 md:px-8 relative overflow-hidden bg-slate-50/50">
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Active Carousel Slide Container with Glassmorphism and Uniform Sizing */}
            <div 
              onTouchStart={handleHeroTouchStart}
              onTouchMove={handleHeroTouchMove}
              onTouchEnd={handleHeroTouchEnd}
              className={`w-full rounded-[2.5rem] bg-gradient-to-br ${carouselSlides[currentSlide].bgColor} p-8 lg:p-12 relative overflow-hidden shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8 h-[490px] md:h-[450px] lg:h-[420px] py-8 transition-all duration-500 ease-in-out border border-slate-200/60`}
            >
              
              {/* Dynamic Backdrop Glow matching each active slide */}
              <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -z-0 opacity-70 transition-all duration-500 ${carouselSlides[currentSlide].glowOverlay}`} />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

              {/* Left Column: Clinical Copy & Stats */}
              <div className="w-full lg:w-3/5 text-left text-slate-800 z-10 space-y-4">
                
                {/* Badge indicator with dynamic active glow styles */}
                <span className={`inline-block border text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest font-headline shadow-sm transition-all duration-300 ${carouselSlides[currentSlide].badgeStyle}`}>
                  {carouselSlides[currentSlide].badge}
                </span>

                {/* Main Slide Title with Custom Dynamic Metallic Gradient Text */}
                <h1 className={`font-headline text-[26px] md:text-[34px] lg:text-[38px] font-black tracking-tight uppercase leading-[1.1] bg-gradient-to-r ${carouselSlides[currentSlide].titleGradient} bg-clip-text text-transparent filter drop-shadow-sm`}>
                  {carouselSlides[currentSlide].title}
                </h1>

                {/* Sub-tagline */}
                <p className={`${carouselSlides[currentSlide].taglineColor} text-xs md:text-sm max-w-xl opacity-90 leading-relaxed font-body font-medium`}>
                  {carouselSlides[currentSlide].tagline}
                </p>

                {/* Stats & Pricing block side-by-side with vertical lines */}
                <div className="flex flex-wrap items-center gap-8 pt-1">
                  <div className={`flex items-center gap-3 border-l-2 ${carouselSlides[currentSlide].line1Color} pl-4 h-10`}>
                    <div>
                      <div className={`text-[9px] font-bold ${carouselSlides[currentSlide].line1Text} tracking-wider uppercase font-headline`}>Clinical Coverage</div>
                      <div className="text-lg md:text-xl font-black text-slate-800 font-headline leading-none mt-1">{carouselSlides[currentSlide].totalTests}</div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 border-l-2 ${carouselSlides[currentSlide].line2Color} pl-4 h-10`}>
                    <div>
                      <div className={`text-[9px] font-bold ${carouselSlides[currentSlide].line2Text} tracking-wider uppercase font-headline`}>Special Price</div>
                      <div className="text-lg md:text-xl font-black text-slate-800 font-headline leading-none mt-1">₹{carouselSlides[currentSlide].price}</div>
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="pt-2">
                  <button 
                    onClick={() => handleCarouselBook(carouselSlides[currentSlide])}
                    className={`${carouselSlides[currentSlide].btnClass} px-8 py-3 rounded-full font-black text-xs font-headline transition-all duration-150 active:scale-95 shadow-lg flex items-center justify-center uppercase tracking-wider cursor-pointer w-fit`}
                  >
                    Book Now
                    <span className="material-symbols-outlined text-sm ml-1.5 font-black">arrow_forward</span>
                  </button>
                </div>

                {/* Slide features bar underneath search */}
                <div className="flex flex-wrap gap-5 text-slate-500 text-[9.5px] uppercase font-bold tracking-widest font-headline pt-2">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span> Free collection in 60 Mins</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span> Smart Dynamic Reports</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span> Doctor Consultations</span>
                </div>

              </div>

              {/* Right Column: Professional Diagnostic Setting Visual inside pure 3D Isometric tablet mockup */}
              <div className="w-full lg:w-2/5 max-w-xs lg:max-w-sm relative z-10 flex justify-center group/tablet">
                <div className="w-[280px] h-[240px] lg:w-[340px] lg:h-[290px] bg-gradient-to-tr from-[#3b7572] to-[#5a9c99] rounded-[2.5rem] flex items-center justify-center p-6 shadow-2xl relative overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-white/[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Isometric 3D Tablet */}
                  <div 
                    style={{ transform: 'perspective(1200px) rotateX(18deg) rotateY(-18deg) rotateZ(12deg)' }}
                    className="relative rounded-[1.8rem] bg-[#0c0d0e] p-[8px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/15 select-none overflow-hidden aspect-[3/4] w-[150px] lg:w-[175px] transition-all duration-700 ease-out group-hover/tablet:scale-[1.03] group-hover/tablet:[transform:perspective(1200px)_rotateX(14deg)_rotateY(-14deg)_rotateZ(9deg)!important] group-hover/tablet:shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                  >
                    <img 
                      className="rounded-[1.3rem] w-full h-full object-cover transition-all duration-700"
                      alt={carouselSlides[currentSlide].title}
                      src={carouselSlides[currentSlide].image}
                    />
                    
                    {/* Pathology Mapped Live Pill Overlay */}
                    <div className="absolute bottom-3 left-3 bg-[#112423]/85 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] text-emerald-300 font-headline font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/15 shadow-lg select-none">
                      <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse shadow-md shadow-emerald-500/50" />
                      Pathology Mapped Live
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Slide Navigation Dots Indicators */}
            <div className="flex justify-center items-center gap-3 mt-6">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? "w-8 bg-primary" : "w-2.5 bg-outline-variant"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* How it Works Section - Clean Bento Style */}
        <section className="py-14 px-8 relative overflow-hidden pb-8">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl -z-10"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary/70 font-headline bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 inline-block mb-3">
                Simple Workflow
              </span>
              <h2 className="font-headline text-[36px] text-on-surface mb-4 font-extrabold tracking-tight">How ChooseMyLab Works</h2>
              <p className="text-base text-on-surface-variant max-w-xl mx-auto">Three simple steps to unlock complete clinical health transparency and save money.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-[2rem] border border-white/60 text-center bento-card hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-primary/5 text-primary border border-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-4xl">search_insights</span>
                </div>
                <h3 className="font-headline text-xl mb-3 font-bold text-on-surface">1. Search</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm opacity-90">
                  Browse our comprehensive catalog of NABL accredited laboratory tests and checkups.
                </p>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-white/60 text-center bento-card hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-primary/5 text-primary border border-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-4xl">compare_arrows</span>
                </div>
                <h3 className="font-headline text-xl mb-3 font-bold text-on-surface">2. Compare</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm opacity-90">
                  Instantly review laboratory comparisons, certified ratings, and pricing lists side-by-side.
                </p>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-white/60 text-center bento-card hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-primary/5 text-primary border border-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-4xl">event_available</span>
                </div>
                <h3 className="font-headline text-xl mb-3 font-bold text-on-surface">3. Book</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm opacity-90">
                  Securely schedule your clinic slot or convenient free home collection with NABL technicians.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Callback Advisor Widget relocated after How ChooseMyLab Works */}
        <section className="pt-4 pb-4 px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#286d67] hover:bg-[#006027] text-white px-8 py-5 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,114,47,0.12)] flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0 animate-bounce">📞</div>
                <div className="text-left">
                  <h4 className="font-headline font-bold text-base md:text-lg leading-tight">Get a Callback from our Health Advisor</h4>
                  <p className="text-white/80 text-xs mt-0.5">Enter your number to receive free expert pathlab advice.</p>
                </div>
              </div>

              <form onSubmit={handleCallbackSubmit} className="w-full md:w-auto flex items-center gap-3 flex-1 md:flex-initial max-w-md">
                <input 
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  maxLength={10}
                  className="flex-grow px-5 py-3.5 bg-white text-on-surface placeholder:text-on-surface-variant/40 rounded-2xl border-none outline-none text-xs font-bold font-body"
                  placeholder="Enter 10 digit mobile no." 
                  type="tel"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#ba1a1a] hover:bg-[#a01616] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 font-headline cursor-pointer shrink-0"
                >
                  Call Back
                </button>
              </form>
            </div>

            {/* Callback success notification message */}
            {callbackSuccess && (
              <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold font-body px-5 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-sm leading-none">check_circle</span>
                Successfully requested a callback! Our senior healthcare advisor will reach out to you within 15 minutes.
              </div>
            )}
          </div>
        </section>

        {/* Compare Labs Section - High-End Bento Showcase */}
        <section className="pt-8 pb-16 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-secondary font-headline bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/15 inline-block mb-3">
                📍 Verified Near You
              </span>
              <h2 className="font-headline text-[36px] text-on-surface mb-2 font-extrabold tracking-tight leading-none">Nearby Accredited Laboratories</h2>
              <p className="text-base text-on-surface-variant">Recommended pathology partners based on your active location parameters.</p>
            </div>
            <button 
              onClick={() => {
                if (setTestName) setTestName(null);
                setPage("lab-listing");
              }} 
              className="text-primary hover:text-primary-container font-bold flex items-center gap-2 group cursor-pointer text-sm font-headline bg-primary/5 px-5 py-3 rounded-2xl border border-primary/10 transition-all hover:bg-primary hover:text-on-primary"
            >
              <span>View all labs</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingLabs ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="glass rounded-[2rem] p-6 border border-white/60 pulse-shimmer h-[26rem] shadow-sm" />
              ))
            ) : labs.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-on-surface-variant glass rounded-[2rem] border border-white/60">
                <span className="material-symbols-outlined text-4xl text-primary/40 mb-4 block">location_off</span>
                <span className="font-headline font-bold text-lg text-on-surface block mb-1">No Nearby Labs Located</span>
                <span className="text-sm opacity-80">We couldn't detect any NABL labs. Try changing your search parameters.</span>
              </div>
            ) : (
              labs.map((lab, index) => (
                <div 
                  key={lab.branch_id || lab.id} 
                  className="glass rounded-[2rem] p-6 border border-white/60 bento-card shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(0,65,162,0.06)] flex flex-col justify-between h-[28rem] relative group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
                  
                  <div>
                    {/* Lab Header details */}
                    <div className="flex justify-between items-center mb-5">
                      <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-[10px] flex items-center gap-1 font-bold font-headline uppercase tracking-wider">
                        <span className="material-symbols-outlined text-xs fill-current">verified</span> NABL Certified
                      </span>
                      <span className="flex items-center gap-1 text-on-surface font-bold text-xs bg-white/50 px-2.5 py-1 rounded-xl border border-white/40">
                        <span className="material-symbols-outlined text-yellow-500 fill-current text-sm">star</span> 4.8
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl mb-5 shadow-inner aspect-[16/10] border border-white/35">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={lab.lab_name}
                        src={labImages[index % labImages.length]}
                      />
                    </div>

                    <h4 className="font-headline text-xl mb-1.5 font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                      {lab.lab_name}
                    </h4>
                    
                    <p className="text-on-surface-variant flex items-center gap-1.5 text-xs font-medium opacity-85">
                      <span className="material-symbols-outlined text-sm text-primary">schedule</span> 
                      <span>Results generated in <strong>{lab.turnaround_hours || "12-24"} hours</strong></span>
                    </p>
                  </div>

                  {/* Pricing footer block */}
                  <div className="flex items-center justify-between pt-5 border-t border-outline-variant/15 mt-5">
                    <div>
                      <span className="text-on-surface-variant text-[9px] font-bold uppercase tracking-wider block opacity-70">Starting at</span>
                      <span className="text-primary font-headline text-2xl font-extrabold">₹{lab.min_price || "199"}</span>
                    </div>
                    <button 
                      onClick={() => fetchTestsAtBranch(lab)}
                      className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold font-headline hover:bg-primary-container active:scale-95 transition-all shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 text-xs"
                    >
                      Book Clinic
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-primary text-on-primary pt-10 pb-20 overflow-visible relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 -translate-y-20"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="font-headline text-[26px] mb-5 leading-tight font-bold">
                  Your Health, Our Priority. Why ChooseMyLab?
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="bg-on-primary/10 p-2.5 rounded-xl text-white">
                      <span className="material-symbols-outlined text-2xl">verified_user</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm mb-1 font-bold text-white">NABL Certified Labs Only</h4>
                      <p className="text-on-primary/80 text-[11px] leading-relaxed">We only partner with accredited laboratories that meet strict quality and safety standards.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-on-primary/10 p-2.5 rounded-xl text-white">
                      <span className="material-symbols-outlined text-2xl">payments</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm mb-1 font-bold text-white">Best Price Guarantee</h4>
                      <p className="text-on-primary/80 text-[11px] leading-relaxed">Found a lower price elsewhere? We will match it and give you an extra discount.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-on-primary/10 p-2.5 rounded-xl text-white">
                      <span className="material-symbols-outlined text-2xl">lock</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-sm mb-1 font-bold text-white">Secure & Private Data</h4>
                      <p className="text-on-primary/80 text-[11px] leading-relaxed">Your medical data is encrypted and only accessible to you and your selected providers.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 relative max-w-sm">
                <div className="relative bg-surface-container-lowest/10 p-1 rounded-[32px]">
                  <img 
                    className="rounded-[30px] shadow-2xl w-full object-cover object-top" 
                    alt="Healthcare specialist" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3pN88HIjziN8XMIL3cEovAbKrWnGK9ncgJQN5NOA0Tv5nn7yzyQlc0NRaOtmjinMIEuNoon1fYuxu_-dFfbtP3DLngXNlo87tesl6RKyffbxIDPAsp2jx0DKTJSTtpWcK0XFQ0ammaItqSTRsn15EBGUMSeeok0qIh2byzSSQ7nCZOTh02rvS-mLB3h6EEqFl2MO3VYNRtSGX6Sv1xfUaST20XwCW6XEf8fmFLlaPVskCALmwomyDAKG58IHZ8YTvjQGD8hOOtwo"
                  />
                  {/* Stats badge overlaid on bottom-left of image */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-2xl shadow-xl text-slate-800 max-w-[140px] border border-slate-100 z-20">
                    <p className="font-headline text-2xl text-primary mb-0.5 font-bold">10k+</p>
                    <p className="font-bold text-[9px] uppercase tracking-wider text-slate-500 leading-tight">Patients served monthly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revamped Popular Health Packages with Carousel Slider */}
        <section className="py-14 px-8 max-w-7xl mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-green-600 font-headline bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 mb-3">
                <span className="material-symbols-outlined text-xs fill-current">verified</span> NABL Certified
              </span>
              <h2 className="font-headline text-[32px] font-black text-slate-800 tracking-tight leading-none">
                Popular Health Packages
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl font-medium leading-relaxed">
                Comprehensive screenings designed for every health goal. Transparent pricing, no hidden costs.
              </p>
            </div>
            
            {/* Carousel navigation arrows */}
            <div className="flex gap-2">
              <button 
                onClick={() => setPackageIndex(prev => Math.max(prev - 1, 0))}
                disabled={packageIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none border ${
                  packageIndex === 0 
                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200 cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button 
                onClick={() => setPackageIndex(prev => Math.min(prev + 1, getPopularPackages().length - 4))}
                disabled={packageIndex >= getPopularPackages().length - 4}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none shadow-md ${
                  packageIndex >= getPopularPackages().length - 4
                    ? "bg-slate-50 text-slate-300 shadow-none cursor-not-allowed border border-slate-100" 
                    : "bg-primary text-white hover:bg-primary-container cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            onTouchStart={handlePkgTouchStart}
            onTouchMove={handlePkgTouchMove}
            onTouchEnd={handlePkgTouchEnd}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 select-none"
          >
            {loadingPackages ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-slate-100 rounded-3xl p-6 pulse-shimmer h-[380px] shadow-sm" />
              ))
            ) : (
              getPopularPackages().slice(packageIndex, packageIndex + 4).map((pkg) => (
                <div key={pkg.id} className="bg-white border border-slate-100 hover:border-primary/20 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full min-h-[380px] relative group">
                  <div>
                    {/* Dynamic Icon */}
                    <div className={`p-3.5 rounded-2xl border inline-flex ${pkg.iconColor} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-2xl">{pkg.icon}</span>
                    </div>

                    <h4 className="font-headline text-lg font-black text-slate-800 leading-snug tracking-tight mt-5 group-hover:text-primary transition-colors">
                      {pkg.name}
                    </h4>

                    {/* Mapped checklists */}
                    <ul className="space-y-2 mt-5">
                      {pkg.bulletPoints.map((bp, idx) => (
                        <li key={idx} className="text-xs text-slate-600 font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-500 text-base leading-none">check_circle</span>
                          <span className="opacity-90">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    {/* Price block */}
                    <div className="flex items-baseline gap-2 mt-6">
                      <span className="text-primary font-headline text-2xl font-black">₹{pkg.price}</span>
                      <span className="text-slate-400 text-xs font-semibold line-through">₹{pkg.originalPrice}</span>
                    </div>

                    <button 
                      onClick={() => handleBookPackage({ id: pkg.id, name: pkg.name, price: pkg.price })}
                      className="bg-[#F1F3F6] hover:bg-primary hover:text-white text-slate-700 text-xs font-black py-3 rounded-xl transition-all duration-200 font-headline text-center cursor-pointer w-full mt-4 active:scale-95 shadow-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Popular Individual Tests Section with Slider */}
        <section className="py-14 px-8 max-w-7xl mx-auto text-left border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h2 className="font-headline text-[28px] font-black text-slate-800 tracking-tight leading-none">
                Popular Individual Tests
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Specific screenings for targeted diagnostic precision.
              </p>
            </div>
            
            {/* Tests Navigation Arrows */}
            <div className="flex gap-2">
              <button 
                onClick={() => setTestPageIndex(prev => Math.max(prev - 1, 0))}
                disabled={testPageIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none border ${
                  testPageIndex === 0 
                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200 cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button 
                onClick={() => setTestPageIndex(prev => Math.min(prev + 1, Math.ceil(getPopularTests().length / 6) - 1))}
                disabled={testPageIndex >= Math.ceil(getPopularTests().length / 6) - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 outline-none select-none shadow-md ${
                  testPageIndex >= Math.ceil(getPopularTests().length / 6) - 1
                    ? "bg-slate-50 text-slate-300 shadow-none cursor-not-allowed border border-slate-100" 
                    : "bg-primary text-white hover:bg-primary-container cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            onTouchStart={handleTestTouchStart}
            onTouchMove={handleTestTouchMove}
            onTouchEnd={handleTestTouchEnd}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 select-none"
          >
            {getPopularTests().slice(testPageIndex * 6, testPageIndex * 6 + 6).map((test, idx) => (
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
                className="bg-white border border-slate-100 hover:border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 bg-[#edf6f9] text-primary border border-[#a9ece5] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <span className="material-symbols-outlined text-lg leading-none">biotech</span>
                  </div>
                  <div className="text-left">
                    <h5 className="font-headline text-[13px] font-black text-slate-800 group-hover:text-primary transition-colors leading-tight">
                      {test.name}
                    </h5>
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1 leading-none">
                      <span className="material-symbols-outlined text-xs leading-none">schedule</span> {test.rep} TAT
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs font-black text-slate-800 font-headline">₹{test.price}</span>
                  <span className="h-5 w-5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-transparent flex items-center justify-center transition-all duration-200">
                    <span className="material-symbols-outlined text-xs leading-none">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => { setActiveCategoryFilter("Blood"); setPage("category-listing"); }}
              className="bg-gradient-to-r from-[#00828a] to-emerald-600 hover:from-[#006f75] hover:to-emerald-700 text-white text-sm font-black px-10 py-4 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00828a]/30 active:scale-95 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10">Explore All 500+ Tests</span>
              <span className="material-symbols-outlined text-base leading-none relative z-10 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Small & Compact Can't Decide Banner (Doctor Chat Button Hidden for now) */}
        <section className="py-2.5 px-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#00535b] to-[#236863] text-white rounded-2xl p-4 md:py-3.5 md:px-5 relative overflow-hidden shadow-lg text-left gap-6 min-h-[90px] md:min-h-[110px]">
            {/* Glowing blobs inside card */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#00535b]/20 rounded-full blur-2xl" />

            <div className="w-full md:w-3/5 relative z-10 space-y-2">
              <h3 className="font-headline text-sm md:text-base font-black leading-tight text-white tracking-tight">
                Can't decide which package is right for you?
              </h3>
              <p className="text-white/80 text-[9px] md:text-[10px] max-w-md font-medium leading-relaxed font-body">
                Our clinical experts are available for a free consultation to help you choose the best diagnostic path based on your symptoms and history.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-0.5">
                <a 
                  href="tel:1800123456"
                  className="bg-white hover:bg-slate-100 text-[#236863] text-[9px] font-black px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 duration-150 cursor-pointer uppercase tracking-wider font-headline inline-block"
                >
                  Free Expert Consult
                </a>
              </div>
            </div>

            {/* Compact Doctor Image Column */}
            <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-2 md:mt-0 relative z-10">
              <div className="relative max-w-[100px] md:max-w-[130px] lg:max-w-[145px]">
                <img 
                  className="w-full object-contain rounded-xl drop-shadow-lg border border-white/10" 
                  alt="Friendly doctor consulting" 
                  src="/doctor.png"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
