"use client"

import { ChatDashboard } from "@/components/chat-dashboard"
import { LandingPage } from "@/components/landing-page"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth()

  // Show loading state during transitions
  if (isLoading) {
    if (isAuthenticated) {
      // Signing out - show dashboard with loading state
      return <ChatDashboard onSignOut={signOut} isSigningOut={true} />
    } else {
      // Signing in - show landing page with loading state
      return <LandingPage onSignIn={signIn} isLoading={true} />
    }
  }

  if (!isAuthenticated) {
    return <LandingPage onSignIn={signIn} isLoading={false} />
  }

  return <ChatDashboard onSignOut={signOut} isSigningOut={false} />
}
