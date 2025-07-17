"use client"

import { cn } from "@/lib/utils"
import { ChatSidebar } from "./ChatSidebar"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { TabbedMainSection } from "./TabbedMainSection"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/contexts/AuthContext"
import type { Conversation } from "@/types/chat"

export function ChatDashboard() {
  const { activeConversation, messages, sidebarOpen, toggleSidebar, selectConversation } = useChat()
  const { logout, isLoading } = useAuth()

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
      // Navigation will be handled by the AuthContext/ProtectedRoute
    } catch (error) {
      console.error('Sign out failed:', error)
    }
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
        <TopNavigation onSignOut={handleSignOut} isSigningOut={isLoading} />
        <main className="flex-1 min-h-0">
          <TabbedMainSection 
            activeConversation={activeConversation} 
            initialMessages={messages} 
          />
        </main>
      </div>

      <Footer />
    </div>
  )
}