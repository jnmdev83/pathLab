import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings/recent?limit=10');
        setBookings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent bookings:', err);
        setError('Failed to load recent bookings.');
        
        // Mock data for preview
        setBookings([
          { id: 'BK-1001', patientName: 'John Doe', testName: 'Complete Blood Count', branchName: 'City Center Lab', date: '2023-11-15', status: 'completed' },
          { id: 'BK-1002', patientName: 'Jane Smith', testName: 'Lipid Profile', branchName: 'Northside Clinic', date: '2023-11-15', status: 'pending' },
          { id: 'BK-1003', patientName: 'Robert Johnson', testName: 'Thyroid Panel', branchName: 'Southpark Branch', date: '2023-11-14', status: 'processing' },
          { id: 'BK-1004', patientName: 'Emily Davis', testName: 'Vitamin D', branchName: 'City Center Lab', date: '2023-11-14', status: 'cancelled' },
          { id: 'BK-1005', patientName: 'Michael Wilson', testName: 'HbA1c', branchName: 'East End Center', date: '2023-11-13', status: 'completed' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
  }, []);

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">Pending</span>;
      case 'processing':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Processing</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-bold text-text-main font-serif">Recent Bookings</h3>
        {error && <span className="text-xs text-error bg-red-50 px-2 py-1 rounded">{error}</span>}
      </div>
      
      {loading ? (
        <div className="p-10 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-border">Booking ID</th>
                <th className="p-4 font-medium border-b border-border">Patient Name</th>
                <th className="p-4 font-medium border-b border-border">Test Name</th>
                <th className="p-4 font-medium border-b border-border">Lab Branch</th>
                <th className="p-4 font-medium border-b border-border">Date</th>
                <th className="p-4 font-medium border-b border-border">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-text-muted">No recent bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id || booking.booking_id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-primary">{booking.id || booking.booking_id}</td>
                    <td className="p-4 text-sm text-text-main">{booking.patientName || booking.patient_name}</td>
                    <td className="p-4 text-sm text-text-main">{booking.testName || booking.test_name}</td>
                    <td className="p-4 text-sm text-text-muted">{booking.branchName || booking.branch_name}</td>
                    <td className="p-4 text-sm text-text-muted">
                      {new Date(booking.date || booking.booking_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(booking.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;
