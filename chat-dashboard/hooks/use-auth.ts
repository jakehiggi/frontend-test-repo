"use client"

import { useState } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Start as authenticated for demo
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async () => {
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would handle actual authentication
    setIsAuthenticated(true)
    setIsLoading(false)
  }

  const signOut = async () => {
    setIsLoading(true)

    // Simulate sign out delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would:
    // - Clear authentication tokens
    // - Clear local storage/session storage
    // - Make API call to invalidate session
    // - Clear any cached user data

    // For demo purposes:
    localStorage.clear()
    sessionStorage.clear()
    setIsAuthenticated(false)
    setIsLoading(false)
  }

  return {
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  }
}
