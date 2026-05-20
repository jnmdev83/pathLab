import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Beaker, MapPin, ClipboardList, Calendar, Users, Boxes } from 'lucide-react';

const Sidebar = () => {
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
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary font-serif">ChooseMyLab CMS</h1>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
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
