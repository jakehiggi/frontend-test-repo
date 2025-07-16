// frontend/src/lib/api.ts (Fixed)
import { JWTManager } from './jwt'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api'
const jwtManager = JWTManager.getInstance()

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean
  retryOnAuthFailure?: boolean
}

export class APIClient {
  private static instance: APIClient
  private refreshPromise: Promise<void> | null = null

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient()
    }
    return APIClient.instance
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      requiresAuth = true,
      retryOnAuthFailure = true,
      ...requestConfig
    } = config

    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(requestConfig.headers as Record<string, string>),
    }

    // Add auth header if required and available
    if (requiresAuth) {
      const authHeader = jwtManager.getAuthHeader()
      if (authHeader) {
        headers['Authorization'] = authHeader
      } else {
        throw new APIError('No authentication token available', 401, 'NO_TOKEN')
      }
    }

    const requestOptions: RequestInit = {
      ...requestConfig,
      headers,
    }

    try {
      const response = await fetch(url, requestOptions)
      
      // Handle 401 Unauthorized
      if (response.status === 401 && requiresAuth && retryOnAuthFailure) {
        return this.handleAuthFailure(endpoint, config)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        )
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T
      }

      return response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError('Network error occurred')
    }
  }

  private async handleAuthFailure<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      await this.refreshPromise
    } else {
      this.refreshPromise = this.attemptTokenRefresh()
      await this.refreshPromise
      this.refreshPromise = null
    }

    // Retry the original request with new token
    return this.request(endpoint, { ...config, retryOnAuthFailure: false })
  }

  private async attemptTokenRefresh(): Promise<void> {
    try {
      const tokens = jwtManager.getStoredTokens()
      if (!tokens || jwtManager.isTokenExpired(tokens.refreshToken)) {
        throw new Error('No valid refresh token')
      }

      // Call refresh endpoint
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.refreshToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const newTokens = await response.json()
      jwtManager.storeTokens(newTokens)
    } catch (error) {
      // Clear tokens and redirect to login
      jwtManager.clearTokens()
      window.location.href = '/login'
      throw error
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

export const apiClient = APIClient.getInstance()