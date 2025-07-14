"use client"

import { useState } from "react"
import type { Conversation, Message } from "@/types/chat"

// Mock API functions - replace with actual API calls
const mockApiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock conversation messages
const mockMessages: Record<number, Message[]> = {
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
      content:
        "I'd be happy to help you plan your Q1 project timeline. Let's start by identifying the key deliverables and their dependencies. What are the main components of your project?",
      timestamp: new Date("2024-01-15T10:31:00"),
    },
    {
      id: 3,
      type: "user",
      content:
        "We need to complete the user authentication system, implement the dashboard, and set up the payment processing.",
      timestamp: new Date("2024-01-15T10:32:00"),
    },
  ],
  2: [
    {
      id: 1,
      type: "user",
      content: "I need help integrating the payment API into our application. We're using Stripe.",
      timestamp: new Date("2024-01-14T14:20:00"),
    },
    {
      id: 2,
      type: "assistant",
      content:
        "I can help you integrate Stripe into your application. First, let's make sure you have the Stripe SDK installed and your API keys configured. Are you working with a specific framework?",
      timestamp: new Date("2024-01-14T14:21:00"),
    },
  ],
  3: [
    {
      id: 1,
      type: "user",
      content: "What's the best approach for designing a scalable database schema for a multi-tenant application?",
      timestamp: new Date("2024-01-13T09:15:00"),
    },
    {
      id: 2,
      type: "assistant",
      content:
        "For multi-tenant applications, there are several approaches to consider: single database with tenant isolation, database per tenant, or hybrid approaches. The choice depends on your specific requirements for data isolation, scalability, and maintenance complexity.",
      timestamp: new Date("2024-01-13T09:16:00"),
    },
  ],
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([
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
    {
      id: 3,
      title: "Database Design Questions",
      date: "2024-01-13",
      preview: "What's the best approach for designing a scalable database schema...",
      createdAt: new Date("2024-01-13T09:15:00"),
      updatedAt: new Date("2024-01-13T10:00:00"),
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const createNewConversation = async (): Promise<Conversation> => {
    setIsLoading(true)

    // Simulate API call
    await mockApiDelay(500)

    const now = new Date()
    const newConversation: Conversation = {
      id: Date.now(), // In real app, this would come from the database
      title: "New Conversation",
      date: now.toISOString().split("T")[0],
      preview: "", // Empty preview for new conversations
      createdAt: now,
      updatedAt: now,
    }

    setConversations((prev) => [newConversation, ...prev])
    setIsLoading(false)

    return newConversation
  }

  const deleteConversation = async (id: number): Promise<void> => {
    setIsLoading(true)

    // Simulate API call
    await mockApiDelay(300)

    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    setIsLoading(false)
  }

  const renameConversation = async (id: number, newTitle: string): Promise<void> => {
    setIsLoading(true)

    // Simulate API call
    await mockApiDelay(300)

    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, title: newTitle, updatedAt: new Date() } : conv)),
    )
    setIsLoading(false)
  }

  const loadConversation = async (id: number): Promise<{ conversation: Conversation; messages: Message[] } | null> => {
    setIsLoading(true)

    // Simulate API call
    await mockApiDelay(200)

    const conversation = conversations.find((conv) => conv.id === id)
    const messages = mockMessages[id] || []

    setIsLoading(false)

    return conversation ? { conversation, messages } : null
  }

  return {
    conversations,
    isLoading,
    createNewConversation,
    deleteConversation,
    renameConversation,
    loadConversation,
  }
}
