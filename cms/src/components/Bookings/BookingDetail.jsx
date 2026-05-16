import React, { useState } from 'react';

const BookingDetail = ({ isOpen, onClose, booking, onSaveNotes }) => {
  const [notes, setNotes] = useState('');
  
  // Update local state when booking changes
  React.useEffect(() => {
    if (booking) setNotes(booking.notes || '');
  }, [booking]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface w-full max-w-2xl rounded-xl shadow-xl overflow-hidden my-8">
        <div className="p-6 border-b flex justify-between bg-gray-50">
          <h2 className="text-xl font-bold font-serif">Booking #{booking.booking_id || booking.id}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Details</h3>
            <p className="font-medium text-lg">{booking.patient_name || booking.patientName}</p>
            <p className="text-gray-600 text-sm">{booking.patient_phone || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Test & Location</h3>
            <p className="font-medium">{booking.test_name || booking.testName}</p>
            <p className="text-gray-600 text-sm">{booking.branch_name || booking.branchName}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Schedule</h3>
            <p className="font-medium">{new Date(booking.booking_date || booking.date).toLocaleDateString()}</p>
            <p className="text-gray-600 text-sm">{booking.time_slot}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Status</h3>
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium uppercase tracking-wider">{booking.status}</span>
          </div>
          <div className="md:col-span-2 mt-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Internal Notes</h3>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Add notes here..."></textarea>
            <div className="flex justify-end mt-2">
              <button onClick={() => onSaveNotes(booking.booking_id||booking.id, notes)} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded">Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
