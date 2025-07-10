"use client"

import type React from "react"
import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  sender: "user" | "assistant"
}

export function ChatInterface() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to your dashboard! How can I help you today?", sender: "assistant" },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      setMessages((prev) => [...prev, { id: Date.now(), text: message, sender: "user" }])
      setMessage("")

      // Simulate assistant response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Thanks for your message! This is a demo response.",
            sender: "assistant",
          },
        ])
      }, 1000)
    }
  }

  return (
    <div className="border rounded-lg bg-card flex-1 flex flex-col w-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
