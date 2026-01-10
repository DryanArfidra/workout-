import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FireIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { logout, getCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/amalan', icon: BookOpenIcon, label: 'Amalan' },
    { path: '/olahraga-tabungan', icon: FireIcon, label: 'Olahraga & Tabungan' },
    { path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-emerald-800 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">My Islamic Tracker</h1>
        {currentUser && (
          <p className="text-emerald-200">@{currentUser.username}</p>
        )}
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-100 hover:bg-emerald-700/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-emerald-100 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;