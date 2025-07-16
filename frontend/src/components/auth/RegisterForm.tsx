"use client"

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import type { RegisterCredentials } from '@/types/auth'

interface PasswordStrength {
  score: number
  feedback: string[]
}

export function RegisterForm() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<RegisterCredentials & { confirmPassword: string }>>({})

  const { register, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 25
    } else {
      feedback.push('At least 8 characters')
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 25
    } else {
      feedback.push('Both uppercase and lowercase letters')
    }

    if (/\d/.test(password)) {
      score += 25
    } else {
      feedback.push('At least one number')
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 25
    } else {
      feedback.push('At least one special character')
    }

    return { score, feedback }
  }

  const passwordStrength = calculatePasswordStrength(credentials.password)

  const validateForm = (): boolean => {
    const errors: Partial<RegisterCredentials & { confirmPassword: string }> = {}

    if (!credentials.name.trim()) {
      errors.name = 'Name is required'
    } else if (credentials.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!credentials.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!credentials.password) {
      errors.password = 'Password is required'
    } else if (passwordStrength.score < 50) {
      errors.password = 'Password is too weak'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (credentials.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    clearError()
    
    try {
      await register(credentials)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear global error
    if (error) {
      clearError()
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    
    if (validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }))
    }
    
    if (error) {
      clearError()
    }
  }

  const getPasswordStrengthColor = (score: number): string => {
    if (score < 25) return 'bg-red-500'
    if (score < 50) return 'bg-orange-500'
    if (score < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (score: number): string => {
    if (score < 25) return 'Weak'
    if (score < 50) return 'Fair'
    if (score < 75) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={credentials.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={validationErrors.name ? 'border-destructive' : ''}
                disabled={isLoading}
                autoComplete="name"
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={validationErrors.email ? 'border-destructive' : ''}
                disabled={isLoading}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="text-sm text-destructive">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {credentials.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score >= 75 ? 'text-green-600' : 
                      passwordStrength.score >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength.score} 
                    className="h-2"
                  />
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <p>Password needs:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`pr-10 ${validationErrors.confirmPassword ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {confirmPassword && credentials.password === confirmPassword && (
                  <Check className="absolute right-10 top-3 h-4 w-4 text-green-600" />
                )}
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}