import React from 'react';
import { User, LogOut } from 'lucide-react';
import { clearAuthToken } from '../../services/auth';

const Navbar = () => {
  const handleLogout = () => {
    clearAuthToken();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-end px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-main">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <span>Admin User</span>
        </div>
        
        <div className="h-6 w-px bg-border"></div>
        
        <button 
          onClick={handleLogout}
          className="text-text-muted hover:text-error transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
