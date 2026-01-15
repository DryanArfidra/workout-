import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { getCurrentUser } = useAuthStore();
  const currentUser = getCurrentUser();

  // Format tanggal Indonesia
  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format jam
  const formatTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Hamburger button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            
            {/* Logo/Title */}
            <div className="ml-3">
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                My Islamic Tracker
              </h1>
              <div className="hidden md:flex items-center space-x-2 mt-1">
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {formatTime()}
                </span>
                <span className="text-sm text-gray-500">{formatDate()}</span>
              </div>
            </div>
          </div>

          {/* Right section - User info */}
          {currentUser && (
            <div className="flex items-center space-x-3">
              {/* Greeting untuk mobile */}
              <div className="md:hidden text-right">
                <p className="text-sm font-medium text-gray-700">
                  Halo, {currentUser.username}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime()}
                </p>
              </div>
              
              {/* User avatar */}
              <div className="relative">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white">
                  {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Date for mobile */}
        <div className="md:hidden py-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">{formatDate()}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;