import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { API_BASE_URL } from '../../config';

const PAGE_LIMIT = 8;

export function Search({ testName, setPage, setTest, user, userLocation }) {
  const isMobile = useIsMobile();

  const [testMeta, setTestMeta]     = useState(null);
  const [topPicks, setTopPicks]     = useState(null);
  const [results,  setResults]      = useState([]);
  const [curPage,  setCurPage]      = useState(1);
  const [total,    setTotal]        = useState(0);
  const [hasMore,  setHasMore]      = useState(false);

  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(null);

  const [sort,    setSort]    = useState('popularity');
  const [filters, setFilters] = useState({
    maxPrice:   null,
    turnaround: [],
    collection: null,
    nabl:       false,
  });

  // ── Resolve test name → meta ──────────────────────────────────────────────
  useEffect(() => {
    if (!testName) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/tests/search?q=${encodeURIComponent(testName)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
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
    return p.toString();
  }, [sort, filters, userLocation]);

  // ── Fetch page 1 + top-picks whenever meta / sort / filters change ────────
  useEffect(() => {
    if (!testMeta?.id) return;

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
  }, [testMeta, sort, filters, buildParams]);

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
    setFilters({ maxPrice: null, turnaround: [], collection: null, nabl: false });
    setSort('popularity');
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

  const viewProps = {
    testMeta: testMeta || { name: testName || 'Lab Tests', total_labs: 0, description: '' },
    topPicks,
    results,
    total,
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
  };

  if (isMobile) return <MobileLayout {...viewProps} />;
  return <WebLayout {...viewProps} />;
}
