"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChatSidebar } from "./chat-sidebar"
import { TopNavigation } from "./top-navigation"
import { Footer } from "./footer"
import type { Conversation, Message } from "@/types/chat"
import { useConversations } from "@/hooks/use-conversations"
import { TabbedMainSection } from "./tabbed-main-section"

interface ChatDashboardProps {
  onSignOut: () => void
  isSigningOut?: boolean
}

export function ChatDashboard({ onSignOut, isSigningOut = false }: ChatDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [conversationMessages, setConversationMessages] = useState<Message[]>([])

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
        <TopNavigation onSignOut={onSignOut} isSigningOut={isSigningOut} />
        <main className="flex-1 min-h-0">
          <TabbedMainSection activeConversation={activeConversation} initialMessages={conversationMessages} />
        </main>
      </div>

      <Footer />
    </div>
  )
}
