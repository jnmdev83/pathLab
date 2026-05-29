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
        setData(json);
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
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setMaxPrice(5000);
    setBodyPart("All Body Parts");
    setEquipmentType("");
    setAnesthesia(false);
    setSort("Popularity");
    setCurrentPage(1);
  };

  const [selectedLab, setSelectedLab] = useState(null);

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
