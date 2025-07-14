"use client"

import { useState } from "react"
import { MessageSquare, FileText, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "./chat-interface"
import { UserDocuments } from "./user-documents"
import { GeneratedDocuments } from "./generated-documents"
import type { Conversation, Message } from "@/types/chat"

interface TabbedMainSectionProps {
  activeConversation: Conversation | null
  initialMessages?: Message[]
}

export function TabbedMainSection({ activeConversation, initialMessages = [] }: TabbedMainSectionProps) {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="user-documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              User Documents
            </TabsTrigger>
            <TabsTrigger value="generated-documents" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generated Documents
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface activeConversation={activeConversation} initialMessages={initialMessages} />
          </TabsContent>

          <TabsContent value="user-documents" className="h-full m-0">
            <UserDocuments />
          </TabsContent>

          <TabsContent value="generated-documents" className="h-full m-0">
            <GeneratedDocuments />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
