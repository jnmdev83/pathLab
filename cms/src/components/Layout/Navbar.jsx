import React from 'react';
import { User, LogOut, Menu } from 'lucide-react';
import { clearAuthToken } from '../../services/auth';

const Navbar = ({ onMenuClick }) => {
  const handleLogout = () => {
    clearAuthToken();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Mobile Menu Toggle button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-text-muted hover:text-text-main hover:bg-gray-50 rounded-lg transition-colors"
        title="Open Navigation"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 text-sm font-medium text-text-main">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <span className="hidden sm:inline">Admin User</span>
        </div>
        
        <div className="h-6 w-px bg-border"></div>
        
        <button 
          onClick={handleLogout}
          className="text-text-muted hover:text-error transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
