import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AtSign } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <AtSign className="h-8 w-8 text-teal-600" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900">EIMPILIO/HEALTH</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user?.avatar}
        alt={user?.name}
        className="h-10 w-10 rounded-full"
      />
      <div>
        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.role}</p>
      </div>
    </div>
  );
}