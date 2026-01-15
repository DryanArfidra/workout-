import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  HomeIcon, 
  BookOpenIcon, 
  FireIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, getCurrentUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const mainMenuItems = [
    { path: '/', icon: HomeIcon, label: 'Home', exact: true },
    { path: '/amalan', icon: BookOpenIcon, label: 'Amalan', exact: false },
    { path: '/olahraga-tabungan', icon: FireIcon, label: 'Olahraga & Tabungan', exact: false },
    { path: '/profile', icon: UserIcon, label: 'Profile', exact: false },
  ];

  const historyMenuItems = [
    { path: '/history/amalan', icon: CalendarDaysIcon, label: 'Amalan History' },
    { path: '/history/water', icon: ClockIcon, label: 'Water History' },
    { path: '/history/workout', icon: ChartBarIcon, label: 'Workout History' },
    { path: '/history/tabungan', icon: FolderIcon, label: 'Tabungan History' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-emerald-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Islamic Tracker</h1>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-emerald-200 hover:bg-emerald-700/50 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {currentUser && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">@{currentUser.username}</p>
                        <p className="text-emerald-300 text-sm">
                          Bergabung {formatJoinDate(currentUser.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                <div className="mb-4">
                  <h3 className="text-emerald-300/80 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                    Menu Utama
                  </h3>
                  {mainMenuItems.map((item) => {
                    const active = isActive(item.path, item.exact);
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg ${
                          active ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <h3 className="text-emerald-300/80 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                    Riwayat
                  </h3>
                  {historyMenuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg ${
                          active ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-emerald-700/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2.5 text-emerald-100 hover:bg-emerald-700 rounded-lg"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Desktop Sidebar - BISA DITUTUP
  const DesktopSidebar = () => (
    <div 
      className={`hidden md:block transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="w-64 h-screen sticky top-0">
        <div className="h-full bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-emerald-700/50">
            <h1 className="text-xl font-bold mb-4">Islamic Tracker</h1>
            
            {currentUser && (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">@{currentUser.username}</p>
                    <p className="text-emerald-300 text-sm">
                      Bergabung {formatJoinDate(currentUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-emerald-300/80 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                Menu Utama
              </h3>
              {mainMenuItems.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg ${
                      active ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-4">
              <h3 className="text-emerald-300/80 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                Riwayat
              </h3>
              {historyMenuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg ${
                      active ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-emerald-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-emerald-100 hover:bg-emerald-700 rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;