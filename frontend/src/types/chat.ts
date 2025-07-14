export interface Conversation {
  id: number
  title: string
  date: string
  preview: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: number
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  activeConversationId: number | null
  onConversationSelect: (conversation: Conversation) => void
}

export interface AIModel {
  id: string
  name: string
  description: string
  provider: string
}

export type SortOrder = "asc" | "desc"
export type SortType = "name" | "date"
