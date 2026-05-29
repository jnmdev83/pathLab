import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';
import { API_BASE_URL } from '../../config';

const getItemRating = (item) => {
  const seed = (item.id || 0) + 7;
  return (4.1 + (seed % 9) * 0.1).toFixed(1);
};

export function CategoryListing({ 
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

  // Category tests/packages items
  const [items, setItems] = useState([]);
  const [displayTests, setDisplayTests] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [error, setError] = useState(null);

  // Sorting & Filtering states for tests list
  const [sort, setSort] = useState('popularity');
  const [filters, setFilters] = useState({
    maxPrice: 15000,
    rating: 'all',
    searchQuery: '',
    turnaround: 'all', // 'all' | '12' | '24'
    preparation: 'all', // 'all' | 'fasting' | 'no-fasting'
    categories: []
  });

  const [visibleCount, setVisibleCount] = useState(8);

  // Reset visible items count when any filter or sorting changes
  useEffect(() => {
    setVisibleCount(8);
  }, [filters, sort]);

  // 1. Fetch category previews list on mount / categoryName change
  useEffect(() => {
    if (!categoryName) return;
    setLoadingItems(true);
    setError(null);
    setItems([]);
    setDisplayTests([]);
    setCategoryMeta(null);
    setVisibleCount(8);

    // Fetch category previews
    fetch(`${API_BASE_URL}/api/category-previews`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalize and filter category mappings
          const isAll = categoryName.toLowerCase() === 'all' || categoryName.toLowerCase() === 'blood';
          let matched = data;
          
          if (!isAll) {
            matched = data.filter((x) => {
              const dbCat = x.category_name.toLowerCase().trim();
              const reqCat = categoryName.toLowerCase().trim();
              return dbCat.includes(reqCat) || reqCat.includes(dbCat);
            });
          } else {
            // Remove duplicates if showing all
            const unique = new Map();
            matched.forEach(item => {
              if (!unique.has(item.id)) {
                unique.set(item.id, item);
              }
            });
            matched = Array.from(unique.values());
          }

          setItems(matched);
          if (matched.length === 0) {
            setError(`No active tests mapped under category: ${categoryName}.`);
          }
        } else {
          throw new Error('Invalid previews payload format');
        }
      })
      .catch((err) => {
        console.error('Error fetching category previews:', err);
        setError('Could not load category diagnostics. Please try again.');
      })
      .finally(() => setLoadingItems(false));

    // Fetch category metadata dynamically from DB
    fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(categoryName)}/metadata`)
      .then((r) => r.json())
      .then((data) => {
        setCategoryMeta(data);
      })
      .catch((err) => {
        console.error('Error fetching category metadata:', err);
      });
  }, [categoryName]);

  // 2. Filter and sort items dynamically on the frontend
  useEffect(() => {
    let result = [...items];

    // Filter by rating
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      result = result.filter(x => parseFloat(getItemRating(x)) >= minRating);
    }

    // Filter by price
    if (filters.maxPrice < 15000) {
      result = result.filter(x => x.price <= filters.maxPrice);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(x => 
        x.name.toLowerCase().includes(q) || 
        (x.description || '').toLowerCase().includes(q) ||
        (x.category_name || '').toLowerCase().includes(q)
      );
    }

    // Filter by turnaround
    if (filters.turnaround !== 'all') {
      const targetHours = parseInt(filters.turnaround, 10);
      result = result.filter(x => {
        const repStr = (x.rep || '').toLowerCase();
        const matches = repStr.match(/(\d+)/);
        if (matches) {
          const hrs = parseInt(matches[1], 10);
          return hrs <= targetHours;
        }
        return targetHours >= 24;
      });
    }

    // Filter by preparation
    if (filters.preparation !== 'all') {
      result = result.filter(x => {
        const prepStr = (x.preparations || '').toLowerCase();
        const descStr = (x.description || '').toLowerCase();
        const nameStr = (x.name || '').toLowerCase();
        const isFasting = prepStr.includes('fasting') || descStr.includes('fasting') || nameStr.includes('fasting');
        return filters.preparation === 'fasting' ? isFasting : !isFasting;
      });
    }

    // Filter by selected categories
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(x => {
        const itemCat = (x.category_name || '').toLowerCase().trim();
        return filters.categories.some(cat => {
          const c = cat.toLowerCase().trim();
          return itemCat.includes(c) || c.includes(itemCat);
        });
      });
    }

    // Sort
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'alphabetical') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'location') {
      // Sort by mock distance based on item id
      result.sort((a, b) => {
        const distA = ((a.id || 0) % 5) + 1.2;
        const distB = ((b.id || 0) % 5) + 1.2;
        return distA - distB;
      });
    }

    setDisplayTests(result);
  }, [items, filters, sort]);

  const handleDetails = (item) => {
    if (item.is_pkg) {
      if (setSelectedPackage) {
        setSelectedPackage(item);
      }
      setPage('package-compare');
    } else {
      setTest(item);
      setPage('detail');
    }
  };

  const handleBook = (item) => {
    handleDetails(item);
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: 15000,
      rating: 'all',
      searchQuery: '',
      turnaround: 'all',
      preparation: 'all',
      categories: []
    });
    setSort('popularity');
    setVisibleCount(8);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-outline/40 block mb-4">search_off</span>
        <p className="text-on-surface-variant mb-4">{error}</p>
        <button onClick={() => setPage('home')} className="text-primary font-bold hover:underline">
          ← Back to Home
        </button>
      </div>
    );
  }

  const viewProps = {
    categoryName,
    items,
    displayTests,
    loadingItems,
    categoryMeta,
    sort,
    setSort,
    filters,
    setFilters,
    handleBook,
    handleDetails,
    resetFilters,
    setPage,
    userLocation,
    visibleCount,
    setVisibleCount,
    setTestName,
    setActiveCategoryFilter
  };

  if (isMobile) return <MobileLayout {...viewProps} />;
  return <WebLayout {...viewProps} />;
}
