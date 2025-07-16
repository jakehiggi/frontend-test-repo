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

  // Actions
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

  // Async actions
  loadConversation: (id: number) => Promise<{ conversation: Conversation; messages: Message[] } | null>
  createNewConversation: () => Promise<Conversation>
  deleteConversationAsync: (id: number) => Promise<void>
  renameConversationAsync: (id: number, newTitle: string) => Promise<void>
}

const mockApiDelay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Store messages per conversation
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

        // Actions
        setConversations: (conversations: Conversation[]) => set({ conversations }),
        
        setActiveConversation: (conversation: Conversation | null) => {
          // Don't clear messages here - let loadConversation handle it
          set({ activeConversation: conversation })
        },
        
        addConversation: (conversation: Conversation) => set((state) => ({
          conversations: [conversation, ...state.conversations]
        })),
        
        deleteConversation: (id: number) => set((state) => {
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
        
        renameConversation: (id: number, newTitle: string) => set((state) => ({
          conversations: state.conversations.map(conv => 
            conv.id === id ? { ...conv, title: newTitle, updatedAt: new Date() } : conv
          ),
          activeConversation: state.activeConversation?.id === id 
            ? { ...state.activeConversation, title: newTitle }
            : state.activeConversation
        })),
        
        setMessages: (messages: Message[]) => set({ messages }),
        
        addMessage: (message: Message) => set((state) => {
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
        
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
        
        setSelectedModel: (model: AIModel | null) => set({ selectedModel: model }),
        
        setLoading: (isLoading: boolean) => set({ isLoading }),

        // Async actions
        loadConversation: async (id: number) => {
          const state = get()
          
          // Don't reload if already active
          if (state.activeConversation?.id === id) {
            return { 
              conversation: state.activeConversation, 
              messages: state.messages 
            }
          }

          set({ isLoading: true })
          
          try {
            await mockApiDelay(100) // Shorter delay for better UX
            
            const conversation = state.conversations.find(conv => conv.id === id)
            
            if (!conversation) {
              set({ isLoading: false })
              return null
            }

            // Get stored messages for this conversation
            const messages = conversationMessages[id] || []
            
            set({ 
              activeConversation: conversation,
              messages: messages,
              isLoading: false
            })
            
            return { conversation, messages }
          } catch (error) {
            set({ isLoading: false })
            console.error('Failed to load conversation:', error)
            throw error
          }
        },

        createNewConversation: async () => {
          set({ isLoading: true })
          
          try {
            await mockApiDelay(300)
            
            const now = new Date()
            const newConversation: Conversation = {
              id: Date.now(), // Use timestamp as ID
              title: "New Conversation",
              date: now.toISOString().split("T")[0],
              preview: "",
              createdAt: now,
              updatedAt: now,
            }
            
            // Initialize empty messages for new conversation
            conversationMessages[newConversation.id] = []
            
            set((state) => ({
              conversations: [newConversation, ...state.conversations],
              activeConversation: newConversation,
              messages: [],
              isLoading: false
            }))
            
            return newConversation
          } catch (error) {
            set({ isLoading: false })
            console.error('Failed to create conversation:', error)
            throw error
          }
        },

        deleteConversationAsync: async (id: number) => {
          set({ isLoading: true })
          
          try {
            await mockApiDelay(200)
            
            // Clean up stored messages
            if (conversationMessages[id]) {
              delete conversationMessages[id]
            }
            
            set((state) => ({
              conversations: state.conversations.filter(conv => conv.id !== id),
              activeConversation: state.activeConversation?.id === id ? null : state.activeConversation,
              messages: state.activeConversation?.id === id ? [] : state.messages,
              isLoading: false
            }))
          } catch (error) {
            set({ isLoading: false })
            console.error('Failed to delete conversation:', error)
            throw error
          }
        },

        renameConversationAsync: async (id: number, newTitle: string) => {
          set({ isLoading: true })
          
          try {
            await mockApiDelay(200)
            
            set((state) => ({
              conversations: state.conversations.map(conv => 
                conv.id === id ? { ...conv, title: newTitle, updatedAt: new Date() } : conv
              ),
              activeConversation: state.activeConversation?.id === id 
                ? { ...state.activeConversation, title: newTitle }
                : state.activeConversation,
              isLoading: false
            }))
          } catch (error) {
            set({ isLoading: false })
            console.error('Failed to rename conversation:', error)
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
          // Don't persist messages - they're handled separately
        }),
      }
    ),
    { name: 'chat-store' }
  )
)