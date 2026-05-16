import React from 'react';
import { Edit2, Trash2, PackageCheck, Layers } from 'lucide-react';

const PackagesTable = ({ packages, loading, onEdit, onDelete, onViewPricing }) => {
  if (loading) return <div className="text-center py-20 text-gray-400">Loading packages...</div>;
  if (!packages.length) return <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400">No packages found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-bottom border-gray-100">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Included Tests</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lab Count</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {packages.map((pkg) => (
            <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Layers size={16} />
                  </div>
                  <span className="font-medium text-gray-900">{pkg.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">{pkg.category}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {pkg.included_tests ? pkg.included_tests.slice(0, 3).map((test, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">
                      {test}
                    </span>
                  )) : <span className="text-gray-400 text-xs">No tests</span>}
                  {pkg.included_tests?.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{pkg.included_tests.length - 3} more</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <PackageCheck size={14} />
                  <span className="text-sm font-medium">{pkg.lab_count} Labs</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${pkg.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => onViewPricing(pkg)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Assign to Labs</button>
                  <button onClick={() => onEdit(pkg)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(pkg.id, pkg.name)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackagesTable;
