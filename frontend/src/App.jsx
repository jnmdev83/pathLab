import React, { useState, useEffect, useRef, useMemo } from 'react';
import { S } from './utils/reusables';
import { Navbar } from './components/NAVBAR';
import { Home } from './components/HOME';
import { Listing } from './components/TESTLISTING';
import { LabListing } from './components/LABLISTING';
import { BranchTests } from './components/DETAILPAGE';
import { Detail } from './components/DETAILPAGE';
import { Booking } from './components/BOOKINGPAGE';
import { Signup } from './components/SIGNUPLOGIN';
import { Search } from './components/SEARCHPAGE';
import { ComingSoon } from './components/COMINGSOON';
import { Footer } from './components/FOOTER';
import { UserBookings } from './components/USERDASHBOARDPAGES';
import { UserReports } from './components/USERDASHBOARDPAGES';
import { UserProfile } from './components/USERDASHBOARDPAGES';
import { PackageCompare } from './components/PACKAGECOMPARE';
import { API_BASE_URL } from './config';

export default function App() {
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
  // Rehydrate user from localStorage so login persists across page refreshes
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
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem("cached_all_tests");
      return !cached;
    } catch {
      return true;
    }
  });
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
    label: "Delhi Pincode 110092 (Shakarpur)"
  });
  const [selectedBranch, _setSelectedBranch] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("choosemylab_selectedBranch")) || null;
    } catch {
      return null;
    }
  });
  const [branchTests, setBranchTests] = useState([]);

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

  // Use a ref to always capture the latest state synchronously
  // before pushState is executed, bypassing React's async batching.
  const stateRef = useRef({ test: null, testName: null });

  // Sync ref with initial state from sessionStorage
  useEffect(() => {
    try {
      const initialTest = JSON.parse(sessionStorage.getItem("choosemylab_test"));
      const initialTestName = sessionStorage.getItem("choosemylab_testName");
      stateRef.current.test = initialTest;
      stateRef.current.testName = initialTestName;
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

  // Enable Browser Back Button Navigation
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
    // Initialize first state
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
        alert("Geolocation is not supported by your browser. Please enter your location or enable location access manually.");
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
        console.warn("Geolocation failed or denied:", error.message);
        if (!silent) {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (error.code === 1) {
            alert(
              isMobile
                ? "Location permission denied. Please allow location permissions for ChooseMyLab in your phone settings to find nearby labs."
                : "Location access denied. Please allow location permissions for ChooseMyLab in your browser settings to find nearby labs."
            );
          } else {
            alert(
              isMobile
                ? "Could not detect location. Please turn on your mobile device's GPS/Location services (e.g. from swipe down quick settings) and try again."
                : "Unable to detect location. Please ensure your device's location services (GPS) are enabled and browser access is allowed, then try again."
            );
          }
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  };

  useEffect(() => {
    requestGeolocation(true);
  }, []);


  // Fetch tests dynamically from our PostgreSQL database!
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
            console.error("Failed to save cached tests:", e);
          }
        }
      })
      .catch((err) => console.error("Database not running yet:", err));

    const packagePromise = fetch(`${API_BASE_URL}/api/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPackages(data);
          try {
            localStorage.setItem("cached_packages", JSON.stringify(data));
          } catch (e) {
            console.error("Failed to save cached packages:", e);
          }
        }
      })
      .catch((err) => console.error("Could not fetch packages:", err));

    Promise.allSettled([testPromise, packagePromise]).finally(() => {
      setLoading(false);
    });
  }, [userLocation]);

  function render() {
    switch (page) {
      case "home":
        return (
          <Home
            setPage={setPage}
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
            userLocation={userLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "blood":
        return (
          <Listing
            cat="blood"
            title="Blood Tests"
            setPage={setPage}
            setTestName={setTestName}
            allTests={allTests}
            loading={loading}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "package":
        return (
          <Listing
            cat="package"
            title="Health Packages"
            setPage={setPage}
            setTestName={setTestName}
            allTests={allTests}
            packages={packages}
            setSelectedPackage={setSelectedPackage}
            loading={loading}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "package-compare":
        return (
          <PackageCompare
            selectedPackage={selectedPackage}
            setPage={setPage}
            setTest={setTest}
            user={user}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "scanning":
        return (
          <Listing
            cat="scanning"
            title="Scanning Tests"
            setPage={setPage}
            setTestName={setTestName}
            allTests={allTests}
            loading={loading}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "gastro":
        return (
          <Listing
            cat="gastro"
            title="Gastroenterology"
            setPage={setPage}
            setTestName={setTestName}
            allTests={allTests}
            loading={loading}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "consultation":
        return <ComingSoon title="Doctor Consultation" />;
      case "lab-listing":
        return (
          <LabListing
            testName={testName}
            setPage={setPage}
            setTest={setTest}
            allTests={allTests}
            user={user}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            requestGeolocation={requestGeolocation}
          />
        );
      case "detail":
        return <Detail test={test} setPage={setPage} user={user} />;
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
      case "search":
        return (
          <Search
            q={q}
            setPage={setPage}
            setTest={setTest}
            allTests={allTests}
            user={user}
          />
        );
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
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
          />
        );
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar
        page={page}
        setPage={setPage}
        q={q}
        setQ={setQ}
        user={user}
        setUser={setUser}
      />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "var(--main-padding)" }}>
        {render()}
      </main>
      <Footer />
    </div>
  );
}
