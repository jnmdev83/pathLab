import React from 'react';

const BookingFilters = ({ filters, setFilters, labs, branches, onExport }) => {
  return (
    <div className="bg-surface p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-500">Patient Name</label>
        <input type="text" value={filters.search} onChange={e=>setFilters({...filters, search: e.target.value})} placeholder="Search..." className="w-48 p-2 border rounded text-sm outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-500">Status</label>
        <select value={filters.status} onChange={e=>setFilters({...filters, status: e.target.value})} className="w-32 p-2 border rounded text-sm outline-none bg-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-500">Date From</label>
        <input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters, dateFrom: e.target.value})} className="w-36 p-2 border rounded text-sm outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-500">Date To</label>
        <input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters, dateTo: e.target.value})} className="w-36 p-2 border rounded text-sm outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-500">Lab</label>
        <select value={filters.labId} onChange={e=>setFilters({...filters, labId: e.target.value})} className="w-40 p-2 border rounded text-sm outline-none bg-white">
          <option value="">All Labs</option>
          {labs.map(l => <option key={l.id||l.lab_id} value={l.id||l.lab_id}>{l.name}</option>)}
        </select>
      </div>
      <div className="flex-1"></div>
      <button onClick={onExport} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-sm border border-emerald-200">
        Export CSV
      </button>
    </div>
  );
};

export default BookingFilters;
