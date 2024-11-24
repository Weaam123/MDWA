import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Ambulance,
  FileText,
  Search,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff', icon: Users, label: 'Staff' },
  { to: '/bases', icon: Building2, label: 'Bases' },
  { to: '/vehicles', icon: Ambulance, label: 'Vehicles' },
  { to: '/reports', icon: FileText, label: 'Patient Reports' },
  { to: '/search', icon: Search, label: 'Search' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}