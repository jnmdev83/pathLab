import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { LabDetailPanel } from '../detail/LabDetailPanel';

export function ScansListing({
  categoryName,
  setPage,
  setTest,
  setSelectedPackage,
  user,
  userLocation,
  setTestName,
  setActiveCategoryFilter
}) {
  const isMobile = useIsMobile();
  const [category, setCategory] = useState(categoryName || 'Imaging');
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [bodyPart, setBodyPart] = useState("All Body Parts");
  const [equipmentType, setEquipmentType] = useState("");
  const [anesthesia, setAnesthesia] = useState(false);
  const [sort, setSort] = useState("Popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState("all");

  const [data, setData] = useState({
    tests: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    filters: {
      body_parts: [],
      equipment_types: []
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync category state with prop categoryName if it changes externally
  useEffect(() => {
    if (categoryName && categoryName !== 'Home') {
      setCategory(categoryName);
    }
  }, [categoryName]);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, maxPrice, bodyPart, equipmentType, anesthesia, sort, rating]);

  // Fetch scans listing data
  useEffect(() => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      category,
      search: search.trim(),
      max_price: maxPrice,
      body_part: bodyPart,
      equipment_type: equipmentType,
      anesthesia: anesthesia ? 'true' : 'false',
      sort,
      page: currentPage,
      limit: 8
    });

    fetch(`${API_BASE_URL}/api/scans/listing?${queryParams.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load scans listing data');
        return res.json();
      })
      .then(json => {
        if (currentPage === 1) {
          setData(json);
        } else {
          setData(prev => ({
            ...prev,
            tests: [...prev.tests, ...(json.tests || [])],
            currentPage: json.currentPage,
            totalPages: json.totalPages
          }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Could not fetch scans.');
        setLoading(false);
      });
  }, [category, search, maxPrice, bodyPart, equipmentType, anesthesia, sort, currentPage]);

  const handleCategorySwitch = (newCat) => {
    setCategory(newCat);
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(newCat);
    }
    // Reset filters
    setSearch("");
    setMaxPrice(5000);
    setBodyPart("All Body Parts");
    setEquipmentType("");
    setAnesthesia(false);
    setRating("all");
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setMaxPrice(5000);
    setBodyPart("All Body Parts");
    setEquipmentType("");
    setAnesthesia(false);
    setSort("Popularity");
    setRating("all");
    setCurrentPage(1);
  };

  const [selectedLab, setSelectedLab] = useState(null);

  const getTestRating = (test) => {
    return (4.2 + (test.id % 8) * 0.1).toFixed(1);
  };

  const filteredTests = (() => {
    let result = rating === "all"
      ? (data.tests || [])
      : (data.tests || []).filter(test => parseFloat(getTestRating(test)) >= parseFloat(rating));
    // Client-side rating sort (server handles all other sort keys)
    if (sort === "Rating") {
      result = [...result].sort((a, b) => parseFloat(getTestRating(b)) - parseFloat(getTestRating(a)));
    }
    return result;
  })();

  const props = {
    category,
    search,
    setSearch,
    maxPrice,
    setMaxPrice,
    bodyPart,
    setBodyPart,
    equipmentType,
    setEquipmentType,
    anesthesia,
    setAnesthesia,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    loading,
    error,
    ...data,
    tests: filteredTests,
    rating,
    setRating,
    handleCategorySwitch,
    handleResetFilters,
    setPage,
    setTest,
    setTestName,
    user,
    setSelectedLab
  };

  return (
    <>
      {isMobile ? <MobileLayout {...props} /> : <WebLayout {...props} />}
      {selectedLab && (
        <LabDetailPanel
          labId={selectedLab.lab_id}
          labName={selectedLab.lab_name}
          testName={selectedLab.packageName}
          testPrice={selectedLab.price}
          onClose={() => setSelectedLab(null)}
          onBook={selectedLab.bookFn}
        />
      )}
    </>
  );
}
