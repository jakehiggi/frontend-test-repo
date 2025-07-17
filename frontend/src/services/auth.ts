// frontend/src/services/auth.ts (Updated for first and last name)
import type { LoginCredentials, RegisterCredentials, AuthTokens, User } from '@/types/auth'
import { JWTManager } from '@/lib/jwt'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api'
const jwtManager = JWTManager.getInstance()

class AuthAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AuthAPIError'
  }
}

export class AuthService {
  private static instance: AuthService

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add auth header if available
    const authHeader = jwtManager.getAuthHeader()
    if (authHeader) {
      defaultHeaders['Authorization'] = authHeader
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new AuthAPIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error
      }
      throw new AuthAPIError('Network error occurred')
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // For now, simulate the API call with mock data
    // Replace this with real API call when backend is ready
    return this.mockLogin(credentials)
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // For now, simulate the API call with mock data
    // Replace this with real API call when backend is ready
    return this.mockRegister(credentials)
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthTokens> {
    const tokens = jwtManager.getStoredTokens()
    if (!tokens || jwtManager.isTokenExpired(tokens.refreshToken)) {
      throw new AuthAPIError('No valid refresh token available')
    }

    // For now, simulate the API call
    // Replace this with real API call when backend is ready
    return this.mockRefreshToken(tokens.refreshToken)
  }

  /**
   * Logout user (invalidate tokens)
   */
  async logout(): Promise<void> {
    // For now, just clear local tokens
    // In production, you might want to call an API to blacklist the tokens
    jwtManager.clearTokens()
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me')
  }

  // MOCK IMPLEMENTATIONS - Replace with real API calls
  
  private async mockLogin(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple validation
    if (!credentials.email || !credentials.password) {
      throw new AuthAPIError('Email and password are required', 400, 'MISSING_CREDENTIALS')
    }

    // For login, we'll derive names from email as fallback since we don't have stored user data
    const emailName = credentials.email.split('@')[0]
    const nameParts = emailName.split(/[._-]/).map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    
    const firstName = nameParts[0] || 'User'
    const lastName = nameParts[1] || 'Account'
    const fullName = `${firstName} ${lastName}`

    // Mock user data - use actual email and derived names
    const user: User = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      firstName,
      lastName,
      name: fullName,
      avatar: undefined,
      roles: ['user'],
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    }

    // Generate mock JWT tokens
    const now = Math.floor(Date.now() / 1000)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      roles: user.roles,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: 'levare-ai',
      aud: 'levare-ai-frontend'
    }

    const refreshTokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
      iss: 'levare-ai',
      aud: 'levare-ai-frontend',
      type: 'refresh'
    }

    const tokens: AuthTokens = {
      accessToken: this.createMockJWT(accessTokenPayload),
      refreshToken: this.createMockJWT(refreshTokenPayload),
      expiresAt: (now + (15 * 60)) * 1000 // Convert to milliseconds
    }

    return { user, tokens }
  }

  private async mockRegister(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simple validation
    if (!credentials.email || !credentials.password || !credentials.firstName || !credentials.lastName) {
      throw new AuthAPIError('Email, password, first name, and last name are required', 400, 'MISSING_CREDENTIALS')
    }

    if (credentials.password.length < 8) {
      throw new AuthAPIError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD')
    }

    // Clean and format names
    const firstName = credentials.firstName.trim()
    const lastName = credentials.lastName.trim()
    const fullName = `${firstName} ${lastName}`

    // Mock user data - use the actual provided names
    const user: User = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      firstName,
      lastName,
      name: fullName,
      avatar: undefined,
      roles: ['user'],
      createdAt: new Date(),
      lastLoginAt: new Date()
    }

    // Generate mock JWT tokens
    const now = Math.floor(Date.now() / 1000)
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      roles: user.roles,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: 'levare-ai',
      aud: 'levare-ai-frontend'
    }

    const refreshTokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
      iss: 'levare-ai',
      aud: 'levare-ai-frontend',
      type: 'refresh'
    }

    const tokens: AuthTokens = {
      accessToken: this.createMockJWT(accessTokenPayload),
      refreshToken: this.createMockJWT(refreshTokenPayload),
      expiresAt: (now + (15 * 60)) * 1000
    }

    return { user, tokens }
  }

  private async mockRefreshToken(refreshToken: string): Promise<AuthTokens> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Decode the refresh token to get user info
    const payload = jwtManager.decodeToken(refreshToken)
    if (!payload) {
      throw new AuthAPIError('Invalid refresh token', 401, 'INVALID_TOKEN')
    }

    // Get user info from the stored token payload
    const userFromToken = jwtManager.getUserFromToken(refreshToken)
    
    // Generate new access token with actual user data
    const now = Math.floor(Date.now() / 1000)
    const newAccessTokenPayload = {
      sub: payload.sub,
      email: userFromToken?.email || 'user@example.com',
      firstName: userFromToken?.firstName || 'User',
      lastName: userFromToken?.lastName || 'Account',
      name: userFromToken?.name || 'User Account',
      roles: userFromToken?.roles || ['user'],
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: 'levare-ai',
      aud: 'levare-ai-frontend'
    }

    return {
      accessToken: this.createMockJWT(newAccessTokenPayload),
      refreshToken, // Keep the same refresh token
      expiresAt: (now + (15 * 60)) * 1000
    }
  }

  private createMockJWT(payload: any): string {
    // This is a mock JWT - in production, tokens come from your backend
    const header = { alg: 'HS256', typ: 'JWT' }
    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))
    const signature = 'mock_signature' // In production, this is cryptographically signed
    
    return `${encodedHeader}.${encodedPayload}.${signature}`
  }
}