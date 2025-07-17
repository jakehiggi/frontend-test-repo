"use client"

import { ChevronDown, User, Settings, LogOut, Bot, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useModelSelection } from "@/hooks/useModelSelection"
import { useAuth } from "@/contexts/AuthContext"
import ThemeToggle from "@/components/ThemeToggle"
import { useNavigate } from "react-router-dom"

interface TopNavigationProps {
  onSignOut: () => void
  isSigningOut?: boolean
}

export function TopNavigation({ onSignOut, isSigningOut = false }: TopNavigationProps) {
  const { selectedModel, availableModels, selectModel } = useModelSelection()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    // You could add a confirmation dialog here if needed
    onSignOut()
  }

  // Get user initials for avatar fallback
  const getUserInitials = (currentUser: typeof user): string => {
    if (!currentUser) return 'U'
    
    const firstInitial = currentUser.firstName?.charAt(0)?.toUpperCase() || ''
    const lastInitial = currentUser.lastName?.charAt(0)?.toUpperCase() || ''
    
    if (firstInitial && lastInitial) {
      return firstInitial + lastInitial
    }
    
    // Fallback to full name if first/last names aren't available
    if (currentUser.name) {
      return currentUser.name
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    // Final fallback to email
    if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  // Get display name with fallback
  const getDisplayName = (): string => {
    if (isSigningOut) return "Signing out..."
    if (isLoading) return "Loading..."
    if (!user) return "Guest"
    
    // Use the full name if available
    if (user.name?.trim()) {
      return user.name.trim()
    }
    
    // Construct from first and last name
    if (user.firstName || user.lastName) {
      const firstName = user.firstName?.trim() || ''
      const lastName = user.lastName?.trim() || ''
      const fullName = `${firstName} ${lastName}`.trim()
      if (fullName) {
        return fullName
      }
    }
    
    // Fallback to email username if names aren't available
    if (user.email) {
      const emailName = user.email.split('@')[0]
      return emailName
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    }
    
    return "User"
  }

  const displayName = getDisplayName()
  const initials = getUserInitials(user)

  return (
    <TooltipProvider>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Model Selection Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled={isSigningOut}>
                    <Bot className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{selectedModel.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Select AI model</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => selectModel(model.id)}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium">{model.name}</span>
                    {selectedModel.id === model.id && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                  <span className="text-xs text-muted-foreground font-medium">{model.provider}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2" disabled={isSigningOut}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={displayName} />
                      <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-medium max-w-[120px] truncate">
                      {displayName}
                    </span>
                    {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>User menu</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {/* Show individual names if available for debugging/info */}
                      {user.firstName && user.lastName && (
                        <p className="text-xs text-muted-foreground/70">
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem disabled={isSigningOut}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isSigningOut}
                onSelect={() => navigate("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}