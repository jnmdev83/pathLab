import React, { useState } from 'react';
import { Edit2, Trash2, DollarSign, List, Search } from 'lucide-react';

const TestsTable = ({ tests, loading, onEdit, onDelete, onViewPricing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTests = tests.filter(test => 
    (test.test_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (test.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getCategoryColor = (category) => {
    switch((category || '').toLowerCase()) {
      case 'blood': return 'bg-red-100 text-red-800';
      case 'scanning': return 'bg-blue-100 text-blue-800';
      case 'package': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
        <div className="relative w-64">
          <input type="text" placeholder="Search tests..." value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="text-sm text-gray-500">Showing {paginatedTests.length} of {filteredTests.length} tests</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <th className="p-4">Test Name & Category</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Branches</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan="4" className="p-8 text-center">Loading...</td></tr> : 
             paginatedTests.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-gray-500">No tests found</td></tr> :
             paginatedTests.map(test => (
               <tr key={test.test_id || test.id} className="hover:bg-gray-50 group">
                 <td className="p-4">
                   <div className="font-medium text-gray-900">{test.test_name}</div>
                   <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getCategoryColor(test.category)}`}>{test.category}</span>
                 </td>
                 <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={test.description}>{test.description}</td>
                 <td className="p-4 text-center">
                   <span className="bg-indigo-50 text-primary px-3 py-1 rounded-lg text-sm font-medium">{test.branch_count || 0}</span>
                 </td>
                 <td className="p-4">
                   <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                     <button onClick={() => onViewPricing(test)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Pricing & Branches"><DollarSign size={18} /></button>
                     <button onClick={() => onEdit(test)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Edit"><Edit2 size={18} /></button>
                     <button onClick={() => onDelete(test.test_id || test.id, test.test_name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                   </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 flex justify-between bg-gray-50 border-t text-sm">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p=>p-1)} disabled={currentPage===1} className="px-3 py-1 bg-white border rounded disabled:opacity-50">Prev</button>
            <button onClick={() => setCurrentPage(p=>p+1)} disabled={currentPage===totalPages} className="px-3 py-1 bg-white border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsTable;
