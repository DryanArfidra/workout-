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
    if (window.innerWidth < 768) onClose();
  };

  const isActive = (path: string, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  const formatJoinDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return '-';
    }
  };

  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="p-6 border-b border-emerald-700/50">
                <div className="flex justify-between mb-4">
                  <h1 className="text-xl font-bold">Islamic Tracker</h1>
                  <button onClick={onClose}>
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                {currentUser && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p>@{currentUser.username}</p>
                      <p className="text-sm text-emerald-300">
                        Bergabung {formatJoinDate(currentUser.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <nav className="flex-1 p-4 space-y-4">
                {[...mainMenuItems, ...historyMenuItems].map(item => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex w-full items-center px-3 py-2 rounded-lg ${
                      isActive(item.path, (item as any).exact)
                        ? 'bg-emerald-700'
                        : 'hover:bg-emerald-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-emerald-700/50">
                <button onClick={handleLogout} className="flex items-center w-full">
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

 const DesktopSidebar = () => (
  <div
    className={`
      hidden md:block
      transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0'}
    `}
  >
    <div
      className={`
        w-64 h-full sticky top-0
        bg-gradient-to-b from-emerald-800 to-emerald-900
        text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* === ISI SIDEBAR ANDA TETAP, TIDAK DIUBAH === */}
      <div className="p-6 border-b border-emerald-700/50">
        <h1 className="text-xl font-bold mb-4">Islamic Tracker</h1>
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              {currentUser.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p>@{currentUser.username}</p>
              <p className="text-sm text-emerald-300">
                Bergabung {formatJoinDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>``

        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          {[...mainMenuItems, ...historyMenuItems].map(item => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex w-full items-center px-3 py-2 rounded-lg ${
                isActive(item.path, (item as any).exact)
                  ? 'bg-emerald-700'
                  : 'hover:bg-emerald-700/50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-700/50">
          <button onClick={handleLogout} className="flex items-center w-full">
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Keluar
          </button>
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
