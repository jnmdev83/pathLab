import React, { useState } from 'react';
import { Edit2, Trash2, MapPin, CheckCircle, XCircle, Search } from 'lucide-react';

const BranchesTable = ({ branches, loading, onEdit, onDelete, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter branches
  const filteredBranches = branches.filter(branch => 
    (branch.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (branch.city?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by branch or city..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
        </div>
        <div className="text-sm text-text-muted">
          Showing {paginatedBranches.length} of {filteredBranches.length} branches
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-text-muted text-xs uppercase tracking-wider border-b border-border">
              <th className="p-4 font-medium">Branch Name & City</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : paginatedBranches.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-text-muted">No branches found.</td>
              </tr>
            ) : (
              paginatedBranches.map(branch => (
                <tr key={branch.id || branch.branch_id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-text-main">{branch.name}</div>
                    <div className="text-sm text-text-muted">{branch.city}</div>
                  </td>
                  <td className="p-4 text-sm text-text-main">
                    <div>{branch.phone}</div>
                    {branch.home_collection && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-800 rounded">Home Collection</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-text-main max-w-xs truncate">{branch.address}</div>
                    <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {branch.latitude}, {branch.longitude}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onToggleStatus(branch.id || branch.branch_id, branch.is_active)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        branch.is_active !== false ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {branch.is_active !== false ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {branch.is_active !== false ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(branch)} className="p-1.5 text-text-muted hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => onDelete(branch.id || branch.branch_id, branch.name)} className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-gray-50">
          <div className="text-sm text-text-muted">Page {currentPage} of {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded text-sm bg-white border border-border disabled:bg-gray-100">Previous</button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded text-sm bg-white border border-border disabled:bg-gray-100">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesTable;
