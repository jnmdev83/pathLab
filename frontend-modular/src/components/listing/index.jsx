import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { API_BASE_URL } from '../../config';
import { getDistanceKm, compareNearby } from '../../utils/reusables';

export function Listing(props) {
  const { cat, title, setPage, setTestName, allTests, packages, setSelectedPackage, loading, userLocation } = props;

  const isMobile = useIsMobile();
  const [sort, setSort] = useState("name");
  const [pageIdx, setPageIdx] = useState(1);

  // Package compare states
  const [selectedPackagesForCompare, setSelectedPackagesForCompare] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparedPackagesTests, setComparedPackagesTests] = useState([]);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  const handlePackageSelectForCompare = (pkg) => {
    setSelectedPackagesForCompare(prev => {
      const exists = prev.find(p => p.id === pkg.id);
      if (exists) {
        return prev.filter(p => p.id !== pkg.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 packages at the same time.");
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const startPackageComparison = () => {
    if (selectedPackagesForCompare.length < 2) return;
    setIsLoadingCompare(true);
    setIsCompareModalOpen(true);
    
    Promise.all(
      selectedPackagesForCompare.map(pkg =>
        fetch(`${API_BASE_URL}/api/packages/${pkg.id}/tests`).then(res => res.json())
      )
    )
    .then(results => {
      setComparedPackagesTests(results);
      setIsLoadingCompare(false);
    })
    .catch(err => {
      console.error("Failed to load compared packages tests:", err);
      setIsLoadingCompare(false);
    });
  };

  const getUniqueTests = () => {
    const allUnique = [];
    const testNamesSet = new Set();
    
    comparedPackagesTests.forEach((testsList) => {
      if (Array.isArray(testsList)) {
        testsList.forEach(t => {
          const normalName = t.name.trim();
          if (!testNamesSet.has(normalName.toLowerCase())) {
            testNamesSet.add(normalName.toLowerCase());
            allUnique.push({
              name: normalName,
              description: t.description || ""
            });
          }
        });
      }
    });
    
    return allUnique.sort((a, b) => a.name.localeCompare(b.name));
  };

  const packageHasTest = (pkgTestsList, testName) => {
    if (!Array.isArray(pkgTestsList)) return false;
    return pkgTestsList.some(t => t.name.toLowerCase().trim() === testName.toLowerCase().trim());
  };

  const isPackage = cat === "package";
  
  // Base raw source data filtering by primary page type
  let sourceData = isPackage ? packages : (allTests || []).filter((t) => (t.cat || "").toLowerCase() === cat.toLowerCase());
  
  // Apply smart clinical sub-category filters based on activeCategoryFilter from bottom navbar selection
  const filterKey = (props.activeCategoryFilter || "").toLowerCase();
  if (filterKey && filterKey !== "home" && filterKey !== "full body checkup") {
    if (filterKey === "heart") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("heart") || 
        t.name.toLowerCase().includes("cardiac") || 
        t.name.toLowerCase().includes("lipid") ||
        t.name.toLowerCase().includes("ecg")
      );
    } else if (filterKey === "cancer") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("cancer") || 
        t.name.toLowerCase().includes("oncology") || 
        t.name.toLowerCase().includes("pap smear") ||
        t.name.toLowerCase().includes("psa")
      );
    } else if (filterKey === "thyroid") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("thyroid") || 
        t.name.toLowerCase().includes("tsh")
      );
    } else if (filterKey === "diabetes") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("sugar") || 
        t.name.toLowerCase().includes("glucose") || 
        t.name.toLowerCase().includes("hba1c") ||
        t.name.toLowerCase().includes("diabetic")
      );
    } else if (filterKey === "pregnancy") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("pregnancy") || 
        t.name.toLowerCase().includes("hcg") || 
        t.name.toLowerCase().includes("fsh") ||
        t.name.toLowerCase().includes("lh")
      );
    } else if (filterKey === "allergy/intolerance") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("allergy") || 
        t.name.toLowerCase().includes("ige")
      );
    } else if (filterKey === "hormone") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("hormone") || 
        t.name.toLowerCase().includes("testosterone") ||
        t.name.toLowerCase().includes("prolactin") ||
        t.name.toLowerCase().includes("fsh") ||
        t.name.toLowerCase().includes("lh")
      );
    } else if (filterKey === "dna test") {
      sourceData = sourceData.filter(t => 
        t.name.toLowerCase().includes("dna") || 
        t.name.toLowerCase().includes("gene") ||
        t.name.toLowerCase().includes("chromos")
      );
    }
  }

  const grouped = {};
  if (isPackage) {
    sourceData.forEach(p => {
      grouped[p.name] = {
        ...p,
        minPrice: p.min_price || 0,
        count: p.lab_count || 0,
        testCount: p.test_count || 0
      };
    });
  } else {
    sourceData.forEach((t) => {
      const distance = getDistanceKm(t);
      if (!grouped[t.name])
        grouped[t.name] = {
          name: t.name,
          minPrice: t.price,
          count: 1,
          nearestDistance: distance,
        };
      else {
        grouped[t.name].count++;
        if (t.price < grouped[t.name].minPrice)
          grouped[t.name].minPrice = t.price;
        if (
          distance !== null &&
          (grouped[t.name].nearestDistance === null ||
            grouped[t.name].nearestDistance === undefined ||
            distance < grouped[t.name].nearestDistance)
        ) {
          grouped[t.name].nearestDistance = distance;
        }
      }
    });
  }

  const allRows = Object.values(grouped).sort((a, b) => {
    if (sort === "low") return a.minPrice - b.minPrice;
    if (sort === "high") return b.minPrice - a.minPrice;
    if (sort === "rating") return b.count - a.count;
    if (sort === "loc") return compareNearby(a, b);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  const pageSize = 10;
  const totalPages = Math.ceil(allRows.length / pageSize) || 1;
  const rows = allRows.slice((pageIdx - 1) * pageSize, pageIdx * pageSize);

  useEffect(() => {
    setPageIdx(1);
  }, [sort, cat]);

  const viewProps = {
    ...props,
    title,
    rows: isMobile ? allRows : rows, // Mobile can render full scrollable list
    cat,
    sort,
    setSort,
    pageIdx,
    setPageIdx,
    totalPages,
    isPackage,
    setSelectedPackage,
    setPage,
    setTestName,
    selectedPackagesForCompare,
    handlePackageSelectForCompare,
    startPackageComparison,
    isCompareModalOpen,
    setIsCompareModalOpen,
    isLoadingCompare,
    comparedPackagesTests,
    getUniqueTests,
    packageHasTest,
    setSelectedPackagesForCompare
  };

  if (loading && allRows.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="pulse-shimmer text-lg font-bold text-primary">
          Loading ChooseMyLab offerings...
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileLayout {...viewProps} />;
  }

  return <WebLayout {...viewProps} />;
}
