// frontend/src/hooks/useChat.ts
import { useChatStore } from '@/stores/chatStore'
import { useCallback } from 'react'
import type { Conversation, Message } from '@/types/chat'
import type { FileItem } from '@/types/file-system'

export const useChat = () => {
  const store = useChatStore()

  // Memoized selectors for performance
  const conversations = useChatStore((state) => state.conversations)
  const activeConversation = useChatStore((state) => state.activeConversation)
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)
  const sidebarOpen = useChatStore((state) => state.sidebarOpen)
  const error = useChatStore((state) => state.error)

  // Memoized actions
  const createConversation = useCallback(async (): Promise<Conversation> => {
    try {
      store.clearError()
      return await store.createNewConversation()
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw error
    }
  }, [store])

  const selectConversation = useCallback(async (conversation: Conversation) => {
    try {
      store.clearError()
      return await store.loadConversation(conversation.id)
    } catch (error) {
      console.error('Failed to select conversation:', error)
      throw error
    }
  }, [store])

  const sendMessage = useCallback((content: string, attachedFiles?: FileItem[]) => {
    if (!content.trim() && (!attachedFiles || attachedFiles.length === 0)) {
      return
    }

    // Ensure we have an active conversation
    if (!activeConversation) {
      console.warn('No active conversation to send message to')
      return
    }

    try {
      store.clearError()
      
      const message: Message = {
        id: Date.now(),
        type: 'user',
        content,
        timestamp: new Date(),
      }
      
      store.addMessage(message)

      // Update conversation preview with the latest message
      const updatedConversation = {
        ...activeConversation,
        preview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        updatedAt: new Date()
      }
      store.setActiveConversation(updatedConversation)

      // Simulate AI response with a more realistic delay
      setTimeout(() => {
        try {
          const response: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: attachedFiles && attachedFiles.length > 0 
              ? `I can see you've attached ${attachedFiles.length} file(s): ${attachedFiles.map(f => f.name).join(', ')}. I'll use these as context for my response.\n\nThis is a simulated response - in a real implementation, the AI would analyze the attached files and provide a contextual response based on their content.`
              : 'I understand your message. This is a simulated response. In a real implementation, this would connect to your AI service and provide intelligent responses based on your input.',
            timestamp: new Date(),
          }
          store.addMessage(response)
        } catch (error) {
          console.error('Failed to add AI response:', error)
          store.setError('Failed to get AI response')
        }
      }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds for realism
    } catch (error) {
      console.error('Failed to send message:', error)
      store.setError('Failed to send message')
    }
  }, [store, activeConversation])

  const deleteConversation = useCallback(async (id: number): Promise<void> => {
    try {
      store.clearError()
      return await store.deleteConversationAsync(id)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      throw error
    }
  }, [store])

  const renameConversation = useCallback(async (id: number, title: string): Promise<void> => {
    try {
      store.clearError()
      return await store.renameConversationAsync(id, title)
    } catch (error) {
      console.error('Failed to rename conversation:', error)
      throw error
    }
  }, [store])

  const toggleSidebar = useCallback(() => {
    store.toggleSidebar()
  }, [store])

  const setSidebarOpen = useCallback((open: boolean) => {
    store.setSidebarOpen(open)
  }, [store])

  const clearError = useCallback(() => {
    store.clearError()
  }, [store])

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    sidebarOpen,
    error,
    
    // Actions
    createConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    renameConversation,
    toggleSidebar,
    setSidebarOpen,
    clearError,
    
    // Raw store access for advanced usage
    store,
  }
}