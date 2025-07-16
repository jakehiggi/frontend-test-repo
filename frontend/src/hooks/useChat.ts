import { useChatStore } from '@/stores/chatStore'
import { useCallback } from 'react'
import type { Conversation, Message } from '@/types/chat'

export const useChat = () => {
  const store = useChatStore()

  // Memoized selectors for performance
  const conversations = useChatStore((state) => state.conversations)
  const activeConversation = useChatStore((state) => state.activeConversation)
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)
  const sidebarOpen = useChatStore((state) => state.sidebarOpen)

  // Memoized actions
  const createConversation = useCallback(async (): Promise<Conversation> => {
    try {
      return await store.createNewConversation()
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw error
    }
  }, [store])

  const selectConversation = useCallback(async (conversation: Conversation) => {
    try {
      return await store.loadConversation(conversation.id)
    } catch (error) {
      console.error('Failed to select conversation:', error)
      throw error
    }
  }, [store])

  const sendMessage = useCallback((content: string, attachedFiles?: any[]) => {
    if (!content.trim() && (!attachedFiles || attachedFiles.length === 0)) {
      return
    }

    const message: Message = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    
    store.addMessage(message)

    // Simulate AI response with a more realistic delay
    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: attachedFiles && attachedFiles.length > 0 
          ? `I can see you've attached ${attachedFiles.length} file(s): ${attachedFiles.map(f => f.name).join(', ')}. I'll use these as context for my response. This is a simulated response - in a real implementation, the AI would analyze the attached files.`
          : 'I understand your message. This is a simulated response. In a real implementation, this would connect to your AI service.',
        timestamp: new Date(),
      }
      store.addMessage(response)
    }, 800)
  }, [store])

  const deleteConversation = useCallback(async (id: number): Promise<void> => {
    try {
      return await store.deleteConversationAsync(id)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      throw error
    }
  }, [store])

  const renameConversation = useCallback(async (id: number, title: string): Promise<void> => {
    try {
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

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    sidebarOpen,
    
    // Actions
    createConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    renameConversation,
    toggleSidebar,
    setSidebarOpen,
    
    // Raw store access for advanced usage
    store,
  }
}