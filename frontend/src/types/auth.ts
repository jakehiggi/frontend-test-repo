export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  createdAt: Date
  lastLoginAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number // timestamp
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface JWTPayload {
  sub: string // user id
  email: string
  name: string
  roles: string[]
  iat: number // issued at
  exp: number // expires at
  iss: string // issuer
  aud: string // audience
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
}