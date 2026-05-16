import React, { useState } from 'react';

const UpdateStatusModal = ({ isOpen, onClose, booking, onUpdate }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (booking) setStatus(booking.status || 'pending');
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(booking.booking_id || booking.id, status);
      onClose();
    } catch {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b flex justify-between bg-gray-50">
          <h2 className="font-bold">Update Status</h2>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-gray-500">Booking: #{booking.booking_id || booking.id}</p>
          <div>
            <label className="block text-sm font-medium mb-1">New Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full p-2 border rounded">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="pt-2 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-primary text-white rounded text-sm">{loading?'Saving...':'Update'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
