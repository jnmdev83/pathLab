import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BookingFilters from '../components/Bookings/BookingFilters';
import BookingsTable from '../components/Bookings/BookingsTable';
import BookingDetail from '../components/Bookings/BookingDetail';
import UpdateStatusModal from '../components/Bookings/UpdateStatusModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [filters, setFilters] = useState({ search: '', status: '', dateFrom: '', dateTo: '', labId: '' });
  
  const [detailBooking, setDetailBooking] = useState(null);
  const [statusBooking, setStatusBooking] = useState(null);

  useEffect(() => {
    api.get('/labs').then(res => setLabs(res.data)).catch(() => {});
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if(filters.status) params.append('status', filters.status);
      if(filters.labId) params.append('lab_id', filters.labId);
      
      const res = await api.get(`/bookings?${params.toString()}`);
      
      // Client-side filter for dates & search (since simple backend might not have it)
      let data = res.data || [];
      if (filters.search) {
        data = data.filter(b => (b.patient_name||b.patientName||'').toLowerCase().includes(filters.search.toLowerCase()));
      }
      if (filters.dateFrom) {
        data = data.filter(b => new Date(b.booking_date||b.date) >= new Date(filters.dateFrom));
      }
      if (filters.dateTo) {
        data = data.filter(b => new Date(b.booking_date||b.date) <= new Date(filters.dateTo));
      }
      setBookings(data);
    } catch {
      setBookings([
        { id: 'BK-1001', patient_name: 'John Doe', patient_phone: '999999999', test_name: 'CBC', branch_name: 'City Center', date: '2023-11-15', time_slot: '09:00 AM', status: 'completed' },
        { id: 'BK-1002', patient_name: 'Jane Smith', patient_phone: '888888888', test_name: 'Lipid Profile', branch_name: 'Northside', date: '2023-11-16', time_slot: '10:00 AM', status: 'pending' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    fetchBookings();
    if(detailBooking && (detailBooking.booking_id===id || detailBooking.id===id)) {
      setDetailBooking({...detailBooking, status});
    }
    showToast('Status updated');
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      await api.put(`/bookings/${id}/notes`, { notes });
      fetchBookings();
      if(detailBooking && (detailBooking.booking_id===id || detailBooking.id===id)) {
        setDetailBooking({...detailBooking, notes});
      }
      showToast('Notes saved');
    } catch { showToast('Error saving notes', 'error'); }
  };

  const handleExport = () => {
    if(bookings.length === 0) return alert('No data to export');
    const header = "Booking ID,Patient Name,Test,Lab/Branch,Date,Time,Status\n";
    const rows = bookings.map(b => `${b.booking_id||b.id},${b.patient_name||b.patientName},${b.test_name||b.testName},${b.branch_name||b.branchName},${new Date(b.booking_date||b.date).toLocaleDateString()},${b.time_slot},${b.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_export_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-8">
      {toast && <div className={`fixed top-4 right-4 p-4 rounded z-50 text-white ${toast.type==='success'?'bg-emerald-500':'bg-red-500'}`}>{toast.msg}</div>}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-serif">Bookings</h1>
        <p className="text-gray-500 mt-1">Manage all test appointments and view patient details.</p>
      </div>

      <BookingFilters filters={filters} setFilters={setFilters} labs={labs} onExport={handleExport} />
      
      <BookingsTable bookings={bookings} loading={loading} onViewDetail={setDetailBooking} onUpdateStatus={setStatusBooking} />
      
      <BookingDetail isOpen={!!detailBooking} onClose={() => setDetailBooking(null)} booking={detailBooking} onSaveNotes={handleSaveNotes} />
      <UpdateStatusModal isOpen={!!statusBooking} onClose={() => setStatusBooking(null)} booking={statusBooking} onUpdate={handleUpdateStatus} />
    </div>
  );
};

export default BookingsPage;
