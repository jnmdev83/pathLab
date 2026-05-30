import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { API_BASE_URL } from '../../config';
import { LabDetailPanel } from '../detail/LabDetailPanel';

const PAGE_LIMIT = 8;

export function Search({ 
  testName, 
  setTestName, 
  setPage, 
  setTest, 
  user, 
  userLocation, 
  setActiveCategoryFilter,
  setSelectedBranch,
  setBranchTests
}) {
  const isMobile = useIsMobile();

  const [testMeta, setTestMeta]     = useState(null);
  const [topPicks, setTopPicks]     = useState(null);
  const [results,  setResults]      = useState([]);
  const [curPage,  setCurPage]      = useState(1);
  const [total,    setTotal]        = useState(0);
  const [hasMore,  setHasMore]      = useState(false);
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(null);

  const [sort,    setSort]    = useState('popularity');
  const [filters, setFilters] = useState({
    maxPrice:   null,
    turnaround: [],
    collection: null,
    nabl:       false,
    rating:     'all',
  });

  // ── Resolve test name → meta ──────────────────────────────────────────────
  useEffect(() => {
    if (!testName) {
      setTestMeta({
        name: "All Laboratories",
        total_labs: 0,
        description: "Explore accredited NABL labs and diagnostic partners near you."
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/tests/search?q=${encodeURIComponent(testName)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        if (testName.toLowerCase().includes(' vs ')) {
          data.name = testName;
        }
        setTestMeta(data);
      })
      .catch(err => {
        console.error('Test meta fetch error:', err);
        setError('Could not find that test. Please go back and try again.');
        setLoading(false);
      });
  }, [testName]);

  // ── Build paginated query string ──────────────────────────────────────────
  const buildParams = useCallback((pg = 1) => {
    const p = new URLSearchParams({ page: pg, limit: PAGE_LIMIT, sort });
    if (userLocation?.lat) p.set('lat', userLocation.lat);
    if (userLocation?.lng) p.set('lng', userLocation.lng);
    if (filters.maxPrice)                p.set('max_price',  filters.maxPrice);
    if (filters.collection)              p.set('collection', filters.collection);
    if (filters.nabl)                    p.set('nabl',       'true');
    if (filters.turnaround.length > 0)   p.set('turnaround', filters.turnaround[0]);
    if (filters.rating && filters.rating !== 'all') p.set('rating', filters.rating);
    return p.toString();
  }, [sort, filters, userLocation]);

  // ── Fetch page 1 + top-picks whenever meta / sort / filters change ────────
  useEffect(() => {
    if (!testMeta) return;

    if (!testMeta.id) {
      // Discovery Mode: Fetch all labs nearby or in city
      setLoading(true);
      setCurPage(1);
      setResults([]);
      setTopPicks(null);

      const lat = userLocation?.lat || 28.6314;
      const lng = userLocation?.lng || 77.2789;

      fetch(`${API_BASE_URL}/api/labs/nearby?lat=${lat}&lng=${lng}&radius=20`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((item, idx) => ({
              lab_id: item.lab_id || item.id,
              lab_name: item.lab_name || item.name,
              is_verified: true,
              rating: 4.8,
              booking_count: 1200 + (idx * 110),
              branch_id: item.branch_id || item.id,
              branch_name: item.branch_name,
              address: item.address,
              city: item.city,
              phone: item.phone,
              latitude: item.latitude,
              longitude: item.longitude,
              home_collection: item.home_collection,
              operating_hours: item.operating_hours || "8 AM - 8 PM",
              price: item.min_price || 199,
              reporting_time: item.turnaround_hours ? `${item.turnaround_hours} Hours` : "12-24 Hours",
              is_available: true,
              test_id: null,
              test_name: null,
            }));
            setResults(mapped);
            setTotal(mapped.length);
            setHasMore(false);
          } else {
            // Fallback to city
            fetch(`${API_BASE_URL}/api/labs/city?city=Delhi`)
              .then(r => r.json())
              .then(cityData => {
                if (Array.isArray(cityData)) {
                  const mapped = cityData.map((item, idx) => ({
                    lab_id: item.lab_id || item.id,
                    lab_name: item.lab_name || item.name,
                    is_verified: true,
                    rating: 4.8,
                    booking_count: 1200 + (idx * 110),
                    branch_id: item.branch_id || item.id,
                    branch_name: item.branch_name,
                    address: item.address,
                    city: item.city,
                    phone: item.phone,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    home_collection: item.home_collection,
                    operating_hours: item.operating_hours || "8 AM - 8 PM",
                    price: item.min_price || 199,
                    reporting_time: item.turnaround_hours ? `${item.turnaround_hours} Hours` : "12-24 Hours",
                    is_available: true,
                    test_id: null,
                    test_name: null,
                  }));
                  setResults(mapped);
                  setTotal(mapped.length);
                  setHasMore(false);
                }
              });
          }
        })
        .catch(err => console.error('Discovery labs fetch error:', err))
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    setCurPage(1);
    setResults([]);

    const pricesUrl   = `${API_BASE_URL}/api/tests/${testMeta.id}/prices?${buildParams(1)}`;
    const topPicksUrl = `${API_BASE_URL}/api/tests/${testMeta.id}/top-picks`;

    Promise.all([
      fetch(pricesUrl).then(r => r.json()),
      fetch(topPicksUrl).then(r => r.json()).catch(() => null),
    ])
      .then(([pricesData, topPicksData]) => {
        if (pricesData.results !== undefined) {
          setResults(pricesData.results);
          setTotal(pricesData.total ?? 0);
          setHasMore(pricesData.hasMore ?? false);
        } else if (Array.isArray(pricesData)) {
          // backwards-compat fallback
          setResults(pricesData);
          setTotal(pricesData.length);
          setHasMore(false);
        }
        if (topPicksData && !topPicksData.error) setTopPicks(topPicksData);
      })
      .catch(err => console.error('Search fetch error:', err))
      .finally(() => setLoading(false));
  }, [testMeta, sort, filters, buildParams, userLocation]);

  // ── Load More ─────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !testMeta?.id) return;
    const nextPage = curPage + 1;
    setLoadingMore(true);
    fetch(`${API_BASE_URL}/api/tests/${testMeta.id}/prices?${buildParams(nextPage)}`)
      .then(r => r.json())
      .then(data => {
        if (data.results) {
          setResults(prev => [...prev, ...data.results]);
          setCurPage(nextPage);
          setHasMore(data.hasMore ?? false);
        }
      })
      .catch(err => console.error('Load more error:', err))
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, testMeta, curPage, buildParams]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const handleBook = (labRow) => {
    if (!testName || !labRow.test_id) {
      fetch(`${API_BASE_URL}/api/branches/${labRow.branch_id || labRow.id}/tests`)
        .then((res) => res.json())
        .then((data) => {
          if (setSelectedBranch) setSelectedBranch(labRow);
          if (setBranchTests) setBranchTests(Array.isArray(data) ? data : []);
          setPage("branch-tests");
        })
        .catch(err => console.error("Could not fetch tests for this branch:", err));
      return;
    }

    setTest({
      id:            labRow.test_id,
      name:          testMeta?.name || testName,
      price:         labRow.price,
      lab:           labRow.lab_name,
      lab_id:        labRow.lab_id,
      lab_branch_id: labRow.branch_id,
      branch_name:   labRow.branch_name,
      reporting_time: labRow.reporting_time,
      address:       labRow.address,
      city:          labRow.city,
      home_collection: labRow.home_collection,
      ok: true,
    });
    setPage('booking');
  };

  const handleDetails = (labRow) => {
    if (!testName || !labRow.test_id) {
      handleBook(labRow);
      return;
    }

    setTest({
      id:            labRow.test_id,
      name:          testMeta?.name || testName,
      price:         labRow.price,
      lab:           labRow.lab_name,
      lab_branch_id: labRow.branch_id,
    });
    setPage('detail');
  };

  const resetFilters = () => {
    setFilters({ maxPrice: null, turnaround: [], collection: null, nabl: false, rating: 'all' });
    setSort('popularity');
    setSelectedCompare([]);
    setCompareOpen(false);
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-outline/40 block mb-4">search_off</span>
        <p className="text-on-surface-variant mb-4">{error}</p>
        <button onClick={() => setPage('home')} className="text-primary font-bold hover:underline">
          ← Back to Home
        </button>
      </div>
    );
  }

  const filteredResults = !testMeta?.id
    ? (() => {
        let r = results.filter(item => {
          if (filters.maxPrice && item.price > filters.maxPrice) return false;
          if (filters.collection === 'home' && !item.home_collection) return false;
          if (filters.collection === 'lab' && item.home_collection) return false;
          if (filters.nabl && !item.is_verified) return false;
          if (filters.rating && filters.rating !== 'all' && item.rating < parseFloat(filters.rating)) return false;
          return true;
        });
        if (sort === 'rating') r = [...r].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (sort === 'price_asc') r = [...r].sort((a, b) => (a.price || 0) - (b.price || 0));
        if (sort === 'price_desc') r = [...r].sort((a, b) => (b.price || 0) - (a.price || 0));
        return r;
      })()
    : results;

  const viewProps = {
    testMeta: testMeta || { name: testName || 'Lab Tests', total_labs: 0, description: '' },
    topPicks,
    results: filteredResults,
    total: !testMeta?.id ? filteredResults.length : total,
    hasMore,
    loading,
    loadingMore,
    sort,
    setSort,
    filters,
    setFilters,
    loadMore,
    handleBook,
    handleDetails,
    resetFilters,
    setPage,
    user,
    setTestName,
    setActiveCategoryFilter,
    selectedCompare,
    setSelectedCompare,
    compareOpen,
    setCompareOpen,
    setSelectedLab
  };

  return (
    <>
      {isMobile ? (
        <MobileLayout {...viewProps} />
      ) : (
        <WebLayout {...viewProps} />
      )}
      {selectedLab && (
        <LabDetailPanel
          labId={selectedLab.lab_id}
          labName={selectedLab.lab_name}
          testName={selectedLab.testName || testMeta?.name || testName || 'Lab Test'}
          testPrice={selectedLab.price}
          onClose={() => setSelectedLab(null)}
          onBook={selectedLab.bookFn}
        />
      )}
    </>
  );
}
