import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Ubah ke false default

  useEffect(() => {
    if (
      !isAuthenticated &&
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Mobile: selalu tertutup default
      } else {
        setIsSidebarOpen(true); // Desktop: selalu terbuka default
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Jika belum login dan sedang di login/register → render child
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar hanya muncul jika sudah login */}
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          <main 
            className={`
              flex-1 w-full
              ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}
              pb-16 md:pb-0
              transition-all duration-300
            `}
>
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Bottom nav mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;