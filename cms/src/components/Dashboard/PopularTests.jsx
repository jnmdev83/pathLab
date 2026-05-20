import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const truncateLabel = (value) => {
  if (typeof value === 'string' && value.length > 20) {
    return value.substring(0, 18) + '...';
  }
  return value;
};

const PopularTests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularTests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tests/popular?limit=5');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching popular tests:', err);
        setError('Failed to load popular tests.');
        
        // Mock data for preview
        setData([
          { name: 'Complete Blood Count', count: 145 },
          { name: 'Lipid Profile', count: 120 },
          { name: 'Thyroid Panel', count: 95 },
          { name: 'HbA1c', count: 88 },
          { name: 'Liver Function', count: 76 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTests();
  }, []);

  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main font-serif">Popular Tests</h3>
        {error && <span className="text-xs text-error bg-red-50 px-2 py-1 rounded">{error}</span>}
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4B5563', fontSize: 11 }} 
                width={140}
                tickFormatter={truncateLabel}
              />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PopularTests;
