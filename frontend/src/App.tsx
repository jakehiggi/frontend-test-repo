// frontend/src/App.tsx
"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import LandingPage from "@/routes/LandingPage";
import About from "@/routes/About";
import Login from "@/routes/Login";
import Register from "@/routes/Register";
import Dashboard from "@/routes/dashboard";
import DashboardHome from "@/routes/dashboard/Home";
import Settings from "@/routes/dashboard/Settings";
import Preferences from "@/routes/dashboard/Preferences";
import Unauthorized from "@/routes/Unauthorised";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingOverlay } from "@/components/dashboard/LoadingOverlay";
import { useAuth } from "@/contexts/AuthContext";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while auth is being determined
  if (isLoading) {
    return <LoadingOverlay message="Loading application..." />;
  }

  return (
    <Suspense fallback={<LoadingOverlay message="Loading page..." />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        
        {/* Auth routes - redirect to dashboard if already authenticated */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Protected dashboard routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<Settings />} />
          <Route path="preferences" element={<Preferences />} />
        </Route>
        
        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Catch all - redirect to dashboard if authenticated, otherwise to landing */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} 
        />
      </Routes>
    </Suspense>
  );
}