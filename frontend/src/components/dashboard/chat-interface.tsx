"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileAttachmentDialog } from "./file-attachment-dialog"
import type { Message, Conversation } from "@/types/chat"
import type { FileItem } from "@/types/file-system"

interface ChatInterfaceProps {
  activeConversation: Conversation | null
  initialMessages?: Message[]
}

export function ChatInterface({ activeConversation, initialMessages = [] }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([])

  // Update messages when activeConversation or initialMessages change
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages, activeConversation])

  const handleSendMessage = () => {
    if (!message.trim() && attachedFiles.length === 0) return

    let messageContent = message.trim()
    if (attachedFiles.length > 0) {
      const fileList = attachedFiles.map((f) => f.name).join(", ")
      messageContent += `\n\n📎 Attached files: ${fileList}`
    }

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
    setAttachedFiles([])

    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: messages.length + 2,
        type: "assistant",
        content:
          attachedFiles.length > 0
            ? `I can see you've attached ${attachedFiles.length} file${attachedFiles.length > 1 ? "s" : ""}: ${attachedFiles.map((f) => f.name).join(", ")}. I'll use these as context for my response. This is a simulated response - in a real implementation, the AI would analyze the attached files.`
            : "I understand your message. This is a simulated response. In a real implementation, this would connect to your AI service.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAttachFiles = (files: FileItem[]) => {
    setAttachedFiles(files)
  }

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        {activeConversation && (
          <div className="border-b p-4 bg-background/95 backdrop-blur">
            <h2 className="font-semibold text-lg">{activeConversation.title}</h2>
            <p className="text-sm text-muted-foreground">Created {activeConversation.createdAt.toLocaleDateString()}</p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && activeConversation && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">{activeConversation.title}</h3>
                <p>Start your conversation by typing a message below.</p>
              </div>
            </div>
          )}

          {messages.length === 0 && !activeConversation && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">Welcome to AI Chat</h3>
                <p>Select a conversation from the sidebar or start a new chat to begin.</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full text-sm">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                        onClick={() => removeAttachedFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove attached file</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setAttachmentDialogOpen(true)}
                  className="self-end"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach files</TooltipContent>
            </Tooltip>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[60px] resize-none"
              rows={2}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSendMessage} size="icon" className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* File Attachment Dialog */}
        <FileAttachmentDialog
          open={attachmentDialogOpen}
          onOpenChange={setAttachmentDialogOpen}
          onAttachFiles={handleAttachFiles}
          selectedFiles={attachedFiles}
        />
      </div>
    </TooltipProvider>
  )
}
