import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

const PopularBranches = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularBranches = async () => {
      try {
        setLoading(true);
        const response = await api.get('/branches/popular?limit=5');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching popular branches:', err);
        setError('Failed to load branches data.');
        
        // Mock data for preview
        setData([
          { name: 'City Center Lab', value: 400 },
          { name: 'Northside Clinic', value: 300 },
          { name: 'Southpark Branch', value: 300 },
          { name: 'East End Center', value: 200 },
          { name: 'Westfield Health', value: 100 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBranches();
  }, []);

  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main font-serif">Top 5 Branches</h3>
        {error && <span className="text-xs text-error bg-red-50 px-2 py-1 rounded">{error}</span>}
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                itemStyle={{ color: '#111827' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PopularBranches;
