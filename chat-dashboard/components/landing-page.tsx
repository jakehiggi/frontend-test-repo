"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LandingPageProps {
  onSignIn: () => void
  isLoading?: boolean
}

export function LandingPage({ onSignIn, isLoading = false }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-light text-slate-400">blank.in</h1>
          <p className="text-slate-500 text-lg">AI-powered conversations made simple</p>
        </div>

        <div className="space-y-4">
          <Button onClick={onSignIn} size="lg" className="px-8 py-3 text-lg min-w-[200px]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In to Continue"
            )}
          </Button>
          <p className="text-slate-600 text-sm">
            {isLoading ? "Please wait while we authenticate you..." : "Start your AI conversation journey"}
          </p>
        </div>
      </div>
    </div>
  )
}
