// frontend/src/stores/chatStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Conversation, Message, AIModel } from '@/types/chat'

interface ChatStore {
  // State
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  sidebarOpen: boolean
  selectedModel: AIModel | null
  isLoading: boolean
  error: string | null

  // Actions - all functions need stable references
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (conversation: Conversation | null) => void
  addConversation: (conversation: Conversation) => void
  deleteConversation: (id: number) => void
  renameConversation: (id: number, newTitle: string) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSelectedModel: (model: AIModel | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Async actions
  loadConversation: (id: number) => Promise<{ conversation: Conversation; messages: Message[] } | null>
  createNewConversation: () => Promise<Conversation>
  deleteConversationAsync: (id: number) => Promise<void>
  renameConversationAsync: (id: number, newTitle: string) => Promise<void>
}

const mockApiDelay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Store messages per conversation - moved outside to avoid recreation
const conversationMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      type: "user",
      content: "Let's discuss the upcoming project timeline and deliverables for Q1.",
      timestamp: new Date("2024-01-15T10:30:00"),
    },
    {
      id: 2,
      type: "assistant",
      content: "I'd be happy to help you plan your Q1 project timeline. Let's start by identifying the key deliverables and their dependencies.",
      timestamp: new Date("2024-01-15T10:31:00"),
    },
  ],
  2: [
    {
      id: 1,
      type: "user",
      content: "I need help integrating the payment API into our application.",
      timestamp: new Date("2024-01-14T14:20:00"),
    },
    {
      id: 2,
      type: "assistant",
      content: "I can help you integrate Stripe into your application. First, let's make sure you have the Stripe SDK installed.",
      timestamp: new Date("2024-01-14T14:21:00"),
    },
  ],
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        conversations: [
          {
            id: 1,
            title: "Project Planning Discussion",
            date: "2024-01-15",
            preview: "Let's discuss the upcoming project timeline and deliverables...",
            createdAt: new Date("2024-01-15T10:30:00"),
            updatedAt: new Date("2024-01-15T11:45:00"),
          },
          {
            id: 2,
            title: "API Integration Help",
            date: "2024-01-14",
            preview: "I need help integrating the payment API into our application...",
            createdAt: new Date("2024-01-14T14:20:00"),
            updatedAt: new Date("2024-01-14T15:30:00"),
          },
        ],
        activeConversation: null,
        messages: [],
        sidebarOpen: false,
        selectedModel: null,
        isLoading: false,
        error: null,

        // Actions - using stable function references
        setConversations: (conversations) => set({ conversations }),
        
        setActiveConversation: (conversation) => set({ activeConversation: conversation }),
        
        addConversation: (conversation) => set((state) => ({
          conversations: [conversation, ...state.conversations]
        })),
        
        deleteConversation: (id) => set((state) => {
          // Clean up messages for deleted conversation
          if (conversationMessages[id]) {
            delete conversationMessages[id]
          }
          
          return {
            conversations: state.conversations.filter(conv => conv.id !== id),
            activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
            messages: state.activeConversation?.id === id ? [] : state.messages
          }
        }),
        
        renameConversation: (id, newTitle) => set((state) => ({
          conversations: state.conversations.map(conv => 
            conv.id === id ? { ...conv, title: newTitle, updatedAt: new Date() } : conv
          ),
          activeConversation: state.activeConversation?.id === id 
            ? { ...state.activeConversation, title: newTitle }
            : state.activeConversation
        })),
        
        setMessages: (messages) => set({ messages }),
        
        addMessage: (message) => set((state) => {
          const newMessages = [...state.messages, message]
          
          // Store message in conversation-specific storage
          if (state.activeConversation) {
            conversationMessages[state.activeConversation.id] = newMessages
          }
          
          return { messages: newMessages }
        }),
        
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen 
        })),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        setSelectedModel: (model) => set({ selectedModel: model }),
        
        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        // Async actions
        loadConversation: async (id) => {
          const state = get()
          
          // Don't reload if already active
          if (state.activeConversation?.id === id) {
            return { 
              conversation: state.activeConversation, 
              messages: state.messages 
            }
          }

          set({ isLoading: true, error: null })
          
          try {
            await mockApiDelay(300)
            
            const conversation = state.conversations.find(conv => conv.id === id)
            
            if (!conversation) {
              set({ isLoading: false, error: 'Conversation not found' })
              return null
            }

            // Ensure dates are Date objects
            const normalizedConversation = {
              ...conversation,
              createdAt: conversation.createdAt instanceof Date ? conversation.createdAt : new Date(conversation.createdAt),
              updatedAt: conversation.updatedAt instanceof Date ? conversation.updatedAt : new Date(conversation.updatedAt)
            }

            // Get stored messages for this conversation and normalize timestamps
            const storedMessages = conversationMessages[id] || []
            const normalizedMessages = storedMessages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
            }))
            
            set({ 
              activeConversation: normalizedConversation,
              messages: normalizedMessages,
              isLoading: false,
              error: null
            })
            
            return { conversation: normalizedConversation, messages: normalizedMessages }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load conversation'
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        createNewConversation: async () => {
          set({ isLoading: true, error: null })
          
          try {
            await mockApiDelay(500)
            
            const now = new Date()
            const newConversation: Conversation = {
              id: Date.now(),
              title: "New Conversation",
              date: now.toISOString().split("T")[0],
              preview: "Start your conversation...",
              createdAt: now,
              updatedAt: now,
            }
            
            // Initialize empty messages for new conversation
            conversationMessages[newConversation.id] = []
            
            set((state) => ({
              conversations: [newConversation, ...state.conversations],
              activeConversation: newConversation,
              messages: [],
              isLoading: false,
              error: null
            }))
            
            return newConversation
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation'
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        deleteConversationAsync: async (id) => {
          set({ isLoading: true, error: null })
          
          try {
            await mockApiDelay(300)
            
            // Clean up stored messages
            if (conversationMessages[id]) {
              delete conversationMessages[id]
            }
            
            set((state) => ({
              conversations: state.conversations.filter(conv => conv.id !== id),
              activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
              messages: state.activeConversation?.id === id ? [] : state.messages,
              isLoading: false,
              error: null
            }))
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation'
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        renameConversationAsync: async (id, newTitle) => {
          if (!newTitle.trim()) {
            throw new Error('Title cannot be empty')
          }

          set({ isLoading: true, error: null })
          
          try {
            await mockApiDelay(300)
            
            set((state) => ({
              conversations: state.conversations.map(conv => 
                conv.id === id ? { ...conv, title: newTitle.trim(), updatedAt: new Date() } : conv
              ),
              activeConversation: state.activeConversation?.id === id 
                ? { ...state.activeConversation, title: newTitle.trim() }
                : state.activeConversation,
              isLoading: false,
              error: null
            }))
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to rename conversation'
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({ 
          conversations: state.conversations,
          selectedModel: state.selectedModel,
          sidebarOpen: state.sidebarOpen
          // Don't persist messages, activeConversation, loading states, errors, or function references
        }),
        // Add onRehydrateStorage to handle Date deserialization
        onRehydrateStorage: () => (state) => {
          if (state?.conversations) {
            // Convert string dates back to Date objects
            state.conversations = state.conversations.map(conv => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt)
            }))
          }
        },
      }
    ),
    { name: 'chat-store' }
  )
)