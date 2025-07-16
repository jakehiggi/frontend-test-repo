"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User, AuthTokens } from '@/types/auth'
import { AuthService } from '@/services/auth'
import { JWTManager } from '@/lib/jwt'

// Auth reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TOKEN_REFRESH'; payload: AuthTokens }

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    
    case 'TOKEN_REFRESH':
      return {
        ...state,
        tokens: action.payload,
      }
    
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const authService = AuthService.getInstance()
  const jwtManager = JWTManager.getInstance()

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = jwtManager.getStoredTokens()
      if (tokens && !jwtManager.isTokenExpired(tokens.accessToken)) {
        const user = jwtManager.getUserFromToken(tokens.accessToken)
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } })
        }
      }
    }

    initializeAuth()
  }, [])

  // Auto-refresh tokens
  useEffect(() => {
    if (!state.isAuthenticated || !state.tokens) return

    const refreshInterval = setInterval(async () => {
      try {
        const newTokens = await jwtManager.autoRefreshToken(() => authService.refreshToken())
        if (newTokens) {
          dispatch({ type: 'TOKEN_REFRESH', payload: newTokens })
        } else {
          // Refresh failed, logout user
          dispatch({ type: 'AUTH_LOGOUT' })
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error)
        dispatch({ type: 'AUTH_LOGOUT' })
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(refreshInterval)
  }, [state.isAuthenticated, state.tokens])

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const { user, tokens } = await authService.login(credentials)
      jwtManager.storeTokens(tokens)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
    }
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const { user, tokens } = await authService.register(credentials)
      jwtManager.storeTokens(tokens)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      jwtManager.clearTokens()
      dispatch({ type: 'AUTH_LOGOUT' })
    }
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const newTokens = await authService.refreshToken()
      jwtManager.storeTokens(newTokens)
      dispatch({ type: 'TOKEN_REFRESH', payload: newTokens })
    } catch (error) {
      console.error('Token refresh failed:', error)
      dispatch({ type: 'AUTH_LOGOUT' })
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}