import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores';
import { Spinner } from '@/components/common';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardMain } from '@/components/dashboard';
import { ProtectedRoute } from '@/components/auth';
import { userService } from '@/services/apiService';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { user, setUser } = useUserStore();

  // Initialize session on app load
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (token) {
          // Fetch user profile from API
          try {
            const userData = await userService.getProfile();
            console.log('User profile loaded:', userData);
            setUser(userData);
          } catch (apiError) {
            console.error('Failed to fetch user profile:', apiError);
            // Token invalid, clear auth
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [setUser]);

  if (isInitializing) {
    return <Spinner fullScreen size="lg" />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        />
        
        {/* User routes (alternative paths) */}
        <Route
          path="/user/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard if authenticated, otherwise to login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* 404 redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
