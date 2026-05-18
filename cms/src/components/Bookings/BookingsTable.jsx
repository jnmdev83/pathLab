import React, { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';

const BookingsTable = ({ bookings, loading, onViewDetail, onUpdateStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginated = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch((status||'').toLowerCase()) {
      case 'completed': return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Completed</span>;
      case 'confirmed': return <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">Confirmed</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">Pending</span>;
      case 'cancelled': return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Cancelled</span>;
      default: return <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">{status}</span>;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <th className="p-4">ID / Date</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Test & Lab</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr> : 
             paginated.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">No bookings found</td></tr> :
             paginated.map(b => (
               <tr key={b.booking_id || b.id} className="hover:bg-gray-50 group">
                 <td className="p-4">
                   <div className="font-medium text-primary text-sm">{b.booking_id || b.id}</div>
                   <div className="text-xs text-gray-500">{new Date(b.booking_date || b.date).toLocaleDateString()} {b.time_slot}</div>
                 </td>
                 <td className="p-4 font-medium text-sm">{b.patient_name || b.patientName}</td>
                 <td className="p-4 text-sm">
                   <div>{b.test_name || b.testName}</div>
                   <div className="text-xs text-gray-500">{b.branch_name || b.branchName}</div>
                 </td>
                 <td className="p-4 text-center">{getStatusBadge(b.status)}</td>
                 <td className="p-4">
                   <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                     <button onClick={() => onViewDetail(b)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-indigo-50 rounded"><Eye size={18} /></button>
                     <button onClick={() => onUpdateStatus(b)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit3 size={18} /></button>
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

export default BookingsTable;
