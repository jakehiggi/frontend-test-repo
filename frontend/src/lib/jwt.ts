import type { JWTPayload, AuthTokens, User } from '@/types/auth'

const TOKEN_STORAGE_KEY = 'auth_tokens'
const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

export class JWTManager {
  private static instance: JWTManager
  private refreshPromise: Promise<AuthTokens> | null = null

  static getInstance(): JWTManager {
    if (!JWTManager.instance) {
      JWTManager.instance = new JWTManager()
    }
    return JWTManager.instance
  }

  /**
   * Decode JWT token without verification (for client-side use)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = parts[1]
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
      return decoded as JWTPayload
    } catch (error) {
      console.error('Failed to decode JWT:', error)
      return null
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token)
    if (!payload) return true

    const now = Date.now() / 1000
    return payload.exp < now
  }

  /**
   * Check if token needs refresh (within threshold)
   */
  needsRefresh(token: string): boolean {
    const payload = this.decodeToken(token)
    if (!payload) return true

    const now = Date.now()
    const expiryTime = payload.exp * 1000
    return (expiryTime - now) < REFRESH_THRESHOLD
  }

  /**
   * Extract user info from JWT payload
   */
  getUserFromToken(token: string): User | null {
    const payload = this.decodeToken(token)
    if (!payload) return null

    // Handle both old and new token formats for backward compatibility
    const firstName = payload.firstName || payload.name?.split(' ')[0] || 'User'
    const lastName = payload.lastName || payload.name?.split(' ').slice(1).join(' ') || 'Account'
    const fullName = payload.name || `${firstName} ${lastName}`

    return {
      id: payload.sub,
      email: payload.email,
      firstName,
      lastName,
      name: fullName,
      roles: payload.roles || [],
      createdAt: new Date(), // This would come from your backend
      lastLoginAt: new Date()
    }
  }

  /**
   * Store tokens securely
   */
  storeTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
    } catch (error) {
      console.error('Failed to store tokens:', error)
    }
  }

  /**
   * Retrieve stored tokens
   */
  getStoredTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!stored) return null

      const tokens = JSON.parse(stored) as AuthTokens
      
      // Check if access token is expired
      if (this.isTokenExpired(tokens.accessToken)) {
        // If refresh token is also expired, clear storage
        if (this.isTokenExpired(tokens.refreshToken)) {
          this.clearTokens()
          return null
        }
      }

      return tokens
    } catch (error) {
      console.error('Failed to retrieve tokens:', error)
      this.clearTokens()
      return null
    }
  }

  /**
   * Clear stored tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  /**
   * Get authorization header value
   */
  getAuthHeader(): string | null {
    const tokens = this.getStoredTokens()
    if (!tokens || this.isTokenExpired(tokens.accessToken)) {
      return null
    }
    return `Bearer ${tokens.accessToken}`
  }

  /**
   * Auto-refresh token if needed
   */
  async autoRefreshToken(refreshFn: () => Promise<AuthTokens>): Promise<AuthTokens | null> {
    const tokens = this.getStoredTokens()
    if (!tokens) return null

    // If access token is still valid and doesn't need refresh, return current tokens
    if (!this.isTokenExpired(tokens.accessToken) && !this.needsRefresh(tokens.accessToken)) {
      return tokens
    }

    // If refresh token is expired, can't refresh
    if (this.isTokenExpired(tokens.refreshToken)) {
      this.clearTokens()
      return null
    }

    // Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    try {
      this.refreshPromise = refreshFn()
      const newTokens = await this.refreshPromise
      this.storeTokens(newTokens)
      return newTokens
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
      return null
    } finally {
      this.refreshPromise = null
    }
  }
}