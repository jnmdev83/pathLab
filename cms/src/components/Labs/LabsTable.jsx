import React, { useState } from 'react';
import { Edit2, Trash2, Eye, CheckCircle, XCircle, Search, ChevronUp, ChevronDown } from 'lucide-react';

const LabsTable = ({ 
  labs, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleVerify, 
  onViewDetails, 
  onViewBranches,
  searchTerm,
  setSearchTerm
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ChevronDown size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />;
    return sortDirection === 'asc' ? 
      <ChevronUp size={14} className="text-primary" /> : 
      <ChevronDown size={14} className="text-primary" />;
  };

  // Filter and sort labs
  const filteredLabs = labs.filter(lab => 
    (lab.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (lab.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (lab.phone || '').includes(searchTerm)
  );

  const sortedLabs = [...filteredLabs].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    // String comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedLabs.length / itemsPerPage);
  const paginatedLabs = sortedLabs.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search labs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
        </div>
        <div className="text-sm text-text-muted">
          Showing {sortedLabs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedLabs.length)} of {sortedLabs.length} labs
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-text-muted text-xs uppercase tracking-wider border-b border-border">
              <th 
                className="p-4 font-medium cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">Lab Name {getSortIcon('name')}</div>
              </th>
              <th className="p-4 font-medium">Contact</th>
              <th 
                className="p-4 font-medium cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('is_active')}
              >
                <div className="flex items-center gap-1">Status {getSortIcon('is_active')}</div>
              </th>
              <th 
                className="p-4 font-medium cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('is_verified')}
              >
                <div className="flex items-center gap-1">Verified {getSortIcon('is_verified')}</div>
              </th>
              <th className="p-4 font-medium text-center">Branches</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedLabs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-text-muted">
                  No labs found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedLabs.map((lab) => (
                <tr key={lab.id || lab.lab_id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-text-main">{lab.name}</div>
                    {lab.website && <div className="text-xs text-primary truncate max-w-[200px]">{lab.website}</div>}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-text-main">{lab.phone}</div>
                    <div className="text-xs text-text-muted truncate max-w-[180px]">{lab.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${lab.is_active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                      {lab.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => onToggleVerify(lab.id || lab.lab_id, lab.is_verified)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        lab.is_verified 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lab.is_verified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {lab.is_verified ? 'Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onViewBranches(lab.id || lab.lab_id)}
                      className="px-3 py-1 bg-indigo-50 text-primary rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      {lab.branch_count || 0} Branches
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onViewDetails(lab)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-indigo-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(lab)}
                        className="p-1.5 text-text-muted hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        title="Edit Lab"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(lab.id || lab.lab_id, lab.name)}
                        className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded transition-colors"
                        title="Delete Lab"
                      >
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-gray-50">
          <div className="text-sm text-text-muted">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-border text-text-main hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-border text-text-main hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabsTable;
