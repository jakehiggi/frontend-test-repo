"use client"

import { cn } from "@/lib/utils"
import { ChatSidebar } from "./ChatSidebar"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { TabbedMainSection } from "./TabbedMainSection"
import { useChat } from "@/hooks/useChat"
import type { Conversation } from "@/types/chat"

interface ChatDashboardProps {
  onSignOut: () => void
  isSigningOut?: boolean
}

export function ChatDashboard({ onSignOut, isSigningOut = false }: ChatDashboardProps) {
  const { activeConversation, messages, sidebarOpen, toggleSidebar, selectConversation } = useChat()

  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      await selectConversation(conversation)
    } catch (error) {
      console.error("Failed to load conversation:", error)
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