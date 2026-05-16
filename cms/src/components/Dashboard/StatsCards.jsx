import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, DollarSign, Activity, Clock } from 'lucide-react';

const StatsCards = () => {
  const [data, setData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeLabs: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings/stats');
        // Handle response mapping based on common patterns
        setData({
          totalBookings: response.data.totalBookings || 0,
          totalRevenue: response.data.totalRevenue || 0,
          activeLabs: response.data.activeLabs || 0,
          pendingBookings: response.data.pendingBookings || 0
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics.');
        // Set fallback data for preview if API fails during development
        setData({
          totalBookings: 1250,
          totalRevenue: 45000,
          activeLabs: 24,
          pendingBookings: 18
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Bookings',
      value: data.totalBookings,
      icon: <Calendar className="text-primary" size={24} />,
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="text-emerald-500" size={24} />,
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Active Labs',
      value: data.activeLabs,
      icon: <Activity className="text-blue-500" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Bookings',
      value: data.pendingBookings,
      icon: <Clock className="text-amber-500" size={24} />,
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div>
      {error && <div className="text-sm text-error mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error} - Showing preview data.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex items-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-text-main">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
