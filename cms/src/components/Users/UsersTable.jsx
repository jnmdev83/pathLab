import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const UsersTable = ({ users, loading, onEdit, onDelete, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginated = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getRoleColor = (role) => {
    switch((role||'').toLowerCase()) {
      case 'super admin': return 'bg-purple-100 text-purple-800';
      case 'lab manager': return 'bg-blue-100 text-blue-800';
      case 'support staff': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <th className="p-4">Name & Contact</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr> : 
             paginated.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found</td></tr> :
             paginated.map(user => (
               <tr key={user.id || user.user_id} className="hover:bg-gray-50 group">
                 <td className="p-4">
                   <div className="font-medium">{user.name}</div>
                   <div className="text-xs text-gray-500">{user.email} | {user.phone}</div>
                 </td>
                 <td className="p-4">
                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>{user.role}</span>
                 </td>
                 <td className="p-4 text-center">
                   <button onClick={() => onToggleStatus(user.id || user.user_id, user.is_active)} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${user.is_active!==false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                     {user.is_active!==false ? <CheckCircle size={14}/> : <XCircle size={14}/>} {user.is_active!==false ? 'Active' : 'Inactive'}
                   </button>
                 </td>
                 <td className="p-4 text-sm text-gray-500">
                   {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                 </td>
                 <td className="p-4">
                   <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                     <button onClick={() => onEdit(user)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit2 size={18} /></button>
                     <button onClick={() => onDelete(user.id || user.user_id, user.name)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                   </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 text-sm">
          <div className="text-gray-500 font-medium">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1} 
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              title="First Page"
            >
              « First
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={currentPage === 1} 
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Next
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages} 
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Last Page"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
