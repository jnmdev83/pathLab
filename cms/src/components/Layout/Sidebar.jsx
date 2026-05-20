import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beaker, MapPin, ClipboardList, Calendar, Users, Boxes, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Labs', path: '/labs', icon: <Beaker size={20} /> },
    { name: 'Branches', path: '/branches', icon: <MapPin size={20} /> },
    { name: 'Tests', path: '/tests', icon: <ClipboardList size={20} /> },
    { name: 'Packages', path: '/packages', icon: <Boxes size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <Calendar size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border h-full flex flex-col shadow-sm transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary font-serif">ChooseMyLab CMS</h1>
        {/* Close Button for Mobile Sidebar */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 text-text-muted hover:text-text-main hover:bg-gray-50 rounded-lg"
          title="Close Navigation"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={onClose} // Auto-close drawer on click for mobile
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-primary font-medium' 
                      : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
