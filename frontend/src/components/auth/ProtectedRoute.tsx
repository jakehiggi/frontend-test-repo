"use client"

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingOverlay } from '@/components/dashboard/LoadingOverlay'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingOverlay message="Checking authentication..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role))
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

// Hook for role-based access control
export function useRoles() {
  const { user } = useAuth()
  
  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false
  }
  
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }
  
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => hasRole(role))
  }
  
  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    roles: user?.roles ?? []
  }
}