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

export default function App() {
  const [page, _setPage] = useState("home");
  const [test, _setTest] = useState(null);
  const [testName, _setTestName] = useState(null);
  const [q, setQ] = useState("");
  // Rehydrate user from localStorage so login persists across page refreshes
  const [user, _setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pathlab_user")) || null;
    } catch {
      return null;
    }
  });
  const [allTests, setAllTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchTests, setBranchTests] = useState([]);

  const setUser = (u) => {
    _setUser(u);
    if (u) localStorage.setItem("pathlab_user", JSON.stringify(u));
    else localStorage.removeItem("pathlab_user");
  };

  // Use a ref to always capture the latest state synchronously
  // before pushState is executed, bypassing React's async batching.
  const stateRef = useRef({ test: null, testName: null });

  const setTest = (t) => {
    stateRef.current.test = t;
    _setTest(t);
  };

  const setTestName = (tn) => {
    stateRef.current.testName = tn;
    _setTestName(tn);
  };

  // Enable Browser Back Button Navigation
  const setPage = (newPage) => {
    _setPage(newPage);
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
        if (e.state.test !== undefined) setTest(e.state.test);
        if (e.state.testName !== undefined) setTestName(e.state.testName);
      } else {
        _setPage("home");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Current browser location",
        });
      },
      () => {
        setUserLocation(null);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  // Fetch tests dynamically from our PostgreSQL database!
  useEffect(() => {
    const params = userLocation
      ? `?lat=${encodeURIComponent(userLocation.lat)}&lng=${encodeURIComponent(userLocation.lng)}`
      : "";
    
    // Fetch tests
    fetch(`http://localhost:5000/api/tests${params}`)
      .then((res) => res.json())
      .then((data) => setAllTests(data))
      .catch((err) => console.error("Database not running yet:", err));

    // Fetch common packages
    fetch(`http://localhost:5000/api/packages`)
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Could not fetch packages:", err));
  }, [userLocation]);

  function render() {
    switch (page) {
      case "home":
        return (
          <Home
            setPage={setPage}
            setSelectedBranch={setSelectedBranch}
            setBranchTests={setBranchTests}
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
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {render()}
      </main>
      <Footer />
    </div>
  );
}
