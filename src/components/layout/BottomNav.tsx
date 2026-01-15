import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FireIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

const BottomNav: React.FC = () => {
  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/amalan', icon: BookOpenIcon, label: 'Amalan' },
    { path: '/olahraga-tabungan', icon: FireIcon, label: 'O & T' },
    { path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around py-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-emerald-600'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;