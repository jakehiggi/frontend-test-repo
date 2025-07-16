// frontend/src/components/dashboard/ChatDashboard.tsx (Updated)
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChatSidebar } from "./ChatSidebar"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { LoadingOverlay } from "./LoadingOverlay"
import type { Conversation, Message } from "@/types/chat"
import { useConversations } from "@/hooks/useConversations"
import { useAuth } from "@/contexts/AuthContext"
import { TabbedMainSection } from "./TabbedMainSection"

export function ChatDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [conversationMessages, setConversationMessages] = useState<Message[]>([])

  const { logout, isLoading: authLoading } = useAuth()
  const { loadConversation } = useConversations()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleConversationSelect = async (conversation: Conversation) => {
    setActiveConversation(conversation)

    try {
      const result = await loadConversation(conversation.id)
      if (result) {
        setConversationMessages(result.messages)
      } else {
        // For new conversations, start with empty messages
        setConversationMessages([])
      }
    } catch (error) {
      console.error("Failed to load conversation messages:", error)
      setConversationMessages([])
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
      // Navigation will be handled by the App component based on auth state
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (authLoading) {
    return <LoadingOverlay message="Loading your dashboard..." />
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
          <TabbedMainSection activeConversation={activeConversation} initialMessages={conversationMessages} />
        </main>
      </div>

      <Footer />
    </div>
  )
}