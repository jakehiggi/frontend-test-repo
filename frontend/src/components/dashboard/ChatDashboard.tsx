// frontend/src/components/dashboard/ChatDashboard.tsx
"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChatSidebar } from "./ChatSidebar"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { TabbedMainSection } from "./TabbedMainSection"
import { LoadingOverlay } from "./LoadingOverlay"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/contexts/AuthContext"
import type { Conversation } from "@/types/chat"

export function ChatDashboard() {
  const { logout, isLoading: authLoading } = useAuth()
  const { activeConversation, messages, sidebarOpen, toggleSidebar, selectConversation, isLoading } = useChat()

  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      await selectConversation(conversation)
    } catch (error) {
      console.error("Failed to load conversation:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Show loading overlay during auth operations
  if (authLoading) {
    return <LoadingOverlay message="Loading dashboard..." />
  }

  return (
    <div className="flex h-screen w-full relative pb-12">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeConversationId={activeConversation?.id || null}
        onConversationSelect={handleConversationSelect}
      />

      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-80" : "ml-0",
        )}
      >
        <TopNavigation onSignOut={handleSignOut} isSigningOut={authLoading} />
        <main className="flex-1 min-h-0">
          <TabbedMainSection 
            activeConversation={activeConversation} 
            initialMessages={messages} 
          />
        </main>
      </div>

      <Footer />
      
      {/* Show loading overlay for chat operations */}
      {isLoading && <LoadingOverlay message="Loading conversation..." />}
    </div>
  )
}