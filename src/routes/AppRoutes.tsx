import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load pages for better performance
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Home = lazy(() => import('../pages/Home'));
const Amalan = lazy(() => import('../pages/Amalan'));
const OlahragaTabungan = lazy(() => import('../pages/OlahragaTabungan'));
const Profile = lazy(() => import('../pages/Profile'));
const AmalanHistory = lazy(() => import('../pages/history/AmalanHistory'));
const WaterHistory = lazy(() => import('../pages/history/WaterHistory'));
const WorkoutHistory = lazy(() => import('../pages/history/WorkoutHistory'));
const TabunganHistory = lazy(() => import('../pages/history/TabunganHistory'));

// Loading component for suspense
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="amalan" element={<Amalan />} />
            <Route path="olahraga-tabungan" element={<OlahragaTabungan />} />
            <Route path="profile" element={<Profile />} />
            
            {/* History routes */}
            <Route path="history">
              <Route path="amalan" element={<AmalanHistory />} />
              <Route path="water" element={<WaterHistory />} />
              <Route path="workout" element={<WorkoutHistory />} />
              <Route path="tabungan" element={<TabunganHistory />} />
            </Route>
          </Route>
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;