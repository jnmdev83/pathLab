import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
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
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main font-serif">Top 5 Branches</h3>
        {error && <span className="text-xs text-error bg-red-50 px-2 py-1 rounded">{error}</span>}
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col h-64 justify-between">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom responsive HTML legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-2 text-xs font-semibold mt-1">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 min-w-[100px] sm:min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-gray-600 truncate max-w-[110px]" title={entry.name}>
                  {entry.name}
                </span>
                <span className="text-gray-400 font-normal">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularBranches;
