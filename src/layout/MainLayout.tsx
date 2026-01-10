import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isAuthenticated &&
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Jika belum login dan sedang di login/register → render child
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Bottom nav mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
