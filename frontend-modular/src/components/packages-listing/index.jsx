import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { LabDetailPanel } from '../detail/LabDetailPanel';
import { MultiCompareModal } from './MultiCompareModal';

const getSanitizedCategory = (cat) => {
  if (!cat || cat === 'Home' || cat === 'All' || cat === 'All Packages') {
    return 'Full Body Checkup';
  }
  if (cat.includes("Heart")) return "Heart";
  if (cat.includes("Diabetes")) return "Diabetes";
  if (cat.includes("Women") || cat.includes("Female") || cat.includes("Pregnancy")) return "Pregnancy";
  if (cat.includes("Thyroid")) return "Thyroid";
  if (cat.includes("Senior")) return "Senior Citizen";
  if (cat.includes("Full Body")) return "Full Body Checkup";
  if (cat.includes("Cancer")) return "Cancer";
  return cat;
};

export function PackagesListing({
  setPage,
  setSelectedPackage,
  setSelectedBranch,
  user,
  userLocation,
  requestGeolocation,
  activeCategoryFilter,
  setActiveCategoryFilter
}) {
  const isMobile = useIsMobile();
  
  // Sanitize the starting category
  const initialCategory = getSanitizedCategory(activeCategoryFilter);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Synchronize dynamic category changes from parent triggers
  useEffect(() => {
    const nextCategory = getSanitizedCategory(activeCategoryFilter);
    if (nextCategory !== activeCategory) {
      setActiveCategory(nextCategory);
      // Reset filters and page
      setPageNum(1);
      setFilters(prev => ({ ...prev, tier: null }));
    }
  }, [activeCategoryFilter]);

  // States
  const [metadata, setMetadata] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    tier: null,
    maxPrice: 25000,
    accreditations: {
      NABL: true, // checked by default
      CAP: false,
      ISO: false
    },
    homeCollection: true // checked by default
  });

  const [sort, setSort] = useState('recommended');
  const [pageNum, setPageNum] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCompare, setSelectedCompare] = useState([]);
  
  // Custom Detail/Comparison Modals lifted states
  const [selectedLab, setSelectedLab] = useState(null); // { lab_id, lab_name, packageName, price, bookFn }
  const [multiCompareOpen, setMultiCompareOpen] = useState(false);

  // Fetch Metadata (Hero, Stats, Tiers, Guides, FAQs)
  useEffect(() => {
    setLoadingMetadata(true);
    fetch(`${API_BASE_URL}/api/packages-listing/metadata?category=${encodeURIComponent(activeCategory)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load category metadata');
        return res.json();
      })
      .then(data => {
        setMetadata(data);
        setLoadingMetadata(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load packages listing metadata.');
        setLoadingMetadata(false);
      });
  }, [activeCategory]);

  // Fetch Offers List (Lab Package pricing, tests, distance)
  useEffect(() => {
    setLoadingOffers(true);
    
    // Compile active accreditations
    const activeAccs = [];
    if (filters.accreditations.NABL) activeAccs.push('NABL');
    if (filters.accreditations.CAP) activeAccs.push('CAP');
    if (filters.accreditations.ISO) activeAccs.push('ISO');

    // Build API query parameters
    let url = `${API_BASE_URL}/api/packages-listing/offers?category=${encodeURIComponent(activeCategory)}`;
    url += `&min_price=0&max_price=${filters.maxPrice}`;
    url += `&home_collection=${filters.homeCollection ? 'true' : 'false'}`;
    url += `&sort=${sort}`;
    url += `&page=${pageNum}&limit=8`;

    if (filters.tier) {
      url += `&tier=${encodeURIComponent(filters.tier)}`;
    }
    if (activeAccs.length > 0) {
      url += `&accreditations=${encodeURIComponent(activeAccs.join(','))}`;
    }
    if (userLocation?.lat && userLocation?.lng) {
      url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load listing offers');
        return res.json();
      })
      .then(data => {
        if (pageNum === 1) {
          setOffers(data.results || []);
        } else {
          setOffers(prev => [...prev, ...(data.results || [])]);
        }
        setTotalOffers(data.total || 0);
        setHasMore(data.hasMore || false);
        setLoadingOffers(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load diagnostic packages.');
        setLoadingOffers(false);
      });
  }, [activeCategory, filters, sort, pageNum, userLocation]);

  // Reset Filters Handler
  const resetFilters = () => {
    setFilters({
      tier: null,
      maxPrice: 25000,
      accreditations: {
        NABL: true,
        CAP: false,
        ISO: false
      },
      homeCollection: true
    });
    setSort('recommended');
    setPageNum(1);
  };

  // Category Switcher Handler
  const handleCategorySwitch = (newCat) => {
    setActiveCategory(newCat);
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(newCat);
    }
    setPageNum(1);
    // Reset tier filter when category changes
    setFilters(prev => ({
      ...prev,
      tier: null
    }));
  };

  if (loadingMetadata && pageNum === 1) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#00535b]/20 border-t-[#00535b] animate-spin" />
          <p className="text-sm font-bold text-[#00535b] font-headline animate-pulse">Loading medical screening directory...</p>
        </div>
      </div>
    );
  }

  const props = {
    activeCategory,
    metadata,
    offers,
    loadingOffers,
    filters,
    setFilters,
    sort,
    setSort,
    pageNum,
    setPageNum,
    totalOffers,
    hasMore,
    resetFilters,
    handleCategorySwitch,
    selectedCompare,
    setSelectedCompare,
    setPage,
    setSelectedPackage,
    setSelectedBranch,
    user,
    userLocation,
    requestGeolocation
  };

  if (isMobile) {
    return (
      <>
        <MobileLayout 
          {...props} 
          setSelectedLab={setSelectedLab} 
          setMultiCompareOpen={setMultiCompareOpen} 
        />
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
        {multiCompareOpen && (
          <MultiCompareModal
            packages={selectedCompare}
            onClose={() => setMultiCompareOpen(false)}
            onBook={(pkg) => {
              setSelectedPackage({ id: pkg.package_id, name: pkg.package_name });
              setPage("package-compare");
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <WebLayout 
        {...props} 
        setSelectedLab={setSelectedLab} 
        setMultiCompareOpen={setMultiCompareOpen} 
      />
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
      {multiCompareOpen && (
        <MultiCompareModal
          packages={selectedCompare}
          onClose={() => setMultiCompareOpen(false)}
          onBook={(pkg) => {
            setSelectedPackage({ id: pkg.package_id, name: pkg.package_name });
            setPage("package-compare");
          }}
        />
      )}
    </>
  );
}
