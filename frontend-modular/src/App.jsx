import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/home';
import { Detail, BranchTests, PackageCompare, PackageDetail } from './components/detail';
import { Booking } from './components/booking';
import { Signup } from './components/auth';
import { UserBookings, UserReports, UserProfile } from './components/dashboard';
import { Search } from './components/search';
import { CategoryListing } from './components/category-listing';
import { PackagesLanding } from './components/packages-landing';
import { PackagesListing } from './components/packages-listing';
import { ScanningLanding } from './components/scanning-landing';
import { ScansListing } from './components/scans-listing';
import { API_BASE_URL } from './config';
import { useIsMobile } from './utils/useIsMobile';
import { MobileSearchOverlay } from './components/layout/MobileSearchOverlay';



export default function App() {
  const isMobileViewport = useIsMobile();
  const [page, _setPage] = useState(() => {
    try {
      return sessionStorage.getItem("choosemylab_page") || "home";
    } catch {
      return "home";
    }
  });

  const [test, _setTest] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("choosemylab_test")) || null;
    } catch {
      return null;
    }
  });

  const [testName, _setTestName] = useState(() => {
    try {
      return sessionStorage.getItem("choosemylab_testName") || null;
    } catch {
      return null;
    }
  });

  const [q, setQ] = useState("");

  const [user, _setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("choosemylab_user")) || null;
    } catch {
      return null;
    }
  });

  const [allTests, setAllTests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cached_all_tests")) || [];
    } catch {
      return [];
    }
  });

  const [packages, setPackages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cached_packages")) || [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const [selectedPackage, _setSelectedPackage] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("choosemylab_selectedPackage")) || null;
    } catch {
      return null;
    }
  });

  const [userLocation, setUserLocation] = useState({
    lat: 28.6314,
    lng: 77.2789,
    label: "Delhi Pincode 110092"
  });

  const [selectedBranch, _setSelectedBranch] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("choosemylab_selectedBranch")) || null;
    } catch {
      return null;
    }
  });

  const [branchTests, setBranchTests] = useState([]);

  const [activeCategoryFilter, _setActiveCategoryFilter] = useState(() => {
    try {
      return sessionStorage.getItem("choosemylab_activeCategoryFilter") || "Home";
    } catch {
      return "Home";
    }
  });

  const setActiveCategoryFilter = (catName) => {
    _setActiveCategoryFilter(catName);
    try {
      sessionStorage.setItem("choosemylab_activeCategoryFilter", catName);
    } catch (e) {
      console.error(e);
    }
  };

  const setSelectedPackage = (pkg) => {
    _setSelectedPackage(pkg);
    try {
      if (pkg) sessionStorage.setItem("choosemylab_selectedPackage", JSON.stringify(pkg));
      else sessionStorage.removeItem("choosemylab_selectedPackage");
    } catch (e) {
      console.error(e);
    } 
  };

  const setSelectedBranch = (br) => {
    _setSelectedBranch(br);
    try {
      if (br) sessionStorage.setItem("choosemylab_selectedBranch", JSON.stringify(br));
      else sessionStorage.removeItem("choosemylab_selectedBranch");
    } catch (e) {
      console.error(e);
    }
  };

  const setUser = (u) => {
    _setUser(u);
    if (u) localStorage.setItem("choosemylab_user", JSON.stringify(u));
    else localStorage.removeItem("choosemylab_user");
  };

  const stateRef = useRef({ test: null, testName: null });

  useEffect(() => {
    try {
      stateRef.current.test = JSON.parse(sessionStorage.getItem("choosemylab_test"));
      stateRef.current.testName = sessionStorage.getItem("choosemylab_testName");
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setTest = (t) => {
    stateRef.current.test = t;
    _setTest(t);
    try {
      if (t) sessionStorage.setItem("choosemylab_test", JSON.stringify(t));
      else sessionStorage.removeItem("choosemylab_test");
    } catch (e) {
      console.error(e);
    }
  };

  const setTestName = (tn) => {
    stateRef.current.testName = tn;
    _setTestName(tn);
    try {
      if (tn) sessionStorage.setItem("choosemylab_testName", tn);
      else sessionStorage.removeItem("choosemylab_testName");
    } catch (e) {
      console.error(e);
    }
  };

  const setPage = (newPage) => {
    _setPage(newPage);
    try {
      sessionStorage.setItem("choosemylab_page", newPage);
    } catch (e) {
      console.error(e);
    }
    window.history.pushState(
      {
        page: newPage,
        test: stateRef.current.test,
        testName: stateRef.current.testName,
      },
      "",
      "",
    );
  };

  useEffect(() => {
    window.history.replaceState(
      { page: "home", test: null, testName: null },
      "",
      "",
    );

    const handlePopState = (e) => {
      if (e.state && e.state.page) {
        _setPage(e.state.page);
        try {
          sessionStorage.setItem("choosemylab_page", e.state.page);
        } catch {}
        if (e.state.test !== undefined) setTest(e.state.test);
        if (e.state.testName !== undefined) setTestName(e.state.testName);
      } else {
        _setPage("home");
        try {
          sessionStorage.setItem("choosemylab_page", "home");
        } catch {}
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const requestGeolocation = (silent = true) => {
    if (!navigator.geolocation) {
      if (!silent) {
        alert("Geolocation is not supported by your browser.");
      }
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "My Location",
        });
      },
      (error) => {
        console.warn("Geolocation failed:", error.message);
        if (!silent) {
          alert("Location access denied or unavailable. Please search manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  };

  useEffect(() => {
    requestGeolocation(true);
  }, []);

  // Fetch tests dynamically from PostgreSQL database!
  useEffect(() => {
    const params = userLocation
      ? `?lat=${encodeURIComponent(userLocation.lat)}&lng=${encodeURIComponent(userLocation.lng)}`
      : "";
    
    setLoading(true);

    const testPromise = fetch(`${API_BASE_URL}/api/tests${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllTests(data);
          try {
            localStorage.setItem("cached_all_tests", JSON.stringify(data));
          } catch (e) {
            console.error("Failed to cache tests:", e);
          }
        }
      })
      .catch((err) => console.error("Database test fetch error:", err));

    const packagePromise = fetch(`${API_BASE_URL}/api/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPackages(data);
          try {
            localStorage.setItem("cached_packages", JSON.stringify(data));
          } catch (e) {
            console.error("Failed to cache packages:", e);
          }
        }
      })
      .catch((err) => console.error("Database package fetch error:", err));

    Promise.allSettled([testPromise, packagePromise]).finally(() => {
      setLoading(false);
    });
  }, [userLocation]);

  function renderPage() {
    switch (page) {
      case "home":
        return (
          <Home
            setPage={setPage}
            setTestName={setTestName}
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
            userLocation={userLocation}
            requestGeolocation={requestGeolocation}
            setSelectedPackage={setSelectedPackage}
            user={user}
            allTests={allTests}
            setActiveCategoryFilter={setActiveCategoryFilter}
            setTest={setTest}
          />
        );

      case "package":
        return (
          <PackagesLanding
            setPage={setPage}
            setSelectedPackage={setSelectedPackage}
            setActiveCategoryFilter={setActiveCategoryFilter}
            user={user}
          />
        );
      case "scans-landing":
        return (
          <ScanningLanding
            setPage={setPage}
            setSelectedPackage={setSelectedPackage}
            setActiveCategoryFilter={setActiveCategoryFilter}
            user={user}
            setTestName={setTestName}
          />
        );
      case "package-listing":
        return (
          <PackagesListing
            setPage={setPage}
            setSelectedPackage={setSelectedPackage}
            setSelectedBranch={setSelectedBranch}
            user={user}
            userLocation={userLocation}
            requestGeolocation={requestGeolocation}
            activeCategoryFilter={activeCategoryFilter}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        );

      case "package-compare":
        return (
          <PackageCompare
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            setPage={setPage}
            setTest={setTest}
            user={user}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );

      case "detail":
        return <Detail test={test} setPage={setPage} setTest={setTest} user={user} />;
      case "package-detail":
        return (
          <PackageDetail
            selectedPackage={selectedPackage}
            selectedBranch={selectedBranch}
            setPage={setPage}
            setTest={setTest}
            setSelectedPackage={setSelectedPackage}
            setSelectedBranch={setSelectedBranch}
            user={user}
          />
        );
      case "lab-listing":
        return (
          <Search
            testName={testName}
            setTestName={setTestName}
            setPage={setPage}
            setTest={setTest}
            user={user}
            userLocation={userLocation}
            setActiveCategoryFilter={setActiveCategoryFilter}
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
          />
        );

      case "category-listing":
        return (
          <CategoryListing
            categoryName={activeCategoryFilter}
            setPage={setPage}
            setTest={setTest}
            setSelectedPackage={setSelectedPackage}
            user={user}
            userLocation={userLocation}
            setTestName={setTestName}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        );

      case "scans-listing":
        return (
          <ScansListing
            categoryName={activeCategoryFilter}
            setPage={setPage}
            setTest={setTest}
            setSelectedPackage={setSelectedPackage}
            user={user}
            userLocation={userLocation}
            setTestName={setTestName}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        );

      case "branch-tests":
        return (
          <BranchTests
            selectedBranch={selectedBranch}
            branchTests={branchTests}
            setPage={setPage}
            setTest={setTest}
            user={user}
          />
        );
      case "booking":
        return (
          <Booking
            test={test}
            user={user}
            setPage={setPage}
            userLocation={userLocation}
          />
        );
      case "signup":
        return <Signup setUser={setUser} setPage={setPage} />;
      case "bookings-page":
        return <UserBookings user={user} setPage={setPage} />;
      case "reports-page":
        return <UserReports user={user} setPage={setPage} />;
      case "profile-page":
        return <UserProfile user={user} setPage={setPage} setUser={setUser} />;
      default:
        return (
          <Home
            setPage={setPage}
            setTestName={setTestName}
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
            userLocation={userLocation}
            requestGeolocation={requestGeolocation}
            setSelectedPackage={setSelectedPackage}
            user={user}
            allTests={allTests}
            setActiveCategoryFilter={setActiveCategoryFilter}
            setTest={setTest}
          />
        );
    }
  }

  function renderMobileBottomNav() {
    const isSearchActive = page !== "package-compare" && page !== "profile-page" && page !== "bookings-page" && page !== "reports-page";
    const isCompareActive = page === "package-compare";
    const isProfileActive = page === "profile-page" || page === "bookings-page" || page === "reports-page";

    return (
      <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-full px-4 py-2.5 flex justify-between items-center max-w-md mx-auto select-none">
        <button 
          onClick={() => setSearchOpen(true)} 
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            isSearchActive 
              ? "bg-[#006d77] text-white rounded-2xl w-[88px] h-[58px] shadow-lg shadow-[#00535b]/15 active:scale-95" 
              : "text-slate-500/80 hover:text-[#006d77] w-[72px] h-[58px] rounded-2xl active:scale-90"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] font-bold">search</span>
          <span className="font-headline font-black text-[9px] uppercase tracking-wider mt-0.5">Search</span>
        </button>
        
        <button 
          onClick={() => setPage("package-compare")} 
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            isCompareActive 
              ? "bg-[#006d77] text-white rounded-2xl w-[88px] h-[58px] shadow-lg shadow-[#00535b]/15 active:scale-95" 
              : "text-slate-500/80 hover:text-[#006d77] w-[72px] h-[58px] rounded-2xl active:scale-90"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          <span className="font-headline font-extrabold text-[9px] uppercase tracking-wider mt-0.5">Compare</span>
        </button>
        
        <button 
          onClick={() => setPage("profile-page")} 
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            isProfileActive 
              ? "bg-[#006d77] text-white rounded-2xl w-[88px] h-[58px] shadow-lg shadow-[#00535b]/15 active:scale-95" 
              : "text-slate-500/80 hover:text-[#006d77] w-[72px] h-[58px] rounded-2xl active:scale-90"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
          <span className="font-headline font-extrabold text-[9px] uppercase tracking-wider mt-0.5">Profile</span>
        </button>
      </nav>
    );
  }

  const hideGlobalNavFooter = (page === 'category-listing' || page === 'scans-listing') && isMobileViewport;

  if (hideGlobalNavFooter) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pb-24">
        <main className="w-full">
          {renderPage()}
        </main>
        
        {/* Mobile Search Overlay */}
        <MobileSearchOverlay 
          isOpen={searchOpen} 
          onClose={() => setSearchOpen(false)} 
          setPage={setPage} 
          setTestName={setTestName} 
          setActiveCategoryFilter={setActiveCategoryFilter} 
        />

        {/* Global Mobile Capsule Bottom Navbar */}
        {renderMobileBottomNav()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between overflow-x-hidden w-full max-w-full pb-24 md:pb-0">
      <div>
        <Navbar
          page={page}
          setPage={setPage}
          q={q}
          setQ={setQ}
          user={user}
          setUser={setUser}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          requestGeolocation={requestGeolocation}
          activeCategoryFilter={activeCategoryFilter}
          setActiveCategoryFilter={setActiveCategoryFilter}
          allTests={allTests}
          packages={packages}
          setTest={setTest}
          setSelectedPackage={setSelectedPackage}
          setTestName={setTestName}
        />
        <main className="w-full">
          {renderPage()}
        </main>
      </div>
      <Footer page={page} setPage={setPage} setTestName={setTestName} />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        setPage={setPage} 
        setTestName={setTestName} 
        setActiveCategoryFilter={setActiveCategoryFilter} 
      />

      {/* Global Mobile Capsule Bottom Navbar */}
      {isMobileViewport && renderMobileBottomNav()}
    </div>
  );
}
