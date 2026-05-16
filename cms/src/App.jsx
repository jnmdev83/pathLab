import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import LabsPage from './pages/LabsPage';
import BranchesPage from './pages/BranchesPage';
import TestsPage from './pages/TestsPage';
import BookingsPage from './pages/BookingsPage';
import UsersPage from './pages/UsersPage';
import PackagesPage from './pages/PackagesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Admin Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Route>
        
        {/* Catch all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
