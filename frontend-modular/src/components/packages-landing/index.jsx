import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../utils/useIsMobile';
import { API_BASE_URL } from '../../config';
import { WebLayout } from './WebLayout';
import { MobileLayout } from './MobileLayout';

export function PackagesLanding({ setPage, setSelectedPackage, user }) {
  const isMobile = useIsMobile();
  const [data, setData] = useState({
    categories: [],
    popular: [],
    faqs: [],
    partners: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/packages-landing/data`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load packages landing page data');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Could not load data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          {/* Clinical loader */}
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm font-bold text-primary font-headline animate-pulse">Loading clinical health packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-error text-5xl mb-4">error</span>
        <h3 className="text-lg font-bold text-on-surface mb-2">Error Loading Landing Page</h3>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-white font-label-md px-6 py-2.5 rounded-lg active:scale-95 transition-all shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const props = {
    ...data,
    setPage,
    setSelectedPackage,
    user
  };

  if (isMobile) {
    return <MobileLayout {...props} />;
  }

  return <WebLayout {...props} />;
}
