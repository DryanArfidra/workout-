import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (
      !isAuthenticated &&
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  /* ================= RESPONSIVE SIDEBAR ================= */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return <Outlet />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar toggleSidebar={() => setIsSidebarOpen(v => !v)} />

      <div className="flex flex-1 relative">
        {/* ================= SIDEBAR ================= */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* ================= MAIN CONTENT ================= */}
        <main
          className={`
            flex-1 w-full
            pb-16 md:pb-0
            transition-all duration-300 ease-in-out
          `}
        >
          <div
            className={`
              p-4 md:p-6
              transition-all duration-300 ease-in-out
              ${isSidebarOpen
                ? 'max-w-6xl mx-auto'
                : 'max-w-full'}
            `}
          >
            <Outlet />
          </div>
        </main>

        {/* ================= BOTTOM NAV (MOBILE) ================= */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
