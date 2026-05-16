import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import BookingChart from '../components/Dashboard/BookingChart';
import PopularTests from '../components/Dashboard/PopularTests';
import PopularBranches from '../components/Dashboard/PopularBranches';
import RecentBookings from '../components/Dashboard/RecentBookings';

const Dashboard = () => {
  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main font-serif">Dashboard Overview</h1>
        <p className="text-text-muted mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Top row: 4 Stats Cards */}
      <StatsCards />

      {/* Middle row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingChart />
        <PopularTests />
      </div>

      {/* Next row: Pie Chart (can be put in a grid or full width, let's put it in a 3-column grid to look nice, or just a 2-col with some other empty block, or just full width centered) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PopularBranches />
        {/* Empty div for layout balance or a placeholder for future content */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
           <h3 className="text-lg font-bold text-text-main font-serif mb-2">More Insights Coming Soon</h3>
           <p className="text-sm text-text-muted">Additional analytics will be available in future updates.</p>
        </div>
      </div>

      {/* Bottom row: Table */}
      <RecentBookings />
    </div>
  );
};

export default Dashboard;
